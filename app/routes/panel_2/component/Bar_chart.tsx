import { useLoaderData } from "@remix-run/react";
import React, { PureComponent } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type ExampleProps = {
  barChartDocData: any; // 必要に応じて具体的な型に変更する
};

export default class Example extends PureComponent<ExampleProps> {
  render() {
    const { barChartDocData }: any = this.props; // propsからデータを受け取る

    // 各キーを抽出して配列に格納
    // イテレートに barChartDocData["各キー"]でvalueを取得
    const keys = Object.keys(barChartDocData);
    const techDatas = keys.reduce((acc, key) => {
      if (key == "maxYear" || key == "maxValue") return acc;

      const period = barChartDocData[key];

      acc.push({
        tech: key,
        period: period,
      });

      return acc;
    }, [] as { tech: string; period: number }[]);

    // const monthTickFormatter = (tick: string | number | Date) => {
    //   const date = new Date(tick);

    //   return `${date.getMonth() + 1}`; // 数値を文字列に変換して返す
    // };

    // const renderQuarterTick = (tickProps: { x: any; y: any; payload: any }) => {
    //   const { x, y, payload } = tickProps;
    //   const { value, offset } = payload;
    //   const date = new Date(value);
    //   const month = date.getMonth();
    //   const quarterNo = Math.floor(month / 3) + 1;
    //   const isMidMonth = month % 3 === 1;

    //   if (month % 3 === 1) {
    //     return (
    //       <text x={x} y={y - 4} textAnchor="middle">{`Q${quarterNo}`}</text>
    //     );
    //   }

    //   const isLast = month === 11;

    //   if (month % 3 === 0 || isLast) {
    //     const pathX = Math.floor(isLast ? x + offset : x - offset) + 0.5;

    //     return <path d={`M${pathX},${y - 4}v${-35}`} stroke="red" />;
    //   }

    //   return <></>; // 空の要素を返す
    // };

    return (
      <ResponsiveContainer
        width="100%"
        height="100%"
        style={{
          backgroundColor: "#ffffff",
        }}
      >
        <BarChart
          layout="vertical"
          data={techDatas}
          margin={{
            left: 90,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            domain={[0, barChartDocData.maxValue]} // 最小値と最大値を設定
            ticks={[0, barChartDocData.maxValue / 2, barChartDocData.maxValue]} // 明示的に表示したい値を指定
            tick={(props) => {
              const { x, y, payload } = props; // 各メモリラベルの位置情報を取得
              const value = payload.value; // メモリの値

              return (
                <text
                  x={x} // X座標
                  y={y + 10} // Y座標を調整（10px 下げる）
                  fontSize={13} // フォントサイズ
                  fill="gray" // 必要に応じて色を変更
                  textAnchor="middle" // 中央揃え
                >
                  {value === barChartDocData.maxValue / 2
                    ? ""
                    : value === barChartDocData.maxValue
                    ? `${barChartDocData.maxYear} yr`
                    : value}
                  {/* ラベルの条件 */}
                </text>
              );
            }}
            type="number"
          />
          <YAxis
            interval={0} // すべてのメモリを表示
            type="category"
            dataKey="tech"
            tickLine={false}
            tick={(props) => {
              const { x, y, payload } = props; // 各メモリラベルの位置情報と値を取得
              return (
                <>
                  {/* Y軸のラベル */}
                  <text
                    x={x} // メモリのデフォルト位置
                    y={y + 5} // オフセット調整 (+5で中央揃え)
                    fontSize={15}
                    fill="#808080"
                    textAnchor="end"
                  >
                    {payload.value} {/* デフォルトのラベル */}
                  </text>
                  {/* 左側に追加するカスタム文字 */}
                  <text
                    x={x - 50} // 左側にオフセット
                    y={y + 5} // 同様に中央揃え
                    fill="red"
                    textAnchor="end"
                  >
                    {/* {"Custom"}  */}
                    {/* 描きたい文字 */}
                  </text>
                </>
              );
            }}
          />
          <Tooltip />
          {/* <Legend /> */}
          <Bar
            dataKey="period"
            stroke="#82ca9d"
            fill="#82ca9d"
            fillOpacity={0.4}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}
