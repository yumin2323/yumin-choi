// 사이트에 보이는 내용은 모두 이 파일에서 관리한다.
// 문장 안의 **굵게** 표기는 화면에서 강조(strong)로 바뀐다.

export type Link = { label: string; href: string };

/** 성과 한 줄. title이 있으면 "제목 — 설명" 형태, details는 하위 목록 */
export type Highlight = { title?: string; text: string; details?: string[] };

/** 프로젝트의 대표 성과 하나. 설명 뒤에 이전 값 → 개선된 값으로 보여준다 */
export type Outcome = { before: string; after: string; caption: string };

/** 프로젝트 화면 캡처. video가 있으면 image는 재생 전 정지 화면으로 쓴다 (파일은 public/ 아래) */
export type Media = { image: string; video?: string; caption: string };

/** 캡처 묶음. shape이 phone이면 세로 화면 세 칸, screen이면 가로 화면 두 칸으로 놓인다 */
export type MediaSet = { shape: "phone" | "screen"; items: Media[] };

export type Work = {
  /** Resume 페이지의 앵커(/resume#id) */
  id: string;
  name: string;
  /** 이름 아래 붙는 짧은 분류. 홈 메타 줄에도 쓰인다 */
  category: string;
  /** 서비스 종료 같은 현재 상태. Resume에서만 분류 뒤에 붙는다 */
  status?: string;
  period: string;
  url?: string;
  outcome?: Outcome;
  /** 사용자·고객 관점의 제품 성과 한 줄 */
  impact?: string;
  /** 왜 만들었는지 한 문장. 사이드 프로젝트에서 쓴다 */
  motive?: string;
  /** 화면 캡처 */
  media?: MediaSet;
  stack: string[];
  highlights: Highlight[];
  /** 관련 블로그 글의 slug (content/blog/<slug>.mdx) */
  post?: string;
};

export type TimelineItem = {
  company: string;
  period: string;
  summary: string;
  current?: boolean;
};

export type SkillGroup = { title: string; items: string[] };

export type Expertise = { title: string; text: string; items: string[] };

/** 홈의 대표 작업. 프로젝트 이름보다 해결한 문제를 먼저 보여준다 */
export type SelectedWork = { title: string; text: string; work: Work["id"] };

export const profile = {
  name: "Yumin Choi",
  nameKo: "최유민",
  role: "Frontend Developer",
  headline: "복잡한 데이터를\n빠르고 단단한 화면으로.",
  /** 히어로의 한 줄 소개. 자세한 설명은 about에서 */
  intro: "복잡한 데이터 화면을 설계하고 성능을 개선하는 프론트엔드 개발자 최유민입니다.",
  /** 히어로의 지금 하는 일 한 줄 */
  now: {
    text: "지금은 스퀴즈비츠에서 Yetter를 만들고 있습니다",
    href: "https://yetter.ai/",
  },
  /** 홈에 보이는 주요 기술. 전체 목록은 skills */
  coreStack: ["Next.js", "TypeScript", "TanStack Query", "Zustand"],
  email: "cym6749@gmail.com",
  links: [{ label: "GitHub", href: "https://github.com/yumin2323" }] satisfies Link[],
};

export const about = [
  "7년 넘게 복잡한 데이터와 인터랙션을 다뤄 온 프론트엔드 개발자입니다. AI 워크플로우, 수천 개 노드의 모델 그래프, 스프레드시트형 편집 화면처럼 구현 난도가 높은 인터페이스를 주로 만들어 왔습니다.",
  "화면이 느려지면 렌더링 병목과 상태 구조까지 원인을 따라가고, 같은 작업이 반복되면 그 작업이 필요 없는 구조를 만듭니다. 작은 팀에서 API와 배포, 모니터링까지 직접 맡아 왔기 때문에 화면을 제품 전체의 흐름 안에서 봅니다.",
];

export const expertise: Expertise[] = [
  {
    title: "복잡한 UI 설계",
    text: "상태와 인터랙션이 얽힌 화면을 다루기 쉬운 구조로 나눕니다.",
    items: ["대규모 그래프", "워크플로우 에디터", "데이터 그리드"],
  },
  {
    title: "성능과 구조 개선",
    text: "느린 화면의 원인을 측정으로 찾고, 데이터가 흐르는 길을 정리합니다.",
    items: ["렌더링 병목 분석", "상태 관리 구조 개선", "실시간 이벤트 처리"],
  },
  {
    title: "제품 운영까지 이어지는 개발",
    text: "화면 구현에서 끝내지 않고 배포·관측·운영 방식까지 함께 설계합니다.",
    items: ["API 설계와 연동", "배포와 운영", "모니터링"],
  },
];

export const selectedWork: SelectedWork[] = [
  {
    title: "대규모 데이터를 빠르게 그립니다",
    text: "4,000개가 넘는 노드를 처리하는 모델 그래프의 레이아웃과 탐색 병목을 제거했습니다.",
    work: "owlite",
  },
  {
    title: "반복 작업을 없애는 구조를 만듭니다",
    text: "OpenAPI 스키마만으로 새 모델의 입력 화면을 생성하는 구조로 바꿨습니다. 도입 후 5개월간 새 모델은 위젯 추가 없이 스키마만으로 폼이 만들어졌습니다.",
    work: "yetter",
  },
  {
    title: "스프레드시트 수준의 편집을 직접 구현합니다",
    text: "AG Grid Community 버전 위에 범위 선택, 필 핸들, Excel 호환 붙여넣기, Undo를 만들고 모든 셀 변경을 하나의 처리 구조로 모았습니다.",
    work: "fitsonchips",
  },
];

export const works: Work[] = [
  {
    id: "yetter",
    name: "Yetter",
    category: "생성형 AI 플랫폼",
    period: "2025 – 현재",
    url: "https://yetter.ai/",
    outcome: {
      before: "모델 수",
      after: "입력 타입 수",
      caption: "모델 추가 비용이 비례하는 기준 전환",
    },
    impact: "Modular와 MAX 프레임워크 확장을 위한 MOU 체결",
    stack: ["Next.js", "TypeScript", "TanStack Query", "Zustand", "Tailwind CSS", "Radix UI", "Sentry"],
    highlights: [
      {
        title: "프론트엔드 1인 담당으로 처음부터 설계·구축",
        text: "기술 스택 선정, 아키텍처, 인증부터 디자인 토큰·공통 컴포넌트·Storybook, Sentry 모니터링, 배포 설정까지 담당",
      },
      {
        title: "실시간 워크플로우 화면 성능·안정성 개선",
        text: "노드를 이어 만든 생성 워크플로우를 실행할 때 서버에서 쏟아지는 진행 이벤트(SSE)를 프레임 단위로 묶어 반영하고 바뀐 노드만 다시 그리도록 최적화했으며, 이전 실행 결과가 최신 화면을 덮어쓰는 경쟁 문제 방지",
      },
      {
        title: "OpenAPI 기반 모델 입력 화면 자동 생성",
        text: "모델별 입력 스키마를 해석해 폼과 중첩 데이터를 자동 구성",
        details: ["도입 후 5개월간 입력 타입과 위젯 추가 없이, 새로 들어온 모델은 스키마만으로 폼 생성"],
      },
    ],
    post: "json-schema-type-widget-mismatch",
  },
  {
    id: "owlite",
    name: "Owlite",
    category: "딥러닝 모델 벤치마크 및 뷰어 서비스",
    status: "2026년 8월 서비스 종료",
    period: "2022 – 2025",
    outcome: {
      before: "172.64초",
      after: "18.85초",
      caption: "대규모 모델 그래프의 최초 레이아웃 계산 시간 89% 단축",
    },
    impact: "PoC 5건을 정식 도입으로 전환",
    stack: ["React", "SVG", "Redux", "Emotion", "MUI"],
    highlights: [
      {
        title: "대규모 모델 그래프 최초 레이아웃 계산 병목 제거",
        text: "SVG와 HTML DOM을 결합한 그래프 뷰어가 노드 4,000개 이상 모델을 열 때 수 분씩 멈추던 문제를, 그래프 규모별 레이아웃 알고리즘 분기와 O(n²) 배열 탐색·재귀 처리 제거로 해결",
      },
      {
        title: "예외만 지정하면 되는 계층형 양자화 설정 화면 구현",
        text: "모델 경량화(양자화) 옵션을 전체 모델 → 연산자 유형 → 개별 레이어 순으로 좁은 범위가 넓은 범위를 덮어쓰는 구조로 설계해, 수천 개 레이어에 CSS 캐스케이드처럼 예외만 지정하면 되도록 함",
        details: [
          "다중 선택 일괄 편집, 전체 바꾸기, 추천값 한 번에 적용, YAML 내보내기",
          "설정 상태를 Redux 기능별 모듈로 분리해 유지보수성 개선",
        ],
      },
    ],
    post: "editor-node-select-full-rerender",
  },
  {
    id: "fitsonchips",
    name: "FitsOnChips",
    category: "LLM 벤치마크 실행 및 비교 서비스",
    status: "2026년 8월 서비스 종료",
    period: "2023 – 2025",
    outcome: {
      before: "셀 수만큼",
      after: "1건",
      caption: "다중 셀 붙여넣기 시 서버 요청",
    },
    impact: "가입 사용자 100명 이상 확보",
    stack: ["AG Grid", "Nivo", "React", "Redux", "Emotion", "MUI"],
    highlights: [
      {
        title: "AG Grid 기반 스프레드시트 편집 기능 구현",
        text: "Community 버전에서 범위 선택, 필 핸들, Excel 호환 복사·붙여넣기, Undo, 키보드 선택을 직접 구현하고 모든 셀 변경을 단일 처리 구조로 통합하고 백엔드 벌크 API에 연결",
      },
      {
        title: "모델·하드웨어별 벤치마크 결과 비교 차트 구현",
        text: "지표마다 값의 자릿수가 크게 다른 결과를 한 화면에서 비교할 수 있도록 차트 라이브러리(Nivo) 레이어를 직접 확장해 로그 축·역방향 축·사용자 지정 범위를 지원하고, 잘못된 데이터가 차트를 깨뜨리지 않도록 검증과 마우스 호버 판정 영역 개선",
      },
      {
        title: "디자인·다국어 반영 자동화",
        text: "Figma 토큰과 다국어 문구를 GitHub Actions로 변환·반영해 기획자·디자이너가 개발자 도움 없이 변경사항을 반영할 수 있는 구조 구축",
      },
    ],
    post: "aggrid-community-range-selection",
  },
  {
    id: "squeezebits-web",
    name: "스퀴즈비츠 공식 웹사이트",
    category: "회사 공식 웹사이트",
    period: "2025 – 2026",
    url: "https://squeezebits.com/",
    outcome: {
      before: "2.06MB",
      after: "53KB",
      caption: "초기 폰트 다운로드 97% 축소",
    },
    stack: ["Next.js", "FastAPI", "MongoDB", "GA4/GTM"],
    highlights: [
      {
        title: "공식 웹사이트 풀스택 단독 구현",
        text: "전 페이지 프론트엔드와 FastAPI·MongoDB 백엔드를 구현하고, Dockerfile·Jenkins 설정 파일 수정 및 배포 후 서비스 동작 검증",
      },
      {
        title: "외부 블로그 콘텐츠 자동 동기화",
        text: "외부 블로그 글을 가져와 첫 화면은 서버에서 렌더링(RSC)하고 이후는 커서 기반 무한 스크롤로 이어 붙이며, API 장애 시 정적 콘텐츠로 대체하는 fallback 적용",
      },
      {
        title: "마케팅 데이터·공지 운영 이관",
        text: "GA4/GTM 6종 이벤트 체계를 설계하고, popup·banner 공지 기능과 운영 문서를 만들어 비개발 직군이 코드 배포 없이 운영하도록 개선",
      },
      {
        title: "폰트 로딩 최적화",
        text: "서브셋 분리와 unicode-range, 로케일별 동적 import로 초기 폰트 다운로드 축소",
      },
    ],
  },
];

/** 사이드 프로젝트 섹션 첫머리의 한 문장. AI와 함께 만들 때 맡은 역할을 밝힌다 */
export const sideProjectsSummary =
  "기획·설계·구현 과정에서 AI 코딩 에이전트를 활용하고, 제품 방향과 주요 의사결정·검증은 직접 수행했습니다.";

/** 회사 밖에서 만든 프로젝트. 홈의 대표 작업(works)과는 따로 관리한다 */
export const sideProjects: Work[] = [
  {
    id: "marglet",
    name: "Marglet",
    category: "독서 기록 iOS 앱",
    status: "출시 준비 중",
    period: "2026",
    motive: "독후감 작성 부담 없이 책 등록만으로 독서 기록을 남기고, 필요한 순간에만 문장을 추가하는 iOS 앱",
    media: {
      shape: "phone",
      items: [
        { image: "/works/marglet/home.webp", caption: "홈" },
        {
          image: "/works/marglet/search-poster.webp",
          video: "/works/marglet/search.mp4",
          caption: "책 검색과 담기",
        },
        {
          image: "/works/marglet/theme-poster.webp",
          video: "/works/marglet/theme.mp4",
          caption: "테마와 잉크 색 바꾸기",
        },
      ],
    },
    stack: ["Expo", "React Native", "TypeScript", "expo-sqlite", "Supabase", "Jest"],
    highlights: [
      {
        title: "오프라인 우선 저장과 기기 간 동기화",
        text: "네트워크 연결 여부와 관계없이 기록할 수 있도록 SQLite에 우선 저장하고, 변경 대기열과 서버 커서로 동기화하며 행 단위 최신 우선·삭제 우선 규칙으로 충돌 처리",
      },
      {
        title: "도서 검색 프록시",
        text: "Supabase Edge Function으로 카카오 책 검색 키를 서버에만 두고 계정·IP별 하루 호출 제한 적용",
      },
      {
        title: "완료 기준을 테스트로 검증",
        text: "기획 단계에서 정의한 완료 기준을 Jest 578개와 pgTAP 47개 테스트로 자동 검증",
      },
    ],
  },
  {
    id: "crinkle-studio",
    name: "Crinkle Studio",
    category: "AI 애니메이션 제작 도구",
    period: "2026",
    motive:
      "여러 생성 모델을 오가며 캐릭터 설정·프롬프트·샷별 결과를 반복 관리하는 불편을 줄이기 위해 만든 AI 애니메이션 제작 도구",
    media: {
      shape: "screen",
      items: [
        { image: "/works/crinkle-studio/character-bible.webp", caption: "캐릭터 바이블" },
        { image: "/works/crinkle-studio/story.webp", caption: "아이디어를 샷으로 나눈 샷 보드" },
        { image: "/works/crinkle-studio/shot.webp", caption: "샷별 Take 비교와 채택" },
        { image: "/works/crinkle-studio/finish.webp", caption: "완성 영상 미리보기와 MP4 내보내기" },
      ],
    },
    stack: ["Next.js", "TypeScript", "TanStack Query", "Redux", "Supabase"],
    highlights: [
      {
        title: "아이디어에서 MP4까지 5단계 제작 흐름",
        text: "아이디어를 샷으로 분해하고 이미지·영상·오디오 생성을 거쳐 ffmpeg로 MP4 내보내기",
      },
      {
        title: "바이블 기반 프롬프트 조합",
        text: "캐릭터·배경·스타일 설정을 한 번 정의해 두고 샷마다 프롬프트를 자동 조합해 일관성 유지",
      },
      {
        title: "생성 Provider 추상화",
        text: "이미지·영상·오디오 생성 API를 공통 인터페이스로 추상화해 Provider 교체가 제작 흐름에 영향을 주지 않도록 설계",
      },
      {
        title: "샷별 Take 관리",
        text: "샷마다 여러 생성 결과를 Take로 보존하고 비교·채택할 수 있도록 상태 구조 설계",
      },
    ],
  },
];

/** 경력 섹션 첫머리의 한 문장. 최근 프론트엔드 1인 담당 경험의 범위를 명확히 드러낸다 */
export const careerSummary =
  "7년 넘게 정부과제, 제조 MES, AI 서비스까지 여러 도메인의 프론트엔드를 맡아 왔고, 최근 4년은 프론트엔드 1인 담당으로 네 제품의 프론트엔드를 초기 설계부터 정식 서비스 운영까지 맡았습니다.";

export const timeline: TimelineItem[] = [
  {
    company: "스퀴즈비츠",
    period: "2022.10 – 현재",
    summary: "Owlite, FitsOnChips, Yetter, 공식 웹사이트의 프론트엔드를 맡고 있습니다.",
    current: true,
  },
  {
    company: "데이터메이커",
    period: "2022.05 – 2022.09",
    summary: "Vue로 데이터 라벨링 현황 대시보드와 교육용 튜토리얼 사이트를 만들었습니다.",
  },
  {
    company: "위피엔피",
    period: "2020.09 – 2022.01",
    summary: "인쇄물 자동 견적 시스템, 생산 관리 MES, Adobe CEP 플러그인을 React와 PHP로 개발했습니다.",
  },
  {
    company: "메타빌드",
    period: "2017.02 – 2018.05",
    summary: "식약처·공정위 정부과제에서 기관 간 데이터 연계 시스템의 화면을 개발했습니다.",
  },
];

export const education = ["건양대학교 융합IT학부(ICT전공) 졸업", "정보처리기사 · SQLD · 리눅스마스터 2급"];

export const skills: SkillGroup[] = [
  {
    title: "프론트엔드",
    items: ["TypeScript", "React", "Next.js", "TanStack Query", "Zustand"],
  },
  { title: "데이터 시각화", items: ["SVG", "dagre.js", "Nivo", "AG Grid"] },
  {
    title: "디자인 시스템",
    items: ["Tailwind CSS", "Radix UI", "Emotion", "Storybook", "Style Dictionary"],
  },
  {
    title: "백엔드와 운영",
    items: ["FastAPI", "MongoDB", "Sentry", "GA4/GTM"],
  },
];

export function findWork(id: Work["id"]) {
  const work = works.find((item) => item.id === id);
  if (!work) throw new Error(`알 수 없는 작업: ${id}`);
  return work;
}
