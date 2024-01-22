import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginForm from "./LoginForm.js";
import MyPage from "./Mypage.js";
import Signup from "./Signup.js";
import QuestionsAll from "./QuestionsAll.js";
import Mycreate from "./Mycreate.js";
import Editor from "./Editor.tsx";
import Mysolve from "./Mysolve.js";
import Message from "./Message.js";
import AllCompanyUsers from "./AllCompanyUsers.js";
import CompanyMessage from "./CompanyMessage.js";
import SendMessage from "./SendMessage.js";
import AddUser from "./add_user.js";
import UserChange from "./user_change.js";
import ReadWorkbook from "./ReadWorkbook.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/questionsAll" element={<QuestionsAll />} />
        <Route path="/user_change" element={<UserChange />} />
        <Route path="/editor" element={<Editor />} />
        
        <Route
          path="/editor/:workbookId"
          element={<ReadWorkbook next={"Editor"} />}
        />
        <Route path="/mypage/mycreate" element={<Mycreate />} />
        <Route path="/add_user" element = {<AddUser />} />
        <Route path="/send_message" element={<SendMessage />} />
        <Route path="/all_company_users" element={<AllCompanyUsers />} />
        <Route path="/mypage/mysolve" element={<Mysolve />} />
        <Route path="/mypage/message" element={<Message />} />
        <Route path="/mypage/company_message" element={<CompanyMessage />} />
        <Route
          path="/solve/:workbookId"
          element={<ReadWorkbook next={"QuestionsSolve"} />}
        />
      </Routes>
    </Router>
  );
}

export default App;