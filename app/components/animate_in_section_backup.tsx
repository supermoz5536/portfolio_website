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

type AccumObj = {
  delaySum: number;
  processedChildrenArray: React.ReactNode[];
};

/**
 * @example
 *
 *   <AnimateIn>
 *      一括でトリガーしたいセクション
 *   </AnimateIn>
 */
export const AnimateInSection = ({ children }: AnimateInProps) => {
  const textTags = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "span"];

  const { ref, inView } = useInView({
    rootMargin: "0% 0% -30% 0%",
    triggerOnce: true,
    threshold: 0,
  });

  /**
   * React.ReactNode:
   * 非常に包括的な型で、文字列、数字、配列、null、undefined なども含まれます。
   *
   * React.Children:
   * childrenがReaqctElement[]型かをチェック
   * 子要素が単一の場合でも、配列の場合でも、falsyの場合でも同じ方法で処理できる
   *
   * React.Children.toArrayを使うことで、childrenを必ず配列に変換できます。
   */
  const processChildrenForSection = (
    parentAccum: AccumObj,
    children: React.ReactNode,
  ): AccumObj => {
    console.log("2");

    const arrayedChildren = React.Children.toArray(children);
    const resultProcessedChildren = arrayedChildren.reduce(
      (accum: AccumObj, child) => {
        console.log("3");

        /* isValidElement: React要素であれば true  */
        if (React.isValidElement(child)) {
          console.log("4 childDebug:", child.props.id);

          if (child.props.id == "done") {
            return {
              delaySum: accum.delaySum,
              processedChildrenArray: [...accum.processedChildrenArray, child],
            };
          }

          console.log("4.2");

          const id = child.props.id;
          const tagName = typeof child.type == "string" ? child.type : null;
          let animateClassName = null;
          let className = null;

          /* 文字列系のタグの場合 */
          if (tagName && textTags.includes(tagName))
            animateClassName = "animate-scale-in-ver-bottom";
          /* imgタグの場合 */
          if (tagName == "img")
            animateClassName = "animate-scale-in-ver-bottom";
          /* 横ラインの場合 */
          if (id == "line") animateClassName = "animate-scale-in-hor-left";
          /* 丸アイコンの場合 */
          if (id == "circle") animateClassName = "animate-scale-in-ver-bottom";
          /* チャートの場合 */
          if (id == "chart") animateClassName = "animate-scale-in-ver-bottom";
          /* テストの場合 */
          if (id == "test") animateClassName = "animate-fade-in-bottom";

          console.log("5");

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

          /* 遅延用Delayをインライン設定 */
          const style = {
            ...child.props.style,
            animationDelay: `${accum.delaySum + 2}s`,
          };

          console.log("6");

          // ここまで: 動的クラスの処理
          // ここから: child の children の child(nestedChild)群 の
          // accumオブジェクトを取得して、自分のaccumとマージしてリターン

          let processedNestedChildren;

          if (child.props.children) {
            const arrayedChildren = React.Children.toArray(
              child.props.children,
            );

            const processedNestedChildrenAccumObj = arrayedChildren.reduce(
              (accum, nestedChild) => {
                const resultAccumObj = processChildrenForSection(
                  accum,
                  nestedChild,
                );
                const newAccum = {
                  delaySum: accum.delaySum + resultAccumObj.delaySum,
                  processedChildrenArray: [
                    ...resultAccumObj.processedChildrenArray,
                  ],
                };

                return newAccum;
              },
              {
                delaySum: accum.delaySum,
                processedChildrenArray: accum.processedChildrenArray,
              } as AccumObj,
            );

            processedNestedChildren =
              processedNestedChildrenAccumObj.processedChildrenArray;
          } else {
            processedNestedChildren = child.props.children;
          }

          const processedResult = React.cloneElement(
            child as React.ReactElement,
            {
              ref: animateClassName != null ? ref : null,
              className: className,
              style: animateClassName != null ? style : null,
              children: processedNestedChildren,
              id: "done",
            },
          );
          console.log("7 className:", className);
          console.log("7 processedChildren:", processedNestedChildren);
          console.log("7 processedResult:", processedResult);

          const newDelaySum =
            animateClassName != null ? accum.delaySum + 2 : accum.delaySum;

          const newProcessedChildrenArray = [
            ...accum.processedChildrenArray,
            processedResult,
          ];

          return {
            delaySum: newDelaySum,
            processedChildrenArray: newProcessedChildrenArray,
          };

          /* isValidElement: React要素でない場合、処理せずに同じaccumを返す  */
        } else {
          console.log("8");
          return {
            delaySum: accum.delaySum,
            processedChildrenArray: [...accum.processedChildrenArray, child],
          };
        }
      },
      {
        delaySum: parentAccum.delaySum,
        processedChildrenArray: parentAccum.processedChildrenArray,
      } as AccumObj,
    );
    console.log("9");
    return resultProcessedChildren;
  };

  const arrayedChildren = React.Children.toArray(children);
  const processedAccumObj = arrayedChildren.reduce(
    (accum, child) => {
      console.log("1");
      const accumObj = processChildrenForSection(accum, child);
      console.log("end");

      return accumObj;
    },
    { delaySum: 0, processedChildrenArray: [] } as AccumObj,
  );

  const wrappedChildren = processedAccumObj.processedChildrenArray;
  console.log("end wrappedChildren:", wrappedChildren);

  return <>{wrappedChildren}</>;
};
