import { json, type MetaFunction } from "@remix-run/node";
import Scene1 from "./scene_1/_index";
import Scene2 from "./scene_2/_index";
import Scene3 from "./scene_3/_index";
import Panel1 from "./panel_1/_index";
import Panel2 from "./panel_2/_index";
import { fetchVideoDownloadURL } from "~/model/firestorage/firestorage_server_model";
import {
  setGanttForDev,
  getGanttDocDatas,
  getBarChatDocData,
} from "~/model/firestore/firestore_server_model";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async () => {
  // Gantt Chart
  await setGanttForDev();
  const ganttDocDatas = await getGanttDocDatas();

  // Bar Chart
  const barChartDocData = await getBarChatDocData();

  const response = await fetchVideoDownloadURL();
  const data = await response.json();
  return Response.json({
    downloadUrlArray: data.downloadUrlArray,
    ganttDocDatas: ganttDocDatas,
    barChartDocData: barChartDocData,
  });
};

export default function Index() {
  return (
    <div className="flex flex-col items-center justify-start">
      <Scene1 />
      <Panel1 />
      <Scene2 />
      <Panel2 />
      <Scene3 />
    </div>
  );
}
