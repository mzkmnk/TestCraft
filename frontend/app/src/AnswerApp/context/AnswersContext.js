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

  return (
    <AnswersContext.Provider value={{ answers, setAnswers }}>
      {children}
    </AnswersContext.Provider>
  );
}
