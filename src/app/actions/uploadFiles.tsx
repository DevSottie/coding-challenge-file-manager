"use server";
import { existsSync, promises as fs, mkdirSync } from "fs";
import { getUploadedFiles } from "./getUploadedFiles";

export async function UploadFile(formData: FormData) {
    try {
        const files = formData.getAll("file") as File[];

        console.log("[DEBUG] Quantidade dos arquivos:", files.length);

        if(!files || files.length === 0) {
        console.log("[ERRO] Arquivo vazio ou não enviado");
        return { error: "No file uploaded" };
        }

        const uploadDir =  process.cwd() + "/api/download";
        console.log("[DEBUG] Diretório de upload:", uploadDir);
        if(!existsSync(uploadDir)){
            mkdirSync(uploadDir, {recursive: true});
            console.log("[DEBUG] Diretório criado com sucesso");
        }

        const uploadFiles = await Promise.all(
            files.map( async (file) => {
                try{
                    if (file.size === 0 ){
                        return { fileName: file.name, status: "error", message: "Empty file" };
                    }
                    
                    const buffer = Buffer.from(await file.arrayBuffer());
                    console.log("[DEBUG] Tamanho do buffer:", buffer.length, "bytes");
                    const data = await file.arrayBuffer();
                    await fs.writeFile(`${uploadDir}/${file.name}`, Buffer.from(data));
                    console.log("[SUCESSO] Arquivo salvo em: ", uploadDir+"/"+file.name);
                    await getUploadedFiles();
                    return { fileName: file.name, status: "success", message: "Upload success" };
                } catch (error) {
                    console.error("ERRO CRITICO", error);
                    return { fileName: file.name, status: "error", message: "Upload error" };
                }
            })
        );
        return { 
            success: true, 
            message: "Process concluded", 
            results: uploadFiles 
          };
      
        } catch (error) {
          console.error(error);
          return { error: "Internal server error" };
        }   
}


