import UserHeader from "./UserHeader";
import { Link } from "react-router-dom";
export default function Error() {
  return (
    <>
      <UserHeader />
      <div
        style={{
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "1.5rem" }}>エラーが発生しました。</p>
      </div>
    </>
  );
}
