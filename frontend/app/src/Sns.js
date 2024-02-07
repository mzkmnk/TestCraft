import React from "react";

import UserHeader from "./UserHeader";
import Sidebar from "./components/Sidebar.js";

function Sns() {
  return (
    <>
        <UserHeader position="fixed"/>
        <Sidebar />
    </>
  );
}

export default Sns;