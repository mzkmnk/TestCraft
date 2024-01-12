import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import UserHeader from './UserHeader';

function MyPage() {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState({}); 

  useEffect(() => {
    fetch('http://localhost:8000/api/check_auth', {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        if (data.authenticated === false) {
          navigate('/login');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });

      //　グラフのデータを取得する
      fetch('http://localhost:8000/api/get_graph_data',{
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          if(data.success){
            setChartData({
              labels:data.map(item => item.date),
              datasets: [
                {
                  labels:'問題回答数',
                  data: data.map(item => item.solve_cnt),
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                  ],
                },
                {
                  labels:'問題作成数',
                  data:data.map(item => item.create_cnt),
                  backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                  ],
                  borderColor: [
                    'rgba(54, 162, 235, 1)',
                  ],
                }
              ]
            })
          }else{
            console.log("グラフデータの取得に失敗しました");
          }
        })
    }, []);
  return (
    <>
      <UserHeader />
      <div>
        {chartData.labels ? (
          <Line data={chartData} />
        ) : (
          <p>グラフデータがありません or ロード中</p>
        )}
      </div>
    </>
  );
}

export default MyPage;