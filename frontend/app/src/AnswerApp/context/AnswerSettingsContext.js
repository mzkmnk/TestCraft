import { useState, createContext, useContext } from "react";

const AnswerSettingsContext = createContext();
export const useAnswerSettings = () => {
  return useContext(AnswerSettingsContext);
};

/**
 * 解答設定を提供する役割を持つ。
 */
export function AnswerSettingsProvider({ children }) {
  const defaultAnswerSettings = {
    /**単位は秒 */
    time: 360,
  };
  const [answerSettings, setAnswerSettings] = useState(defaultAnswerSettings);

  return (
    <AnswerSettingsContext.Provider
      value={{ answerSettings, setAnswerSettings }}
    >
      {children}
    </AnswerSettingsContext.Provider>
  );
}
