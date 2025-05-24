import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Tabs, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';
import avatar1 from '../../../assets/images/user/avatar-1.jpg';
import avatar2 from '../../../assets/images/user/avatar-2.jpg';
import avatar3 from '../../../assets/images/user/avatar-3.jpg';
import { Chart as ChartJS } from 'chart.js/auto';


const dashBankData = [
  { title: 'Bank Balance', amount: '$500,000.00', icon: 'icon-dollar-sign text-c-green', value: 80, class: 'progress-c-theme' },
  { title: 'Users Registered', amount: '1,250', icon: 'icon-users text-c-blue', value: 65, class: 'progress-c-theme2' },
  { title: 'Officers Registered', amount: '150', icon: 'icon-shield text-c-orange', value: 50, color: 'progress-c-theme' },
  { title: 'Monthly Transactions', amount: '$120,000.00', icon: 'icon-arrow-up text-c-green', value: 60, class: 'progress-c-theme' },
  { title: 'Yearly Transactions', amount: '$1,500,000.00', icon: 'icon-arrow-down text-c-red', value: 75, class: 'progress-c-theme2' }
];

const DashDefault = () => {
  const [transactions, setTransactions] = useState([]);
  const [loanData, setLoanData] = useState([]);

  useEffect(() => {
    setTransactions([
      { date: '2025-04-01', deposit: 5000, withdrawal: 3000 },
      { date: '2025-04-02', deposit: 6000, withdrawal: 1000 },
      { date: '2025-04-03', deposit: 7000, withdrawal: 2000 }
    ]);
    setLoanData([
      { customer: 'Customer 1', loanGiven: 10000, amountRepaid: 3000 },
      { customer: 'Customer 2', loanGiven: 5000, amountRepaid: 5000 }
    ]);
  }, []);

  const transactionChartData = {
    labels: transactions.map(t => t.date),
    datasets: [
      {
        label: 'Deposits',
        data: transactions.map(t => t.deposit),
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
      {
        label: 'Withdrawals',
        data: transactions.map(t => t.withdrawal),
        borderColor: 'rgba(255,99,132,1)',
        fill: false,
      }
    ]
  };

  const loanChartData = {
    labels: loanData.map(l => l.customer),
    datasets: [
      {
        label: 'Loan Given',
        data: loanData.map(l => l.loanGiven),
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
      {
        label: 'Amount Repaid',
        data: loanData.map(l => l.amountRepaid),
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
      }
    ]
  };

  return (
    <React.Fragment>
      <Row>
        {dashBankData.map((data, index) => (
          <Col key={index} xl={6} xxl={4}>
            <Card>
              <Card.Body>
                <h6 className="mb-4">{data.title}</h6>
                <div className="row d-flex align-items-center">
                  <div className="col-9">
                    <h3 className="f-w-300 d-flex align-items-center m-b-0">
                      <i className={`feather ${data.icon} f-30 m-r-5`} /> {data.amount}
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

        {/* Daily Transactions Chart */}
        <Col md={6} xl={8}>
          <Card>
            <Card.Body>
              <h5 className="mb-4">Daily Transactions</h5>
              <Line data={transactionChartData} options={{ responsive: true, scales: { x: { beginAtZero: true } } }} />
            </Card.Body>
          </Card>
        </Col>

        {/* Loan Chart */}
        <Col md={6} xl={4}>
          <Card>
            <Card.Body>
              <h5 className="mb-4">Loans Given vs. Repaid</h5>
              <Bar data={loanChartData} options={{ responsive: true, scales: { x: { beginAtZero: true } } }} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
}

export default DashDefault;
