import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(
  req: Request,
  { params }: { params: { filename: string } }
) {
  try {
    const filePath = path.join(process.cwd(), "uploads", params.filename);
    const fileBuffer = await fs.readFile(filePath);
    
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Disposition": `attachment; filename="${params.filename}"`,
        "Content-Type": "application/octet-stream",
      },
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Arquivo não encontrado" },
      { status: 404 }
    );
  }
}