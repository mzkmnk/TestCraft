import { createContext, useContext } from "react";

const QuestionsContext = createContext();
export function useQuestions() {
  return useContext(QuestionsContext);
}

/**
 * 問題データを提供する役割を持つ。
 * workbookを{ info, questionTree, questionIds }の形で提供する。
 *
 * @param {object} workbook
 * @returns
 */

export const QuestionsProvider = ({ children, workbook }) => {
  const info = workbook.info;
  const questionTree = workbook.questions;
  const rootId = Object.keys(questionTree).find(
    (key) => questionTree[key].questionType === "root"
  );
  return (
    <QuestionsContext.Provider value={{ info, questionTree, rootId }}>
      {children}
    </QuestionsContext.Provider>
  );
};
