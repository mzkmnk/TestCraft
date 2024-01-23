import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * urlを受け取り、APIからデータを取得する。
 * デフォルトでログイン認証を行う。
 * ログイン認証に失敗した場合は、ログインページにリダイレクトする。
 *
 * @param {object} {url, isLoginRequired}
 * @returns {object} {data, error, isLoading}
 */

export default function useAPI({ url, isLoginRequired = true }) {
  const [data, setData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(undefined);
  const [error, setError] = useState(undefined);

  const navigate = useNavigate();

  useEffect(() => {
    class NotAuthenticatedError extends Error {
      constructor(message) {
        super(message);
        this.name = "NotAuthenticatedError";
      }
    }

    const fetchData = (async () => {
      setIsLoading(true);
      try {
        // ログイン認証
        if (isLoginRequired) {
          const response = await fetch("http://localhost:8000/api/check_auth", {
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });
          const data = await response.json();
          if (data.authenticated === false) {
            throw new NotAuthenticatedError("Not authenticated");
          }
        }

        // データの取得
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();
        setIsSuccess(true);
        setData(data);
      } catch (error) {
        if (error instanceof NotAuthenticatedError) {
          // ログインページにリダイレクト
          navigate("/login");
        } else {
          setError(error);
        }
      }
      setIsLoading(false);
    })();
  }, [isLoginRequired, navigate, url]);

  return { data, isLoading, isSuccess, error };
}
