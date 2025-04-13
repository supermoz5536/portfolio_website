import { initializedAdmin } from "../../firebase/setup_server";

const adminDb = initializedAdmin.firestore();

export const fetchBarChartDocData = async () => {
  const barChatRef = adminDb.collection("chart").doc("bar");
  const docSnapshot = await barChatRef.get();
  const data = docSnapshot.data();
  return data;
};

// Barチャートの更新用関数
// デプロイする場合は必ずオフにする
export const setBarChartDocDataForDev = async () => {
  const barChatRef = adminDb.collection("chart").doc("bar");
  await barChatRef.set({
    React: 10,
    Remix: 4,
    Firebase: 16,
    Electron: 4,
    Flutter: 8,
    TypeScript: 10,
    HTML_CSS: 9,
    Git_GitHub: 14,
    Creative_2D: 3,
    Creative_3D: 6,
    maxYear: 2,
    maxValue: 24,
  });
};

// ============================================================

export const fetchGanttDocDatas = async () => {
  const projectCollectionRef = adminDb
    .collection("chart")
    .doc("gantt")
    .collection("project");

  const docsSnapshot = await projectCollectionRef.get();
  const docDatas = docsSnapshot.docs.map((doc: any) => doc.data());

  return docDatas;
};

// Ganttチャートのプロジェクトの操作用関数
// デプロイする場合は必ずオフにする
export const setGanttForDev = async () => {
  const projRef = adminDb
    .collection("chart")
    .doc("gantt")
    .collection("project");

  await projRef.doc("project_1").set({
    id: 1,
    start_year: 2023,
    start_month: 11,
    start_monthPeriod: 4,
    end_year: 2024,
    end_month: 4,
    end_monthPeriod: 1,
    target_start_row: 3,
    title: "ChatBus",
    subtitle: "Exchange Learning with Random Chat",
    description:
      "ChatBus is for exchanging languages with people all over the world, easily and anonymously.",
    tech_stacks: ["Firebase", "Flutter Web", "Stripe API", "DeepL API"],
  });

  await projRef.doc("project_2").set({
    id: 2,
    start_year: 2024,
    start_month: 4,
    start_monthPeriod: 1,
    end_year: 2024,
    end_month: 6,
    end_monthPeriod: 1,
    target_start_row: 5,
    title: "TraceSpeaker",
    subtitle: "YouTube Simultaneous Interpretation",
    description:
      "TraceSpeaker is an English listening app that utilizes YouTube videos. It's perfect for those who are tired of traditional English learning",
    tech_stacks: ["Firebase", "Flutter Web"],
  });

  await projRef.doc("project_3").set({
    id: 3,
    start_year: 2024,
    start_month: 4,
    start_monthPeriod: 5,
    end_year: 2024,
    end_month: 5,
    end_monthPeriod: 4,
    target_start_row: 7,
    title: "Scraping Tool",
    subtitle: "For TraceSpeaker",
    description:
      "A support tool for TraceSpeaker to retrieve YouTube video URLs.",
    tech_stacks: ["Python"],
  });

  await projRef.doc("project_4").set({
    id: 4,
    start_year: 2024,
    start_month: 6,
    start_monthPeriod: 1,
    end_year: 2024,
    end_month: 10,
    end_monthPeriod: 1,
    target_start_row: 3,
    title: "Inventory Z",
    subtitle: "Scraping Amazon to Collect Inventory Data",
    description:
      "A desktop application specialized in inventory research for Amazon import businesses.",
    tech_stacks: ["Firebase", "Electron", "React", "Stripe API"],
  });

  await projRef.doc("project_5").set({
    id: 5,
    start_year: 2024,
    start_month: 8,
    start_monthPeriod: 1,
    end_year: 2024,
    end_month: 11,
    end_monthPeriod: 1,
    target_start_row: 7,
    title: "Outlier in Remote Work",
    subtitle: "Training LLMs in English writing",
    description:
      "A job including the training of LLMs in Japanese by providing English writing input.",
    tech_stacks: ["English"],
  });

  await projRef.doc("project_6").set({
    id: 6,
    start_year: 2024,
    start_month: 10,
    start_monthPeriod: 1,
    end_year: 2024,
    end_month: 11,
    end_monthPeriod: 2,
    target_start_row: 5,
    title: "Outsourced Business",
    subtitle: "For Mobile Development",
    description:
      "Contracted development of an iOS app using a location-sharing service, like Zenly.",
    tech_stacks: ["Firebase", "Flutter"],
  });

  await projRef.doc("project_7").set({
    id: 7,
    start_year: 2024,
    start_month: 11,
    start_monthPeriod: 1,
    end_year: 2025,
    end_month: 2,
    end_monthPeriod: 2,
    target_start_row: 3,
    title: "Who?",
    subtitle: "WebGL 3D Content Developed by Three.js",
    description:
      "A project useing the metaphor of ascending floors to represent the evolution of the spiritual world.",
    tech_stacks: ["Remix", "WebGL", "GLSL", "Three.js"],
  });

  await projRef.doc("project_8").set({
    id: 8,
    start_year: 2025,
    start_month: 2,
    start_monthPeriod: 1,
    end_year: 2025,
    end_month: 4,
    end_monthPeriod: 4,
    target_start_row: 5,
    title: "A Portfolio Website",
    subtitle: "A playful showcase of creative works.",
    description:
      "This website was developed with a focus on integrating WebGL with readable UI/UX. I worked on this project while heavily referencing the website 'Sougen' by Utsubo.",
    tech_stacks: ["Remix", "WebGL", "GLSL", "Three.js"],
  });
};
