import React, { useEffect, useState } from "react";
import { Card, Row, Col, Badge } from "react-bootstrap";
import { FiDollarSign, FiPieChart } from "react-icons/fi";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";
import "../../../assets/scss/dashboard.scss";

/* axios instance që dërgon cookie accessToken */
const api = axios.create({
  baseURL: "http://localhost:5231/api",
  withCredentials: true,
});

export default function BalancePage() {
  const [totalBalance, setTotalBalance] = useState(0);
  const [spent, setSpent] = useState(0);
  const [limit, setLimit] = useState(5000); // fallback default

  /* ───────── leximi i të dhënave ───────── */
  useEffect(() => {
    // 1️⃣ Balanca
    api.get("/users/balance")
       .then(r => setTotalBalance(Number(r.data)))
       .catch(err => console.error("Balanca:", err));

    // 2️⃣ Shpenzimet e muajit
    api.get("/user/transactions/me/monthly-expense")
       .then(r => setSpent(Number(r.data)))
       .catch(err => console.error("Shpenzimet:", err));

    // 3️⃣ Kufiri i shpenzimit
    api.get("/users/spending-limit")
       .then(r => setLimit(Number(r.data)))
       .catch(() => {/* le default */});
  }, []);

  /* përqindja dhe ngjyra */
  const percent    = limit ? Math.min(100, (spent / limit) * 100) : 0;
  const gaugeColor =
    percent < 50 ? "#1eac52" : percent < 80 ? "#f0b518" : "#dc3545";

  /* ───────── UI ───────── */
  return (
    <div className="balance-page">
      <h2 className="page-title">
        <FiDollarSign /> Balancë
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
                Shpenzuar këtë muaj:&nbsp;
                <strong>{spent.toFixed(2)} €</strong>
              </p>
              <p className="mb-3">
                Kufiri ditor:&nbsp;
                <strong>{limit.toFixed(2)} €</strong>
              </p>
              {percent >= 100 ? (
                <p className="text-danger">
                  Kufiri u tejkalua — transferet bllokohen për 24&nbsp;h
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
