import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { getUserId, getUserRole, clearUserSession } from '../../../session/session'; // rregullo path sipas strukturës tënde


const DashDefault = () => {
  const [transactions, setTransactions] = useState([]);
  const [summaryData, setSummaryData] = useState({
    totalAmount: 0,
    completedTransactions: 0,
    totalLoans: 0,
  });
  const navigate = useNavigate();
  useEffect(() => {
    const userId = getUserId();
    const role = getUserRole();

    if (!userId || !role) {
      navigate('/login/signin');
    }
  }, [navigate]);
  

  // Merr të dhënat për transaksionet
  useEffect(() => {
    const fetchTransactions = async () => {
      const userId = localStorage.getItem('userId');
      try {
        const response = await axios.get(`http://localhost:5231/api/transactions/my-transactions?userId=${userId}`);
        setTransactions(response.data);
    
        const totalAmount = response.data.reduce((acc, tx) => acc + parseFloat(tx.Amount), 0);
        const completedTransactions = response.data.filter(tx => tx.Status === 'Completed').length;
    
        setSummaryData(prev => ({
          ...prev,
          totalAmount: totalAmount.toFixed(2),
          completedTransactions
        }));
      } catch (error) {
        console.error("Gabim gjatë marrjes së të dhënave:", error);
      }
    };
    

    fetchTransactions();
  }, []);

  // Merr numrin e kredive
  useEffect(() => {
    const fetchLoansCount = async () => {
      const userId = localStorage.getItem('userId');
      try {
        const response = await axios.get(`http://localhost:5231/api/loans/my-loans-count?userId=${userId}`);
        console.log('Total Loans:', response.data.totalLoans);
      } catch (error) {
        console.error("Gabim gjatë marrjes së të dhënave:", error);
      }
    };
    

    fetchLoansCount();
  }, []);

  return (
    <React.Fragment>
      <Row>
        {/* Shuma e Transaksioneve */}
        <Col xs={12} md={6} xl={4}>
          <Card>
            <Card.Body>
              <h6 className="mb-4">Shuma e Transaksioneve të Total</h6>
              <div className="row d-flex align-items-center">
                <div className="col-9">
                  <h3 className="f-w-300 d-flex align-items-center m-b-0">
                    <i className="feather icon-arrow-up text-c-green f-30 m-r-5" />
                    ${summaryData.totalAmount}
                  </h3>
                </div>
                <div className="col-3 text-end">
                  <p className="m-b-0">{summaryData.completedTransactions}%</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Numri i Transaksioneve të Kompletuara */}
        <Col xs={12} md={6} xl={4}>
          <Card>
            <Card.Body>
              <h6 className="mb-4">Numri i Transaksioneve të Kompletuara</h6>
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
                      <tr key={tx.TransactionId} className="unread">
                        <td>
                          <img className="rounded-circle" style={{ width: '40px' }} src={avatar1} alt="user" />
                        </td>
                        <td>
                          <h6 className="mb-1">{tx.Description || 'Transaksion'}</h6>
                          <p className="m-0">{tx.Amount} €</p>
                        </td>
                        <td>
                          <h6 className="text-muted">
                            <i className={`fa fa-circle ${tx.Status === 'Completed' ? 'text-c-green' : 'text-c-red'} f-10 m-r-15`} />
                            {new Date(tx.Date).toLocaleString()}
                          </h6>
                        </td>
                        <td>
                          <span className="label theme-bg2 text-white f-12">
                            {tx.Status}
                          </span>
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
