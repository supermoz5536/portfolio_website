import { json, type MetaFunction } from "@remix-run/node";
import Scene1 from "./scene_2/_index";
import Scene3 from "./scene_3/_index";
import Panel1 from "./panel_1/_index";
import Panel2 from "./panel_2/_index";
import { fetchVideoDownloadURL } from "~/model/firestorage/firestorage_server_model";
import {
  setGanttForDev,
  fetchGanttDocDatas,
  fetchBarChartDocData,
  setBarChartDocDataForDev,
} from "~/model/firestore/firestore_server_model";
import Scene1Test from "./scene_1_asap/_index";
import Scene2 from "./scene_2/_index";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async () => {
  // Gantt Chart
  // await setGanttForDev();
  const ganttDocDatas = await fetchGanttDocDatas();

  // Bar Chart
  // await setBarChartDocDataForDev();
  const barChartDocData = await fetchBarChartDocData();

  const response = await fetchVideoDownloadURL();
  const data = await response.json();

  return new Response(
    JSON.stringify({
      downloadUrlArray: data.downloadUrlArray,
      ganttDocDatas: ganttDocDatas,
      barChartDocData: barChartDocData,
    }),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    },
  );
};

export default function Index() {
  return (
    <div className="relative flex flex-col items-center justify-start">
      {/* <Scene1Test />
      <Panel1 /> */}
      <Scene2 />
      {/* <Panel2 /> */}
      {/* <Scene3 /> */}
    </div>
  );
}
