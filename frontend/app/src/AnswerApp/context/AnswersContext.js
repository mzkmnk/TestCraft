import { useState, createContext, useContext } from "react";

const AnswersContext = createContext();

export function useAnswers() {
  return useContext(AnswersContext);
}

/**
 * 解答データを提供する役割を持つ。
 * @returns
 */
export function AnswersProvider({ children }) {
  const [answers, setAnswers] = useState({});
  const answersCount = Object.keys(answers).length;

  return (
    <AnswersContext.Provider value={{ answers, setAnswers, answersCount }}>
      {children}
    </AnswersContext.Provider>
  );
}
