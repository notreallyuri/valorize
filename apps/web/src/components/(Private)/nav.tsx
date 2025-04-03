"use client";
import {
  Upload,
  Search,
  Undo2,
  type LucideIcon,
  Settings,
  Settings2,
} from "lucide-react";
import { cn } from "@/utils";
import { usePathname } from "next/navigation";
import SearchBar from "./searchBar";

import Link from "next/link";
import React from "react";

interface NavProps {
  username?: string;
  usermail?: string;
}

export default function Nav({
  username = "username",
  usermail = "example@mail.com",
}: NavProps) {
  const pathname = usePathname();

  interface NavItemProps {
    href: string;
    text: string;
    icon: LucideIcon;
  }

  function NavButton({ href, text, icon: Icon }: NavItemProps) {
    return (
      <Link
        href={href}
        className={cn(
          "inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg px-2.5",
          "bg-indigo-500 text-white hover:bg-indigo-400",
          "outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
        )}
      >
        <p className="text-sm font-medium">{text}</p>
        <Icon size={24} />
      </Link>
    );
  }

  function NavLink({ href, text, icon: Icon }: NavItemProps) {
    return (
      <Link
        href={href}
        className={cn(
          "inline-flex w-full cursor-pointer items-center justify-between gap-2 p-2",
          "text-gray-600 hover:text-gray-400",
        )}
      >
        <p className="font-medium">{text}</p>
        <Icon size={24} />
      </Link>
    );
  }

  const navLinks: NavItemProps[] = [
    { href: "/profile", text: "Perfil", icon: Settings2 },
    { href: "/settings", text: "Configurações", icon: Settings },
  ];

  return (
    <header
      className={cn(
        "flex h-16 w-full items-center border-b px-2",
        "absolute z-40 gap-2 border-b-gray-300 bg-white",
      )}
    >
      <Link href={"/dashboard"} className="mr-auto flex items-center gap-2">
        <div className="size-10 rounded-full bg-indigo-500" />
        <h1 className="font-display text-3xl font-bold">Valorize</h1>
      </Link>

      {pathname === "/dashboard" && (
        <>
          <div
            className={cn(
              "focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500",
              "mr-2 inline-flex h-9 w-72 items-center rounded-lg px-3",
              "border border-black/10 bg-gray-100",
            )}
          >
            <Search className="h-4 w-4 text-gray-500" />
            <SearchBar />
            <kbd
              className={cn(
                "peer-[:not(:placeholder-shown)]:hidden peer-[:placeholder-shown]:inline-flex sm:inline-flex",
                "ml-2 hidden items-center rounded border px-1.5 py-0.5 text-xs",
                "border-gray-300 bg-gray-200 text-gray-500",
              )}
            >
              CTRL+K
            </kbd>
          </div>
        </>
      )}

      {(pathname === "/dashboard" || "/register_data") && (
        <NavButton
          href={(pathname === "/dashboard" && "/register_data") || "/dashboard"}
          text={
            (pathname === "/dashboard" && "Adicionar Documento") || "Voltar"
          }
          icon={(pathname === "/dashboard" && Upload) || Undo2}
        />
      )}

      <div className="group">
        <div className="relative flex h-12 w-48 items-center justify-end gap-2 rounded-lg p-1 hover:bg-gray-200">
          <div className="flex flex-col text-right">
            <h2 className="select-none">{username}</h2>
            <h3 className="text-xs text-gray-800 select-none">{usermail}</h3>
          </div>
          <div className="size-10 rounded-lg bg-indigo-500" />
        </div>

        <div className="absolute top-14 right-2 hidden w-64 flex-col rounded-xl border border-gray-300 bg-white group-hover:flex">
          {navLinks.map((link, index) => (
            <React.Fragment key={link.text}>
              <NavLink icon={link.icon} href={link.href} text={link.text} />
              {index < navLinks.length - 1 && (
                <div className="h-[1px] w-full bg-gray-300" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </header>
  );
}
