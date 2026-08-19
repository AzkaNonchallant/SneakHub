import { SearchView } from "./search-view"

// ponytail: key=query — same-route nav (header search) remount komponen,
// state + visual-match store dikonsumsi lagi
export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const { q } = await searchParams
  const initialQuery = typeof q === "string" ? q : ""
  return <SearchView key={initialQuery} initialQuery={initialQuery} />
}