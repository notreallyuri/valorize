import { useSearch } from "@/hooks/useSearch";

export default function SearchBar() {
  const { searchQuery, setSearchQuery, searchRef, handleSubmit } = useSearch();

  return (
    <input
      ref={searchRef}
      type="text"
      placeholder="Search..."
      value={searchQuery}
      onBlur={handleSubmit}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="peer ml-2 w-full flex-1 bg-transparent outline-none placeholder:text-gray-400"
      aria-label="Search"
    />
  );
}
