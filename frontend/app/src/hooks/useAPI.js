import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const urlBase = "http://localhost:8000/api";
const APIs = {
  singup: `${urlBase}/signup`,
  login: `${urlBase}/login`,
  check_auth: `${urlBase}/check_auth`,
  logout: `${urlBase}/logout`,
  user_change: `${urlBase}/user_change`,
  company_signup: `${urlBase}/company_signup`,
  questionsall: `${urlBase}/questionsall`,
  create_user_workbook: `${urlBase}/create_user_workbook`,
  add_user: `${urlBase}/add_user`,
  get_graph_data: `${urlBase}/get_graph_data`,
  save_data: `${urlBase}/save_data`,
  edit_workbook: (workbookId) => `${urlBase}/edit_workbook/${workbookId}`,
  questionsall_like: (workbookId) =>
    `${urlBase}/questionsall/${workbookId}/like`,
  save_answer: `${urlBase}/save_answer`,
  solve_workbook: `${urlBase}/solve_workbook`,
  solve_detail: (arr) => `${urlBase}/solve_detail/${arr[0]}/${arr[1]}`,
  message: `${urlBase}/message`,
  get_company_user: `${urlBase}/get_company_user`,
  send_message: `${urlBase}/send_message`,
  is_company_user: `${urlBase}/is_company_user`,
  all_company_users: `${urlBase}/all_company_users`,
};

/**
 * urlを受け取り、APIからデータを取得する。
 * ログイン認証に失敗した場合は、ログインページにリダイレクトする。
 * 一つのuseAPIでは、一つのAPIしか叩けず、初回読み込み時にAPINameを指定する必要がある。
 * isLoginRequiredも、初期化時のみしか変更できない。
 * 初回読み込み時にAPIを叩くかどうかは、loadOnStartで指定する。
 * sendAPIを使う場合、useEffectの中、非同期のイベント関数の中などで使う必要がある。（無限ループになる）
 * bodyがあるかないかでGetとPostを判別するため、bodyのないPostは、空のオブジェクトをbodyに渡す必要がある。（出来が悪いインタフェースでごめん）
 *
 * @param {object} {APIName:string, params:string, body:string isLoginRequired:bool, loadOnStart:bool}
 * @returns {object} {sendAPI, data, isLoading, isSuccess, error }
 */

// この関数が生きている限りは引数が使える？
export function useAPI({
  APIName,
  params = null,
  body = null,
  isLoginRequired = false,
  loadOnStart = false,
}) {
  // dataの初期値がnullだと、data.~~でエラーが出る。
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(loadOnStart ? true : null);
  const [isSuccess, setIsSuccess] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const stateInit = () => {
    setData({});
    setIsLoading(true);
    setError(undefined);
    setIsSuccess(undefined);
  };

  // useEffectでも、外部からも呼び出せるようにするには、useCallbackを使う必要がある。
  // コンポーネント内で関数が再宣言 & 定義されると、参照が変わり、関数が変化したとみなされる。
  // これは、useEffectの無限ループを引き起こす。
  // これを防ぐため、関数をメモ化して、保存する。
  const sendAPI = useCallback(
    async ({ params = null, body = null }) => {
      // ログイン認証失敗Error
      class NotAuthenticatedError extends Error {
        constructor(message) {
          super(message);
          this.name = "NotAuthenticatedError";
        }
      }
      stateInit();
      try {
        // ログイン認証
        if (isLoginRequired) {
          const response = await fetch(APIs.check_auth, {
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
        const API = APIs[APIName];
        if (!API) {
          throw new Error("APIName is not found");
        }
        // JSON Bodyがある場合は、POSTリクエストを送る。
        const url = typeof API === "function" ? API(params) : API;
        console.log("url", url);
        const reqData = body
          ? {
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              method: "POST",
              body: body,
            }
          : {
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            };
        console.log("reqData", reqData);
        const response = await fetch(url, reqData);
        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setData(data);

        setIsSuccess(true);
      } catch (error) {
        // ログイン認証失敗の場合、ログインページにリダイレクトする。
        if (error instanceof NotAuthenticatedError) {
          navigate("/login");
        } else {
          setError(error);
        }
        console.log(error);
        setIsSuccess(false);
      } finally {
        setIsLoading();
      }
    },
    [APIName, navigate]
  );

  useEffect(() => {
    if (loadOnStart) {
      sendAPI({
        params,
        body,
      });
    }
  }, [body, isLoginRequired, loadOnStart, params, sendAPI]);

  return { sendAPI, data, isLoading, isSuccess, error };
}
