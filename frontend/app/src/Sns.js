import React from "react";

import UserHeader from "./UserHeader";
import Sidebar from "./components/Sidebar.tsx";

function Sns() {
  return (
    <>
        <UserHeader position="fixed"/>
        <Sidebar />
    </>
  );
}

export default Sns;