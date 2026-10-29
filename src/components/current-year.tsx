"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * 올해 연도. 페이지는 빌드할 때 한 번 만들어지므로, 서버 HTML에는 빌드한 해(fallback)를 두고
 * 하이드레이션이 끝나면 방문한 날의 연도로 바꾼다
 */
export function CurrentYear({ fallback }: { fallback: number }) {
  return useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => fallback,
  );
}
