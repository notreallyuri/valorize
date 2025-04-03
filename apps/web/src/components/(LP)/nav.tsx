import { cn } from "@/utils";
import Link from "next/link";

export default function Nav() {
  return (
    <header
      className={cn(
        "absolute inset-x-1/2 top-5 h-14 w-4/6 -translate-x-1/2 rounded-lg",
        "border border-black/20 bg-white shadow shadow-black/25",
        "flex items-center justify-between px-2",
      )}
    >
      <nav className="flex items-center gap-x-4 text-gray-700">
        <div className="inline-flex items-center gap-x-2">
          <div className="size-10 rounded-full bg-indigo-600" />
          <h1 className="font-display text-2xl font-bold select-none">
            Valorize
          </h1>
        </div>

        <div className="h-10 w-0.5 rounded bg-black/20" />

        <div className="flex items-center gap-x-2">
          <Link
            href=""
            className="flex h-10 w-32 items-center justify-center transition-colors hover:text-indigo-500"
          >
            Página Inicial
          </Link>
          <div className="h-6 w-0.25 rounded bg-black/20" />
          <Link
            href=""
            className="flex h-10 w-32 items-center justify-center transition-colors hover:text-indigo-500"
          >
            Documentação
          </Link>
        </div>
      </nav>
      <Link
        href={"/sign-in"}
        className={cn(
          "flex h-10 min-w-20 items-center justify-center rounded-md border transition-colors",
          "bg-indigo-500 text-white duration-150 hover:bg-indigo-400",
        )}
      >
        Entrar
      </Link>
    </header>
  );
}
