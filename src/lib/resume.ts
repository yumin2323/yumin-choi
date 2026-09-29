// 사이트에 보이는 내용은 모두 이 파일에서 관리한다.
// 문장 안의 **굵게** 표기는 화면에서 강조(strong)로 바뀐다.

export type Link = { label: string; href: string };

/** 성과 한 줄. title이 있으면 "제목 — 설명" 형태, details는 하위 목록 */
export type Highlight = { title?: string; text: string; details?: string[] };

/** 작업 카드의 일러스트 종류 (src/components/work-illustration.tsx) */
export type IllustrationVariant = "workflow" | "benchmark" | "graph" | "website";

export type Work = {
  name: string;
  period: string;
  url?: string;
  tagline: string;
  illustration: IllustrationVariant;
  stack: string[];
  highlights: Highlight[];
};

export type Story = {
  title: string;
  project: string;
  problem: string;
  approach: string;
  result: string;
  metric: { before: string; after: string; unit: string };
};

export type TimelineItem = { company: string; period: string; summary: string; current?: boolean };

export type SkillGroup = { title: string; items: string[] };

export const profile = {
  name: "Yumin Choi",
  nameKo: "최유민",
  role: "프론트엔드 개발자",
  greeting: "안녕하세요,\n프론트엔드 개발자 최유민입니다.",
  intro: [
    "7년 가까이 React와 Next.js로 서비스를 설계하고 만들어 왔어요. 수천 개의 노드가 얽힌 모델 그래프, 편집 가능한 벤치마크 표, 실시간으로 흘러가는 AI 워크플로우처럼 데이터가 많고 복잡한 화면을 빠르고 단단하게 만드는 일을 좋아해요.",
    "화면만 만들지 않고 배포 설정과 운영, 필요하면 FastAPI 백엔드까지 직접 챙기면서 데이터가 흐르는 길 전체를 보려고 해요.",
  ],
  now: { label: "지금", text: "스퀴즈비츠에서 생성형 AI 서비스 Yetter를 만들고 있어요", href: "https://yetter.ai/" },
  email: "cym6749@gmail.com",
  links: [{ label: "GitHub", href: "https://github.com/yumin2323" }] satisfies Link[],
};

export const works: Work[] = [
  {
    name: "Yetter",
    period: "2025 – 현재",
    url: "https://yetter.ai/",
    tagline: "노드를 이어 이미지와 비디오를 생성하는 AI 서비스. 프론트엔드를 처음부터 설계했어요.",
    illustration: "workflow",
    stack: ["Next.js", "TypeScript", "TanStack Query", "Zustand", "Tailwind CSS", "Radix UI", "Sentry"],
    highlights: [
      {
        title: "생성형 AI 서비스 프론트엔드 설계·구축 주도",
        text: "기술 스택 선정부터 아키텍처, 인증, 디자인 시스템과 모니터링 환경을 담당하고 배포 설정 및 동작 검증 수행",
      },
      {
        title: "실시간 워크플로우 화면 성능·안정성 개선",
        text: "SSE 이벤트를 묶어 처리하고 변경된 노드만 다시 렌더링하도록 최적화했으며, 이전 실행 결과가 최신 화면을 덮어쓰는 문제 방지",
      },
      {
        title: "OpenAPI 기반 모델 입력 화면 자동 생성",
        text: "모델별 입력 스키마를 해석해 폼과 중첩 데이터를 자동 구성하고, 신규 모델 추가 시 약 2~3시간 소요되던 프론트엔드 작업 제거",
      },
      {
        title: "디자인 시스템·운영 기반 구축",
        text: "디자인 토큰, 공통 컴포넌트, Storybook, Sentry 환경을 구축해 UI 일관성과 운영 안정성 향상",
      },
    ],
  },
  {
    name: "Owlite",
    period: "2022 – 2025",
    tagline: "딥러닝 모델의 구조를 그래프로 탐색하고 양자화 설정을 다루는 모델 분석 서비스",
    illustration: "graph",
    stack: ["React", "SVG", "Redux", "Emotion", "MUI"],
    highlights: [
      {
        title: "대규모 모델 그래프 렌더링 시간 89% 단축",
        text: "Stable Diffusion UNet XL 기준 렌더링 시간을 **172.64초에서 18.85초로 단축**",
        details: [
          "SVG와 HTML DOM을 결합한 그래프 뷰어에서 대규모 모델(노드 4,000개 이상) 처리 시 수 분의 지연 발생",
          "그래프 규모에 따라 레이아웃 알고리즘을 분기하고, O(n²) 배열 탐색과 재귀 처리 등 주요 병목 제거",
        ],
      },
      {
        title: "3단계 우선순위 기반 모델 양자화 설정 시스템 구현",
        text: "전체 모델·연산자 유형·개별 레이어 설정이 순서에 따라 덮어써지는 구조 구현",
        details: [
          "다중 레이어 일괄 편집, Replace All, 추천 설정 연동, YAML export 제공",
          "복잡한 설정 상태를 Redux와 기능별 모듈로 분리해 유지보수성 개선",
        ],
      },
    ],
  },
  {
    name: "FitsOnChips",
    period: "2023 – 2025",
    tagline: "LLM 벤치마크를 돌리고 모델·하드웨어별 성능을 비교하는 서비스",
    illustration: "benchmark",
    stack: ["React", "Redux", "AG Grid", "Nivo", "Emotion", "MUI"],
    highlights: [
      {
        title: "AG Grid 기반 스프레드시트 편집 기능 구현",
        text: "Community 버전에서 범위 선택, 필 핸들, Excel 호환 복사·붙여넣기, Undo, 키보드 선택을 직접 구현하고 모든 셀 변경을 단일 처리 구조로 통합",
        details: ["백엔드 벌크 API 도입 시 붙여넣은 셀 수와 관계없이 서버 요청 1건으로 처리하도록 확장"],
      },
      {
        title: "다차원 벤치마크 시각화 구현",
        text: "Nivo 기본 레이어를 확장해 지표별 log·reverse 축과 사용자 지정 범위를 지원하고, 데이터 검증과 호버 영역 개선으로 복잡한 결과를 안정적으로 비교",
      },
      {
        title: "디자인·다국어 반영 자동화",
        text: "Figma 토큰과 다국어 문구를 GitHub Actions로 변환·반영해 기획자·디자이너가 개발자 도움 없이 변경사항을 반영할 수 있는 구조 구축",
      },
    ],
  },
  {
    name: "스퀴즈비츠 공식 웹사이트",
    period: "2025 – 2026",
    tagline: "프론트엔드부터 FastAPI·MongoDB 백엔드, 배포 설정까지 혼자 만든 회사 웹사이트",
    illustration: "website",
    stack: ["Next.js", "FastAPI", "MongoDB", "Docker", "Jenkins", "AWS", "GA4/GTM"],
    highlights: [
      {
        title: "공식 웹사이트 풀스택 구현",
        text: "전 페이지 프론트엔드와 FastAPI·MongoDB 백엔드를 구현하고, Dockerfile과 Jenkins 설정 파일을 구성해 배포 및 서비스 동작 검증",
      },
      {
        title: "외부 블로그 콘텐츠 자동 동기화",
        text: "MongoDB 복합 키 기반 커서 페이지네이션과 RSC 첫 화면 SSR·무한 스크롤을 결합하고, API 장애 시 정적 콘텐츠로 대체하는 fallback 적용",
      },
      {
        title: "마케팅 데이터·공지 운영 이관",
        text: "GA4/GTM 6종 이벤트 체계를 설계하고, popup·banner 공지 기능과 운영 문서를 만들어 비개발 직군이 코드 배포 없이 운영하도록 개선",
      },
      {
        title: "폰트 로딩 최적화",
        text: "서브셋 분리와 unicode-range, 로케일별 동적 import로 초기 폰트 다운로드를 **2.06MB에서 53KB로 97% 축소**",
      },
    ],
  },
];

export const stories: Story[] = [
  {
    title: "3분 가까이 걸리던 그래프를 19초로",
    project: "Owlite",
    problem:
      "SVG와 HTML DOM을 섞어 그리는 모델 그래프 뷰어가 노드 4,000개가 넘는 대규모 모델 앞에서 몇 분씩 멈춰 있었어요.",
    approach:
      "그래프 규모에 따라 레이아웃 알고리즘을 나눠 쓰고, O(n²) 배열 탐색과 재귀 처리처럼 시간을 잡아먹던 병목을 하나씩 걷어냈어요.",
    result: "Stable Diffusion UNet XL 기준 렌더링 시간이 89% 줄었어요.",
    metric: { before: "172.64", after: "18.85", unit: "초" },
  },
  {
    title: "첫 화면 폰트를 53KB로",
    project: "스퀴즈비츠 공식 웹사이트",
    problem: "한국어·일본어·영문을 모두 지원하느라 첫 화면을 그리기 전에 받아야 하는 폰트가 2MB를 넘었어요.",
    approach:
      "폰트를 latin·korean·japanese 서브셋으로 나누고, unicode-range와 로케일별 동적 import로 필요한 글자만 받도록 바꿨어요.",
    result: "초기 폰트 다운로드가 97% 줄었고, 저장소의 폰트 자산도 14.3MB에서 6.8MB로 가벼워졌어요.",
    metric: { before: "2.06MB", after: "53KB", unit: "" },
  },
  {
    title: "새 모델이 올 때마다 하던 화면 작업을 없애기",
    project: "Yetter",
    problem: "AI 모델이 추가될 때마다 입력 폼을 손으로 만드느라 모델 하나에 2~3시간씩 프론트엔드 작업이 필요했어요.",
    approach: "모델의 OpenAPI 입력 스키마를 해석해서 폼과 중첩 데이터 구조를 자동으로 구성하게 만들었어요.",
    result: "이제 새 모델이 추가돼도 입력 화면은 코드 수정 없이 바로 생겨요.",
    metric: { before: "2~3", after: "0", unit: "시간" },
  },
];

export const timeline: TimelineItem[] = [
  {
    company: "스퀴즈비츠",
    period: "2022.10 – 현재",
    summary: "Owlite, FitsOnChips, Yetter, 공식 웹사이트의 프론트엔드를 맡고 있어요.",
    current: true,
  },
  { company: "데이터메이커", period: "2022.05 – 2022.09", summary: "Vue로 데이터 라벨링 현황 대시보드와 교육용 튜토리얼 사이트를 만들었어요." },
  {
    company: "위피엔피",
    period: "2020.09 – 2022.01",
    summary: "인쇄물 자동 견적 시스템, 생산 관리 MES, Adobe CEP 플러그인을 React와 PHP로 만들었어요.",
  },
  { company: "메타빌드", period: "2017.02 – 2018.05", summary: "식약처·공정위 정부과제에서 기관 간 데이터 연계 시스템 화면을 만들었어요." },
];

export const education = ["건양대학교 융합IT학부(ICT전공) 졸업", "정보처리기사 · SQLD · 리눅스마스터 2급"];

export const skills: SkillGroup[] = [
  { title: "자주 쓰는", items: ["TypeScript", "React", "Next.js", "TanStack Query", "Zustand", "Tailwind CSS", "Radix UI"] },
  { title: "데이터를 그릴 때", items: ["SVG", "dagre.js", "Nivo", "AG Grid"] },
  { title: "디자인 시스템", items: ["Storybook", "Style Dictionary", "MUI", "Emotion", "shadcn/ui"] },
  { title: "백엔드와 운영", items: ["FastAPI", "MongoDB", "MySQL", "Docker", "Jenkins", "AWS", "Sentry", "GA4/GTM"] },
  { title: "함께 일하는", items: ["GitHub", "Claude", "Cursor AI"] },
];
