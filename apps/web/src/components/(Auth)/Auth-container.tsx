"use client";

import { cn } from "@/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface AuthContainerProps {
  children: Readonly<React.ReactNode>;
}

export const AuthContainer = ({
  children,
}: AuthContainerProps): React.ReactElement => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [prevPathname, setPrevPathname] = useState(""); // Empty initial value
  const [currentContent, setCurrentContent] = useState<React.ReactNode>(null); // Start with null

  useEffect(() => {
    setMounted(true);
    setPrevPathname(pathname);
    setCurrentContent(children);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (pathname !== prevPathname) {
      setPrevPathname(pathname);

      const timer = setTimeout(() => {
        setCurrentContent(children);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [pathname, children, prevPathname]);

  type currentPathProps = {
    [key: string]: string;
  };

  const currentPath: currentPathProps = {
    "/sign-in": "h-100",
    "/create": "h-180",
    "/reset": "h-85",
    "/request": "h-70",
  };

  const containerClass = currentPath[pathname] || "h-120";

  return (
    <div
      className={cn(
        "w-full max-w-md overflow-hidden rounded-lg shadow-lg",
        "border border-black/20 bg-white duration-300 ease-out",
        "absolute inset-1/2 z-10 -translate-1/2",
        containerClass,
      )}
    >
      {currentContent}
    </div>
  );
};
