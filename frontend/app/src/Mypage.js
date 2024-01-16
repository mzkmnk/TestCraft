import React, {
  useState,
  useEffect
} from 'react';

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
        },
        ticks: {
          color: "#000",
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'count'
        },
        ticks: {
          color: '#000',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    plugins:{
      legend: {
        position: 'top',
        labels: {
          color: '#000',
          boxWidth: 20,
        },
      },
    },
    toolbar: {
      enabled: true,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: 'rgba(255, 255, 255, 0.3)',
      borderWidth: 1
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <>
      <UserHeader />
      <div style={{ height: '400px', width: '100%'}}>
        <h2>ユーザアクティビティグラフ</h2>
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