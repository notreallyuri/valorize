"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function useSearch() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const searchRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const query = searchQuery.trim();
    if (query) {
      router.push(`?q=${encodeURIComponent(query)}`);
    } else {
      router.push("?");
    }
  };

  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  return { searchQuery, setSearchQuery, searchRef, handleSubmit };
}
