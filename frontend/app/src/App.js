import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  navigate,
} from "react-router-dom";

import LoginForm from "./LoginForm";
import MyPage from "./Mypage";
import Signup from "./Signup";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element = {<LoginForm />} />
        <Route path="/mypage" element = {<MyPage />} />
        <Route path="/signup" element = {<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
