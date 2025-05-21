import React from 'react';
import { Col, Card, Tabs, Tab, Row, Form, Button } from 'react-bootstrap'; // Importoni Form dhe Button
import { Link } from 'react-router-dom';

import avatar3 from '../../../assets/images/user/avatar-3.jpg';

const DashDefault = () => {
  const tabContent = (
    <React.Fragment>
      <div className="d-flex friendlist-box align-items-center justify-content-center">
        <div className="m-r-10 photo-table flex-shrink-0">
          <Link to="#">
            <img className="rounded-circle" style={{ width: '40px' }} src={avatar3} alt="activity-user" />
          </Link>
        </div>
        <div className="flex-grow-1 ms-3">
          <h6 className="m-0 d-inline">Storm Hanse</h6>
          <span className="float-end d-flex align-items-center">
            <i className="fa fa-caret-down f-22 m-r-10 text-c-red" />
            8750
          </span>
        </div>
      </div>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <Col md={8} xl={12} className="user-activity">
        <Card>
          <Tabs defaultActiveKey="today" id="uncontrolled-tab-example">
            <Tab eventKey="today" title="Today">
              {tabContent}
            </Tab>
            <Tab eventKey="week" title="This Week">
              {tabContent}
            </Tab>
            <Tab eventKey="all" title="All">
              {tabContent}
            </Tab>
          </Tabs>
        </Card>
      </Col>

      <Col sm={12}>
        <Card>
          <Card.Header>
            <Card.Title as="h5">Dergo Transaksion </Card.Title>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formBasicRecipientId">
                  <Form.Label>ID Card e pranuesit</Form.Label>
                  <Form.Control type="text" placeholder="Sheno ID kartelen e pranuesit" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicReason">
                  <Form.Label>Arsyeja qe po dergoni para</Form.Label>
                  <Form.Control type="text" placeholder="Sheno arsyejen e dërgesës" />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form>
                  <Form.Group className="mb-3" controlId="formBasicSenderId">
                    <Form.Label>ID Card Derguesit</Form.Label>
                    <Form.Control type="text" placeholder="Sheno ID kartelen e dërguesit" />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicAmount">
                    <Form.Label>Shuma qe deshironi te dergoni</Form.Label>
                    <Form.Control type="number" placeholder="Sheno shumën" />
                  </Form.Group>

                  <div className="d-flex justify-content-center">
                    <Button variant="primary" type="submit">Dergo</Button>
                  </div>
                </Form>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default DashDefault;
