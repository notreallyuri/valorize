"use client";
import { LucideIcon, Undo2, Upload } from "lucide-react";
import { cn } from "@/utils";
import Link from "next/link";

export default function Sidebar({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  return (
    <div className="w-78 border-r border-gray-300 p-2 pt-20">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-700">Explorer</h1>
        <Link
          href={"/register-template"}
          className="text-sm hover:text-indigo-700"
        >
          Adicionar Template
        </Link>
      </div>
      {children}
    </div>
  );
}
