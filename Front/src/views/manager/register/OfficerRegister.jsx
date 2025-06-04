import React, { useState, useCallback } from "react";
import { Row, Col, Card, Form, Button, Table, InputGroup } from "react-bootstrap";
import {
  addOfficer,
  updateOfficer,
  deleteOfficer,
  getOfficers,
} from "../../../api/officerApi";
import { debounce } from "lodash";

const OfficerRegistrationForm = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    dateOfBirth: "",
    sentTransactions: [],
    receivedTransactions: [],
    klientLoans: [],
  });

  const [officers, setOfficers] = useState([]); 
  const [editingOfficer, setEditingOfficer] = useState(null);
  const [search, setSearch] = useState(""); 
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");


  const loadOfficers = useCallback(
    debounce(async (text) => {
      if (!text) {
        setOfficers([]);
        return;
      }
      try {
        const data = await getOfficers(text); 
        setOfficers(data);
      } catch (err) {
        console.error("Failed to load officers:", err);
      }
    }, 400),
    []
  );

  // -------------------------------------------------
  // Handlers
  // -------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    loadOfficers(value);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const generatedID = Math.floor(100 + Math.random() * 9000);
    const currentDateTime = new Date().toISOString();

    const officerPayload = {
      personalID: editingOfficer ? editingOfficer.personalID : generatedID,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      dateOfBirth: formData.dateOfBirth,
      role: "officer",
      phone: formData.phone,
      address: formData.address,
      city: "Prishtina",
      balance: 0,
          sentTransactions: [],
      receivedTransactions: [],
      klientLoans: []
    };
    

    try {
      const res = editingOfficer
        ? await updateOfficer(editingOfficer.id, {
            ...officerPayload,
            id: editingOfficer.id,
          })
        : await addOfficer(officerPayload);
         
      const result = await res;
      if (editingOfficer) {
        setOfficers(
          officers.map((o) => (o.id === result.id ? result : o))
        );
      } else {
        // Only append to list if it matches current search text
        if (
          search &&
          result.name.toLowerCase().includes(search.toLowerCase())
        ) {
          setOfficers([...officers, result]);
        }
      }

      // reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        dateOfBirth: "",
        sentTransactions: [],
        receivedTransactions: [],
        klientLoans: [],
      });
      setEditingOfficer(null);
    } catch (error) {
      console.error("Error:", error);
      alert(" Failed to register or update officer.");
    }
  };

  const handleEdit = (officer) => {
    setFormData({
      name: officer.name,
      email: officer.email,
      phone: officer.phone,
      address: officer.address,
      password: "", // never pre‑fill password
      dateOfBirth: officer.dateOfBirth,
      sentTransactions: [],
      receivedTransactions: [],
      klientLoans: [],
    });
    setEditingOfficer(officer);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this officer?")) return;
    try {
      await deleteOfficer(id);
      setOfficers(officers.filter((off) => off.id !== id));
    } catch (err) {
      console.error("Error:", err);
      alert("❌ Failed to delete officer.");
    }
  };

  // -------------------------------------------------
  // Client‑side sorting
  // -------------------------------------------------
  const sortedOfficers = [...officers].sort((a, b) => {
    if (!sortField) return 0;
    const valA = a[sortField];
    const valB = b[sortField];
    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // -------------------------------------------------
  // UI
  // -------------------------------------------------
  return (
    <React.Fragment>
      {/* ------------------ Registration form ------------------ */}
      <Row>
        <Col sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">
                {editingOfficer ? "Perditso Oficerin" : "Regjistrimi Oficerit"}
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit} autoComplete="off">
                <Row>
                  {/* Left column */}
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Emri</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Shenoni emrin"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="shenoni emailin"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Numri Telefonit</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Shenoni numrin e telefonit"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Adresa</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="shenoni adresen"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Fjalkalimi</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Shenoni fjalkalimin"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Data e Lindjes</Form.Label>
                      <Form.Control
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Button variant="primary" type="submit">
                  {editingOfficer ? "Perditso Oficerin" : "Regjistro Oficerin"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ------------------ Search & Table ------------------ */}
      <Row className="mt-4">
        <Col sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Oficerat e Regjistruar</Card.Title>
              <InputGroup className="mt-2">
                <Form.Control
                  type="text"
                  placeholder="kerkoni oficerin…"
                  value={search}
                  onChange={handleFilterChange}
                />
              </InputGroup>
            </Card.Header>
            <Card.Body>
              {search && sortedOfficers.length === 0 && (
                <p className="m-0">Nuk u gjet oficeri.</p>
              )}
              {!search && (
                <p className="m-0 text-muted">shenoni emrin e oficerit per tu shfaqur oficeri.</p>
              )}
              {sortedOfficers.length > 0 && (
                <Table striped bordered hover responsive className="mt-2">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort("id")}>ID</th>
                      <th onClick={() => handleSort("name")}>Emri</th>
                      <th>personalID</th>
                      <th>Email</th>
                      <th>Numri Telefonit</th>
                      <th>Adresa</th>
                      <th>Data e Lindjes</th>
                      <th>Veprime</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedOfficers.map((officer) => (
                      <tr key={officer.id}>
                     <td>{officer.id}</td>           {/* ID sipas backend */}
  <td>{officer.name}</td>
  <td>{officer.personalID}</td>   {/* me ID të madhe */}
  <td>{officer.email}</td>
  <td>{officer.phone}</td>
  <td>{officer.address}</td>
  <td>{officer.dateOfBirth}</td>
                        <td>
                          <Button
                            variant="warning"
                            size="sm"
                            onClick={() => handleEdit(officer)}
                          >
                            Edit
                          </Button>{" "}
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(officer.id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default OfficerRegistrationForm;