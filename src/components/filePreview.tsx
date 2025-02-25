// app/components/FilePreview.tsx
"use client";
import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import dompurify from 'dompurify';
import { FiX, FiArrowLeft, FiArrowRight } from 'react-icons/fi';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function FilePreview({ filePath, onClose }: { 
  filePath: string; 
  onClose: () => void 
}) {
  const [content, setContent] = useState<string | JSX.Element>('');
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [fileType, setFileType] = useState('');

  useEffect(() => {
    const loadFile = async () => {
      try {
        const response = await fetch(filePath);
        const blob = await response.blob();
        const extension = filePath.split('.').pop()?.toLowerCase();

        setFileType(extension || 'unknown');

        switch(extension) {
          case 'pdf':
            const pdfUrl = URL.createObjectURL(blob);
            setContent(
              <Document
                file={pdfUrl}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              >
                <Page pageNumber={pageNumber} />
              </Document>
            );
            break;

          case 'docx':
          case 'doc':
            const arrayBuffer = await blob.arrayBuffer();
            const result = await mammoth.convertToHtml({ arrayBuffer });
            const cleanHtml = dompurify.sanitize(result.value);
            setContent(<div dangerouslySetInnerHTML={{ __html: cleanHtml }} />);
            break;

          case 'xlsx':
            const reader = new FileReader();
            reader.onload = (e) => {
              const data = new Uint8Array(e.target?.result as ArrayBuffer);
              const workbook = XLSX.read(data, { type: 'array' });
              const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
              const html = XLSX.utils.sheet_to_html(firstSheet);
              setContent(<div dangerouslySetInnerHTML={{ __html: html }} />);
            };
            reader.readAsArrayBuffer(blob);
            break;

          default:
            setContent('Formato não suportado');
        }
      } catch (error) {
        console.error('Erro ao carregar arquivo:', error);
        setContent('Erro ao carregar o arquivo');
      }
    };

    loadFile();
  }, [filePath]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Visualização: {filePath.split('/').pop()}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>

        <div className="p-4 overflow-auto max-h-[70vh]">
          {fileType === 'pdf' && (
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                disabled={pageNumber <= 1}
              >
                <FiArrowLeft />
              </button>
              <span>Página {pageNumber} de {numPages}</span>
              <button 
                onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
                disabled={pageNumber >= numPages}
              >
                <FiArrowRight />
              </button>
            </div>
          )}

          <div className={fileType === 'pdf' ? 'pdf-viewer' : ''}>
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}