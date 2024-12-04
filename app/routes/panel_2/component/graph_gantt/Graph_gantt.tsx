import { useEffect, useRef, useState } from "react";
import { Tooltip } from "@mui/material";
import "./graph_gantt.css";
import { tv } from "tailwind-variants";

type InputData = {
  projectId: number;
  projectStartYear: number;
  projectStartMonth: number;
  projectStartMonthPeriod: number;
  projectEndYear: number;
  projectEndMonth: number;
  projectEndMonthPeriod: number;
  targetStartRow: number;
  projectTitle: string;
  projectSubtitle: string;
  projectDescription: string;
  techStacks: string[];
};

// Tailwind Variants を使ったスタイル設定
const borderColorStyles = tv({
  base: "relative top-[-1.25px] left-[-1px] h-[100.5%] w-[100.25%] shadow-md hover:bg-white hover:opacity-75 transition-all duration-300 border border-s-[6px]",
  variants: {
    number: {
      1: "border-[#9FDB85]",
      2: "border-[#9BB6FF]",
      3: "border-[#FFCE9B]",
      4: "border-[#CE9BFF]",
      5: "border-[#FFBBA8]",
      6: "border-[#FFA8D9]",
      7: "border-[#9BCEEE]",
      8: "border-[#E0CB99]",
    },
  },
  defaultVariants: {
    number: 1,
  },
});

const bgColorStyles = tv({
  base: "absolute h-full w-full opacity-30",
  variants: {
    number: {
      1: "bg-[#9FDB85]",
      2: "bg-[#9BB6FF]",
      3: "bg-[#FFCE9B]",
      4: "bg-[#CE9BFF]",
      5: "bg-[#FFBBA8]",
      6: "bg-[#FFA8D9]",
      7: "bg-[#9BCEEE]",
      8: "bg-[#E0CB99]",
    },
  },
  defaultVariants: {
    number: 1,
  },
});

export default function GraphGantt() {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // チャート初期値
  const systemStartYear = 2023;
  const startMonth = 11;
  const headerChunkNumber = 5;
  const rowCellsNumber = 7;
  const colCellsNumber = getInitColCellsNumber();
  const headerCellsNumber = colCellsNumber / headerChunkNumber;
  const [totalCellsNumber, setTotalCellsNumber] = useState(
    rowCellsNumber * colCellsNumber,
  );

  // 入力値（テスト）
  const projectStartYear = 2024;
  const projectStartMonth = 1;
  const projectStartMonthPeriod = 1;
  const projectEndYear = 2024;
  const projectEndMonth = 2;
  const projectEndMonthPeriod = 1;
  const targetStartRow = 3;
  const projectTitle = "ChatBus";
  const projectSubtitle = "Random Chat App";
  const projectDescription =
    "強力なプロジェクトの説明はとなくビジョ助けるために専門家のヒントなプロジェクトの説明はとなくビジョ助けるために専門家のヒントなプロジェクトの説明はとなくビジョ助けるために専門家のヒントとサンプル プロジェクトの説明をまとめました。";

  let inputDatas: InputData[] = [
    {
      projectId: 1,
      projectStartYear: projectStartYear,
      projectStartMonth: projectStartMonth,
      projectStartMonthPeriod: projectStartMonthPeriod,
      projectEndYear: projectEndYear,
      projectEndMonth: projectEndMonth,
      projectEndMonthPeriod: projectEndMonthPeriod,
      targetStartRow: targetStartRow,
      projectTitle: projectTitle,
      projectSubtitle: projectSubtitle,
      projectDescription: projectDescription,
      techStacks: ["Firebase", "Flutter", "React", "Remix", "Three.js"],
    },
    {
      projectId: 2,
      projectStartYear: projectStartYear,
      projectStartMonth: projectStartMonth + 2,
      projectStartMonthPeriod: projectStartMonthPeriod,
      projectEndYear: projectEndYear,
      projectEndMonth: projectEndMonth + 2,
      projectEndMonthPeriod: projectEndMonthPeriod,
      targetStartRow: targetStartRow + 1,
      projectTitle: projectTitle,
      projectSubtitle: projectSubtitle,
      projectDescription: projectDescription,
      techStacks: ["Firebase", "Flutter", "React", "Remix", "Three.js"],
    },
  ];

  /// 初期化処理
  useEffect(() => {
    // // スクロール位置の初期配置を指定
    // if (scrollRef.current) {
    //   scrollRef.current.scrollLeft =
    //     scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
    // }

    // totalCellsNumbers から占有領域分のセル数を除算
    const colExtraCellsNumberAccum: number = inputDatas.reduce(
      (accum, currentValue, index, array) => {
        const colStartCell = convertFromInputValueToMapValue(
          array[index],
        ).colStartCell;

        const colEndCell = convertFromInputValueToMapValue(
          array[index],
        ).colEndCell;

        const colExtraCellsNumber = colEndCell - colStartCell;
        return accum + colExtraCellsNumber;
      },
      0,
    );

    setTotalCellsNumber(totalCellsNumber - colExtraCellsNumberAccum);
  }, []);

  /// 全てのグリットの要素を埋める関数
  /// HeaderとBodyの全てのCellを含む
  const CellsFormatter = () => {
    let cells = [];

    for (let i = 0; i < totalCellsNumber; ++i) {
      // Header Cell
      if (i < colCellsNumber / headerChunkNumber) {
        const headerCell = {
          className:
            "flex flex-row justify-center items-center h-[25px] w-[225px] bg-gray-200 border-r border-b border-[#C5C5C5]",
          style: {
            gridColumn: `${i * headerChunkNumber + 1}/${
              i * headerChunkNumber + 6
            }`,
          },
        };
        cells.push(headerCell);

        // Normal Cell
      } else if (i < totalCellsNumber - headerCellsNumber * 4) {
        const normalCell = {
          className:
            "h-[45px] w-[45px] border-r border-b border-dashed border-[#CACACA]",
          style: {},
        };

        // Add Cell
        cells.push(normalCell);
      }
    }

    return cells;
  };

  /// DBから取得したデータを
  /// gridColumsでマッピングするために変換
  const convertFromInputValueToMapValue = (inputData: InputData) => {
    let colStartCell;
    let colEndCell;

    if (inputData.projectStartYear < 2024) {
      colStartCell =
        (inputData.projectStartMonth - 11) * 5 +
        inputData.projectStartMonthPeriod;
      colEndCell =
        (inputData.projectEndMonth - 11) * 5 + inputData.projectEndMonthPeriod;
    } else {
      colStartCell =
        10 +
        (inputData.projectStartYear - 2024) * 5 +
        (inputData.projectStartMonth - 1) * 5 +
        inputData.projectStartMonthPeriod;
      colEndCell =
        10 +
        (inputData.projectEndYear - 2024) * 5 +
        (inputData.projectEndMonth - 1) * 5 +
        inputData.projectEndMonthPeriod;
    }

    return { colStartCell: colStartCell, colEndCell: colEndCell };
  };

  // 現在の日付からcolCellsNumber（横列の総セル数）を算出
  function getInitColCellsNumber() {
    const thisYear = new Date().getFullYear();
    const thisMonth = new Date().getMonth();
    // +10： 2023年は11-12月しかない
    // 年数分のセル：現在年から2023を引いて x 60して加える
    // 月数分のセル：月は x 5して加える
    const colCellsNumber = 10 + (thisYear - 2023) * 60 + thisMonth * 5;
    return colCellsNumber;
  }

  return (
    <>
      {/* 全体枠 */}
      <div
        ref={scrollRef}
        className="h-auto w-auto bg-white border border-[#C5C5C5] overflow-x-auto overflow-y-auto"
        style={{
          display: "grid",
          gridTemplateRows: `25px repeat(${rowCellsNumber - 1}, 45px)`,
          gridTemplateColumns: `repeat(${colCellsNumber}, 45px)`,
        }}
      >
        {/* Header Content */}
        {CellsFormatter().map((cell, index) => (
          <div className={cell.className} style={cell.style}>
            {index < headerCellsNumber && (
              <div>{`${
                index == 0 || index == 1
                  ? systemStartYear
                  : systemStartYear + 1 + Math.floor((index - 2) / 12)
              } 年 ${
                (startMonth + index) % 12 == 0 ? 12 : (startMonth + index) % 12
              } 月`}</div>
            )}
          </div>
        ))}

        {/* Cells Content */}
        {inputDatas.map((inputData) => {
          return (
            <Tooltip
              title={
                <>
                  <div className="font-bold">Overview :</div>
                  <div>{inputData.projectDescription}</div>
                  <br />
                  <div className="font-bold">Tech Stack :</div>
                  {inputData.techStacks.map((teckStack, index) => (
                    <span>
                      {teckStack}
                      {index == inputData.techStacks.length - 1 ? "" : ", "}
                    </span>
                  ))}
                </>
              }
              followCursor
              placement="bottom-start"
              slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [10, 15], // ピクセル単位で位置を調整
                      },
                    },
                  ],
                },
                tooltip: {
                  style: {
                    height: "auto",
                    width: "225px",
                    padding: "10px",
                    color: "black", // テキスト色
                    backgroundColor: "white", // 背景色
                    border: "2px solid #cccccc",
                  },
                },
              }}
            >
              <div
                // セルの親コンポーネント
                className={`${borderColorStyles({
                  number:
                    inputData.projectId % 8 == 0
                      ? 8
                      : ((inputData.projectId % 8) as
                          | 1
                          | 2
                          | 3
                          | 4
                          | 5
                          | 6
                          | 7
                          | 8),
                })}`}
                style={{
                  gridColumnStart:
                    convertFromInputValueToMapValue(inputData).colStartCell,
                  gridColumnEnd:
                    convertFromInputValueToMapValue(inputData).colEndCell,
                  gridRowStart: inputData.targetStartRow,
                  gridRowEnd: inputData.targetStartRow + 1,
                }}
              >
                {/* 背景色用 */}
                <div
                  className={`${bgColorStyles({
                    number:
                      inputData.projectId % 8 == 0
                        ? 8
                        : ((inputData.projectId % 8) as
                            | 1
                            | 2
                            | 3
                            | 4
                            | 5
                            | 6
                            | 7
                            | 8),
                  })}`}
                ></div>

                {/* テキスト用 */}
                <div className="absolute top-0 left-1 text-gray-600 font-[425] ml-2 text-lg">
                  {inputData.projectTitle}
                </div>

                <div className="absolute top-[60%] left-1 text-gray-600 ml-2 mt-[-3px] text-[13.5px]">
                  {inputData.projectSubtitle}
                </div>
              </div>
            </Tooltip>
          );
        })}
      </div>
    </>
  );
}
