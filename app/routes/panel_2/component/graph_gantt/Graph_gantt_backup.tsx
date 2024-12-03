// import "./graph_gantt.css";

// export default function GraphGantt() {
//   const colCells = () => {
//     let cells = [];

//     for (let i = 0; i < 8; ++i) {
//       const cell = {
//         className: "flex flex-row h-[45px] w-auto divide-x-2 divide-gray-200",
//       };
//       cells.push(cell);
//     }
//     return cells;
//   };

//   const rowCells = () => {
//     let cells = [];

//     for (let i = 0; i < 42; ++i) {
//       const cell = {
//         className: "h-[45px] w-[45px] flex-shrink-0 bg-white",
//       };
//       cells.push(cell);
//     }
//     return cells;
//   };

//   return (
//     <>
//       {/* 全体枠 */}
//       <div className="flex flex-col h-full w-full bg-white overflow-x-auto overflow-y-auto divide-y-2 divide-gray-200">
//         {/* 縦列のセルを生成 */}
//         {colCells().map((colCell) => (
//           <div className={`${colCell.className}`}>
//             {/* 各縦列のセルの中に、横列のセルを生成 */}
//             {rowCells().map((rowCell) => (
//               <div className={`${rowCell.className}`}></div>
//             ))}
//           </div>
//         ))}
//       </div>
//     </>
//   );
// }
