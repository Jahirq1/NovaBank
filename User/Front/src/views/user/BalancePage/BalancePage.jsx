import React, { useEffect, useState } from 'react';
import { Card, Row, Col, ProgressBar, Table } from 'react-bootstrap';
import { FiDollarSign, FiPieChart, FiBarChart2 } from 'react-icons/fi';
import axios from 'axios';
import '../../../assets/scss/dashboard.scss';

/* helper për userId-në e ruajtur në localStorage */
const getUserId = () => Number(localStorage.getItem('userId') ?? 0);

const BalancePage = () => {
  /* ───────────── state ───────────── */
  const [totalBalance, setTotalBalance] = useState(0);
  const [expenses,     setExpenses]     = useState([]);   // aggre­guar në backend
  const [limit,        setLimit]        = useState(5000); // shembull - merre nga API nëse ke

  /* ───────────── efekt: lexon të dhënat ───────────── */
  useEffect(() => {
    const id = getUserId();
    if (!id) return;

    /* 1️⃣ balanca totale */
    axios.get(`https://localhost:5001/api/Users/balance/${id}`)
         .then(r => setTotalBalance(Number(r.data)))
         .catch(err => console.error('Balanca:', err));

    /* 2️⃣ shpenzimet e fundit (backend kthen array me muaj + kategori) */
    axios.get(`https://localhost:5001/api/Transactions/last-expenses/${id}`)
         .then(r => setExpenses(r.data))    // pritet [{month:'Jan', ushqim:400, blerje:240, fatura:100}, …]
         .catch(err => console.error('Shpenzimet:', err));

    /* 3️⃣ kufiri mujor (opsionale) */
    axios.get(`https://localhost:5001/api/Users/spending-limit/${id}`)
         .then(r => setLimit(Number(r.data)))
         .catch(() => {/* nëse s’ka endpoint, leje default */});
  }, []);

  /* llogarit të shpenzuarën & përqindjen */
  const spent =
    expenses.reduce((s, m) =>
      s + (m.ushqim ?? 0) + (m.blerje ?? 0) + (m.fatura ?? 0), 0);
  const percent = limit ? Math.min(100, (spent / limit) * 100) : 0;

  /* ───────────── UI ───────────── */
  return (
    <div className="balance-page">
      <h2 className="page-title">
        <FiDollarSign /> Balanca Juaj
      </h2>

      {/* Balanca Totale */}
      <Card className="summary-card mb-4">
        <Card.Body>
          <Card.Title>Balancë Totale</Card.Title>
          <Card.Text className="balance-amount">
            {totalBalance.toFixed(2)} €
          </Card.Text>
        </Card.Body>
      </Card>

      {/* Shpenzimet e Fundit – tabelë e thjeshtë */}
      <h4 className="section-title mt-4">
        <FiBarChart2 /> Shpenzimet e Fundit
      </h4>
      <Card className="mb-4">
        <Card.Body>
          {expenses.length === 0 ? (
            <p>Nuk ka të dhëna.</p>
          ) : (
            <Table bordered responsive>
              <thead>
                <tr>
                  <th>Muaji</th>
                  <th>Ushqim (€)</th>
                  <th>Blerje (€)</th>
                  <th>Fatura (€)</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((m, i) => (
                  <tr key={i}>
                    <td>{m.month}</td>
                    <td>{(m.ushqim  ?? 0).toFixed(2)}</td>
                    <td>{(m.blerje  ?? 0).toFixed(2)}</td>
                    <td>{(m.fatura  ?? 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Kufiri i Shpenzimeve */}
      <h4 className="section-title">
        <FiPieChart /> Kufiri i Shpenzimeve
      </h4>
      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between mb-2">
            <span>Shpenzuar: {spent.toFixed(2)} €</span>
            <span>Kufiri: {limit.toFixed(2)} €</span>
          </div>

          <ProgressBar
            now={percent}
            label={`${percent.toFixed(0)}%`}
            variant={percent > 80 ? 'danger' : 'primary'}
          />
        </Card.Body>
      </Card>
    </div>
  );
};

export default BalancePage;
