import { useLoaderData } from "@remix-run/react";
import React from "react";
import Example from "./Bar_chart"; // クラスコンポーネントをインポート

export const BarChartWrapper = () => {
  const { barChartDocData }: any = useLoaderData(); // データを取得

  return (
    <Example barChartDocData={barChartDocData} /> // 取得したデータをpropsとして渡す
  );
};
