/// サーバーサイドでFirebaseの操作ができるように
/// Firebase admin-SDK を設定するファイル

/// admin-SDKのエントリーポイントを"admin"として取得
// import * as admin from "firebase-admin";
import admin from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import dotenv from "dotenv";

/// まず最初に dotenv.config()を実行することで
/// .envファイルの内容を process.env にロードします。
dotenv.config();

const cert = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
};

/// すでに初期化された場合に再初期化を防ぐための分岐です。
/// サーバーサイドではコードが複数回実行される可能性があるからです。
/// Admin SDKでは複数のアプリを初期化することが可能です。
/// 初期化されていない場合、length === 0 になります。

let initializedAdmin: any;

if (admin.apps.length === 0) {
  initializedAdmin = admin.initializeApp({
    credential: admin.credential.cert(cert),
    storageBucket: "portfolio-website-4645b.firebasestorage.app",
  });
} else {
  initializedAdmin = admin.app();
}

export { initializedAdmin };
