import React, { useState } from 'react';
import { Row, Col, Card, Form, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';  // Importoni Link nëse po përdorni rrugë
import avatar2 from '../../../assets/images/user/avatar-2.jpg';
import avatar3 from '../../../assets/images/user/avatar-3.jpg';

const CreditApplicationForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    idCardNumber: '',
    address: '',
    email: '',
    phoneNumber: '',
    employmentStatus: '',
    income: '',
    creditAmount: '',
    creditPurpose: '',
    creditTerm: '',
    collateral: '',
    previousLoans: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to a backend service
    console.log('Form submitted:', formData);
  };

  return (
    <React.Fragment>
      <Row>
        <Col md={6} xl={12}>
          <Card className="Recent-Users widget-focus-lg">
            <Card.Header>
              <Card.Title as="h5">Kreditë e Leshuara</Card.Title>
            </Card.Header>
            <Card.Body className="px-0 py-2">
              <Table responsive hover className="recent-users">
                <tbody>
                  <tr className="unread">
                    <td>
                      <img className="rounded-circle" style={{ width: '40px' }} src={avatar2} alt="activity-user" />
                    </td>
                    <td>
                      <h6 className="mb-1">Mathilde Andersen</h6>
                      <p className="m-0">Lorem Ipsum is simply dummy text of…</p>
                    </td>
                    <td>
                      <h6 className="text-muted">
                        <i className="fa fa-circle text-c-red f-10 m-r-15" />
                        11 MAY 10:35
                      </h6>
                    </td>
                    <td>
                      <Link to="#" className="label theme-bg2 text-white f-12">
                        View the Credit
                      </Link>
                    </td>
                  </tr>
                  <tr className="unread">
                    <td>
                      <img className="rounded-circle" style={{ width: '40px' }} src={avatar3} alt="activity-user" />
                    </td>
                    <td>
                      <h6 className="mb-1">Karla Sorensen</h6>
                      <p className="m-0">Lorem Ipsum is simply dummy text of…</p>
                    </td>
                    <td>
                      <h6 className="text-muted">
                        <i className="fa fa-circle text-c-green f-10 m-r-15" />9 MAY 17:38
                      </h6>
                    </td>
                    <td>
                      <Link to="#" className="label theme-bg2 text-white f-12">
                        View the Credit
                      </Link>
                    </td>
                  </tr>
                  {/* Add more rows as needed */}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8} xl={12}>
          <Card className="Recent-Users widget-focus-lg">
            <Card.Header>
              <Card.Title as="h5">Kërkesat për Kredi</Card.Title>
            </Card.Header>
            <Card.Body className="px-0 py-2">
              <Table responsive hover className="recent-users">
                <tbody>
                  <tr className="unread">
                    <td>
                      <img className="rounded-circle" style={{ width: '40px' }} src={avatar2} alt="activity-user" />
                    </td>
                    <td>
                      <h6 className="mb-1">Mathilde Andersen</h6>
                      <p className="m-0">Lorem Ipsum is simply dummy text of…</p>
                    </td>
                    <td>
                      <h6 className="text-muted">
                        <i className="fa fa-circle text-c-red f-10 m-r-15" />
                        11 MAY 10:35
                      </h6>
                    </td>
                    <td>
                      <Link to="#" className="label theme-bg2 text-white f-12">
                        View the Credit
                      </Link>
                    </td>
                    <td>
                      <Link to="#" className="label theme-bg2 text-white f-12">
                        Pending
                      </Link>
                    </td>
                  </tr>
                  {/* Add more rows as needed */}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Aplikim për Kreditë</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                {/* Personal Information */}
                <h5>Informacioni Personal</h5>
                <Form.Group className="mb-3" controlId="formFullName">
                  <Form.Label>Emri i plotë</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Sheno emrin e plotë"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formDateOfBirth">
                  <Form.Label>Data e lindjes</Form.Label>
                  <Form.Control
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formIdCardNumber">
                  <Form.Label>Numri i ID Kartelës</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Sheno numrin e ID kartelës"
                    name="idCardNumber"
                    value={formData.idCardNumber}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formAddress">
                  <Form.Label>Adresa</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Sheno adresën"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Sheno emailin"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPhoneNumber">
                  <Form.Label>Numri i telefonit</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Sheno numrin e telefonit"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                {/* Employment Information */}
                <h5>Statusi i Punës dhe Të Ardhurat</h5>
                <Form.Group className="mb-3" controlId="formEmploymentStatus">
                  <Form.Label>Statusi i Punës</Form.Label>
                  <Form.Control
                    as="select"
                    name="employmentStatus"
                    value={formData.employmentStatus}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Zgjidhni statusin</option>
                    <option value="employed">I punësuar</option>
                    <option value="selfEmployed">I vetëpunësuar</option>
                    <option value="unemployed">I papunë</option>
                    <option value="student">Student</option>
                    <option value="retired">Pensionist</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formIncome">
                  <Form.Label>Të ardhurat mujore</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Sheno të ardhurat tuaja mujore"
                    name="income"
                    value={formData.income}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                {/* Loan Information */}
                <h5>Kërkesa për Kreditë</h5>
                <Form.Group className="mb-3" controlId="formCreditAmount">
                  <Form.Label>Shuma e Kredisë</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Sheno shumën që dëshironi të merrni"
                    name="creditAmount"
                    value={formData.creditAmount}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formCreditPurpose">
                  <Form.Label>Qëllimi i Kredisë</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Sheno qëllimin e kredisë"
                    name="creditPurpose"
                    value={formData.creditPurpose}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formCreditTerm">
                  <Form.Label>Kohëzgjatja e Kredisë</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Sheno kohëzgjatjen e kredisë (në muaj)"
                    name="creditTerm"
                    value={formData.creditTerm}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formCollateral">
                  <Form.Label>Kolateral (Nëse ka)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Sheno pasuritë që mund të ofroni si garanci"
                    name="collateral"
                    value={formData.collateral}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPreviousLoans">
                  <Form.Label>Kredia të mëparshme</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Sheno kredinë e mëparshme (nëse ka)"
                    name="previousLoans"
                    value={formData.previousLoans}
                    onChange={handleChange}
                  />
                </Form.Group>

                {/* Submit Button */}
                <Button variant="primary" type="submit">
                  Dërgo Aplikimin
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>       
      </Row>
    </React.Fragment>
  );
};

export default CreditApplicationForm;
