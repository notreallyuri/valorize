import { cn } from "@/utils";

interface BoardProps {
  className?: string;
  children?: Readonly<React.ReactNode>;
}

export function SmallBoard({ children, className }: BoardProps) {
  return (
    <div
      className={cn(
        "h-22 rounded-xl border border-black/20 bg-white p-2",
        "flex flex-col",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Board({ children, className }: BoardProps) {
  return (
    <div
      className={cn(
        "h-full rounded-xl border border-black/20 bg-white lg:col-span-3",
        className,
      )}
    >
      {children}
    </div>
  );
}
