import React, { useState, useEffect } from 'react';
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
import { Line } from 'react-chartjs-2';
import { Row, Col, Card } from 'react-bootstrap';
import api from '../../../api/apiClient';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashDefault = () => {
  const [summary, setSummary] = useState({
    totalBalance: 0,
    totalUsers: 0,
    totalOfficers: 0
  });
  const [monthlyUserData, setMonthlyUserData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // uses apiClient → baseURL + withCredentials
        const summaryRes = await api.get('/manager/dashboard/summary');
        setSummary(summaryRes.data);

        const monthlyRes = await api.get(
          '/manager/dashboard/user-registrations/monthly'
        );
        setMonthlyUserData(monthlyRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchDashboardData();
  }, []);

  const dashBankData = [
    {
      title: 'Bank Balance',
      amount:
        typeof summary.totalBalance === 'number'
          ? `$${summary.totalBalance.toLocaleString()}`
          : '$0',
      icon: 'icon-dollar-sign text-c-green',
      value: summary.totalBalance > 0 ? 100 : 0,
      class: 'progress-c-theme'
    },
    {
      title: 'Users Registered',
      amount: summary.totalUsers?.toString() ?? '0',
      icon: 'icon-users text-c-blue',
      value: summary.totalUsers > 0 ? Math.min(100, summary.totalUsers / 10) : 0,
      class: 'progress-c-theme2'
    },
    {
      title: 'Officers Registered',
      amount: summary.totalOfficers?.toString() ?? '0',
      icon: 'icon-shield text-c-orange',
      value:
        summary.totalOfficers > 0 ? Math.min(100, summary.totalOfficers / 2) : 0,
      class: 'progress-c-theme'
    }
  ];

  const monthlyChartConfig = {
    labels: monthlyUserData.map((entry) => entry.month),
    datasets: [
      {
        label: 'Users Registered Per Month',
        data: monthlyUserData.map((entry) => entry.count),
        fill: false,
        tension: 0.2
      }
    ]
  };

  return (
    <>
      <Row>
        {dashBankData.map((data, idx) => (
          <Col key={idx} xl={6} xxl={4}>
            <Card>
              <Card.Body>
                <h6 className="mb-4">{data.title}</h6>
                <div className="row d-flex align-items-center">
                  <div className="col-9">
                    <h3 className="f-w-300 d-flex align-items-center m-b-0">
                      <i className={`feather ${data.icon} f-30 m-r-5`} />{' '}
                      {data.amount}
                    </h3>
                  </div>
                  <div className="col-3 text-end">
                    <p className="m-b-0">{data.value}%</p>
                  </div>
                </div>
                <div className="progress m-t-30" style={{ height: '7px' }}>
                  <div
                    className={`progress-bar ${data.class}`}
                    role="progressbar"
                    style={{ width: `${data.value}%` }}
                    aria-valuenow={data.value}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}

        <Col md={12}>
          <Card>
            <Card.Body>
              <h5 className="mb-4">Monthly User Registrations</h5>
              <Line
                data={monthlyChartConfig}
                options={{
                  responsive: true,
                  plugins: { legend: { display: true } }
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DashDefault;
