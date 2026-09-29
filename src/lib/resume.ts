// 사이트에 보이는 이력 내용은 모두 이 파일에서 관리한다.
// 문장 안의 **굵게** 표기는 화면에서 강조(strong)로 바뀐다.

export type Link = { label: string; href: string };

/** 성과 한 줄. title이 있으면 "제목 — 설명" 형태, details는 하위 목록 */
export type Highlight = { title?: string; text: string; details?: string[] };

export type CareerProject = {
  name: string;
  /** "YYYY.MM – YYYY.MM" 또는 "YYYY.MM – 현재" */
  period?: string;
  url?: string;
  summary?: string;
  stack: string[];
  highlights: Highlight[];
};

export type Company = {
  name: string;
  /** YYYY.MM 형식. 재직 중이면 end 생략 */
  start: string;
  end?: string;
  projects: CareerProject[];
};

export type Stat = { value: string; label: string; detail: string };

export type SkillGroup = { title: string; items: string[] };

export type Milestone = { title: string; period: string };

export const profile = {
  name: "Yumin Choi",
  nameKo: "최유민",
  role: "프론트엔드 개발자",
  headline: "복잡한 데이터와 AI 서비스를 빠르고 단단한 화면으로",
  intro: [
    "약 7년간 React와 Next.js 기반 서비스의 설계와 개발을 주도하고, 배포 설정과 운영까지 경험해 온 프론트엔드 개발자입니다.",
    "딥러닝 모델 뷰어 Owlite, LLM 벤치마크 비교 서비스 FitsOnChips, 생성형 AI 서비스 Yetter의 프론트엔드를 맡아 대규모 데이터 UI, 렌더링 성능 최적화, 실시간 상태 처리, 디자인 시스템과 모니터링 환경을 만들어 왔습니다.",
  ],
  links: [
    { label: "Email", href: "mailto:cym6749@gmail.com" },
    { label: "GitHub", href: "https://github.com/yumin2323" },
  ] satisfies Link[],
};

export const stats: Stat[] = [
  { value: "89%", label: "대규모 모델 그래프 렌더링 시간 단축", detail: "172.64초 → 18.85초" },
  { value: "97%", label: "초기 렌더 폰트 다운로드 축소", detail: "2.06MB → 53KB" },
  { value: "2~3시간 → 0", label: "신규 AI 모델 입력 화면 작업", detail: "OpenAPI 스키마로 자동 생성" },
];

export const companies: Company[] = [
  {
    name: "스퀴즈비츠",
    start: "2022.10",
    projects: [
      {
        name: "Yetter",
        period: "2025.05 – 현재",
        url: "https://yetter.ai/",
        summary: "생성형 AI 모델 테스트와 노드 기반 이미지·비디오 생성을 지원하는 서비스",
        stack: ["Next.js", "React", "TypeScript", "TanStack Query", "Zustand", "Tailwind CSS", "Radix UI", "Sentry"],
        highlights: [
          {
            title: "생성형 AI 서비스 프론트엔드 설계·구축 주도",
            text: "프론트엔드 전반을 책임지며 기술 스택 선정부터 아키텍처, 인증, 디자인 시스템과 모니터링 환경을 담당하고 배포 설정 및 동작 검증 수행",
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
        name: "스퀴즈비츠 공식 웹사이트",
        period: "2025.10 – 2026.06",
        stack: ["Next.js", "React", "TypeScript", "MUI", "FastAPI", "MongoDB", "Docker", "Jenkins", "AWS", "GA4/GTM"],
        highlights: [
          {
            title: "공식 웹사이트 풀스택 구현",
            text: "전 페이지 프론트엔드와 FastAPI·MongoDB 백엔드를 구현하고, Dockerfile과 Jenkins 설정 파일을 구성해 배포 및 서비스 동작 검증",
          },
          {
            title: "외부 블로그 콘텐츠 자동 동기화",
            text: "MongoDB 복합 키 기반 커서 페이지네이션과 RSC 첫 화면 SSR·무한 스크롤을 결합해 자동 동기화 구조를 구현하고, API 장애 시 정적 콘텐츠로 대체하는 fallback 적용",
          },
          {
            title: "마케팅 데이터·공지 운영 이관",
            text: "GA4/GTM에서 제품 관심도·콘텐츠·문의 전환을 측정하는 6종 이벤트 체계를 설계하고, popup·banner 공지 기능과 운영 문서를 구축해 비개발 직군이 코드 배포 없이 운영하도록 개선",
          },
          {
            title: "폰트 로딩 최적화",
            text: "폰트를 latin·korean·japanese 서브셋으로 분리하고 unicode-range와 로케일별 동적 import를 적용해 초기 렌더 경로의 폰트 다운로드를 **2.06MB에서 53KB로 97% 축소**하고, 저장소 폰트 자산도 14.3MB에서 6.8MB로 52% 감축",
          },
        ],
      },
      {
        name: "FitsOnChips",
        period: "2023.07 – 2025.08",
        summary: "LLM 벤치마크를 실행하고 다양한 모델·하드웨어의 성능 결과를 비교하는 서비스",
        stack: ["JavaScript", "React", "Redux", "Emotion", "MUI", "AG Grid", "Nivo"],
        highlights: [
          {
            title: "AG Grid 기반 스프레드시트 편집 기능 구현",
            text: "Community 버전에서 범위 선택, 필 핸들, Excel 호환 복사·붙여넣기, Undo, 키보드 선택을 직접 구현하고 모든 셀 변경을 단일 처리 구조로 통합해 서버 저장과 편집 제어의 일관성 확보",
            details: ["백엔드 벌크 API 도입 시 붙여넣은 셀 수와 관계없이 서버 요청 1건으로 처리하도록 확장"],
          },
          {
            title: "다차원 벤치마크 시각화 구현",
            text: "Nivo 기본 레이어를 확장해 지표별 log·reverse 축과 사용자 지정 범위를 지원하고, 데이터 검증과 호버 영역 개선을 통해 복잡한 결과를 안정적으로 비교할 수 있도록 구현",
          },
          {
            title: "디자인·다국어 반영 자동화",
            text: "Figma 토큰과 다국어 문구를 GitHub Actions로 변환·반영하고, 여러 UI 라이브러리가 동일한 토큰을 사용하도록 구성해 기획자·디자이너가 개발자 도움 없이 변경사항을 반영할 수 있는 구조 구축",
          },
        ],
      },
      {
        name: "Owlite",
        period: "2022.11 – 2025.11",
        summary: "딥러닝 모델의 성능을 검증하고 대규모 모델 구조를 시각적으로 탐색하는 모델 분석 서비스",
        stack: ["JavaScript", "React", "SVG", "Emotion", "MUI"],
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
    ],
  },
  {
    name: "데이터메이커",
    start: "2022.05",
    end: "2022.09",
    projects: [
      {
        name: "데이터 라벨링 현황 대시보드",
        stack: ["Vue 2"],
        highlights: [{ text: "통계, 관리자 권한, 검색 필터를 갖춘 대시보드 신규 페이지 개발" }],
      },
      {
        name: "라벨링 교육용 튜토리얼 사이트",
        stack: ["Vue 3", "Tailwind CSS"],
        highlights: [{ text: "튜토리얼 사이트를 개발하고 테이블·페이지네이션·Form을 공통 컴포넌트화" }],
      },
    ],
  },
  {
    name: "위피엔피",
    start: "2020.09",
    end: "2022.01",
    projects: [
      {
        name: "인쇄물 자동 견적 시스템",
        period: "2021.07 – 2021.11",
        stack: ["React", "PHP", "MySQL"],
        highlights: [{ text: "원가·제약조건 기반 자동 견적 산출 로직과 관리 페이지 구현, 쇼핑몰 상품 연동으로 실서비스 적용" }],
      },
      {
        name: "WEPNP MES",
        period: "2021.04 – 2022.01",
        stack: ["React", "PHP", "MySQL"],
        highlights: [
          {
            text: "품목·주문·생산계획 관리 기능 및 API 개발, 카페24·플레이오토 주문 동기화로 처리 자동화, 인쇄 장치 상태 수집 기반 실시간 공정 모니터링",
          },
        ],
      },
      {
        name: "Adobe CEP 플러그인",
        period: "2020.10 – 2021.03",
        stack: ["React", "PHP", "MySQL"],
        highlights: [{ text: "가격표·카탈로그 eBook 제작용 Adobe 확장 프로그램 및 관리 페이지 개발" }],
      },
    ],
  },
  {
    name: "메타빌드",
    start: "2017.02",
    end: "2018.05",
    projects: [
      {
        name: "기관 간 데이터 연계 시스템",
        summary: "식약처·공정위 정부과제",
        stack: ["Spring", "JavaScript"],
        highlights: [
          { text: "기관 간 데이터 연계 시스템의 조회·관리·통계 화면을 구현하며 복잡한 공공 데이터 구조와 권한 기반 업무 화면을 경험" },
        ],
      },
    ],
  },
];

export const skills: SkillGroup[] = [
  { title: "Frontend", items: ["TypeScript", "JavaScript", "HTML", "CSS", "React", "Next.js", "Vue.js"] },
  { title: "State & Data", items: ["TanStack Query", "Zustand", "Redux"] },
  { title: "Visualization", items: ["SVG", "dagre.js", "Nivo", "AG Grid"] },
  { title: "UI", items: ["MUI", "Emotion", "Tailwind CSS", "Radix UI", "shadcn/ui"] },
  { title: "Design System", items: ["Storybook", "Style Dictionary"] },
  {
    title: "Backend & Infra",
    items: ["FastAPI", "MongoDB", "MySQL", "Docker", "Jenkins", "AWS ECR", "AWS Secrets Manager"],
  },
  { title: "Observability", items: ["Sentry"] },
  { title: "Analytics", items: ["GA4", "GTM"] },
  { title: "Collaboration & AI", items: ["GitHub", "Claude", "Cursor AI"] },
];

export const education: Milestone[] = [
  { title: "건양대학교 융합IT학부(ICT전공) 졸업", period: "2013.02 – 2017.02" },
  { title: "한국소프트웨어기술진흥협회 ‘자바 프레임워크&안드로이드 개발자 양성 과정’ 수료", period: "2016.01 – 2016.07" },
];

export const certificates: Milestone[] = [
  { title: "SQL 개발자(SQLD)", period: "2021.06" },
  { title: "정보처리기사", period: "2016.07" },
  { title: "리눅스마스터 2급", period: "2015.12" },
];
