import { useState, useEffect } from "react";

import UserHeader from "./UserHeader";
import { useAPI } from "./hooks/useAPI";

export function GroupTestALL() {
    const [groupTests, setGroupTests] = useState([]);

  return (
    <>
      <UserHeader />
      </>
  );
}
