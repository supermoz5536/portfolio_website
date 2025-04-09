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
import { useRef, useState } from "react";
import { AnimateInBlock } from "~/components/animate_in_block";
import { useGlobalStore } from "~/store/global/global_store";

export default function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const isMobile = useGlobalStore((state) => state.isMobile);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    form.reset();
    setIsSubmitted(true);
  };

  return (
    <>
      <AnimateInBlock rootMarginBottom={isMobile ? -60 : -60}>
        <div className="w-full p-8">
          {/* タイトル部分 */}

          <h2 id="tablet" className={"text-3xl font-bold mb-8 text-white"}>
            Inquiry Form
          </h2>

          <Form
            onSubmit={handleSubmit}
            action="."
            method="post"
            className={isMobile ? "space-y-5" : "space-y-10"}
          >
            {/* Title */}
            <div>
              <label
                id="tablet"
                htmlFor="title"
                className={"block mb-1 font-semibold text-white"}
              >
                Title
              </label>
              <input
                id="tablet"
                name="title"
                type="text"
                className="w-full border border-gray-300 rounded p-2"
                required
              />
            </div>

            {/* Email */}
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

            {/* Content */}
            <div>
              <label
                id="tablet"
                htmlFor="content"
                className={"block mb-1 font-semibold text-white"}
              >
                Content
              </label>
              <textarea
                id="tablet"
                name="content"
                rows={5}
                className="w-full border border-gray-300 rounded p-2"
                required
              />
            </div>

            {/* Send Button */}
            <div className="relative flex flex-row justify-center">
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
              {isSubmitted && (
                <div className={"text-lg " + (isMobile ? "mt-16" : "mt-8")}>
                  Submission complete!
                </div>
              )}
            </div>
          </Form>
        </div>
      </AnimateInBlock>
    </>
  );
}
