"use client"
import { useState } from "react";
import { UploadFile } from "@/app/actions/uploadFiles";
import FileList from "@/components/fileList";

export default function Home() {

  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string }>({});
   
  const handleSubmit = async (formData: FormData) => {
    const response = await UploadFile(formData);
    setResult(response);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <form action={handleSubmit}>
          <input type="file" name="file" multiple accept=".pdf, .docx, .doc, xlsx"/>
          <button>Upload</button>
        </form>
        {result?.error && <p className="text-red-500">{result.error}</p>}
        {result?.success && <p className="text-green-500">{result.message}</p>}
        <FileList />
      </div>

    </main>
  );
}
