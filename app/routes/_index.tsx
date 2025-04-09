import { ActionFunction, json, type MetaFunction } from "@remix-run/node";
import Panel1 from "./panel_1/_index";
import Panel2 from "./panel_2/_index";
import { fetchVideoDownloadURL } from "~/model/firestorage/firestorage_server_model";
import {
  fetchGanttDocDatas,
  fetchBarChartDocData,
} from "~/model/firestore/firestore_server_model";
import Scene3 from "./scene_3/_index";
import Scene2 from "./scene_2/_index";
import Scene1 from "./scene_1/_index";
import { Config } from "~/config";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

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
    <>
      {/* <Scene1 />
      <Panel1 />
      <Scene2 />
      <Panel2 /> */}
      <Scene3 />
    </>
  );
}

export const action: ActionFunction = async ({ request }: any) => {
  let formData = await request.formData();
  let to_mail = formData.get("email")?.toString(); // フォームフィールド名に合わせる

  const transportOptions = {
    host: Config.SMTP_HOST,
    port: Config.SMTP_PORT,
    secure: Config.SMTP_SECURE,
    auth: {
      user: Config.SMTP_AUTH_USER,
      pass: Config.SMTP_AUTH_PASS,
    },
  } as unknown as import("nodemailer/lib/smtp-transport").Options; // .defaultを削除  //                                         ↑ この部分はダブルキャスト

  let transporter = nodemailer.createTransport(transportOptions);

  let info = await transporter.sendMail({
    from: to_mail,
    to: Config.SEND_MAIL_ADDRESS,
    subject: "title_1",
    text: "text_sample",
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  return json({ result: "OK" });
};
