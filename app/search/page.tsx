import { SearchView } from "./search-view"



export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const { q } = await searchParams
  const initialQuery = typeof q === "string" ? q : ""
  return <SearchView key={initialQuery} initialQuery={initialQuery} />
}