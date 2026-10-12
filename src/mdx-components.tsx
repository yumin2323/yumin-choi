import type { MDXComponents } from "mdx/types";
import type { ComponentProps } from "react";
import { CssDeliveryDemo } from "@/components/demos/css-delivery-demo";
import { DecodeWindowDemo } from "@/components/demos/decode-window-demo";
import { MiniEditorDemo } from "@/components/demos/mini-editor-demo";
import { SchemaFormDemo } from "@/components/demos/schema-form-demo";
import { StreamBatchDemo } from "@/components/demos/stream-batch-demo";
import { TextLink } from "@/components/section";

// 블로그 본문(MDX)의 마크다운 요소 스타일
const components: MDXComponents = {
  h2: (props) => (
    <h2 className="mt-14 mb-4 text-[21px] leading-[1.45] font-semibold tracking-[-0.02em] text-heading" {...props} />
  ),
  h3: (props) => <h3 className="mt-10 mb-3 text-[17px] leading-[1.5] font-semibold text-heading" {...props} />,
  p: (props) => <p className="my-5" {...props} />,
  a: ({ href = "", children }: ComponentProps<"a">) => <TextLink href={href}>{children}</TextLink>,
  strong: (props) => <strong className="font-semibold text-heading" {...props} />,
  ul: (props) => <ul className="my-5 list-disc space-y-1.5 pl-5 marker:text-muted" {...props} />,
  ol: (props) => <ol className="my-5 list-decimal space-y-1.5 pl-5 marker:text-muted" {...props} />,
  blockquote: (props) => <blockquote className="my-6 border-l-2 border-gold pl-5 text-sub" {...props} />,
  hr: () => <hr className="my-12 border-line" />,
  pre: (props) => (
    <pre
      className="my-6 overflow-x-auto rounded-lg bg-soft py-4 font-mono text-[13.5px] leading-[1.7] text-heading"
      {...props}
    />
  ),
  // 블록 코드(pre 안)는 pre 스타일을 따르고, 문장 속 코드만 배경을 둔다. 블록 코드의 색과 줄 강조는 globals.css의 [data-line] 규칙
  code: (props) => (
    <code className="rounded bg-soft px-1.5 py-0.5 font-mono text-[0.9em] text-heading [pre_&]:bg-transparent [pre_&]:p-0" {...props} />
  ),
  table: (props) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-[15px]" {...props} />
    </div>
  ),
  th: (props) => <th className="border-b border-line py-2 pr-4 text-left font-semibold text-heading" {...props} />,
  td: (props) => <td className="border-b border-line py-2 pr-4 tabular-nums" {...props} />,

  // 글에서 import 없이 태그로 바로 쓰는 인터랙티브 데모
  CssDeliveryDemo,
  DecodeWindowDemo,
  MiniEditorDemo,
  SchemaFormDemo,
  StreamBatchDemo,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
