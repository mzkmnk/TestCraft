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
import QuestionsAll from "./QuestionsAll";
import Mycreate from "./Mycreate";
import Editor from "./Editor.tsx";
import Mysolve from "./Mysolve";
import Message from "./Message.js";
import ReadWorkbook from "./ReadWorkbook.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/questionsAll" element={<QuestionsAll />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/editor/:workbookId" element={<ReadWorkbook />} />
        <Route path="/mypage/mycreate" element={<Mycreate />} />
        <Route path="/mypage/mysolve" element={<Mysolve />} />
        <Route path="/mypage/message" element={<Message />} />
      </Routes>
    </Router>
  );
}

export default App;
