"use client";

import { useEffect, useRef, useState } from "react";
import type { Media, MediaSet } from "@/lib/resume";

/** 화면 캡처 한 장. 영상은 GIF처럼 소리 없이 반복 재생하고, 인쇄할 때는 정지 화면으로 바꾼다. 누르면 크게 본다 */
export function Shot({ item, name, shape }: { item: Media; name: string; shape: MediaSet["shape"] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const small = useRef<HTMLVideoElement>(null);
  const big = useRef<HTMLVideoElement>(null);
  const startAt = useRef(0);
  const [zoomed, setZoomed] = useState(false);
  const [frame, setFrame] = useState(item.image);
  const label = `${name} ${item.caption} 화면`;
  const [width, height] = shape === "phone" ? [600, 1305] : [1200, 750];
  const className = `w-full border border-line ${shape === "phone" ? "aspect-[600/1305]" : "aspect-[16/10]"}`;
  const large = "block max-h-[calc(100dvh-7rem)] max-w-full object-contain";

  const open = () => {
    // 큰 영상이 준비될 때까지 깜빡이지 않도록, 누른 순간의 장면을 그려 밑에 깔아 둔다
    const video = small.current;
    if (video && video.readyState >= 2) {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d")?.drawImage(video, 0, 0);
      setFrame(canvas.toDataURL());
      startAt.current = video.currentTime;
    } else {
      // 장면을 뜰 수 없으면 지난번에 연 장면 대신 정지 화면을 깔고, 작은 영상의 지금 위치에서 시작한다
      setFrame(item.image);
      startAt.current = video?.currentTime ?? 0;
    }
    setZoomed(true);
    dialog.current?.showModal();
  };

  // 크게 보는 동안 뒤 페이지가 스크롤되지 않게 한다. 열린 채로 다른 페이지로 이동해 언마운트돼도 풀린다
  useEffect(() => {
    if (!zoomed) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = "";
    };
  }, [zoomed]);

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
            ref={small}
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
        {/* lazy로 두면 스크롤하지 않은 채 PDF로 저장할 때 아직 받지 않은 빈 칸으로 찍히므로 바로 받는다.
            페이지 아래쪽이라 위 내용보다 늦게 받도록 우선순위만 낮춘다 */}
        <img
          src={item.image}
          alt={label}
          width={width}
          height={height}
          fetchPriority="low"
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
          // 닫을 때도 큰 영상이 보여 주던 지점에서 이어 간다
          if (small.current && big.current) small.current.currentTime = big.current.currentTime;
          setZoomed(false);
        }}
        className="m-0 h-dvh max-h-none w-dvw max-w-none cursor-zoom-out bg-background p-4 text-body backdrop:bg-transparent open:flex open:flex-col open:items-center open:justify-center sm:p-8 print:hidden"
      >
        {/* 닫혀 있을 때 큰 영상을 따로 받지 않도록 열렸을 때만 그린다 */}
        {zoomed &&
          (item.video ? (
            <div className="relative max-w-full border border-line">
              <img src={frame} alt="" className={large} />
              <video
                ref={big}
                src={item.video}
                aria-hidden="true"
                autoPlay
                loop
                muted
                playsInline
                // 밑에 깔아 둔 장면, 곧 누른 순간의 지점에서 이어서 보여 준다
                onLoadedMetadata={(event) => {
                  event.currentTarget.currentTime = startAt.current;
                }}
                className="absolute inset-0 h-full w-full"
              />
            </div>
          ) : (
            <img src={item.image} alt={label} className={`${large} border border-line`} />
          ))}
        <p className="mt-4 text-sm text-muted">{item.caption}</p>
      </dialog>
    </figure>
  );
}
