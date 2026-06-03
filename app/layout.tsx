import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import GoogleTranslate from "@/components/GoogleTranslate";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'WCFC \u2014 World Cup Fan Challenge 2026',
  description: 'The global fan prediction challenge for the 2026 FIFA World Cup. Pick every match, win real prizes.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script id="translate-crash-guard" strategy="beforeInteractive">
          {`
            (function () {
              if (typeof Node !== 'function' || !Node.prototype) return;
              var origRemove = Node.prototype.removeChild;
              Node.prototype.removeChild = function (child) {
                if (child && child.parentNode !== this) { return child; }
                return origRemove.apply(this, arguments);
              };
              var origInsert = Node.prototype.insertBefore;
              Node.prototype.insertBefore = function (newNode, referenceNode) {
                if (referenceNode && referenceNode.parentNode !== this) { return newNode; }
                return origInsert.apply(this, arguments);
              };
            })();
          `}
        </Script>
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        <GoogleTranslate />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
