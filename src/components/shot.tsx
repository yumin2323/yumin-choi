"use client";

import { useRef, useState } from "react";
import type { Media, MediaSet } from "@/lib/resume";

/** 화면 캡처 한 장. 영상은 GIF처럼 소리 없이 반복 재생하고, 인쇄할 때는 정지 화면으로 바꾼다. 누르면 크게 본다 */
export function Shot({ item, name, shape }: { item: Media; name: string; shape: MediaSet["shape"] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [zoomed, setZoomed] = useState(false);
  const label = `${name} ${item.caption} 화면`;
  const [width, height] = shape === "phone" ? [600, 1305] : [1200, 750];
  const className = `w-full border border-line ${shape === "phone" ? "aspect-[600/1305]" : "aspect-[16/10]"}`;
  const large = "block max-h-[calc(100dvh-7rem)] max-w-full border border-line object-contain";

  const open = () => {
    setZoomed(true);
    dialog.current?.showModal();
    document.documentElement.style.overflow = "hidden";
  };

  return (
    <figure className="break-inside-avoid">
      <button
        type="button"
        onClick={open}
        aria-label={`${label} 크게 보기`}
        className="block w-full cursor-zoom-in print:cursor-auto"
      >
        {item.video && (
          <video
            src={item.video}
            poster={item.image}
            aria-hidden="true"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className={`block print:hidden ${className}`}
          />
        )}
        <img
          src={item.image}
          alt={label}
          width={width}
          height={height}
          loading={item.video ? "eager" : "lazy"}
          className={`${item.video ? "hidden print:block" : "block"} ${className}`}
        />
      </button>
      <figcaption className="mt-2 text-[13px] leading-[1.6] text-muted">{item.caption}</figcaption>

      {/* 크게 보기. 아무 곳이나 누르거나 Esc로 닫는다 */}
      <dialog
        ref={dialog}
        aria-label={label}
        onClick={() => dialog.current?.close()}
        onClose={() => {
          setZoomed(false);
          document.documentElement.style.overflow = "";
        }}
        className="m-0 h-dvh max-h-none w-dvw max-w-none cursor-zoom-out bg-background p-4 text-body backdrop:bg-transparent open:flex open:flex-col open:items-center open:justify-center sm:p-8 print:hidden"
      >
        {/* 닫혀 있을 때 큰 영상을 따로 받지 않도록 열렸을 때만 그린다 */}
        {zoomed &&
          (item.video ? (
            <video
              src={item.video}
              poster={item.image}
              aria-hidden="true"
              autoPlay
              loop
              muted
              playsInline
              className={large}
            />
          ) : (
            <img src={item.image} alt={label} className={large} />
          ))}
        <p className="mt-4 text-sm text-muted">{item.caption}</p>
      </dialog>
    </figure>
  );
}
