import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import UserHeader from './UserHeader';
import 'chartjs-adapter-date-fns';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


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
        .then(userData => {
          console.log(userData);
          if(userData.success && userData.data){
            const graphdata = userData.data;
            setChartData({
              labels:graphdata.map(item => item.date),
              datasets: [
                {
                  label:'問題回答数',
                  data: graphdata.map(item => item.solve_cnt),
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                  ],
                },
                {
                  label:'問題作成数',
                  data:graphdata.map(item => item.create_cnt),
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
  }, [navigate]);

  const options = {
    scales: {
      x: {
        type: 'category',
        time: {
          display: true,
          text: '日付'
        },
        title: {
          display: true,
          text: 'date'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'count'
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false
  };

  return (
    <>
      <UserHeader />
      <div style={{ height: '400px', width: '100%' }}>
        {chartData.labels ? (
          <Line data={chartData} options={options} />
        ) : (
          <p>グラフデータがありません or ロード中</p>
        )}
      </div>
    </>
  );
}

export default MyPage;