"use client";
import { SmallBoard, Board } from "@/components/(Private)/Dashboard/boards";
import RecordList from "@/components/(Private)/Dashboard/record-list";
import InfoBar from "@/components/(Private)/Dashboard/Infobar";
import { useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { cn } from "@/utils";
import Sidebar from "@/components/(Private)/Dashboard/sidebar";
import { Document } from "@prisma/client";
import { getTemplates } from "@/hooks/getTemplates";

export default function Dashboard() {
  const [isSelected, setIsSelected] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<string>("");
  const [currentDocument, setCurrentDocument] = useState<
    Document | undefined
  >();

  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const handleRecordClick = useCallback((document: Document) => {
    setCurrentDocument(document);
    setIsSelected(true);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setIsSelected(false);
    setCurrentDocument(undefined);
  }, []);

  function revertTemplateName(templateName: string) {
    return templateName
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  return (
    <div className="flex h-full w-full">
      <Sidebar>teste</Sidebar>
      <main className="flex w-full flex-col gap-4 px-2 py-4 pt-20">
        <section className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
          <SmallBoard>
            <h1 className="text-2xl font-semibold">Registros - 30 dias</h1>
            <p className="text-gray-600">1234</p>
            <p className="text-xs text-indigo-500">
              38% a mais que o mês passado
            </p>
          </SmallBoard>
          <SmallBoard>
            <h1 className="text-2xl font-semibold">Registros - 7 dias</h1>
            <p className="text-gray-600">1234</p>
          </SmallBoard>
          <SmallBoard>
            <h1 className="text-2xl font-semibold">Registros - 24 horas</h1>
            <p className="text-gray-600">teste</p>
          </SmallBoard>
          <SmallBoard>
            <h1 className="text-2xl font-semibold">Total</h1>
            <p className="text-gray-600">1234</p>
          </SmallBoard>
        </section>
        <section
          className={cn(
            "grid h-full grid-cols-1 gap-2",
            !isSelected && "lg:grid-cols-3",
            isSelected && "lg:grid-cols-4"
          )}
        >
          <Board className="overflow-hidden"></Board>
        </section>
      </main>
    </div>
  );
}
