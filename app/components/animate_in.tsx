import React, { ReactNode } from "react";
import { useInView } from "react-intersection-observer";

type AnimateInProps = {
  /**
   * React.ReactNode は、Reactがレンダリング可能なすべての型を
   * 包括的に表現する型で、配列も含みます。
   * そのため、React.ReactNode を使用する場合、
   * 個別の子要素や子要素の配列を区別せずに扱うことができます。
   */
  children: React.ReactNode;
  rootMarginBottom?: number;
};

/**
 * @example
 * return (
 *  <>
 *    <AnimateIn>
 *       その他の全てのコンポーネント
 *    </AnimateIn>
 *  <>
 * )
 */
export const AnimateIn = ({ children, rootMarginBottom }: AnimateInProps) => {
  const textTags = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "span"];
  if (rootMarginBottom == undefined) rootMarginBottom = -30;

  /**
   * React.ReactNode:
   * 非常に包括的な型で、文字列、数字、配列、null、undefined なども含まれます。
   *
   * React.Children:
   * childrenがReaqctElement[]型かをチェック
   * 子要素が単一の場合でも、配列の場合でも、falsyの場合でも同じ方法で処理できる
   */
  const processChildren = (children: React.ReactNode): any => {
    const { ref, inView } = useInView({
      rootMargin: `0% 0% ${rootMarginBottom}% 0%`,
      triggerOnce: true,
      threshold: 0,
    });

    const resultProcessedChildren = React.Children.map(children, (child) => {
      /* isValidElement: React要素であれば true  */
      if (React.isValidElement(child)) {
        const id = child.props.id;
        const tagName = typeof child.type == "string" ? child.type : null;
        let animateClassName = null;
        let className = null;

        /* コンポーネントが<AnimateIn>の場合は、同じ要素を返してスキップ */
        if (id == "skip") return child;

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
        if (id == "fade-in-bottom") animateClassName = "animate-fade-in-bottom";
        if (id == "tablet") animateClassName = "animate-text-focus-in";
        /* 左からのフェードインの場合 */
        if (id == "fade-in-left") animateClassName = "animate-fade-in-left";

        /* アニメーションする要素のみに動的なCSSクラスを設定 */
        if (animateClassName != null) {
          className = [
            child.props.className,
            inView ? animateClassName : "opacity-0",
          ]
            .filter((el) => el)
            .join(" ");
        } else {
          className = child.props.className;
        }

        // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
        // useInView一括版のコンポーネントでなく
        // かつ
        // childrenが存在するなら
        // に変更する
        // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
        const processedNestedChildren = child.props.children
          ? React.Children.map(child.props.children, (nestedChild) =>
              processChildren(nestedChild),
            )
          : child.props.children;

        const processedResult = React.cloneElement(
          child as React.ReactElement,
          {
            ref: animateClassName != null ? ref : null,
            className: className,
            children: processedNestedChildren,
          },
        );

        return processedResult;
      } else {
        return child;
      }
    });
    return resultProcessedChildren;
  };

  const wrappedChildren = React.Children.map(children, (child) => {
    const result = processChildren(child);
    return result;
  });

  return <>{wrappedChildren}</>;
};
