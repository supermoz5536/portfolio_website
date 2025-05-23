import {
  LoaderFunction,
  ActionFunction,
  json,
  type MetaFunction,
} from "@remix-run/node";
import Panel1 from "./panel_1/_index";
import Panel2 from "./panel_2/_index";
import { fetchVideoDownloadURL } from "~/model/firestorage/firestorage_server_model";
import {
  fetchGanttDocDatas,
  fetchBarChartDocData,
  setGanttForDev,
  setBarChartDocDataForDev,
} from "~/model/firestore/firestore_server_model";
import Scene3 from "./scene_3/_index";
import Scene2 from "./scene_2/_index";
import Scene1 from "./scene_1/_index";

import { sendContactForm } from "~/service/sendEmail.server";

export const meta: MetaFunction = () => {
  return [{ title: "A Portfolio Website" }];
};

export const loader: LoaderFunction = async () => {
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
    <>
      <Scene1 />
      <Panel1 />
      <Scene2 />
      <Panel2 />
      <Scene3 />
    </>
  );
}

export const action: ActionFunction = async ({ request }: any) => {
  await sendContactForm(request);

  return new Response(JSON.stringify({ result: "OK" }), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
