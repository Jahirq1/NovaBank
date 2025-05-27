import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { getUserId, getUserRole } from '../../../session/session';

const DashDefault = () => {
  const [transactions, setTransactions] = useState([]);
  const [summaryData, setSummaryData] = useState({
    totalAmount: 0,
    completedTransactions: 0,
    totalLoans: 0,
  });

  const navigate = useNavigate();
  const userId = getUserId();

  // Verifikimi i sesionit
  useEffect(() => {
    const role = getUserRole();
    if (!userId || !role) {
      navigate('/login/signin');
    }
  }, [navigate, userId]);

  // Merr të dhënat për dashboard
  useEffect(() => {
    const fetchAllData = async () => {
      if (!userId || isNaN(parseInt(userId))) {
        console.error("UserId mungon ose është i pavlefshëm.");
        return;
      }

      try {
        // Merr transaksionet
        const transactionsRes = await axios.get(`http://localhost:5231/api/transactions/my-transactions?userId=${userId}`);
        const transactions = transactionsRes.data;

        setTransactions(transactions);

        // Merr total amount të dërguar brenda vitit
        const totalSentRes = await axios.get(`http://localhost:5231/api/transactions/total-sent-amount?userId=${userId}`);
        const totalSentAmount = totalSentRes.data.totalAmount;

        // Merr numrin e transaksioneve të dërguara
        const countRes = await axios.get(`http://localhost:5231/api/transactions/transaction-count?userId=${userId}`);
        const totalSentTransactions = countRes.data.totalSentTransactions;

        // Përditëso të dhënat
        setSummaryData(prev => ({
          ...prev,
          totalAmount: totalSentAmount.toFixed(2),
          completedTransactions: totalSentTransactions
        }));
      } catch (error) {
        console.error("Gabim gjatë marrjes së të dhënave:", error);
      }
    };

    fetchAllData();
  }, [userId]);

  // Merr numrin e kredive
  useEffect(() => {
    const fetchLoansCount = async () => {
      if (!userId || isNaN(parseInt(userId))) return;

      try {
        const response = await axios.get(`http://localhost:5231/api/loans/my-loans-count?userId=${userId}`);
        setSummaryData(prev => ({
          ...prev,
          totalLoans: response.data.totalLoans
        }));
      } catch (error) {
        console.error("Gabim gjatë marrjes së të dhënave për kredi:", error);
      }
    };

    fetchLoansCount();
  }, [userId]);

  return (
    <React.Fragment>
      <Row>
        {/* Shuma e Transaksioneve të Dërguara */}
        <Col xs={12} md={6} xl={4}>
          <Card>
            <Card.Body>
              <h6 className="mb-4">Shuma e Transaksioneve të Dërguara (1 vit)</h6>
              <div className="row d-flex align-items-center">
                <div className="col-9">
                  <h3 className="f-w-300 d-flex align-items-center m-b-0">
                    <i className="feather icon-arrow-up text-c-green f-30 m-r-5" />
                    {summaryData.totalAmount}€
                  </h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Numri i Transaksioneve të Dërguara */}
        <Col xs={12} md={6} xl={4}>
          <Card>
            <Card.Body>
              <h6 className="mb-4">Numri i Transaksioneve të Dërguara</h6>
              <div className="row d-flex align-items-center">
                <div className="col-9">
                  <h3 className="f-w-300 d-flex align-items-center m-b-0">
                    <i className="feather icon-credit-card text-c-green f-30 m-r-5" />
                    {summaryData.completedTransactions}
                  </h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Numri i Kredive të Lëshuara */}
        <Col xs={12} md={6} xl={4}>
          <Card>
            <Card.Body>
              <h6 className="mb-4">Numri i Kredive të Lëshuara</h6>
              <div className="row d-flex align-items-center">
                <div className="col-9">
                  <h3 className="f-w-300 d-flex align-items-center m-b-0">
                    <i className="feather icon-file-plus text-c-blue f-30 m-r-5" />
                    {summaryData.totalLoans}
                  </h3>
                </div>
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
              <tbody>
  {transactions.length === 0 ? (
    <tr>
      <td colSpan="4" className="text-center">Nuk ka transaksione.</td>
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
    </React.Fragment>
  );
};

export default DashDefault;
