"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

// React 19는 클라이언트 렌더링 중 만들어지는 <script>에 "실행되지 않는다"는 경고를 띄운다.
// 서버 HTML에는 실행되는 스크립트를 그대로 두고(깜빡임 방지), 클라이언트에서는 실행되지 않는
// 데이터 블록(text/plain)으로 넘겨 경고를 피한다. type 차이는 next-themes가 script에 붙이는
// suppressHydrationWarning 덕분에 하이드레이션 경고로 이어지지 않는다.
const scriptProps = typeof window === "undefined" ? undefined : { type: "text/plain" };

export function ThemeProvider(props: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props} scriptProps={scriptProps} />;
}
