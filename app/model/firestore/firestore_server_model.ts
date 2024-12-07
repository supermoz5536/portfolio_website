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
    Cording_2D: 3,
    Cording_3D: 3,
    max: 2,
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
    target_start_row: 4,
    title: "TraceSpeaker",
    subtitle: "YouTube Simultaneous Interpretation",
    description:
      "強力なプロジェクトの説明はとなくビジョ助けるために専門家のヒントなプロジェクトの説明はとなくビジョ助けるために専門家のヒントなプロジェクトの説明はとなくビジョ助けるために専門家のヒントとサンプル プロジェクトの説明をまとめました。",
    tech_stacks: ["Firebase", "Flutter", "React", "Remix", "Three.js"],
  });

  await projRef.doc("project_3").set({
    id: 3,
    start_year: 2024,
    start_month: 5,
    start_monthPeriod: 1,
    end_year: 2024,
    end_month: 6,
    end_monthPeriod: 1,
    target_start_row: 5,
    title: "ChatBus2",
    subtitle: "Random Chat App",
    description:
      "強力なプロジェクトの説明はとなくビジョ助けるために専門家のヒントなプロジェクトの説明はとなくビジョ助けるために専門家のヒントなプロジェクトの説明はとなくビジョ助けるために専門家のヒントとサンプル プロジェクトの説明をまとめました。",
    tech_stacks: ["Firebase", "Flutter", "React", "Remix", "Three.js"],
  });
};
