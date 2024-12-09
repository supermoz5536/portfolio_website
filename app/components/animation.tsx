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
};

/**
 * @example
 *
 * <AnimateIn>
 *   <div> アニメーションする要素 </div>
 * </AnimateIn>
 */
export const AnimateIn = ({ children }: AnimateInProps) => {
  const textTags = ["h1", "h2", "h3", "h4", "h5", "h6", "p"];

  const { ref, inView } = useInView({
    rootMargin: "-300px",
    triggerOnce: true,
  });

  /**
   *  React.Children: childrenがReaqctElement[]型かをチェック
   * 子要素が単一の場合でも、配列の場合でも、falsyの場合でも同じ方法で処理できる
   */
  const processChildren = (children: React.ReactNode): any => {
    console.log("2");
    const resultProcessedChildren = React.Children.map(children, (child) => {
      console.log("3");
      /* isValidElement: React要素であれば true  */
      if (React.isValidElement(child)) {
        console.log("4");
        const id = child.props.id;
        const tagName = typeof child.type == "string" ? child.type : null;
        let animateClassName = null;

        /* 文字列系のタグの場合 */
        if (tagName && textTags.includes(tagName))
          animateClassName = "animate-scale-in-ver-bottom";
        /* imgタグの場合 */
        if (tagName == "img") animateClassName = "";
        /* 横ラインの場合 */
        if (id == "line") animateClassName = "";
        /* 丸アイコンの場合 */
        if (id == "circle") animateClassName = "";
        /* チャートの場合 */
        if (id == "chart") animateClassName = "";

        console.log("5");
        const className = [
          child.props.className,
          inView ? animateClassName : "text-blue-400",
        ]
          .filter((el) => el)
          .join(" ");

        console.log("6");

        const processedChildren = React.isValidElement(child.props.children)
          ? React.Children.map(child.props.children, (nestedChild) =>
              processChildren(nestedChild),
            )
          : child.props.children;

        const processedResult = React.cloneElement(
          child as React.ReactElement,
          {
            ref: animateClassName != null ? ref : null,
            className: className,
            children: processedChildren,
          },
        );
        console.log("7 className:", className);
        console.log("7 processedChildren:", processedChildren);
        console.log("7 processedResult:", processedResult);

        return processedResult;
      } else {
        console.log("9");
        return child;
      }
    });
    return resultProcessedChildren;
  };

  const wrappedChildren = React.Children.map(children, (child) => {
    console.log("1");
    const result = processChildren(child);
    console.log("end:", result);
    return result;
  });

  return <>{wrappedChildren}</>;
};
