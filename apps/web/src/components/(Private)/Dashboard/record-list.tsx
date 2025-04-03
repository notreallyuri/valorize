"use client";
import { cn } from "@/utils";
import { AlertCircle, Loader2, FileText } from "lucide-react";
import { DocumentProps } from "@shared/interfaces/documents";

interface DocumentListProps {
  documents?: DocumentProps[] | null;
  onDocumentClick?: (document: DocumentProps) => void;
  currentTemplate?: string;
}

export default function DocumentList({
  documents,
  onDocumentClick,
  currentTemplate,
}: DocumentListProps) {
  const formatDate = (date: Date): string => {
    if (!(date instanceof Date)) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return "Data inválida";
      }
      return parsedDate.toLocaleDateString("pt-BR");
    }
    return date.toLocaleDateString("pt-BR");
  };

  const Document = ({
    name,
    templateName,
    templateVersion,
    structure,
    createdAt,
  }: Partial<DocumentProps>) => {
    return (
      <div
        className="grid cursor-pointer grid-cols-12 gap-2 border-b border-gray-200 px-4 py-4 hover:bg-gray-50"
        onClick={() =>
          onDocumentClick?.({
            name: name || "",
            templateName: templateName || "",
            templateVersion: templateVersion || "",
            structure: structure || {},
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        }
        data-testid={`document-${name}`}
      >
        <div className="col-span-5 font-medium">
          <div className="flex items-center">
            <FileText className="mr-2 h-4 w-4 text-gray-500" />
            {name}
          </div>
        </div>
        <div className="col-span-3 text-sm text-gray-600">{templateName}</div>
        <div className="col-span-2 text-sm text-gray-600">
          {templateVersion || ""}
        </div>
        <div className="col-span-2 text-right text-sm text-gray-600">
          {createdAt ? formatDate(createdAt) : ""}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col">
      <div className="grid grid-cols-12 gap-2 border-b border-gray-200 px-4 py-3 text-sm font-medium text-gray-600">
        <div className="col-span-5">Nome do Documento</div>
        <div className="col-span-3">Template</div>
        <div className="col-span-2">Versão</div>
        <div className="col-span-2 text-right">Data de Criação</div>
      </div>

      {documents === null || documents === undefined ? (
        <div className="flex h-full w-full flex-col items-center justify-center text-center">
          <Loader2 className="mb-4 size-10 animate-spin text-gray-600" />
          <p className="text-gray-600">Carregando documentos...</p>
        </div>
      ) : documents.length === 0 ? (
        <div className="flex h-full w-full flex-col items-center justify-center text-center">
          <AlertCircle className="mb-4 size-10 text-gray-600" />
          <p className="text-gray-600">
            {currentTemplate
              ? `Nenhum documento encontrado para o template "${currentTemplate}"`
              : "Nenhum documento encontrado"}
          </p>
        </div>
      ) : (
        documents.map((document) => (
          <Document
            key={document.name}
            name={document.name}
            templateName={document.templateName}
            structure={document.structure}
          />
        ))
      )}
    </div>
  );
}
