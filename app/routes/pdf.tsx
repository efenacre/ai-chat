import type { Route } from "./+types/pdf";
import { useState, useRef } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "PDF Viewer - AI Chat App" },
    { name: "description", content: "Search and display PDF files" },
  ];
}

export default function PDF() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [pdfFiles, setPdfFiles] = useState<string[]>([
    "sample-document-1.pdf",
    "sample-document-2.pdf",
    "technical-manual.pdf",
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files)
        .filter((file) => file.type === "application/pdf")
        .map((file) => file.name);
      setPdfFiles((prev) => [...prev, ...newFiles]);
      if (newFiles.length > 0) {
        setSelectedFile(newFiles[0]);
      }
    }
  };

  const filteredFiles = pdfFiles.filter((file) =>
    file.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar for PDF list */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            PDF Files
          </h2>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search PDFs..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
          >
            Upload PDF
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {filteredFiles.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              No PDFs found
            </p>
          ) : (
            <div className="space-y-1">
              {filteredFiles.map((file) => (
                <button
                  key={file}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedFile === file
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {file}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* PDF viewer area */}
      <div className="flex-1 flex flex-col">
        {selectedFile ? (
          <>
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedFile}
              </h3>
            </div>
            <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 p-6">
              <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <div className="space-y-4">
                  {/* Placeholder PDF content - in production, use a PDF viewer library like react-pdf */}
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                      PDF Viewer Placeholder
                    </p>
                    <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                      File: {selectedFile}
                    </p>
                    <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
                      In production, integrate a PDF viewer library like{" "}
                      <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">
                        react-pdf
                      </code>{" "}
                      or{" "}
                      <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">
                        pdf.js
                      </code>{" "}
                      to display PDF content here.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Select a PDF file from the sidebar to view it
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
