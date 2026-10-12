"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";

/* ---------- 스키마 타입 ---------- */

type PropertySchema = {
  type?: string;
  "x-ui-type"?: string;
  default?: unknown;
  enum?: string[];
  minimum?: number;
  maximum?: number;
  nullable?: boolean;
  required?: boolean;
};

type NormalizedProps = Record<string, PropertySchema>;
type FormValues = Record<string, unknown>;

const DEFAULT_SCHEMA = `{
  "type": "object",
  "required": ["prompt"],
  "x-ui-order-properties": [
    "prompt", "image_size", "num_images",
    "seed", "enable_safety", "reference_images"
  ],
  "properties": {
    "prompt": { "type": "string", "x-ui-type": "prompt" },
    "image_size": {
      "type": "string",
      "x-ui-type": "dropdown",
      "enum": ["square", "portrait_4_3", "landscape_16_9"],
      "default": "square"
    },
    "num_images": {
      "type": "integer",
      "x-ui-type": "slider",
      "minimum": 1, "maximum": 4, "default": 1
    },
    "seed": { "type": "integer", "x-ui-type": "seed" },
    "enable_safety": { "type": "boolean", "default": true },
    "reference_images": {
      "type": "array",
      "x-ui-type": "image_url_array"
    }
  }
}`;

/* ---------- 1. 스키마 정규화 ---------- */

function normalize(raw: any): NormalizedProps {
  const order: string[] = raw?.["x-ui-order-properties"] ?? Object.keys(raw?.properties ?? {});
  const props = raw?.properties ?? {};
  const requiredArray: string[] = Array.isArray(raw?.required) ? raw.required : [];

  const out: NormalizedProps = {};
  order.forEach((key) => {
    if (!props[key]) return;
    out[key] = { ...props[key], required: requiredArray.includes(key) };
  });
  return out;
}

/* ---------- 2. 기본값 생성 ---------- */

function buildDefaultValues(props: NormalizedProps): FormValues {
  const values: FormValues = {};
  for (const [key, prop] of Object.entries(props)) {
    let value: unknown = prop.default ?? null;

    if (value === null && !prop.nullable) {
      if (prop.type === "string") value = "";
      else if (prop.type === "number" || prop.type === "integer") value = prop.minimum ?? 0;
      else if (prop.type === "boolean") value = false;
      else if (prop.type === "array") value = [];
    }
    values[key] = value;
  }
  return values;
}

/* ---------- 3. 위젯 분기 ---------- */

const fieldBox =
  "w-full rounded-lg border border-line bg-background px-2.5 py-1.5 text-[13px] text-heading outline-none focus:border-accent";

function Field({
  name,
  prop,
  value,
  onChange,
}: {
  name: string;
  prop: PropertySchema;
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  const uiType = prop["x-ui-type"];
  const type = prop.type;

  const label = (
    <div className="mb-1 flex items-center gap-1.5">
      <span className="text-[12.5px] font-semibold text-heading">{name}</span>
      {prop.required ? <span className="text-accent">*</span> : null}
      <span className="ml-auto rounded border border-line px-1.5 py-0.5 font-mono text-[10.5px] text-muted">
        {uiType ?? type}
      </span>
    </div>
  );

  let control: React.ReactNode;

  if (uiType === "prompt") {
    control = (
      <textarea
        rows={3}
        value={String(value ?? "")}
        placeholder="생성할 이미지를 설명하세요"
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        className={fieldBox + " resize-none leading-relaxed"}
      />
    );
  } else if (uiType === "seed") {
    control = (
      <div className="flex gap-1.5">
        <input
          value={String(value ?? "")}
          placeholder="비워 두면 무작위"
          onChange={(e) => onChange(e.target.value)}
          className={fieldBox}
        />
        <button
          type="button"
          onClick={() => onChange(String(Math.floor(Math.random() * 9000000) + 1000000))}
          className="shrink-0 cursor-pointer rounded-lg border border-line px-2.5 text-[12px] font-semibold text-sub hover:bg-soft hover:text-heading"
        >
          난수
        </button>
      </div>
    );
  } else if (uiType === "multi-select") {
    const selected = Array.isArray(value) ? (value as string[]) : [];
    control = (
      <div className="flex flex-wrap gap-1.5">
        {(prop.enum ?? []).map((opt) => {
          const on = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(on ? selected.filter((v) => v !== opt) : [...selected, opt])}
              className={
                "cursor-pointer rounded-md border px-2 py-1 text-[12px] font-semibold " +
                (on ? "border-accent bg-accent-soft text-accent" : "border-line text-sub hover:text-heading")
              }
            >
              {opt}
            </button>
          );
        })}
      </div>
    );
  } else if (uiType === "dropdown" || (prop.enum?.length ?? 0) > 0) {
    control = (
      <select value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className={fieldBox}>
        {(prop.enum ?? []).map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  } else if (uiType === "slider") {
    const min = prop.minimum ?? 0;
    const max = prop.maximum ?? 10;
    control = (
      <div className="flex items-center gap-2.5">
        <input
          type="range"
          min={min}
          max={max}
          value={Number(value ?? min)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-1 flex-1 cursor-pointer accent-[var(--color-accent,currentColor)]"
        />
        <span className="w-7 text-right text-[13px] font-semibold text-heading tabular-nums">{String(value ?? min)}</span>
      </div>
    );
  } else if (uiType === "image_url" || uiType === "image_url_array") {
    const urls = Array.isArray(value) ? (value as string[]) : [];
    const single = uiType === "image_url";
    control = (
      <div className="flex flex-wrap items-center gap-1.5">
        {urls.map((u, i) => (
          <span
            key={u + i}
            className="flex items-center gap-1 rounded-md border border-line bg-soft px-2 py-1 text-[11.5px] text-sub"
          >
            <span className="inline-block h-3.5 w-3.5 rounded-sm bg-accent-soft" aria-hidden />
            {u}
            <button
              type="button"
              aria-label={`${u} 제거`}
              onClick={() => onChange(urls.filter((_, idx) => idx !== i))}
              className="cursor-pointer pl-0.5 text-muted hover:text-heading"
            >
              ×
            </button>
          </span>
        ))}
        {single && urls.length >= 1 ? null : (
          <button
            type="button"
            onClick={() => onChange([...urls, `image_${urls.length + 1}.png`])}
            className="cursor-pointer rounded-md border border-dashed border-line px-2.5 py-1 text-[12px] font-semibold text-sub hover:border-accent hover:text-accent"
          >
            + 이미지 추가
          </button>
        )}
      </div>
    );
  } else if (type === "boolean") {
    control = (
      <button
        type="button"
        role="switch"
        aria-checked={Boolean(value)}
        onClick={() => onChange(!value)}
        className={
          "flex h-5 w-9 items-center rounded-full p-0.5 transition-colors " +
          (value ? "bg-accent" : "bg-line")
        }
      >
        <span
          className={
            "h-4 w-4 rounded-full bg-background transition-transform " + (value ? "translate-x-4" : "translate-x-0")
          }
        />
      </button>
    );
  } else if (type === "number" || type === "integer") {
    control = (
      <input
        inputMode="numeric"
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        className={fieldBox}
      />
    );
  } else {
    control = (
      <input value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className={fieldBox} />
    );
  }

  return (
    <div>
      {label}
      {control}
    </div>
  );
}

/* ---------- JSON 편집기 ---------- */

// 키 / 문자열 / 숫자·true·false·null / 괄호·쉼표. 색은 블로그 코드 블록과 같은 --shiki-* 변수
const JSON_TOKEN = /("(?:\\.|[^"\\])*")(\s*:)?|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|\b(?:true|false|null)\b)|([{}[\],:])/g;

function highlightJson(text: string) {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(JSON_TOKEN)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const [token, str, colon, literal] = m;
    const color = str
      ? colon
        ? "var(--shiki-token-keyword)"
        : "var(--shiki-token-string)"
      : literal
        ? "var(--shiki-token-constant)"
        : "var(--shiki-token-punctuation)";
    out.push(
      <span key={m.index} style={{ color }}>
        {str ?? token}
      </span>,
    );
    if (colon) out.push(<span key={`${m.index}:`} style={{ color: "var(--shiki-token-punctuation)" }}>{colon}</span>);
    last = m.index + token.length;
  }
  out.push(text.slice(last));
  return out;
}

/**
 * 색이 입혀진 JSON 편집기. 글자를 투명하게 한 textarea를 색칠한 pre 위에 겹치고 스크롤을 맞춘다.
 * 줄바꿈 위치가 같도록 둘 다 세로 스크롤바 자리를 항상 잡아 내용 너비를 맞춘다
 */
function JsonEditor({ value, onChange }: { value: string; onChange: (next: string) => void }) {
  const preRef = useRef<HTMLPreElement>(null);
  const layer =
    "absolute inset-0 m-0 overflow-x-hidden overflow-y-scroll p-3 font-mono text-[11.5px] leading-[1.6] whitespace-pre-wrap break-words";

  return (
    <div className="relative h-[340px] rounded-lg border border-line bg-soft focus-within:border-accent">
      <pre ref={preRef} aria-hidden="true" className={`${layer} pointer-events-none text-[var(--shiki-foreground)]`}>
        {highlightJson(value)}
        {/* 마지막 줄이 빈 줄일 때 textarea와 높이를 맞춤 */}
        {"\n"}
      </pre>
      <textarea
        spellCheck={false}
        aria-label="OpenAPI Input 스키마"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={(e) => {
          if (!preRef.current) return;
          preRef.current.scrollTop = e.currentTarget.scrollTop;
        }}
        className={`${layer} w-full resize-none bg-transparent text-transparent caret-heading outline-none selection:bg-accent/25`}
      />
    </div>
  );
}

/* ---------- 4. 데모 카드 ---------- */

export function SchemaFormDemo() {
  const [text, setText] = useState(DEFAULT_SCHEMA);

  const parsed = useMemo(() => {
    try {
      return { props: normalize(JSON.parse(text)), error: null as string | null };
    } catch (e) {
      return { props: null, error: e instanceof Error ? e.message : "JSON을 읽을 수 없습니다" };
    }
  }, [text]);

  const props = parsed.props;
  const signature = props ? JSON.stringify(Object.keys(props)) : "";

  const [values, setValues] = useState<FormValues>(() => (props ? buildDefaultValues(props) : {}));

  // 필드 구성이 바뀌면 기본값을 다시 만든다
  useEffect(() => {
    if (props) setValues(buildDefaultValues(props));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  return (
    <figure className="my-10 border-y border-line py-5">
      <div>
        <figcaption className="text-[15px] font-semibold text-heading">
          스키마를 고치면 폼이 따라 바뀐다
        </figcaption>
        <p className="mt-2 text-sm leading-[1.75] text-sub">
          왼쪽 스키마의 <code className="font-mono text-[12.5px] text-accent">x-ui-type</code>을 바꾸면 오른쪽 위젯이
          바뀐다. 프론트엔드 코드는 그대로다.
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="flex flex-col">
          <div className="mb-1.5 text-[12px] font-semibold text-muted">OpenAPI Input 스키마</div>
          <JsonEditor value={text} onChange={setText} />
          {parsed.error ? (
            <p className="mt-1.5 text-[12px] text-accent">JSON 오류: {parsed.error}</p>
          ) : (
            <p className="mt-1.5 text-[12px] text-muted">
              쓸 수 있는 값: prompt · seed · dropdown · slider · multi-select · image_url_array
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <div className="mb-1.5 text-[12px] font-semibold text-muted">생성된 입력 폼</div>
          <div className="h-[340px] overflow-y-auto rounded-lg border border-line p-3">
            {props && Object.keys(props).length > 0 ? (
              <div className="flex flex-col gap-3.5">
                {Object.entries(props).map(([name, prop]) => (
                  <Field
                    key={name}
                    name={name}
                    prop={prop}
                    value={values[name]}
                    onChange={(next) => setValues((prev) => ({ ...prev, [name]: next }))}
                  />
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-muted">
                {parsed.error ? "스키마를 읽을 수 없어 폼을 그리지 못했다." : "properties가 비어 있다."}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 text-[13px] text-muted">
        필드 순서는 <code className="font-mono text-[12px]">x-ui-order-properties</code> 배열이 정한다. 순서를 바꾸면
        폼의 순서도 바뀐다.
      </div>
    </figure>
  );
}
