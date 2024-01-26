import React, { useEffect, useState } from "react";
import UserHeader from "./UserHeader";
import { useNavigate,useParams } from "react-router-dom";

function Solved() {
  const navigate = useNavigate();
  const {workbookId} = useParams();
  useEffect(() => {
    fetch("http://localhost:8000/api/check_auth", {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.authenticated === false) {
          navigate("/login");
        } else {
          fetch(`http://localhost:8000/api/solve_detail/${workbookId}`, {
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          })
            .then((response) => response.json())
            .then((data) => {

              if (data.success) {
                console.log(data);
              }else{
                console.error("Error:", data.error);
              }
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [navigate,workbookId]);


  return (
    <>
      <UserHeader />
    </>
  );
}

export default Solved;
