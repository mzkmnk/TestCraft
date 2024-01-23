import { useState, useEffect } from "react";

export default function useTimer(startValue) {
  const [seconds, setSeconds] = useState(startValue);
  const [prevStart, setPrevStart] = useState(startValue);
  const [isActive, setIsActive] = useState(false);

  const toggleActive = () => {
    setIsActive(!isActive);
  };

  const reset = (startValue = prevStart) => {
    setSeconds(startValue);
    setPrevStart(startValue);
  };

  useEffect(() => {
    if (!isActive) {
      return;
    }
    const timer = setInterval(() => {
      // 直接更新ではなく、更新関数を渡すと、依存配列に追加する必要がなくなる。
      setSeconds((time) => time - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isActive]);

  return { seconds, toggleActive, reset };
}
