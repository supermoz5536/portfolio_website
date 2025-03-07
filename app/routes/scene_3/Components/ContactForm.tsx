// ContactForm.tsx

/**
 * このコンポーネントは、Remix で使用するコンタクトフォームのサンプルです。
 * - 名前
 * - メールアドレス
 * - お問い合わせ内容
 * という3つの項目を用意し、Formコンポーネントのmethod="post"で送信します。
 *
 * 実際にデータを受け取って処理する部分(サーバー側アクション)は、
 * ページやルートのaction関数などで行ってください。
 *
 * Remix の場合は、Formタグを@remix-run/reactからインポートし、methodに"post"を指定すると
 * `action()` にPOSTリクエストでデータが飛ぶ仕組みになっています。
 */

import { Form } from "@remix-run/react";
import { useEffect, useState } from "react";

import { AnimateInBlock } from "~/components/animate_in_block";

export default function ContactForm() {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    /**
     * Device Setup
     */

    if (/iPhone|Android.+Mobile/.test(navigator.userAgent)) {
      setIsMobile(true);
    }

    /**
     * Resize
     */

    // Callback
    const resizeCallback = () => {
      if (/iPhone|Android.+Mobile/.test(navigator.userAgent)) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    // Listener
    window.addEventListener("resize", resizeCallback);

    return () => {
      window.removeEventListener("resize", resizeCallback);
    };
  }, []);

  return (
    <>
      <AnimateInBlock rootMarginBottom={isMobile ? -60 : -60}>
        <div className={"w-full p-8 " + (isMobile ? "pt-24" : "")}>
          {/* タイトル部分 */}

          <h2 id="tablet" className="text-2xl font-bold mb-6">
            お問い合わせ
          </h2>

          {/**
           *method="post" を指定することで、同じルート(または指定があれば指定先)の action() に
           *フォームデータが送信されます。
           */}
          <Form method="post" className="space-y-10">
            {/* 名前入力フィールド */}
            <div>
              <label
                id="tablet"
                htmlFor="name"
                className="block mb-1 font-semibold"
              >
                お名前
              </label>
              <input
                id="tablet"
                name="name"
                type="text"
                className="w-full border border-gray-300 rounded p-2"
                placeholder="山田 太郎"
                required
              />
            </div>

            {/* メールアドレス入力フィールド */}
            <div>
              <label
                id="tablet"
                htmlFor="email"
                className="block mb-1 font-semibold"
              >
                メールアドレス
              </label>
              <input
                id="tablet"
                name="email"
                type="email"
                className="w-full border border-gray-300 rounded p-2"
                placeholder="example@example.com"
                required
              />
            </div>

            {/* お問い合わせ内容入力フィールド */}
            <div>
              <label
                id="tablet"
                htmlFor="message"
                className="block mb-1 font-semibold"
              >
                お問い合わせ内容
              </label>
              <textarea
                id="tablet"
                name="message"
                rows={5}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="お問い合わせ内容をご記入ください"
                required
              />
            </div>

            {/* 送信ボタン */}
            <div className="relative flex flex-row justify-end">
              <button
                id="button"
                type="submit"
                className="absolute left-[50%] px-10 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition border-2"
              >
                <span id="fade-in-bottom">送信</span>
              </button>
            </div>
          </Form>
        </div>
      </AnimateInBlock>
    </>
  );
}
