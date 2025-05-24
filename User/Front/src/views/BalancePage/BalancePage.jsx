import React from 'react';
import { Card, Row, Col, ProgressBar } from 'react-bootstrap';
import { FiPieChart, FiDollarSign, FiCreditCard, FiBarChart2 } from 'react-icons/fi';
import BarDiscreteChart from '../charts/nvd3-chart/chart/PieDonutChart.jsx'; // Import the chart component
import '../../assets/scss/dashboard.scss';

const BalancePage = () => {
  // Sample data
  const balanceData = {
    totalBalance: '$27,202.24',
    accounts: [
      { id: 1, name: 'Llogaria Kryesore', balance: '$15,420.00', number: '•••• 4567', type: 'VISA' },
      { id: 2, name: 'Kursimet', balance: '$8,245.00', number: '•••• 8910', type: 'Mastercard' },
      { id: 3, name: 'Investimet', balance: '$3,537.24', number: '•••• 1121', type: 'Investime' }
    ],
    spending: {
      limit: '$5,000',
      used: '$3,245',
      percentage: 65
    },
    // Chart data formatted for BarDiscreteChart
    expenses: [
      { name: 'Jan', ushqim: 400, blerje: 240, fatura: 240 },
      { name: 'Feb', ushqim: 300, blerje: 139, fatura: 221 },
      { name: 'Mar', ushqim: 200, blerje: 980, fatura: 229 },
      { name: 'Apr', ushqim: 278, blerje: 390, fatura: 200 },
      { name: 'Maj', ushqim: 189, blerje: 480, fatura: 218 },
      { name: 'Qer', ushqim: 239, blerje: 380, fatura: 250 }
    ]
  };

  // Chart configuration
  const chartConfig = {
    key: 'expense-chart',
    title: 'Shpenzimet e Fundit',
    data: balanceData.expenses,
    categories: ['ushqim', 'blerje', 'fatura'],
    colors: ['#7e37d8', '#1eac52', '#f0b518'],
    yAxisLabel: 'Shuma ($)'
  };

  return (
    <div className="balance-page">
      <h2 className="page-title"><FiDollarSign /> Balanca Juaj</h2>
      
      {/* Balanca Totale */}
      <Card className="summary-card mb-4">
        <Card.Body>
          <Card.Title>Balancë Totale</Card.Title>
          <Card.Text className="balance-amount">{balanceData.totalBalance}</Card.Text>
        </Card.Body>
      </Card>

      {/* Llogaritë */}
      <h4 className="section-title"><FiCreditCard /> Llogaritë e Mia</h4>
      <Row>
        {balanceData.accounts.map(account => (
          <Col md={4} key={account.id} className="mb-3">
            <Card className="account-card">
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <div>
                    <h5>{account.name}</h5>
                    <p className="account-number">{account.number}</p>
                  </div>
                  <span className="account-type">{account.type}</span>
                </div>
                <div className="balance-display">
                  {account.balance}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Shpenzimet e Fundit - Using the template's chart component */}
      <h4 className="section-title mt-4"><FiBarChart2 /> Shpenzimet e Fundit</h4>
      <Card className="mb-4">
        <Card.Body>
          <BarDiscreteChart {...chartConfig} />
          
          {/* Table version as fallback */}
          <div className="mt-4">
            <h5>Detajet</h5>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Muaji</th>
                  <th>Ushqim</th>
                  <th>Blerje</th>
                  <th>Fatura</th>
                </tr>
              </thead>
              <tbody>
                {balanceData.expenses.map((month, i) => (
                  <tr key={i}>
                    <td>{month.name}</td>
                    <td>${month.ushqim}</td>
                    <td>${month.blerje}</td>
                    <td>${month.fatura}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>

      {/* Kufiri i Shpenzimeve */}
      <h4 className="section-title"><FiPieChart /> Kufiri i Shpenzimeve</h4>
      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between mb-2">
            <span>Shpenzuar: {balanceData.spending.used}</span>
            <span>Kufiri: {balanceData.spending.limit}</span>
          </div>
          <ProgressBar 
            now={balanceData.spending.percentage} 
            label={`${balanceData.spending.percentage}%`} 
            variant={balanceData.spending.percentage > 80 ? 'danger' : 'primary'}
          />
        </Card.Body>
      </Card>
    </div>
  );
};

export default BalancePage;