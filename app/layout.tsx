import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Toaster } from "sonner";
import { Archivo_Narrow, Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const archivoNarrow = Archivo_Narrow({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SNEAKHUB — Resale Marketplace",
  description:
    "Sneaker resale marketplace with visual search, price prediction, and secure authentication.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {


  const lang = (await cookies()).get("sneakhub_lang")?.value === "id" ? "id" : "en"
  return (
    <html
      lang={lang}
      className={`${inter.variable} ${archivoNarrow.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
        <Toaster position="top-center" toastOptions={{ className: "rounded-none border border-outline" }} />
      </body>
    </html>
  );
}
