import { Form, useActionData, useFetcher } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { AnimateInBlock } from "~/components/animate_in_block";
import { useGlobalStore } from "~/store/global/global_store";

export default function ContactForm() {
  const actionData = useActionData<{ result: string }>();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");

  const isMobile = useGlobalStore((state) => state.isMobile);

  useEffect(() => {
    if (actionData?.result == "OK") {
      setTitle("");
      setEmail("");
      setContent("");
      setIsSubmitted(true);
    }
  }, [actionData]);

  return (
    <>
      <AnimateInBlock rootMarginBottom={isMobile ? -60 : -60}>
        <div className="w-full p-8">
          {/* タイトル部分 */}

          <h2 id="tablet" className={"text-3xl font-bold mb-8 text-white"}>
            Inquiry Form
          </h2>

          <Form
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={content}
                onChange={(e) => setContent(e.target.value)}
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
