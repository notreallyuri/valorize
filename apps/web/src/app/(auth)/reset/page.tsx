import { cn } from "@/utils";
import Link from "next/link";

export default function Reset() {
  return (
    <>
      <section className={cn("h-full w-full overflow-clip pt-4")}>
        <h1 className="font-display ml-10 text-2xl font-semibold">
          Mudar a senha
        </h1>
        <form className="mt-2 flex h-50 flex-col gap-y-4 px-10">
          <p className="text-sm text-gray-500">
            Insira o e-mail associado à sua conta e enviaremos um link para
            redefinir sua senha.
          </p>
          <div className="flex flex-col">
            <label htmlFor="email" className="w-fit cursor-pointer">
              Email
            </label>
            <input
              type="text"
              id="email"
              className={cn(
                "h-12 rounded border border-gray-300 bg-gray-50 px-2 font-light outline-none",
                "focus:border-indigo-500",
              )}
            />
          </div>
          <button className="mt-auto h-12 w-full rounded bg-indigo-500 text-white transition-colors duration-100 hover:bg-indigo-400">
            Enviar
          </button>
        </form>
        <div
          className={cn(
            "absolute bottom-0 h-16 w-full border-t border-black/20 bg-indigo-50",
            "flex items-center justify-center",
          )}
        >
          <p className="text-sm">
            Não tem conta ainda ?{" "}
            <Link
              href={"/request"}
              className="cursor-pointer text-indigo-500 hover:text-indigo-800"
            >
              Solicite aqui
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
