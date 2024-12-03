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

const data = [
  {
    skill: "React.js",
    pv: 3750,
  },
  {
    skill: "Remix",
    pv: 1250,
  },
  {
    skill: "Flutter",
    pv: 3750,
  },
  {
    skill: "Firebase",
    pv: 5833,
    amt: 2181,
  },
  {
    skill: "Electron",
    pv: 1666,
  },
  {
    skill: "Blender",
    pv: 833,
  },
  {
    skill: "3D Creative Coding",
    pv: 1250,
  },
  {
    skill: "2D Creative Coding",
    pv: 833,
  },
  {
    skill: "TypeScript",
    pv: 3333,
  },
  {
    skill: "HTML/CSS",
    pv: 3333,
  },
  {
    skill: "Git/Github",
    pv: 5833,
  },
];

const monthTickFormatter = (tick: string | number | Date) => {
  const date = new Date(tick);

  return `${date.getMonth() + 1}`; // 数値を文字列に変換して返す
};

const renderQuarterTick = (tickProps: { x: any; y: any; payload: any }) => {
  const { x, y, payload } = tickProps;
  const { value, offset } = payload;
  const date = new Date(value);
  const month = date.getMonth();
  const quarterNo = Math.floor(month / 3) + 1;
  const isMidMonth = month % 3 === 1;

  if (month % 3 === 1) {
    return <text x={x} y={y - 4} textAnchor="middle">{`Q${quarterNo}`}</text>;
  }

  const isLast = month === 11;

  if (month % 3 === 0 || isLast) {
    const pathX = Math.floor(isLast ? x + offset : x - offset) + 0.5;

    return <path d={`M${pathX},${y - 4}v${-35}`} stroke="red" />;
  }
  return <></>; // 空の要素を返す
};
export default class Example extends PureComponent {
  render() {
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
          data={data}
          margin={{
            left: 90,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            domain={[0, 10000]} // 最小値と最大値を設定
            type="number"
            tickCount={3}
            tickFormatter={(value, index) => {
              const inputData = index == 0 ? "" : `~${index}年`;
              return inputData;
            }}
          />
          <YAxis
            interval={0} // すべてのメモリを表示
            type="category"
            dataKey="skill"
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
          <Bar dataKey="pv" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.4} />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}
