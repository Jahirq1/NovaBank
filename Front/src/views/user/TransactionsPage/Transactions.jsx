import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Modal, Row, Col, InputGroup, Alert } from 'react-bootstrap';
import { FiDollarSign, FiDownload, FiSend } from 'react-icons/fi';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';
import axios from 'axios';
import '../../../assets/scss/dashboard.scss';
import api from '../../../server/instance'
function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [backendTransactions, setBackendTransactions] = useState([]);
  const [filters, setFilters] = useState({ dateFrom: '', dateTo: '', search: '' });
  const [showSendModal, setShowSendModal] = useState(false);
  const [transferData, setTransferData] = useState({ recipientId: '', amount: '', note: '' });
  const [lekAmount, setLekAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(0.010);
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
 
  const exchangeRates = {
    EUR: 0.010, USD: 0.011, GBP: 0.0085, CHF: 0.0095, CAD: 0.014,
    AUD: 0.016, JPY: 1.50, SEK: 0.11, NOK: 0.11, DKK: 0.072,
    RUB: 0.85, TRY: 0.15, CNY: 0.075, INR: 0.85, BRL: 0.055,
    ZAR: 0.18, MXN: 0.20, SGD: 0.015, HKD: 0.082, NZD: 0.017
  };



  const handleLekChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setLekAmount(value);
    setConvertedAmount((value * exchangeRates[selectedCurrency]).toFixed(6));
  };

  const handleConvertedChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setConvertedAmount(value);
    setLekAmount((value / exchangeRates[selectedCurrency]).toFixed(2));
  };

  const handleCurrencyChange = (e) => {
    const currency = e.target.value;
    setSelectedCurrency(currency);
    setConvertedAmount((lekAmount * exchangeRates[currency]).toFixed(6));
  };

  const filteredTransactions = transactions.filter(t => {
    return (
      (filters.search === '' || t.description.toLowerCase().includes(filters.search.toLowerCase())) &&
      (filters.dateFrom === '' || new Date(t.date) >= new Date(filters.dateFrom)) &&
      (filters.dateTo === '' || new Date(t.date) <= new Date(filters.dateTo))
    );
  });

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredTransactions);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transaksionet');
    XLSX.writeFile(wb, 'transaksionet.xlsx');
  };

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/auth/me');
      setCurrentUser(res.data);

      const tx = await api.get('/user/transactions/me');
      const data = tx.data;
      
      const formatted = data.map(t => ({
        id: t.id,
        date: t.date,
        description: t.note || (
          t.senderPersonalId === t.receiverPersonalId
            ? "Transfer"
            : t.senderPersonalId === res.data.personalId
              ? `Transfer te ${t.ReceiverName}`
              : `Transfer nga ${t.senderName}`
        ),
        amount: t.amount,
        account: t.senderPersonalId === res.data.personalId ? t.receiverPersonalId : t.senderPersonalId
      }));

      setBackendTransactions(data);
      setTransactions(formatted);
    } catch (err) {
      console.error('Gabim gjatë marrjes së transaksioneve:', err);
      setError("Ndodhi një gabim gjatë marrjes së transaksioneve.");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleTransferSubmit = async () => {
    setError('');
    setSuccess('');

    if (!transferData.recipientId)
      return setError('Ju lutem vendosni Recipient ID.');
    if (!transferData.amount || isNaN(parseFloat(transferData.amount)) || parseFloat(transferData.amount) <= 0)
      return setError('Shuma duhet të jetë një numër pozitiv.');
    if (!currentUser)
      return setError('Përdoruesi nuk është autentikuar.');

    setIsSubmitting(true);
    try {
      const dataToSend = {
        SenderId: currentUser.id,
        RecipientPersonalID: transferData.recipientId,
        Amount: parseFloat(transferData.amount),
        Note: transferData.note
      };
      await api.post('/user/transactions/transfer', dataToSend);
      setSuccess('Transferimi u krye me sukses!');
      setTransferData({ recipientId: '', amount: '', note: '' });
      setShowSendModal(false);
      await fetchTransactions();
    } catch (err) {
      setError(err.response?.data?.message || 'Ndodhi një gabim gjatë transferimit.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="transactions-page">
      <h2 className="page-title"><FiDollarSign /> Transaksionet e Mia</h2>

      <div className="d-flex justify-content-between mb-4">
        <Button variant="primary" onClick={() => setShowSendModal(true)}><FiSend /> Dërgo Para</Button>
        <div>
          <Button variant="outline-secondary" onClick={exportToExcel} className="me-2"><FiDownload /> Excel</Button>
        </div>
      </div>

      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Konvertues Valutor</Card.Title>
          <Form>
            <Row>
              <Col md={5}>
                <Form.Group className="mb-3">
                  <Form.Label>Shuma në Lek</Form.Label>
                  <InputGroup>
                    <Form.Control type="number" value={lekAmount} onChange={handleLekChange} />
                    <InputGroup.Text>ALL</InputGroup.Text>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-center justify-content-center">
                <div className="text-center mt-3"><FiDollarSign size={24} className="text-muted" /></div>
              </Col>
              <Col md={5}>
                <Form.Group className="mb-3">
                  <Form.Label>Konvertuar në</Form.Label>
                  <InputGroup>
                    <Form.Control type="number" value={convertedAmount} onChange={handleConvertedChange} />
                    <Form.Select value={selectedCurrency} onChange={handleCurrencyChange} style={{ maxWidth: '120px' }}>
                      {Object.keys(exchangeRates).map(currency => (
                        <option key={currency} value={currency}>{currency}</option>
                      ))}
                    </Form.Select>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
          </Form>
          <div className="mt-3 text-muted small">
            1 Albanian Lek = {exchangeRates[selectedCurrency]} {selectedCurrency} (kurs fiks)
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>Data</th>
                <th>Përshkrimi</th>
                <th>Shuma (ALL)</th>
                <th>Llogaria</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">Nuk u gjetën transaksione.</td>
                </tr>
              ) : (
                transactions.map((t, idx) => (
                  <tr key={t.id || idx}>
                    <td>{new Date(t.date).toLocaleDateString()}</td>
                    <td>{t.description}</td>
                    <td style={{ color: t.amount > 0 ? 'green' : 'red' }}>
                      {Math.abs(t.amount).toFixed(2)}
                    </td>
                    <td>{t.account}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showSendModal} onHide={() => setShowSendModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Dërgo Para</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Recipient ID</Form.Label>
              <Form.Control
                type="text"
                value={transferData.recipientId}
                onChange={(e) => setTransferData({ ...transferData, recipientId: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Shuma</Form.Label>
              <Form.Control
                type="number"
                value={transferData.amount}
                onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Shënim</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={transferData.note}
                onChange={(e) => setTransferData({ ...transferData, note: e.target.value })}
                placeholder="Shkruani një shënim opsional"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSendModal(false)}>Anulo</Button>
          <Button variant="primary" onClick={handleTransferSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Duke dërguar...' : 'Dërgo'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default TransactionsPage;

