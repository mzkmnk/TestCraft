import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import TopPage from "./TopPage.js";
import LoginForm from "./LoginForm.js";
import MyPage from "./Mypage.js";
import Signup from "./Signup.js";
import QuestionsAll from "./QuestionsAll.js";
import Mycreate from "./Mycreate.js";
import Editor from "./EditorApp/EditorApp.tsx";
import Solved from "./Solved.js";
import Mysolve from "./Mysolve.js";
import Message from "./Message.js";
import AllCompanyUsers from "./AllCompanyUsers.js";
import CompanyMessage from "./CompanyMessage.js";
import SendMessage from "./SendMessage.js";
import AddUser from "./add_user.js";
import ReadWorkbook from "./ReadWorkbook.js";
import EmailVerification from "./email_verification";
import ChangePassSend from "./change_pass_send";
import ChangePass from "./change_pass";
import ChangeProfilePage from "./ChangeProfile.tsx";
import ProfilePage from "./profile.tsx";
import Sns from "./Sns.js";
import PostDetail from "./postDetail.js";
import { PlanTest } from "./PlanTest.js";
import { GroupTestALL } from "./GroupTestAll.js";
import { GroupTest } from "./GroupTest.js";
import Error from "./Error.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TopPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/mypage" element={<MyPage />} />

        <Route path="/change_profile" element={<ChangeProfilePage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/questionsAll" element={<QuestionsAll />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/email_verification" element={<EmailVerification />} />
        <Route path="/change_pass_send" element={<ChangePassSend />} />
        <Route path="/change_pass" element={<ChangePass />} />

        <Route
          path="/editor/:workbookId"
          element={<ReadWorkbook nextAppName={"Editor"} />}
        />
        <Route path="/mypage/mycreate" element={<Mycreate />} />
        <Route path="/add_user" element={<AddUser />} />
        <Route path="/send_message" element={<SendMessage />} />
        <Route path="/all_company_users" element={<AllCompanyUsers />} />
        <Route path="/mypage/mysolve" element={<Mysolve />} />
        <Route path="/mypage/message" element={<Message />} />
        <Route path="/mypage/company_message" element={<CompanyMessage />} />
        <Route
          path="/solve/:workbookId"
          element={<ReadWorkbook nextAppName={"AnswerApp"} />}
        />
        <Route path="/solved/:workbookId/:solved_count" element={<Solved />} />
        <Route path="/sns" element={<Sns />} />
        <Route path="/post_detail/:postId" element={<PostDetail />} />

        <Route path="/error" element={<Error />} />
        <Route path="/plan_test" element={<PlanTest />} />
        <Route path="/group_test_all" element={<GroupTestALL />} />
        <Route path="/group_test/:groupId/:workbookId/:userId" element={<GroupTest />} />
      </Routes>
    </Router>
  );
}

export default App;
