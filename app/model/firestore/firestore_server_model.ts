import { initializedAdmin } from "../../firebase/setup_server";

const adminDb = initializedAdmin.firestore();

// Barチャートの更新用関数
// デプロイする場合は必ずオフにする
export const fetchBarChartDocData = async () => {
  const barChatRef = adminDb.collection("chart").doc("bar");
  const docSnapshot = await barChatRef.get();
  const data = docSnapshot.data();
  return data;
};

export const setBarChartDocDataForDev = async () => {
  const barChatRef = adminDb.collection("chart").doc("bar");
  await barChatRef.set({
    React: 8,
    Remix: 3,
    Firebase: 15,
    Electron: 4,
    Flutter: 8,
    TypeScript: 7,
    HTML_CSS: 7,
    Git_GitHub: 14,
    Creative_2D: 3,
    Creative_3D: 3,
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
      "強力なプロジェクトの説明はとなくビジョ助けるために専門家のヒントなプロジェクトの説明はとなくビジョ助けるために専門家のヒントなプロジェクトの説明はとなくビジョ助けるために専門家のヒントとサンプル プロジェクトの説明をまとめました。",
    tech_stacks: ["Firebase", "Flutter", "React", "Remix", "Three.js"],
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
      "強力なプロジェクトの説明はとなくビジョ助けるために専門家のヒントなプロジェクトの説明はとなくビジョ助けるために専門家のヒントなプロジェクトの説明はとなくビジョ助けるために専門家のヒントとサンプル プロジェクトの説明をまとめました。",
    tech_stacks: ["Firebase", "Flutter", "React", "Remix", "Three.js"],
  });

  await projRef.doc("project_3").set({
    id: 3,
    start_year: 2024,
    start_month: 4,
    start_monthPeriod: 5,
    end_year: 2024,
    end_month: 5,
    end_monthPeriod: 4,
    target_start_row: 6,
    title: "Scraping Tool",
    subtitle: "For TraceSpeaker",
    description:
      "強力なプロジェクトの説明はとなくビジョ助けるために専門家のヒントなプロジェクトの説明はとなくビジョ助けるために専門家のヒントなプロジェクトの説明はとなくビジョ助けるために専門家のヒントとサンプル プロジェクトの説明をまとめました。",
    tech_stacks: ["Firebase", "Flutter", "React", "Remix", "Three.js"],
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
      "強力なプロジェクトの説明はとなくビジョ助けるために専門家のヒントなプロジェクトの説明はとなくビジョ助けるために専門家のヒントなプロジェクトの説明はとなくビジョ助けるために専門家のヒントとサンプル プロジェクトの説明をまとめました。",
    tech_stacks: ["Firebase", "Flutter", "React", "Remix", "Three.js"],
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
    subtitle: "Training AI Systems and LLMs in English writing",
    description:
      "強力なプロジェクトの説明はとなくビジョ助けるために専門家のヒントなプロジェクトの説明はとなくビジョ助けるために専門家のヒントなプロジェクトの説明はとなくビジョ助けるために専門家のヒントとサンプル プロジェクトの説明をまとめました。",
    tech_stacks: ["Firebase", "Flutter", "React", "Remix", "Three.js"],
  });

  await projRef.doc("project_6").set({
    id: 6,
    start_year: 2024,
    start_month: 10,
    start_monthPeriod: 1,
    end_year: 2024,
    end_month: 11,
    end_monthPeriod: 1,
    target_start_row: 5,
    title: "Outsourced Business",
    subtitle: "For Mobile Development",
    description:
      "強力なプロジェクトの説明はとなくビジョ助けるために専門家のヒントなプロジェクトの説明はとなくビジョ助けるために専門家のヒントなプロジェクトの説明はとなくビジョ助けるために専門家のヒントとサンプル プロジェクトの説明をまとめました。",
    tech_stacks: ["Firebase", "Flutter", "React", "Remix", "Three.js"],
  });

  await projRef.doc("project_7").set({
    id: 7,
    start_year: 2024,
    start_month: 11,
    start_monthPeriod: 1,
    end_year: 2024,
    end_month: 12,
    end_monthPeriod: 3,
    target_start_row: 3,
    title: "Developing This Website",
    subtitle: "Designed to Showcase Portfolios",
    description:
      "強力なプロジェクトの説明はとなくビジョ助けるために専門家のヒントなプロジェクトの説明はとなくビジョ助けるために専門家のヒントなプロジェクトの説明はとなくビジョ助けるために専門家のヒントとサンプル プロジェクトの説明をまとめました。",
    tech_stacks: ["Firebase", "Flutter", "React", "Remix", "Three.js"],
  });
};
