"use client";
import { useEffect, useState } from "react";
import { getUploadedFiles } from "@/app/actions/getUploadedFiles";
import { FiFile, FiDownload } from "react-icons/fi";

export default function FileList() {
  const [files, setFiles] = useState<Array<{ name: string; type: string; path: string }>>([]);

  useEffect(() => {
    const loadFiles = async () => {
      const data = await getUploadedFiles();
      setFiles(data);
    };
    loadFiles();
  }, []);

  const getFileIcon = (type: string) => {
    switch (type) {
      case "PDF": return <FiFile className="text-red-500" />;
      case "DOCX": return <FiFile className="text-blue-500" />;
      case "XLSX": return <FiFile className="text-green-500" />;
      default: return <FiFile className="text-gray-500" />;
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Arquivos Enviados</h2>
      
      {files.length === 0 ? (
        <p className="text-gray-500">Nenhum arquivo encontrado</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file, index) => (
            <div 
              key={index}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">
                  {getFileIcon(file.type)}
                </span>
                <span className="font-medium truncate">{file.name}</span>
              </div>
              
              <div className="flex gap-2 mt-3">
                <a
                  href={file.path}
                  download
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                >
                  <FiDownload />
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}