import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import api from '../../../server/instance'; // përdor api të importuar

const DashDefault = () => {
  const [transactions, setTransactions] = useState([]);
  const [summaryData, setSummaryData] = useState({
    totalAmount: '0.00',
    completedTransactions: 0,
    totalLoans: 0,
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Merr transaksionet
        const transactionsRes = await api.get('/officer/transactions/my-transactions');
        // Merr shumën totale të transaksioneve të dërguara
        const totalSentRes = await api.get('/officer/transactions/total-sent-amount');
        // Merr numrin e transaksioneve të dërguara
        const countRes = await api.get('/officer/transactions/transaction-count');
        // Merr numrin e kredive të lëshuara
        const loansRes = await api.get('/officer/loans/my-loans-count');

        setTransactions(transactionsRes.data);

        setSummaryData({
          totalAmount: parseFloat(totalSentRes.data.totalAmount).toFixed(2),
          completedTransactions: countRes.data.totalSentTransactions,
          totalLoans: loansRes.data.totalLoans,
        });
      } catch (error) {
        console.error('Gabim gjatë marrjes së të dhënave:', error.response?.data || error.message);
      }
    };

    fetchAllData();
  }, []);

  return (
    <>
      <Row>
        {/* Shuma e Transaksioneve të Dërguara */}
        <Col xs={12} md={6} xl={4}>
          <Card>
            <Card.Body>
              <h6 className="mb-4">Shuma e Transaksioneve të Dërguara (1 vit)</h6>
              <div className="d-flex align-items-center">
                <h3 className="f-w-300 d-flex align-items-center m-b-0">
                  <i className="feather icon-arrow-up text-c-green f-30 m-r-5" />
                  {summaryData.totalAmount}€
                </h3>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Numri i Transaksioneve të Dërguara */}
        <Col xs={12} md={6} xl={4}>
          <Card>
            <Card.Body>
              <h6 className="mb-4">Numri i Transaksioneve të Dërguara</h6>
              <div className="d-flex align-items-center">
                <h3 className="f-w-300 d-flex align-items-center m-b-0">
                  <i className="feather icon-credit-card text-c-green f-30 m-r-5" />
                  {summaryData.completedTransactions}
                </h3>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Numri i Kredive të Lëshuara */}
        <Col xs={12} md={6} xl={4}>
          <Card>
            <Card.Body>
              <h6 className="mb-4">Numri i Kredive të Lëshuara</h6>
              <div className="d-flex align-items-center">
                <h3 className="f-w-300 d-flex align-items-center m-b-0">
                  <i className="feather icon-file-plus text-c-blue f-30 m-r-5" />
                  {summaryData.totalLoans}
                </h3>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Tabela e Transaksioneve */}
        <Col xs={12}>
          <Card className="Recent-Users widget-focus-lg">
            <Card.Header>
              <Card.Title as="h5">Transaksionet e mia</Card.Title>
            </Card.Header>
            <Card.Body className="px-0 py-2">
              <Table responsive hover className="recent-users">
                <thead>
                  <tr>
                    <th>Dërguesi</th>
                    <th>Shuma e transaksionit</th>
                    <th>Data e transaksionit</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center">Nuk ka transaksione.</td>
                    </tr>
                  ) : (
                    transactions.map((tx, idx) => (
                      <tr key={tx.transactionId || idx} className="unread">
                        <td>
                          <h6 className="mb-1">Nga: <strong>{tx.senderName || 'N/A'}</strong></h6>
                          <p className="m-0">Për: <strong>{tx.receiverName || 'N/A'}</strong></p>
                        </td>
                        <td>{tx.amount} €</td>
                        <td>
                          <h6 className="text-muted">
                            <i className="fa fa-circle text-c-blue f-10 m-r-15" />
                            {new Date(tx.date).toLocaleString()}
                          </h6>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DashDefault;
