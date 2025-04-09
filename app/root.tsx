import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { ActionFunction, LinksFunction } from "@remix-run/node";
import "./tailwind.css";
import { useEffect } from "react";
import { useGlobalStore } from "./store/global/global_store";
import { setupDevice } from "./util/setup/device";
// import { setupLoadingManager } from "./util/setup/loadingManager";
import { loadAllAssets } from "./util/setup/loadingAssets";

// 全てのページで共通して読み込むべき外部リソース（CSSやフォントなど）を宣言してます。
// ============================================
// rel: relationship の略でリソースの用途を示します。
// preconnect: サーバーとの早期接続を試みます。
// この早期接続を使うと、ページのレンダリングがスムーズになります。
// 使い方: フォントやAPIなど、外部リソースを事前に準備。
// ============================================
// href: hyperlink reference の略でリンク先のURLを指定します。
// 使い方: ダウンロードするリソース（CSS、フォントなど）の場所を指定します。
// ============================================
// crossOrigin: クロスオリジン（異なるドメイン）リソースのリクエスト方法を指定します。
// 使い方: リソースが別のドメイン（例: https://fonts.gstatic.com）にある場合、
// どのようにデータをやり取りするか設定します。
// よく使う値:
// anonymous: 認証情報を送らずにリクエストを送る（安全性が高い）
// use-credentials: 認証情報（クッキーなど）を含めてリクエストを送る（必要な場合のみ）。
export const links: LinksFunction = () => [
  // Google Fonts のスタイルシート（CSSファイル）を早く取得する準備をする。
  // スタイル情報（CSS）をスムーズに読み込むため
  // サーバー（fonts.googleapis.com）への接続を事前に確立しています。
  { rel: "preconnect", href: "https://fonts.googleapis.com" },

  // フォントデータそのものを早く取得する準備をする。
  // Googleの別サーバーからフォント自体のデータ（太さ、大きさ等）をスムーズに取得するため
  // サーバー（fonts.googleapis.com）への接続を事前に確立しています。
  // ============================================
  // anonymous を設定して、サーバーとの通信に認証情報を含めないことで
  // 認証が不要になってリクエストが軽量化されます。
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },

  // ダウンロードURLからCSSファイルを取得する。
  // 実際にダウンロードするために記述が必要なのは CSSファイルのURL だけです。
  // 具体的なフォントデータのダウンロードは、
  // CSSファイル内に記載されたURLをブラウザが自動的に参照して行うからです。
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },

  // Archivo Blackフォント
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap",
  },
];

// <Layout> コンポーネントが
// HTMLドキュメント全体を構成します。
// (<html> タグから <body> タグまで）
// ============================================
// <Meta /> でメタ情報を追加。
// 各ルートファイル（例: routes/index.tsx, routes/about.tsx）に
// meta 関数を定義して、ページ固有のメタ情報を設定します。
// ============================================
// <Links /> で外部リソースを追加。
// ページの見た目（スタイル）を適用するために、
// 各ルート（ページ）でlinks関数で指定された
// 外部ファイル（styles.css等）を読み込んでいます。
// ============================================
// {children} で、子コンポーネントをシステムからプロップスで受け取ることで
// 指定箇所にそれらを描画することを指示してる
// ============================================
// <ScrollRestoration /> でページ遷移を管理。
// Remixの特徴的な機能の一つで、SPAでは標準でサポートされていない
// ページ遷移時にスクロール位置を保持する機能が得られます。
// これにより、ユーザーが別のページに移動して戻った際に、
// 前回のスクロール位置が復元されてスムーズな操作感が得られます。
// ============================================
// <Scripts />　でスクリプトを管理。
// SSR では React が動く前に、まず静的な HTML がブラウザに送られます。
// その後、React のクライアントサイド部分がブラウザで動き始め、
// HTML と「結び付けられる」プロセスを「ハイドレーション（Hydration）」と言います。
// ハイドレーションの問題: サーバーサイドで作られたHTMLと、
// クライアントサイドのReactが動かすべきアプリの状態やイベントが一致しないと、
// エラーが発生したり動作が崩れたりします。
// <Scripts /> は、React が正しくハイドレーションするために必要な
// スクリプト（イベント、状態管理など）を読み込む仕組みを提供しています。
export function Layout({ children }: { children: React.ReactNode }) {
  setupDevice();
  loadAllAssets();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        {/* <meta name="viewport" content="width=device-width, initial-scale=1" /> */}
        <meta
          name="viewport"
          content="height=device-height, width=device-width, initial-scale=1.0, minimum-scale=1.0, target-densitydpi=device-dpi"
        />
        {/* <meta name="viewport" content="minimum-scale=1.0" /> */}
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// <Outlet /> は Layout（）内で
//  {children} を配置した場所に挿入される。
// → 設計の分離を保つために、App 関数を経由して役割を切り分けています。
// ============================================
// 設計の分離を保つために、App 関数を経由して役割を切り分けています。
// Layout はアプリ全体の骨組みや共通部分（ヘッダー、フッターなど）を定義しますが、
// どのページが現在表示されているかを知らない状態で動きます。
// ============================================
// <Outlet /> は「現在表示されているページの中身を描画する場所」なので、
// それを直接 Layout に埋め込むと、
// レイアウトの役割とページコンテンツの役割が曖昧になりやすいです。
export default function App() {
  return <Outlet />;
}
