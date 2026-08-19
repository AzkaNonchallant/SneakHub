import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// ponytail: guard UI saja — backend tetap source of truth untuk otorisasi.
// Literal key — import "@/lib/api" (axios) tidak boleh masuk proxy bundle.
const TOKEN_KEY = "sneakhub_token"
function jwtRole(token: string): string | null {
  try {
    const payload = token.split(".")[1]
    const json = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"))
    return typeof json.role === "string" ? json.role.toLowerCase() : null
  } catch {
    return null
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname === "/") return NextResponse.redirect(new URL("/home", request.url))

  if (pathname.startsWith("/admin")) {
    const role = jwtRole(request.cookies.get(TOKEN_KEY)?.value ?? "")
    if (role !== "admin") return NextResponse.redirect(new URL("/home", request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/admin/:path*"],
}
