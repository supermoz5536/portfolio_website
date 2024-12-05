import { getStorage, getDownloadURL } from "firebase-admin/storage";
import { admin } from "../../firebase/setup_server";

export const fetchVideoDownloadURL = async () => {
  let downloadUrlArray: any = [];
  const bucket = admin
    .storage()
    .bucket("portfolio-website-4645b.firebasestorage.app");
  const directoryPath = "system/video/content_block/";

  // content_blockディレクトリ内の全て動画ファイル（1.mp4 ~ 4.mp4）を取得
  // bucket.getFiles() は 配列を返すメソッド で
  // [(ファイルオブジェクトの配列), (メタ情報)]の構造になっており
  // 配列の分割代入は配列の最初の要素を抽出するするので
  // 指定ディレクトリ内の要素オブジェクトのリストが取得できる
  // 例: const files = [{ name: "1.mp4" },{ name: "2.mp4" },{ name: "3.mp4" }];
  const [files] = await bucket.getFiles({
    prefix: directoryPath, // ディレクトリの指定
    delimiter: "/", // サブディレクトリを除外
  });

  // 名前順に配列を整列
  // 要素名が 1.mp4 ~ 4.4m までの単純な数値のみ使用してるので
  // localeCompareのアルファベット順で処理可能
  files.sort((a, b) => a.name.localeCompare(b.name));

  try {
    for (const file of files) {
      // Firebase Storageでは
      // 指定したディレクトリ自体も仮想的なフォルダとして認識されるので
      // ファイル名がフォルダ名と一致してる場合はスキップする
      if (file.name == directoryPath) continue;

      const downloadUrl = await file.getSignedUrl({
        action: "read",
        expires: "12-31-2999",
      });
      downloadUrlArray = [...downloadUrlArray, ...downloadUrl];
    }

    return new Response(
      JSON.stringify({ downloadUrlArray: downloadUrlArray }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (e: any) {
    console.error("fetchVideoDownloadURL failed", e);
    return new Response(
      JSON.stringify({
        error: "fetchVideoDownloadURL failed",
        details: e.message,
      }),
    );
  }
};
