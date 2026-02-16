import React, { useState, useEffect } from "react";
import Breadcrumb from "../../components/Common/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import "../../assets/css/Main.css";
import { withTranslation } from "react-i18next";

import {
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
} from "reactstrap";
import Swal from "sweetalert2";

const steps = [
  "Personal Details",
  "CTC",
  "Roles & Responsibility",
  "Work Experience",
  "Education",
  "Documents",
];

const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  return dateString.split("T")[0]; // YYYY-MM-DD
};
const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};
const ViewStaff = (props) => {
  const { id } = useParams();
  const [activeStep, setActiveStep] = useState("Personal Details");
  const [isReadOnly] = useState(true);
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    name: "",
    phone: "",
    roleName: "",
    designation: "",
    employeeId: "",
    emailId: "",
    personalEmail: "",
    password: "",
    joiningDate: "",
    ctc: { BP: "", DA: "", MA: "", HRA: "", CA: "" },
    rolesDescription: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [workExperienceList, setWorkExperienceList] = useState([]);
  const [educationList, setEducationList] = useState([]);
  const [documentList, setDocumentList] = useState([]);

  const previewDocument = (docId) => {
    const url = `http://localhost:8080/ords/demo123/staff/documents/preview/${docId}`;
    window.open(url, "_blank");
  };
  const fetchDocumentsByEmpId = async (empId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/ords/demo123/staff/documents/${empId}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }

      const data = await response.json();

      setDocumentList(data.items || []);
    } catch (error) {
      console.error("Documents Error:", error);
      setDocumentList([]);
    }
  };

  // Fetch staff by empId
  const fetchStaffById = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/ords/demo123/staff/view/${id}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch staff data");
      }

      const data = await response.json();
      const staff = data.items[0]; // ORDS returns { items: [ {...} ] }

      fetchDocumentsByEmpId(staff.emp_id);

      // Parse JSON strings safely
      let rolesResp = "";

      if (staff.roles_resp) {
        const parsed = safeParse(staff.roles_resp, []);

        if (Array.isArray(parsed)) {
          rolesResp = parsed.join("\n");
        } else if (parsed.roles && Array.isArray(parsed.roles)) {
          rolesResp = parsed.roles.join("\n");
        } else if (typeof parsed === "string") {
          rolesResp = parsed;
        }
      }

      const workExp = staff.work_exp ? JSON.parse(staff.work_exp) : [];

      const education = staff.education ? JSON.parse(staff.education) : [];

      setFormValues({
        name: staff.name || "",
        phone: staff.phone_number || "",
        employeeId: staff.emp_id || "",
        designation: staff.designation || "",
        emailId: staff.company_email || "",
        personalEmail: staff.personal_email || "",
        password: staff.password_hash || "",
        roleName: staff.role || "",
        joiningDate: formatDateForInput(staff.joining_date),

        ctc: {
          BP: staff.ctc_bp || "",
          DA: staff.ctc_da || "",
          MA: staff.ctc_ma || "",
          HRA: staff.ctc_hra || "",
          CA: staff.ctc_ca || "",
        },
        rolesDescription: rolesResp,
      });

      setWorkExperienceList(workExp);
      setEducationList(education);
      setDocumentList(staff.documents || []);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Unable to load staff data", "error");
    }
  };

  useEffect(() => {
    document.title = "Staff | Ambrella Consultancy";
    fetchStaffById();
  }, [id]);

  const handleCancel = () => navigate(-1);

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumb
          title={props.t("Staff")}
          breadcrumbItem={props.t("View Staff")}
        />

        <Row className="px-3">
          <Col md="3">
            <Card className="h-100">
              <CardBody className="p-0">
                <ul className="list-unstyled mb-0 staff-steps">
                  {steps.map((step) => (
                    <li
                      key={step}
                      className={`staff-step ${activeStep === step ? "active" : ""}`}
                      onClick={() => setActiveStep(step)}
                    >
                      {step}
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          </Col>

          <Col md="9">
            <Card>
              <CardBody>
                {/* Header */}
                <div className="add-staff-card-header text-dark d-flex justify-content-between align-items-center mb-3">
                  <h5>{activeStep}</h5>
                  <div className="add-staff-actions d-flex gap-3">
                    <button
                      className="btn-press bg-red text-white p-2 rounded-2 border-0 d-flex align-items-center"
                      onClick={handleCancel}
                    >
                      <i className="bx bx-x fs-4"></i>
                      <span className="ms-2 me-2 fw-bold">CLOSE</span>
                    </button>
                  </div>
                </div>

                {/* ================= Step Forms ================= */}
                {activeStep === "Personal Details" && (
                  <Form className="text-dark">
                    <Row>
                      <Col md="4">
                        <FormGroup>
                          <Label>Name</Label>
                          <Input
                            value={formValues.name}
                            readOnly={isReadOnly}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label>Phone Number</Label>
                          <Input
                            value={formValues.phone}
                            readOnly={isReadOnly}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label>Role</Label>
                          <Input
                            value={formValues.roleName}
                            readOnly={isReadOnly}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="4">
                        <FormGroup>
                          <Label>Designation</Label>
                          <Input
                            value={formValues.designation}
                            readOnly={isReadOnly}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label>Employee Id</Label>
                          <Input
                            value={formValues.employeeId}
                            readOnly={isReadOnly}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label>Personal Email Id</Label>
                          <Input
                            value={formValues.personalEmail}
                            readOnly={isReadOnly}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="4">
                        <FormGroup>
                          <Label>Email Id</Label>
                          <Input
                            value={formValues.emailId}
                            readOnly={isReadOnly}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label>Password</Label>
                          <Input
                            type="password"
                            value={formValues.password}
                            readOnly
                          />
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label>Joining Date</Label>
                          <Input
                            type="date"
                            value={formValues.joiningDate}
                            readOnly
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>
                )}

                {/* ================= CTC ================= */}
                {activeStep === "CTC" && (
                  <div className="ctc-grid text-dark">
                    {["BP", "DA", "MA", "HRA", "CA"].map((key) => (
                      <div key={key}>
                        <Label>{key}</Label>
                        <Input
                          value={formValues.ctc[key]}
                          readOnly={isReadOnly}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* ================= Roles & Responsibility ================= */}
                {activeStep === "Roles & Responsibility" && (
                  <Form>
                    <FormGroup className="roles-editor text-dark">
                      <Label>Key Performance Indicator – Detail</Label>
                      <Input
                        type="textarea"
                        value={formValues.rolesDescription}
                        readOnly={isReadOnly}
                      />
                    </FormGroup>
                  </Form>
                )}

                {/* ================= Work Experience ================= */}
                {activeStep === "Work Experience" &&
                  workExperienceList.map((we, idx) => (
                    <Card className="mb-3 text-dark" key={idx}>
                      <CardBody>
                        {/* ROW 1 */}
                        <Row>
                          <Col md="3">
                            <FormGroup>
                              <Label>Company Name *</Label>
                              <Input
                                type="text"
                                value={we.company || ""}
                                readOnly
                              />
                            </FormGroup>
                          </Col>

                          <Col md="3">
                            <FormGroup>
                              <Label>From Date</Label>
                              <Input
                                type="date"
                                value={we.from_date || ""}
                                readOnly
                              />
                            </FormGroup>
                          </Col>

                          <Col md="3">
                            <FormGroup>
                              <Label>To Date</Label>
                              <Input
                                type="date"
                                value={we.to_date || ""}
                                readOnly
                              />
                            </FormGroup>
                          </Col>

                          <Col md="3">
                            <FormGroup>
                              <Label>Salary</Label>
                              <Input
                                type="number"
                                value={we.salary || ""}
                                readOnly
                              />
                            </FormGroup>
                          </Col>
                        </Row>

                        {/* ROW 2 */}
                        <Row>
                          <Col md="4">
                            <FormGroup>
                              <Label>Position *</Label>
                              <Input
                                type="text"
                                value={we.position || ""}
                                readOnly
                              />
                            </FormGroup>
                          </Col>

                          <Col md="4">
                            <FormGroup>
                              <Label>Reason for Leaving</Label>
                              <Input
                                type="text"
                                value={we.reason || ""}
                                readOnly
                              />
                            </FormGroup>
                          </Col>

                          <Col md="4">
                            <FormGroup>
                              <Label>Contact Person</Label>
                              <Input
                                type="text"
                                value={we.contact_person || ""}
                                readOnly
                              />
                            </FormGroup>
                          </Col>
                        </Row>

                        {/* ROW 3 */}
                        <Row>
                          <Col md="4">
                            <FormGroup>
                              <Label>Email</Label>
                              <Input
                                type="email"
                                value={we.email || ""}
                                readOnly
                              />
                            </FormGroup>
                          </Col>

                          <Col md="4">
                            <FormGroup>
                              <Label>Phone Number</Label>
                              <Input
                                type="text"
                                value={we.phone || ""}
                                readOnly
                              />
                            </FormGroup>
                          </Col>

                          <Col md="4">
                            <FormGroup>
                              <Label>Description</Label>
                              <Input
                                type="textarea"
                                value={we.description || ""}
                                readOnly
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  ))}

                {/* ================= Education ================= */}
                {activeStep === "Education" &&
                  educationList.map((edu, idx) => (
                    <Card className="mb-3 text-dark" key={idx}>
                      <CardBody>
                        <Row>
                          <Col md="3">
                            <FormGroup>
                              <Label>Board *</Label>
                              <Input value={edu.board || ""} readOnly />
                            </FormGroup>
                          </Col>

                          <Col md="3">
                            <FormGroup>
                              <Label>Field *</Label>
                              <Input value={edu.field || ""} readOnly />
                            </FormGroup>
                          </Col>

                          <Col md="3">
                            <FormGroup>
                              <Label>Year *</Label>
                              <Input value={edu.year || ""} readOnly />
                            </FormGroup>
                          </Col>

                          <Col md="3">
                            <FormGroup>
                              <Label>Percentage *</Label>
                              <Input value={edu.percentage || ""} readOnly />
                            </FormGroup>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  ))}

                {/* ================= Documents ================= */}
                {activeStep === "Documents" && (
                  <div className="documents-section text-dark">
                    <div className="table-responsive">
                      <table className="table table-bordered table-light align-middle">
                        <thead>
                          <tr>
                            <th>Doc Id</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {documentList.length === 0 ? (
                            <tr>
                              <td
                                colSpan="3"
                                className="text-center text-muted"
                              >
                                No Documents Found
                              </td>
                            </tr>
                          ) : (
                            documentList.map((doc, idx) => (
                              <tr key={idx}>
                                <td>{doc.id}</td>
                                <td>{doc.name}</td>
                                <td>{doc.type}</td>
                                <td>
                                  <button
                                    color="link"
                                    className=" border-0 btn-press p-2 align-items-center rounded-2 d-flex icon-css bg-white "
                                    onClick={() => previewDocument(doc.id)}
                                  >
                                    <i className="bx bx-show fs-5"></i>
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default withTranslation()(ViewStaff);
