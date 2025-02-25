// app/components/UploadForm.tsx
"use client";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { UploadFile } from "@/app/actions/uploadFiles";
import { FiUploadCloud, FiX, FiFile, FiLoader } from "react-icons/fi";

export function UploadForm() {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
    setError(null);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      selectedFiles.forEach(file => formData.append("file", file));

      const result = await UploadFile(formData);
      
      if (result.error) {
        throw new Error(result.error);
      }

      // Atualizar lista de arquivos
      await queryClient.invalidateQueries({ queryKey: ["files"] });
      setSuccess(true);
      setSelectedFiles([]);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Falha no upload");
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
      <form 
        onSubmit={handleSubmit}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="space-y-4"
      >
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors hover:border-blue-500">
          <label 
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center space-y-2"
          >
            <FiUploadCloud className="w-12 h-12 text-gray-400" />
            <span className="text-gray-600 font-medium">
              Arraste arquivos ou clique para selecionar
            </span>
            <span className="text-sm text-gray-500">
              Formatos suportados: PDF, DOCX, XLSX (até 20MB cada)
            </span>
          </label>
          <input
            id="file-upload"
            type="file"
            name="file"
            multiple
            accept=".pdf,.docx,.xlsx"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Lista de arquivos selecionados */}
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div 
                key={index}
                className="flex items-center justify-between bg-gray-50 p-3 rounded"
              >
                <div className="flex items-center space-x-2">
                  <FiFile className="text-gray-400" />
                  <span className="truncate">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiX />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Mensagens de status */}
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 text-green-700 rounded">
            Arquivos enviados com sucesso!
          </div>
        )}

        {/* Botão de envio */}
        <button
          type="submit"
          disabled={loading || selectedFiles.length === 0}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <FiLoader className="animate-spin mr-2" />
              Enviando...
            </>
          ) : (
            `Enviar ${selectedFiles.length} arquivo${selectedFiles.length > 1 ? 's' : ''}`
          )}
        </button>
      </form>
    </div>
  );
}