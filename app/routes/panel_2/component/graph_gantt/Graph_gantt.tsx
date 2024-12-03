import "./graph_gantt.css";

export default function GraphGantt() {
  // チャート初期設定値
  const headerChunkNumber = 5;
  const rowCellsNumber = 8;
  const colCellsNumber = 120;
  const headerCellsNumber = colCellsNumber / headerChunkNumber;
  const totalCellsNumber = rowCellsNumber * colCellsNumber;

  const formatCells = () => {
    let cells = [];

    for (let i = 0; i < totalCellsNumber; ++i) {
      // Header Cell
      if (i < colCellsNumber / headerChunkNumber) {
        const headerCell = {
          className: "h-[25px] w-[225px] bg-gray-200 border border-[#C5C5C5]",
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

  return (
    <>
      {/* 全体枠 */}
      <div
        className="h-full w-auto bg-white border border-[#C5C5C5] overflow-x-auto overflow-y-auto"
        style={{
          display: "grid",
          gridTemplateRows: `25px repeat(${rowCellsNumber - 1}, 45px)`,
          gridTemplateColumns: `repeat(${colCellsNumber}, 45px)`,
        }}
      >
        {formatCells().map((cell, index) => (
          <div className={cell.className} style={cell.style}>
            {/* Header Content */}
            {index < headerCellsNumber && (
              <div>{/* {`${year}年 ${month}月`} */}</div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
