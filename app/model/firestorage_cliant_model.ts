// import { app } from "../firebase/setup_cliant";
// import { getStorage, ref, getDownloadURL } from "firebase/storage";

// const storage = getStorage(app);

// export const fetchVideo = async () => {
//   getDownloadURL(ref(storage, "system/video/content_block/1.")).then((url) => {
//     const xhr = new XMLHttpRequest();
//     // レスポンスの形式を blob(バイナリ形式)に指定
//     // blob は「Binary Large Object（バイナリラージオブジェクト）」の略
//     // 巨大なバイナリデータを扱うためのデータ型
//     xhr.responseType = "blob";
//     // レスポンス取得時のコールバック
//     // XMLHttpRequest のレスポンスデータは、
//     // リクエストの完了後に response プロパティに格納されます。
//     xhr.onload = (event) => {
//       const blob = xhr.response;
//     };
//     xhr.open("GET", url);
//     xhr.send();
//   });
// };
