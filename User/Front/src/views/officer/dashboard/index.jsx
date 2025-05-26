import React from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';

const DashDefault = () => {
  // Të dhënat statike
  const summaryData = {
    totalAmount: '1234.56',
    completedTransactions: 12,
    totalLoans: 3
  };

  const transactions = [
    {
      TransactionId: 1,
      Description: 'Pagesë për qira',
      Amount: '250.00',
      Status: 'Completed',
      Date: '2025-05-20T10:00:00Z'
    },
    {
      TransactionId: 2,
      Description: 'Dhuratë',
      Amount: '100.00',
      Status: 'Pending',
      Date: '2025-05-22T15:30:00Z'
    }
  ];

  return (
    <React.Fragment>
      <Row>
        {/* Shuma e Transaksioneve të Total */}
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
                  <p className="m-b-0">{summaryData.completedTransactions * 5}%</p>
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
                  {transactions.map((tx) => (
                    <tr key={tx.TransactionId} className="unread">
                      <td>
                        {/* Mund ta zëvendësosh këtë me një ikonë ose imazh të ngurtë */}
                        <div className="rounded-circle bg-secondary" style={{ width: '40px', height: '40px' }} />
                      </td>
                      <td>
                        <h6 className="mb-1">{tx.Description}</h6>
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
                  ))}
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
