import React, { ReactNode, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

type AnimateInProps = {
  /**
   * React.ReactNode は、Reactがレンダリング可能なすべての型を
   * 包括的に表現する型で、配列も含みます。
   * そのため、React.ReactNode を使用する場合、
   * 個別の子要素や子要素の配列を区別せずに扱うことができます。
   */
  children: React.ReactNode;
};

/**
 * @example
 *    <AnimateInBlock>
 *       <Component Group />
 *    </AnimateInBlock>
 *
 * @note
 * 対象要素群の1番目にのみ Ref を渡し
 * そのRefを監視して、その他全要素のアニメーションをトリガーする。
 * しかし、その要素の子孫にCSSアニメーションがデフォルトで設定されていると
 * 適切にトリガーされない。その場合は AnimateIn を部分的に代用する
 */
export const AnimateInBlock = ({ children }: AnimateInProps) => {
  const [triggered, setTriggered] = useState<boolean>(false);
  const textTags = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "span"];
  let firstRefFlag = false;
  let delay = 0;

  const { ref, inView } = useInView({
    rootMargin: "0% 0% -30% 0%",
    triggerOnce: true,
    threshold: 0,
  });

  useEffect(() => {
    if (inView) {
      setTriggered(true);
    }
  }, [inView]);

  /**
   * React.ReactNode:
   * 非常に包括的な型で、文字列、数字、配列、null、undefined なども含まれます。
   *
   * React.Children:
   * childrenがReaqctElement[]型かをチェック
   * 子要素が単一の場合でも、配列の場合でも、falsyの場合でも同じ方法で処理できる
   */
  const processChildren = (children: React.ReactNode): React.ReactNode => {
    const resultProcessedChildren = React.Children.map(
      children,
      (child, index) => {
        /* isValidElement: React要素であれば true  */
        if (React.isValidElement(child)) {
          const id = child.props.id;
          const tagName = typeof child.type == "string" ? child.type : null;
          let animateClassName = null;
          let className = null;

          /* 文字列系のタグの場合 */
          if (tagName && textTags.includes(tagName))
            animateClassName = "animate-scale-in-ver-bottom";
          /* imgタグの場合 */
          if (tagName == "img") animateClassName = "animate-fade-in-bottom";
          /* 横ラインの場合 */
          if (id == "line") animateClassName = "animate-scale-in-hor-left";
          /* 丸アイコンの場合 */
          if (id == "circle") animateClassName = "animate-scale-in-ver-bottom";
          /* チャートの場合 */
          if (id == "chart-l") animateClassName = "animate-rotate-in-2-tl-ccw";
          if (id == "chart-r") animateClassName = "animate-rotate-in-2-fwd-ccw";
          if (id == "chart-b") animateClassName = "animate-bounce-in-top";
          /* svgアイコンの場合 */
          if (id == "svg") animateClassName = "animate-scale-in-center";
          /* buttonの場合 */
          if (id == "button") animateClassName = "animate-scale-in-hor-center";
          /* 下からのフェードインの場合 */
          if (id == "fade-in-bottom") animateClassName = "animate-fade-in-bottom"; // prettier-ignore
          if (id == "tablet") animateClassName = "animate-text-focus-in";

          /**
           * アニメーションする要素のみに以下を設定
           * 動的なCSSクラス
           * delayの追加
           */
          if (animateClassName != null) {
            className = [
              child.props.className,
              triggered ? animateClassName : "opacity-0",
            ]
              .filter((el) => el)
              .join(" ");

            delay = delay + 0.2;
          } else {
            className = child.props.className;
          }

          /* 遅延用Delayをインライン設定 */
          const style = {
            ...child.props.style,
            animationDelay: `${delay}s`,
          };

          const processedNestedChildren = child.props.children
            ? React.Children.map(child.props.children, (nestedChild) =>
                processChildren(nestedChild),
              )
            : child.props.children;

          const processedResult = React.cloneElement(
            child as React.ReactElement,
            {
              ...child.props,
              ref:
                animateClassName != null && firstRefFlag == false ? ref : null,
              className: className,
              children: processedNestedChildren,
              style: animateClassName != null ? style : child.props.style,
            },
          );

          firstRefFlag = true;

          return processedResult;
        } else {
          return child;
        }
      },
    );
    return resultProcessedChildren;
  };

  const wrappedChildren = React.Children.map(children, (child) => {
    const result = processChildren(child);
    return result;
  });

  return <div id="skip">{wrappedChildren}</div>;
};
