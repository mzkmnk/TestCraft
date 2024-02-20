import { useState, useEffect } from "react";

/**
 * hh:mm:ss形式の時間を返すタイマー。
 * isFinishedによって、0になったことを示す。
 * 初期化時は、isActiveがfalse、isFinishedがfalseの状態である。
 * setは、タイマーを停止させて、指定した時間に設定する。
 *
 * resetは、タイマーを停止させる。
 * @param {Number} startSeconds
 * @returns {Object} {time:{hour, minutes, seconds}, toggleActive, reset}
 */
export function useTimer({ startSeconds = 0, notificationTime = 0 }) {
  const [secondsTimer, setSecondsTimer] = useState(startSeconds);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isNotificationTime, setIsNotificationTime] = useState(false);

  const set = (startSeconds) => {
    setIsActive(false);
    setIsFinished(false);
    setSecondsTimer(startSeconds);
  };

  const start = () => {
    setIsActive(true);
  };

  const stop = () => {
    setIsActive(false);
  };

  useEffect(() => {
    const finish = () => {
      setIsFinished(true);
      stop();
    };

    if (!isActive) {
      return;
    }

    const timer = setInterval(() => {
      // 直接更新ではなく、更新関数を渡すと、依存配列に追加する必要がなくなる。
      setSecondsTimer((time) => time - 1);
      if (secondsTimer - 1 === 0) {
        finish();
        return;
      }
      if (secondsTimer - 1 < notificationTime && isNotificationTime === false) {
        setIsNotificationTime(true);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isActive, isNotificationTime, notificationTime, secondsTimer]);

  // hh:mm:ss形式にフォーマット
  let time = { hour: "", minutes: "", seconds: "" };

  const hour = Math.floor(secondsTimer / 3600);
  if (hour < 10) {
    time.hour = "0" + hour;
  } else {
    time.hour = "0" + hour;
  }

  const minutes = Math.floor((secondsTimer - time.hour * 3600) / 60);
  if (minutes < 10) {
    time.minutes = "0" + minutes;
  } else {
    time.minutes = minutes;
  }

  const seconds = secondsTimer - time.hour * 3600 - time.minutes * 60;
  if (seconds < 10) {
    time.seconds = "0" + seconds;
  } else {
    time.seconds = seconds;
  }

  return { time, set, start, stop, isActive, isFinished, isNotificationTime };
}
