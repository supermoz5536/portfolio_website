import { useEffect, useRef, useState } from "react";
import "./graph_gantt.css";
type InputData = {
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
};

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
    "強力なプロジェクトの説明は、利害関係者にロードマップを提供し、詳細に行き詰まることなくビジョンを伝えます。私たちは、あなたが始めるのを助けるために専門家のヒントとサンプル プロジェクトの説明をまとめました。";

  let inputDatas = [
    {
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
    },
    {
      projectStartYear: projectStartYear,
      projectStartMonth: projectStartMonth,
      projectStartMonthPeriod: projectStartMonthPeriod,
      projectEndYear: projectEndYear,
      projectEndMonth: projectEndMonth,
      projectEndMonthPeriod: projectEndMonthPeriod,
      targetStartRow: targetStartRow + 2,
      projectTitle: projectTitle,
      projectSubtitle: projectSubtitle,
      projectDescription: projectDescription,
    },
  ];

  /// 初期化処理
  useEffect(() => {
    // スクロール位置の初期配置を指定
    if (scrollRef.current) {
      scrollRef.current.scrollLeft =
        scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
    }

    /// totalCellsNumbers から占有領域分のセル数を除算
    let colExtraCellsNumber: any;

    inputDatas.map((inputData, index) => {
      const colStartCell =
        convertFromInputValueToMapValue(inputData).colStartCell;
      const colEndCell = convertFromInputValueToMapValue(inputData).colEndCell;
      colExtraCellsNumber = colEndCell - colStartCell;
    });

    setTotalCellsNumber((prev) => prev - colExtraCellsNumber);
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
            // セルの親コンポーネント
            <div
              className="relative top-[-1px] left-[-1px] h-[100.25%] w-[100.25%] border border-[#9BCEAE] shadow-md hover:bg-white hover:opacity-75 transition-all duration-300"
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
              <div className="absolute h-full w-full  bg-[#82ca9d] opacity-30"></div>

              {/* テキスト用 */}
              <div className="absolute top-0 left-1 text-gray-600 font-[425] ml-2 text-lg">
                {inputData.projectTitle}
              </div>
              <div className="absolute top-[60%] left-1 text-gray-600 ml-2 mt-[-3px] text-[13.5px]">
                {inputData.projectSubtitle}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
