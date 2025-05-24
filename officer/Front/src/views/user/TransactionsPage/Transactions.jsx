import React, { useState } from 'react';
import { Card, Table, Button, Form, Modal, Row, Col, InputGroup } from 'react-bootstrap';
import { FiDollarSign, FiCreditCard, FiFilter, FiDownload, FiSend, FiSearch } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import '../../../assets/scss/dashboard.scss';

const TransactionsPage = () => {
  // Sample data
  const [transactions, setTransactions] = useState([
    { id: 1, date: '11 Prill 2025', description: 'Blerje ne supermarket', category: 'Ushqim', amount: -125.50, account: '•••• 4567' },
    { id: 2, date: '10 Prill 2025', description: 'Pagesa fature', category: 'Fatura', amount: -85.00, account: '•••• 8910' },
    { id: 3, date: '09 Prill 2025', description: 'Transfer nga shoku', category: 'Të ardhura', amount: 250.00, account: '•••• 1121' },
    { id: 4, date: '08 Prill 2025', description: 'Blerje online', category: 'Blerje', amount: -65.99, account: '•••• 4567' },
    { id: 5, date: '07 Prill 2025', description: 'Rroga', category: 'Të ardhura', amount: 1200.00, account: '•••• 1121' }
  ]);

  // Filter states
  const [filters, setFilters] = useState({
    category: '',
    dateFrom: '',
    dateTo: '',
    search: ''
  });

  // Send money modal
  const [showSendModal, setShowSendModal] = useState(false);
  const [transferData, setTransferData] = useState({
    recipient: '',
    amount: '',
    note: ''
  });

  // Currency converter states
  const [lekAmount, setLekAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(0.010);
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');
  
  // Exchange rates (sample data - in a real app you would fetch these)
  const exchangeRates = {
    'EUR': 0.010,    // Euro
    'USD': 0.011,    // US Dollar
    'GBP': 0.0085,   // British Pound
    'CHF': 0.0095,   // Swiss Franc
    'CAD': 0.014,    // Canadian Dollar
    'AUD': 0.016,    // Australian Dollar
    'JPY': 1.50,     // Japanese Yen
    'SEK': 0.11,     // Swedish Krona
    'NOK': 0.11,     // Norwegian Krone
    'DKK': 0.072,    // Danish Krone
    'RUB': 0.85,     // Russian Ruble
    'TRY': 0.15,     // Turkish Lira
    'CNY': 0.075,    // Chinese Yuan
    'INR': 0.85,     // Indian Rupee
    'BRL': 0.055,    // Brazilian Real
    'ZAR': 0.18,     // South African Rand
    'MXN': 0.20,     // Mexican Peso
    'SGD': 0.015,    // Singapore Dollar
    'HKD': 0.082,    // Hong Kong Dollar
    'NZD': 0.017     // New Zealand Dollar
  };

  // Handle currency conversion
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

  // Rest of your existing code remains the same...
  // Process data for charts
  const processChartData = () => {
    const categories = {};
    
    transactions.forEach(t => {
      if (!categories[t.category]) {
        categories[t.category] = 0;
      }
      categories[t.category] += Math.abs(t.amount);
    });

    return Object.entries(categories).map(([name, value]) => ({
      name,
      value
    }));
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(t => {
    return (
      (filters.category === '' || t.category === filters.category) &&
      (filters.search === '' || 
       t.description.toLowerCase().includes(filters.search.toLowerCase())) &&
      (filters.dateFrom === '' || new Date(t.date) >= new Date(filters.dateFrom)) &&
      (filters.dateTo === '' || new Date(t.date) <= new Date(filters.dateTo))
    );
  });

  // Export to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredTransactions);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transaksionet");
    XLSX.writeFile(wb, "transaksionet.xlsx");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Lista e Transaksioneve', 14, 16);
    doc.autoTable({
      head: [['Data', 'Përshkrimi', 'Kategoria', 'Shuma']],
      body: filteredTransactions.map(t => [
        t.date,
        t.description,
        t.category,
        t.amount > 0 ? `+${t.amount}` : t.amount
      ]),
      startY: 20,
    });
    doc.save('transaksionet.pdf');
  };

  // Handle money transfer
  const handleTransfer = (e) => {
    e.preventDefault();
    // Add transaction to list
    const newTransaction = {
      id: transactions.length + 1,
      date: new Date().toLocaleDateString('sq-AL', { day: '2-digit', month: 'long', year: 'numeric' }),
      description: `Transfer te ${transferData.recipient}`,
      category: 'Transfer',
      amount: -parseFloat(transferData.amount),
      account: '•••• 4567'
    };
    
    setTransactions([newTransaction, ...transactions]);
    setShowSendModal(false);
    setTransferData({ recipient: '', amount: '', note: '' });
  };

  return (
    <div className="transactions-page">
      <h2 className="page-title"><FiDollarSign /> Transaksionet e Mia</h2>

      {/* Action Buttons */}
      <div className="d-flex justify-content-between mb-4">
        <Button variant="primary" onClick={() => setShowSendModal(true)}>
          <FiSend /> Dërgo Para
        </Button>
        <div>
          <Button variant="outline-secondary" onClick={exportToExcel} className="me-2">
            <FiDownload /> Excel
          </Button>
          <Button variant="outline-secondary" onClick={exportToPDF}>
            <FiDownload /> PDF
          </Button>
        </div>
      </div>

      {/* Currency Converter */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Konvertues Valutor</Card.Title>
          <Form>
            <Row>
              <Col md={5}>
                <Form.Group className="mb-3">
                  <Form.Label>Shuma në Lek</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      value={lekAmount}
                      onChange={handleLekChange}
                      placeholder="Shuma në Lek"
                    />
                    <InputGroup.Text>ALL</InputGroup.Text>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-center justify-content-center">
                <div className="text-center mt-3">
                  <FiDollarSign size={24} className="text-muted" />
                </div>
              </Col>
              <Col md={5}>
                <Form.Group className="mb-3">
                  <Form.Label>Konvertuar në</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      value={convertedAmount}
                      onChange={handleConvertedChange}
                      placeholder="Shuma e konvertuar"
                    />
                    <Form.Select 
                      value={selectedCurrency}
                      onChange={handleCurrencyChange}
                      style={{ maxWidth: '120px' }}
                    >
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
   
      {/* Rest of your existing components remain the same... */}
      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title><FiFilter /> Filtro Transaksionet</Card.Title>
          <Row>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Kategoria</Form.Label>
                <Form.Select 
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                >
                  <option value="">Të gjitha</option>
                  <option value="Ushqim">Ushqim</option>
                  <option value="Fatura">Fatura</option>
                  <option value="Blerje">Blerje</option>
                  <option value="Të ardhura">Të ardhura</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Prej</Form.Label>
                <Form.Control 
                  type="date" 
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Deri</Form.Label>
                <Form.Control 
                  type="date" 
                  value={filters.dateTo}
                  onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Kërko</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <FiSearch />
                  </InputGroup.Text>
                  <Form.Control 
                    placeholder="Kërko transaksione..."
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Spending Chart */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Shpërndarja e Shpenzimeve</Card.Title>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="Shuma ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card.Body>
      </Card>

      {/* Transactions Table */}
      <Card>
        <Card.Body>
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>Data</th>
                <th>Përshkrimi</th>
                <th>Kategoria</th>
                <th>Llogaria</th>
                <th className="text-end">Shuma</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(t => (
                <tr key={t.id}>
                  <td>{t.date}</td>
                  <td>{t.description}</td>
                  <td>
                    <span className={`badge bg-${t.amount > 0 ? 'success' : 'danger'}`}>
                      {t.category}
                    </span>
                  </td>
                  <td>{t.account}</td>
                  <td className={`text-end ${t.amount > 0 ? 'text-success' : 'text-danger'}`}>
                    {t.amount > 0 ? '+' : ''}{t.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Send Money Modal */}
      <Modal show={showSendModal} onHide={() => setShowSendModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title><FiSend /> Dërgo Para</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleTransfer}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Përfituesi</Form.Label>
              <Form.Control 
                placeholder="Emri ose numri i llogarisë"
                value={transferData.recipient}
                onChange={(e) => setTransferData({...transferData, recipient: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Shuma</Form.Label>
              <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <Form.Control 
                  type="number" 
                  placeholder="Shuma"
                  value={transferData.amount}
                  onChange={(e) => setTransferData({...transferData, amount: e.target.value})}
                  required
                />
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Label>Shënim (opsional)</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                value={transferData.note}
                onChange={(e) => setTransferData({...transferData, note: e.target.value})}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowSendModal(false)}>
              Anulo
            </Button>
            <Button variant="primary" type="submit">
              Dërgo
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default TransactionsPage;