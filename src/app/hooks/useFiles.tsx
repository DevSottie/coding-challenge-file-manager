// app/hooks/useFiles.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { getUploadedFiles } from "@/app/actions/getUploadedFiles";

export function useFiles() {
  return useQuery({
    queryKey: ["files"],
    queryFn: getUploadedFiles,
    refetchInterval: 5000, // Opcional: atualização automática a cada 5s
  });
}