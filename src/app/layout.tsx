import type { Metadata } from "next";
import { IBM_Plex_Sans_KR } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { site } from "@/lib/site";
import "./globals.css";

// 한글 글리프는 unicode-range 조각으로 나뉘어 화면에 쓰인 글자만 내려받음
const plex = IBM_Plex_Sans_KR({ weight: ["400", "600"], subsets: ["latin"], variable: "--font-plex" });

export const metadata: Metadata = {
  title: {
    default: site.title,
    template: `%s | ${site.title}`,
  },
  description: site.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // next-themes가 하이드레이션 전에 <html>에 data-theme을 넣으므로 서버 HTML과 달라도 경고하지 않음
    <html lang="ko" className={plex.variable} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col bg-background px-5 font-sans text-base/[1.6] text-body antialiased break-keep wrap-break-word">
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SiteHeader />
          {/* 내용이 짧은 페이지(404 등)에서도 푸터가 뷰포트 맨 아래에 붙도록 남는 높이를 채움 */}
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </ThemeProvider>
        {/* 쿠키 없이 방문자 수와 유입 경로만 집계하는 Vercel Analytics. 프로덕션 배포에서만 수집함 */}
        <Analytics />
      </body>
    </html>
  );
}
