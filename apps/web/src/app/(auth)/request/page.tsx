import { cn } from "@/utils";
import Link from "next/link";

export default function Request() {
  return (
    <>
      <section className={cn("h-full w-full overflow-clip pt-4")}>
        <h1 className="font-display ml-10 text-2xl font-semibold">
          Solicitar cadastro
        </h1>
        <form className="mt-2 flex h-50 flex-col gap-y-4 px-10">
          <p className="text-sm text-gray-500">
            Envie seu e-mail pessoal e iremos te enviar seu e-mail de trabalho
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
      </section>
    </>
  );
}
