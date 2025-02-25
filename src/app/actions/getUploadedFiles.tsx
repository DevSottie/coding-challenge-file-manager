"use server";
import { promises as fs } from "fs";
import path from "path";

export async function getUploadedFiles() {
  try {
    const uploadDir = path.join(process.cwd(), "/api/download");
    
    try {
      await fs.access(uploadDir);
    } catch {
      return [];
    }

    const files = await fs.readdir(uploadDir);
    
    return files.map(file => ({
      name: file,
      type: path.extname(file).replace(".", "").toUpperCase(),
      path: path.join("/api/download", file)
    }));

  } catch (error) {
    console.error("Error on list the archives:", error);
    return [];
  }
}