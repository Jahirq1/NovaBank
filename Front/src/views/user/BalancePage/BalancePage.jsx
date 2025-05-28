import React, { useEffect, useState } from "react";
import { Card, Row, Col, Badge, Table } from "react-bootstrap";
import {
  FiDollarSign,
  FiPieChart,
  FiBarChart2,
} from "react-icons/fi";
import {
  CircularProgressbarWithChildren,
  buildStyles} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";
import "../../../assets/scss/dashboard.scss";

/* helper */
const getUserId = () => Number(localStorage.getItem("userId") ?? 0);

export default function BalancePage() {
  const [totalBalance, setTotalBalance] = useState(0);
  const [expenses, setExpenses]       = useState([]);  // [{month, ushqim, blerje, fatura}]
  const [limit,    setLimit]          = useState(5000);   // default 5 000 €
  const [spent,    setSpent]          = useState(0);

  /* ───────── leximi i të dhënave ───────── */
  useEffect(() => {
    const id = getUserId();
    if (!id) return;

    /* 1️⃣ balanca */
    axios
      .get(`http://localhost:5231/api/Users/balance/${id}`)
      .then(r => setTotalBalance(Number(r.data)))
      .catch(err => console.error("Balanca:", err));

    /* 2️⃣ shpenzimet e muajit */
    axios
  .get(`http://localhost:5231/api/user/transactions/monthly-expense/${id}`)
  .then(r => setSpent(Number(r.data)))
  .catch(err => console.error("Shpenzimet:", err));

    /* 3️⃣ kufiri mujor (nëse ke endpoint-in) */
    axios
      .get(`http://localhost:5231/api/Users/spending-limit/${id}`)
      .then(r => setLimit(Number(r.data)))   // p.sh. 5000
      .catch(() => {/* le default */});
  }, []);

  /* llogarisim totalin e shpenzuar sapo vjen lista */
  useEffect(() => {
    const total = expenses.reduce(
      (s, m) => s + m.ushqim + m.blerje + m.fatura,
      0
    );
    setSpent(total);
  }, [expenses]);

  /* përqindja ndaj kufirit */
  const percent    = limit ? Math.min(100, (spent / limit) * 100) : 0;
  const gaugeColor =
    percent < 50 ? "#1eac52" : percent < 80 ? "#f0b518" : "#dc3545";

  /* ───────── UI ───────── */
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

      {/* Kufiri i Shpenzimeve */}
      <h4 className="section-title">
        <FiPieChart /> Kufiri i Shpenzimeve
      </h4>
      <Card className="mb-4">
        <Card.Body>
          <Row className="align-items-center">
            {/* Gauge */}
            <Col md={4} className="text-center mb-3 mb-md-0">
              <div style={{ width: 180, margin: "0 auto" }}>
                <CircularProgressbarWithChildren
                  value={percent}
                  strokeWidth={12}
                  styles={buildStyles({
                    pathColor: gaugeColor,
                    trailColor: "#e9ecef",
                  })}
                >
                  <div style={{ fontSize: 22 }}>
                    <strong>{percent.toFixed(0)}%</strong>
                  </div>
                </CircularProgressbarWithChildren>
              </div>
              {percent >= 100 && (
                <Badge bg="danger" className="mt-2">
                  Tejkaluar
                </Badge>
              )}
            </Col>

            {/* Detaje */}
            <Col md={8}>
              <p className="mb-1">
                Shpenzuar këtë dite:&nbsp;
                <strong>{spent.toFixed(2)} €</strong>
              </p>
              <p className="mb-3">
                Kufiri Ditor:&nbsp;
                <strong>{limit.toFixed(2)} €</strong>
              </p>
              {percent >= 100 ? (
                <p className="text-danger">
                  Kufiri u tejkalua — transferet bllokohen për 24 h
             
                </p>
              ) : (
                <p className="text-muted">
                  Mund të shpenzosh edhe&nbsp;
                  <strong>{(limit - spent).toFixed(2)} €</strong>.
                </p>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

    
    </div>
  );
}
