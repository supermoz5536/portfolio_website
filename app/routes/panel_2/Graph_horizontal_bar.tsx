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
    skill: "Flutter",
    pv: 2400,
  },
  {
    date: "2000-02",
    pv: 1398,
  },
  {
    date: "2000-03",
    pv: 9800,
  },
  {
    date: "2000-04",

    pv: 3908,
  },
  {
    date: "2000-05",
    pv: 4800,
  },
  {
    date: "2000-06",
    pv: 3800,
  },
  {
    date: "2000-07",
    pv: 4300,
  },
  {
    date: "2000-08",

    pv: 2400,
  },
  {
    date: "2000-09",
    pv: 1398,
    amt: 2210,
  },
  {
    date: "2000-10",
    pv: 9800,
  },
  {
    date: "2000-11",
    pv: 3908,
  },
  {
    date: "2000-13",
    pv: 9800,
    amt: 2181,
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
  static demoUrl =
    "https://codesandbox.io/p/sandbox/bar-chart-with-double-xaxis-zly7wl";

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
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis
            interval={0} // すべてのメモリを表示
            type="category"
            dataKey="skill"
            tick={(props) => {
              const { x, y, payload } = props; // 各メモリラベルの位置情報と値を取得
              return (
                <>
                  {/* Y軸のラベル */}
                  <text
                    x={x} // メモリのデフォルト位置
                    y={y + 5} // オフセット調整 (+5で中央揃え)
                    fill="black"
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
                    {"Custom"} {/* 描きたい文字 */}
                  </text>
                </>
              );
            }}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="pv" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}
