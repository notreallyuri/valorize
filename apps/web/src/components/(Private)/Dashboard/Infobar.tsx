"use client";
import { DocumentProps } from "@shared/interfaces/documents";
import { Mail, MapPin, User, Calendar, CreditCard, X } from "lucide-react";
import { cn } from "@/utils";

interface UserInfoSidebarProps {
  document: DocumentProps | undefined;
  isVisible: boolean;
  onClose: () => void;
  searchQuery?: string;
  searchResultsCount?: number;
}

export default function InfoBar({
  document,
  isVisible,
  onClose,
  searchQuery = "",
  searchResultsCount = 0,
}: UserInfoSidebarProps) {
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

  if (!isVisible) return null;

  return (
    <div className="relative h-full overflow-y-hidden rounded-xl border border-black/20 bg-white p-6">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 cursor-pointer rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <X size={20} />
      </button>

      <h1 className="font-display mt-4 mb-6 text-2xl font-semibold">
        Informações do Registro
      </h1>

      {document ? (
        <div className="flex flex-col space-y-6">
          <div className="flex items-center space-x-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
              <User size={32} />
            </div>
            <div>
              <h2 className="text-xl font-medium">{document.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Cadastrado em {formatDate(document.createdAt)}
              </p>
            </div>
          </div>

          <div className="space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800"></div>

          <div className="mt-4 flex space-x-2">
            <button className="flex-1 rounded-lg bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-400 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none">
              Editar
            </button>
            <button className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:outline-none">
              Histórico
            </button>
          </div>
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Selecione um registro para ver detalhes
          </p>
        </div>
      )}

      {searchQuery.trim() && (
        <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Resultados para: <span className="font-medium">{searchQuery}</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {searchResultsCount} registros encontrados
          </p>
        </div>
      )}
    </div>
  );
}
