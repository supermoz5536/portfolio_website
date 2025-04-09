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
import { AnimateInBlock } from "~/components/animate_in_block";
import { useGlobalStore } from "~/store/global/global_store";

export default function ContactForm() {
  const isMobile = useGlobalStore((state) => state.isMobile);

  return (
    <>
      <AnimateInBlock rootMarginBottom={isMobile ? -60 : -60}>
        <div className="w-full p-8">
          {/* タイトル部分 */}

          <h2 id="tablet" className={"text-3xl font-bold mb-8 text-white"}>
            Inquiry Form
          </h2>

          {/**
           *method="post" を指定することで、同じルート(または指定があれば指定先)の action() に
           *フォームデータが送信されます。
           */}
          <Form
            // action="https://formspree.io/f/xnnpbnwd"
            action="."
            method="post"
            className={isMobile ? "space-y-5" : "space-y-10"}
          >
            {/* 名前入力フィールド */}
            <div>
              <label
                id="tablet"
                htmlFor="name"
                className={"block mb-1 font-semibold text-white"}
              >
                Name
              </label>
              <input
                id="tablet"
                name="name"
                type="text"
                className="w-full border border-gray-300 rounded p-2"
                required
              />
            </div>

            {/* メールアドレス入力フィールド */}
            <div>
              <label
                id="tablet"
                htmlFor="email"
                className={"block mb-1 font-semibold text-white"}
              >
                Email
              </label>
              <input
                id="tablet"
                name="email"
                type="email"
                className="w-full border border-gray-300 rounded p-2"
                placeholder="sample@example.com"
                required
              />
            </div>

            {/* お問い合わせ内容入力フィールド */}
            <div>
              <label
                id="tablet"
                htmlFor="message"
                className={"block mb-1 font-semibold text-white"}
              >
                Content
              </label>
              <textarea
                id="tablet"
                name="message"
                rows={5}
                className="w-full border border-gray-300 rounded p-2"
                required
              />
            </div>

            {/* 送信ボタン */}
            <div className="relative flex flex-row justify-end">
              <button
                id="button"
                type="submit"
                className={
                  "absolute left-[50%] px-10 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition border-2 " +
                  (isMobile ? "mt-7" : "")
                }
              >
                <span id="fade-in-bottom">Submit</span>
              </button>
            </div>
          </Form>
        </div>
      </AnimateInBlock>
    </>
  );
}
