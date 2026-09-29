// 사이트에 보이는 이력 내용은 모두 이 파일에서 관리한다.
// TODO: Notion 이력서 내용으로 교체 (현재는 자리표시용 문구)

export type Link = { label: string; href: string };

export type Experience = {
  company: string;
  team?: string;
  role: string;
  /** YYYY.MM 형식. 재직 중이면 end 생략 */
  start: string;
  end?: string;
  summary: string;
  highlights: string[];
  stack: string[];
};

export type Project = {
  name: string;
  period: string;
  summary: string;
  highlights: string[];
  stack: string[];
  links?: Link[];
};

export type SkillGroup = { title: string; items: string[] };

export type Milestone = { title: string; detail?: string; period: string };

export const profile = {
  name: "Yumin Choi",
  nameKo: "최유민",
  role: "프론트엔드 개발자",
  headline: "사용자가 망설이지 않는 화면을 만듭니다",
  intro: [
    "생성형 AI 제품의 화면을 React, Next.js, TypeScript로 만들고 있습니다.",
    "복잡한 기능을 단순한 흐름으로 풀어내는 일, 그리고 그 과정에서 왜 그렇게 결정했는지 기록하는 일을 좋아합니다.",
  ],
  links: [
    { label: "GitHub", href: "https://github.com/yumin2323" },
    // { label: "Email", href: "mailto:you@example.com" },
    // { label: "Blog", href: "https://..." },
  ] satisfies Link[],
};

export const experiences: Experience[] = [
  {
    company: "회사 이름",
    team: "팀 이름",
    role: "프론트엔드 개발자",
    start: "2024.01",
    summary: "회사와 맡은 제품을 한두 문장으로 소개합니다.",
    highlights: [
      "맡았던 일과 그 결과를 한 줄로 적습니다. 가능하면 수치로 드러냅니다.",
      "어떤 문제를 발견했고 어떻게 풀었는지 적습니다.",
      "협업 방식이나 팀에 기여한 점을 적습니다.",
    ],
    stack: ["React", "Next.js", "TypeScript"],
  },
  {
    company: "이전 회사 이름",
    role: "프론트엔드 개발자",
    start: "2022.03",
    end: "2023.12",
    summary: "회사와 맡은 제품을 한두 문장으로 소개합니다.",
    highlights: ["맡았던 일과 그 결과를 한 줄로 적습니다.", "어떤 문제를 발견했고 어떻게 풀었는지 적습니다."],
    stack: ["React", "TypeScript"],
  },
];

export const projects: Project[] = [
  {
    name: "yumin-devlog",
    period: "2026",
    summary: "일하면서 부딪힌 문제와 결정의 이유를 기록하는 개인 개발 블로그",
    highlights: [
      "MDX로 글을 쓰고 Next.js로 모든 글을 정적 생성",
      "글 안에서 직접 조작해 볼 수 있는 인터랙티브 데모 컴포넌트",
      "레이어로 펼쳐지는 3D 명함 히어로와 라이트/다크 테마",
    ],
    stack: ["Next.js", "MDX", "Tailwind CSS"],
    links: [{ label: "GitHub", href: "https://github.com/yumin2323/yumin-devlog" }],
  },
  {
    name: "프로젝트 이름",
    period: "2025",
    summary: "프로젝트를 한 줄로 소개합니다.",
    highlights: ["핵심 기능이나 기여한 부분을 적습니다.", "배운 점이나 성과를 적습니다."],
    stack: ["React", "TypeScript"],
  },
];

export const skills: SkillGroup[] = [
  { title: "Language", items: ["TypeScript", "JavaScript", "HTML", "CSS"] },
  { title: "Framework", items: ["React", "Next.js"] },
  { title: "Styling", items: ["Tailwind CSS", "CSS Modules"] },
  { title: "Tools", items: ["Git", "Figma"] },
];

export const education: Milestone[] = [{ title: "학교 이름", detail: "전공", period: "2016.03 – 2022.02" }];

export const activities: Milestone[] = [{ title: "활동 · 수상 · 자격증", detail: "간단한 설명", period: "2023" }];
