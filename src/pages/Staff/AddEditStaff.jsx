import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Breadcrumb from "../../components/Common/Breadcrumb";
import { useNavigate, useLocation } from "react-router-dom"; //Pankaj Sharma

import { toast } from "react-toastify";
import Swal from "sweetalert2";
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
import { number } from "prop-types";

const steps = [
  "Personal Details",
  "CTC",
  "Roles & Responsibility",
  "Work Experience",
  "Education",
  "Documents",
];

const AddEditStaff = (props) => {
  const [activeStep, setActiveStep] = useState("Personal Details");
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  // ====== Form State ======
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

  const safeParse = (value, fallback) => {
    if (!value) return fallback;
    if (Array.isArray(value)) return value;
    if (typeof value === "object") return value;
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return dateString.split("T")[0];
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

  const fetchStaffById = async () => {
    const res = await fetch(
      `http://localhost:8080/ords/demo123/staff/view/${id}`,
    );

    const data = await res.json();
    const staff = data.items[0];
    if (!staff) return;

    fetchDocumentsByEmpId(staff.emp_id);

    // ---- PERSONAL ----
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

      rolesDescription: safeParse(staff.roles_resp, [])
        .map((r) => `<p>${r}</p>`)
        .join(""),
    });

    // ---- WORK EXP ----
    const workExpRaw = safeParse(staff.work_exp, []);
    const workExp = Array.isArray(workExpRaw)
      ? workExpRaw.map((we) => ({
          company: we.company || "",
          fromDate: we.from_date || "",
          toDate: we.to_date || "",
          salary: we.salary || "",
          position: we.position || "",
          reason: we.reason || "",
          description: we.description || "",
          contactPerson: we.contact_person || "",
          email: we.email || "",
          phone: we.phone || "",
        }))
      : [];

    setWorkExperienceList(workExp.length ? workExp : []);

    // ---- EDUCATION ----
    const eduRaw = safeParse(staff.education, []);
    setEducationList(Array.isArray(eduRaw) ? eduRaw : []);

    // ---- DOCUMENTS ----
    setDocumentList(staff.documents || []);
  };

  useEffect(() => {
    if (id) fetchStaffById();
  }, [id]);

  const [showPassword, setShowPassword] = useState(false);

  const previewDocument = (docId) => {
    const url = `http://localhost:8080/ords/demo123/staff/documents/preview/${docId}`;
    window.open(url, "_blank");
  };

  const [workExperienceList, setWorkExperienceList] = useState([
    {
      company: "",
      fromDate: "",
      toDate: "",
      salary: "",
      position: "",
      reason: "",
      description: "",
      contactPerson: "",
      email: "",
      phone: "",
    },
  ]);

  const [educationList, setEducationList] = useState([
    { board: "", field: "", year: "", percentage: "" },
  ]);

  const [documentForm, setDocumentForm] = useState({
    name: "",
    type: "",
    file: null,
  });
  const fileInputRef = useRef(null);
  const editorRef = useRef(null);
  useEffect(() => {
    if (!editorRef.current) return;

    if (isReadOnly) {
      editorRef.current.enableReadOnlyMode("view-mode");
    } else {
      editorRef.current.disableReadOnlyMode("view-mode");
    }
  }, [isReadOnly]);

  const [documentList, setDocumentList] = useState([]);

  const location = useLocation();
  const getBreadcrumbLabel = () => {
    if (location.pathname.includes("/add")) return "Add Staff";
    if (location.pathname.includes("/edit")) return "Edit Staff";

    return "Staff";
  };

  //--------------

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email?.trim() || "");

  // ====== Navigation ======
  const handleCancel = () => navigate(-1);

  // ====== Validation ======
  const validateStep = () => {
    const newErrors = {};

    if (activeStep === "Personal Details") {
      if (!formValues.name?.trim()) newErrors.name = "Required";
      if (!formValues.phone?.trim()) newErrors.phone = "Required";
      if (!formValues.employeeId?.trim()) newErrors.employeeId = "Required";
      if (!formValues.emailId?.trim()) newErrors.emailId = "Required";
      else if (!isValidEmail(formValues.emailId))
        newErrors.emailId = "Invalid email";
      if (!formValues.personalEmail?.trim())
        newErrors.personalEmail = "Required";
      else if (!isValidEmail(formValues.personalEmail))
        newErrors.personalEmail = "Invalid email";
      if (!formValues.password?.trim()) newErrors.password = "Required";
    }

    if (activeStep === "CTC") {
      Object.entries(formValues.ctc).forEach(([key, value]) => {
        if (value?.trim() && isNaN(Number(value))) {
          newErrors[`ctc-${key}`] = "Must be a number";
        }
      });
    }

    if (activeStep === "Roles & Responsibility") {
      if (!formValues.rolesDescription?.trim())
        newErrors.rolesDescription = "Required";
    }

    if (activeStep === "Work Experience") {
      workExperienceList.forEach((we, idx) => {
        if (!we.company?.trim()) newErrors[`we-company-${idx}`] = "Required";
        if (!we.position?.trim()) newErrors[`we-position-${idx}`] = "Required";
      });
    }

    if (activeStep === "Education") {
      educationList.forEach((edu, idx) => {
        if (!edu.board?.trim()) newErrors[`edu-board-${idx}`] = "Required";
        if (!edu.field?.trim()) newErrors[`edu-field-${idx}`] = "Required";
        if (!edu.year?.trim()) newErrors[`edu-year-${idx}`] = "Required";
        if (!edu.percentage?.trim())
          newErrors[`edu-percentage-${idx}`] = "Required";
      });
    }

    if (activeStep === "Documents") {
      if (!documentForm.name?.trim()) newErrors.documentName = "Required";
      if (!documentForm.type?.trim()) newErrors.documentType = "Required";
      if (!documentForm.file) newErrors.documentFile = "Required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ===== Save Personal Details function =========

  const savePersonalDetails = async () => {
    const payload = {
      emp_id: formValues.employeeId,
      name: formValues.name,
      phone_number: formValues.phone,
      role: formValues.roleName || "",
      designation: formValues.designation,
      personal_email: formValues.personalEmail,
      company_email: formValues.emailId,
      password: formValues.password,
      joining_date: formValues.joiningDate || null,
    };

    try {
      const response = await fetch(
        "http://localhost:8080/ords/demo123/staff/personal",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText);
      }
    } catch (error) {
      // show error
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to save staff details",
      });

      // 🔥 IMPORTANT: rethrow
      throw error;
    }
  };

  // ===== Save CTC function =========
  const saveCTCDetails = async () => {
    const payload = {
      emp_id: formValues.employeeId,
      ctc_bp: formValues.ctc.BP || 0,
      ctc_da: formValues.ctc.DA || 12,
      ctc_ma: formValues.ctc.MA || 0,
      ctc_hra: formValues.ctc.HRA || 0,
      ctc_ca: formValues.ctc.CA || 0,
    };

    try {
      const response = await fetch(
        "http://localhost:8080/ords/demo123/staff/ctc",
        {
          method: "PUT", // we are updating CTC
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText);
      }
    } catch (error) {
      // show error
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to save CTC details",
      });

      // 🔥 IMPORTANT: rethrow so handleSave can catch it
      throw error;
    }
  };

  // ===== Save Roles & Responsibilities ========

  // ✅ Normalize editor content into an array
  const normalizeEditorContentToArray = (html) => {
    if (!html) return [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    let items = [];

    // 1️⃣ Get all <li> and <p> elements first
    const elements = Array.from(doc.querySelectorAll("li, p"));

    if (elements.length > 0) {
      elements.forEach((el) => {
        // Split by comma, bullets, numbers, or extra spaces
        const parts = el.textContent
          .split(/[\n,•–—·]+/) // newline, comma, common bullets
          .map((i) => i.replace(/^\d+\.\s*/, "")) // remove numbered prefixes
          .map((i) => i.trim())
          .filter(Boolean);

        items.push(...parts);
      });
    } else {
      // fallback: whole text content
      const parts = (doc.body.textContent || "")
        .split(/[\n,•–—·]+/)
        .map((i) => i.replace(/^\d+\.\s*/, "").trim())
        .filter(Boolean);
      items.push(...parts);
    }

    return items;
  };

  // ✅ Save roles to ORDS
  const saveRolesDetails = async () => {
    try {
      const rolesArray = normalizeEditorContentToArray(
        formValues.rolesDescription,
      );

      const payload = {
        emp_id: formValues.employeeId,
        roles_resp: JSON.stringify(rolesArray),
      };

      const response = await fetch(
        "http://localhost:8080/ords/demo123/staff/roles",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText);
      }

      Swal.fire({
        icon: "success",
        title: "Saved",
        text: "Roles & Responsibilities updated successfully",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to save Roles & Responsibilities",
      });
      throw error;
    }
  };

  //====== Save Work Experience =====

  const saveWorkExperience = async () => {
    const payload = {
      emp_id: formValues.employeeId,
      work_exp: JSON.stringify(
        workExperienceList.map((we) => ({
          company: we.company || "",
          from_date: we.fromDate || null,
          to_date: we.toDate || null,
          salary: we.salary || 0,
          position: we.position || "",
          reason: we.reason || "",
          description: we.description || "",
          contact_person: we.contactPerson || "",
          email: we.email || "",
          phone: we.phone || "",
        })),
      ),
    };

    try {
      const response = await fetch(
        "http://localhost:8080/ords/demo123/staff/work",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to save Work Experience",
      });
      throw error;
    }
  };

  // ====== Save Education ========

  const saveEducation = async () => {
    const payload = {
      emp_id: formValues.employeeId,
      education: JSON.stringify(
        educationList.map((edu) => ({
          board: edu.board || "",
          field: edu.field || "",
          year: edu.year || "",
          percentage: edu.percentage || "",
        })),
      ),
    };

    try {
      const response = await fetch(
        "http://localhost:8080/ords/demo123/staff/education",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to save Education Details",
      });
      throw error;
    }
  };

  // ====== Save ======
  const handleSave = async () => {
    if (!validateStep()) {
      toast.error("Please fill all required fields!");
      return;
    }

    if (activeStep !== "Personal Details" && !formValues.employeeId) {
      toast.error("Please save Personal Details first");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to save this Staff ${activeStep}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#01536e",
      cancelButtonColor: "#6c757d",
    });

    if (!result.isConfirmed) return;

    try {
      if (activeStep === "Personal Details") {
        await savePersonalDetails();
      }

      if (activeStep === "CTC") {
        await saveCTCDetails();
      }
      if (activeStep === "Roles & Responsibility") await saveRolesDetails();
      if (activeStep === "Work Experience") await saveWorkExperience();
      if (activeStep === "Education") await saveEducation();
      if (activeStep === "Documents") await handleUploadDocument();
      Swal.fire({
        icon: "success",
        title: "Saved",
        text: "Staff details saved successfully",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      // error already shown in savePersonalDetails
      console.error(err);
    }
  };

  // ====== Work Experience ======
  const handleAddWorkExperience = () =>
    setWorkExperienceList((prev) => [
      ...prev,
      {
        company: "",
        fromDate: "",
        toDate: "",
        salary: "",
        position: "",
        reason: "",
        description: "",
        contactPerson: "",
        email: "",
        phone: "",
      },
    ]);

  const handleRemoveWorkExperience = (index) =>
    setWorkExperienceList((prev) => prev.filter((_, i) => i !== index));

  // ====== Education ======
  const handleAddEducation = () =>
    setEducationList((prev) => [
      ...prev,
      { board: "", field: "", year: "", percentage: "" },
    ]);

  const handleRemoveEducation = (index) =>
    setEducationList((prev) => prev.filter((_, i) => i !== index));

  // ====== Documents ======

  const handleDocumentChange = (e) => {
    const { name, files, value } = e.target;

    if (name === "file") {
      const file = files[0];
      if (!file) return;

      setDocumentForm((prev) => ({
        ...prev,
        file: file,
        mimeType: file.type,
      }));
    } else {
      setDocumentForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleUploadDocument = async () => {
    if (!documentForm.file) {
      Swal.fire("Error", "Please select a file", "error");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save this document?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#01536e",
      cancelButtonColor: "#6c757d",
    });

    if (!result.isConfirmed) return;

    try {
      const formData = new FormData();
      formData.append("body", documentForm.file);
      formData.append("filename", documentForm.file.name);
      formData.append("emp_id", formValues.employeeId);
      formData.append("doc_type", documentForm.type);
      formData.append("mime_type", documentForm.mimeType);

      const response = await fetch(
        "http://localhost:8080/ords/demo123/staff/upload",
        {
          method: "POST",
          body: formData,
        },
      );

      const text = await response.text();
      let data = {};

      try {
        data = JSON.parse(text);
      } catch {
        data = {};
      }

      if (!response.ok) {
        Swal.fire("Error", data.error || "Upload failed", "error");
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Saved",
        text: "Document uploaded successfully",
        timer: 1500,
        showConfirmButton: false,
      });

      // 🔥 REFRESH DOCUMENT LIST
      await fetchDocumentsByEmpId(formValues.employeeId);

      // Clear form
      setDocumentForm({
        name: "",
        type: "",
        file: null,
        mimeType: "",
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Document upload failed", "error");
    }
  };

  const handleDeleteDocument = async (docId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This document will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#01536e",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(
            `http://localhost:8080/ords/demo123/staff/document/delete/${docId}`,
            { method: "DELETE" },
          );

          if (!res.ok) throw new Error();

          // ✅ Remove row from UI
          setDocumentList((prev) => prev.filter((doc) => doc.id !== docId));

          Swal.fire({
            title: "Deleted!",
            text: "Document deleted successfully.",
            icon: "success",
            confirmButtonColor: "#01536e",
          });
        } catch (err) {
          Swal.fire({
            title: "Error",
            text: "Unable to delete document.",
            icon: "error",
            confirmButtonColor: "#01536e",
          });
        }
      }
    });
  };

  // ====== Render ======
  return (
    <div className="page-content ">
      <div className="container-fluid ">
        <Breadcrumb
          title={props.t("Staff")}
          breadcrumbItem={props.t(getBreadcrumbLabel())}
        />

        <Row className="px-3">
          <Col md="3">
            <Card className="h-100">
              <CardBody className="p-0">
                <ul className="list-unstyled mb-0 staff-steps">
                  {steps.map((step) => (
                    <li
                      key={step}
                      className={`staff-step  ${
                        activeStep === step ? "active" : ""
                      }`}
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
                <div className="add-staff-card-header  text-dark d-flex justify-content-between align-items-center mb-3">
                  <h5>{activeStep}</h5>
                  <div className="add-staff-actions  d-flex gap-3">
                    {!isReadOnly && activeStep === "Work Experience" && (
                      <button
                        type="button"
                        className="btn-press bg-tale text-white p-2 rounded-2 border-0 d-flex align-items-center"
                        onClick={() => handleAddWorkExperience()}
                      >
                        <i className="bx bx-plus fs-4"></i>
                        <span className=" ms-2 me-2 fw-bold">ADD MORE </span>
                      </button>
                    )}
                    {!isReadOnly && activeStep === "Education" && (
                      <button
                        type="button"
                        className="btn-press bg-tale text-white p-2 rounded-2 border-0 d-flex align-items-center"
                        onClick={() => handleAddEducation()}
                      >
                        <i className="bx bx-plus fs-4"></i>
                        <span className=" ms-2 me-2 fw-bold">
                          ADD EDUCATION DETAILS{" "}
                        </span>
                      </button>
                    )}
                    {!isReadOnly && activeStep === "Documents" && (
                      <button
                        type="button"
                        className="btn-press bg-tale text-white p-2 rounded-2 border-0 d-flex align-items-center"
                        onClick={() => handleUploadDocument()}
                      >
                        <i className="bx bx-cloud-upload fs-4"></i>
                        <span className=" ms-2 me-2 fw-bold">UPLOAD </span>
                      </button>
                    )}
                    {!isReadOnly && activeStep !== "Documents" && (
                      <button
                        className="btn-press bg-tale text-white p-2  rounded-2 border-0 d-flex  align-items-center  btn-press"
                        onClick={handleSave}
                      >
                        <i className="bx bx-save fs-5"></i>
                        <span className=" ms-2 me-2 fw-bold">SAVE </span>
                      </button>
                    )}
                    <button
                      className="btn-press bg-red text-white p-2  rounded-2 border-0 d-flex  align-items-center  btn-press"
                      onClick={handleCancel}
                    >
                      <i className="bx bx-x fs-4"></i>
                      <span className=" ms-2 me-2 fw-bold">CLOSE </span>
                    </button>
                  </div>
                </div>

                {/* ================= Step Forms ================= */}

                {/* =================Personal Details ================= */}
                {activeStep === "Personal Details" && (
                  <Form className="text-dark">
                    <Row>
                      <Col md="4">
                        <FormGroup>
                          <Label>
                            Name <span className="text-danger">*</span>
                          </Label>
                          <Input
                            placeholder="Enter Name"
                            value={formValues.name}
                            onChange={(e) =>
                              setFormValues({
                                ...formValues,
                                name: e.target.value,
                              })
                            }
                            readOnly={isReadOnly}
                            className={errors.name ? "error-border" : ""}
                          />
                          {errors.name && (
                            <small className="text-danger">{errors.name}</small>
                          )}
                        </FormGroup>
                      </Col>

                      <Col md="4">
                        <FormGroup>
                          <Label>
                            Phone Number<span className="text-danger">*</span>
                          </Label>
                          <Input
                            placeholder="Enter Phone Number"
                            value={formValues.phone}
                            onChange={(e) =>
                              setFormValues({
                                ...formValues,
                                phone: e.target.value,
                              })
                            }
                            readOnly={isReadOnly}
                            className={errors.phone ? "error-border" : ""}
                          />
                          {errors.phone && (
                            <small className="text-danger">
                              {errors.phone}
                            </small>
                          )}
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label>Role Name</Label>
                          <Input
                            type="select"
                            value={formValues.roleName}
                            onChange={(e) =>
                              setFormValues({
                                ...formValues,
                                roleName: e.target.value,
                              })
                            }
                            disabled={isReadOnly}
                          >
                            <option value="">Select Role</option>
                            <option>Software Developer</option>
                            <option>Senior Software Developer</option>
                            <option>Staff</option>
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="4">
                        <FormGroup>
                          <Label>Designation</Label>
                          <Input
                            placeholder="Enter Designation"
                            value={formValues.designation}
                            onChange={(e) =>
                              setFormValues({
                                ...formValues,
                                designation: e.target.value,
                              })
                            }
                            readOnly={isReadOnly}
                          />
                        </FormGroup>
                      </Col>

                      <Col md="4">
                        <FormGroup>
                          <Label>
                            Employee Id <span className="text-danger">*</span>
                          </Label>
                          <Input
                            placeholder="Enter Employee Id"
                            value={formValues.employeeId}
                            onChange={(e) =>
                              setFormValues({
                                ...formValues,
                                employeeId: e.target.value,
                              })
                            }
                            readOnly={isReadOnly}
                            className={errors.employeeId ? "error-border" : ""}
                          />
                          {errors.employeeId && (
                            <small className="text-danger">
                              {errors.employeeId}
                            </small>
                          )}
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label>
                            Personal Email Id{" "}
                            <span className="text-danger">*</span>
                          </Label>
                          <Input
                            placeholder="Enter Personal Email Id"
                            value={formValues.personalEmail}
                            onChange={(e) =>
                              setFormValues({
                                ...formValues,
                                personalEmail: e.target.value,
                              })
                            }
                            readOnly={isReadOnly}
                            className={
                              errors.personalEmail ? "error-border" : ""
                            }
                          />
                          {errors.personalEmail && (
                            <small className="text-danger">
                              {errors.personalEmail}
                            </small>
                          )}
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="4">
                        <FormGroup>
                          <Label>
                            Email Id <span className="text-danger">*</span>
                          </Label>
                          <Input
                            placeholder="Enter Email Id"
                            value={formValues.emailId}
                            onChange={(e) =>
                              setFormValues({
                                ...formValues,
                                emailId: e.target.value,
                              })
                            }
                            readOnly={isReadOnly}
                            className={errors.emailId ? "error-border" : ""}
                          />
                          {errors.emailId && (
                            <small className="text-danger">
                              {errors.emailId}
                            </small>
                          )}
                        </FormGroup>
                      </Col>

                      <Col md="4">
                        <FormGroup>
                          <Label>
                            Password <span className="text-danger">*</span>
                          </Label>

                          <div className="position-relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter Password"
                              value={formValues.password}
                              onChange={(e) =>
                                setFormValues({
                                  ...formValues,
                                  password: e.target.value,
                                })
                              }
                              readOnly={isReadOnly}
                              className={
                                errors.password ? "error-border pe-5" : "pe-5"
                              }
                            />

                            {!isReadOnly && (
                              <span
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                  position: "absolute",
                                  right: "10px",
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                  cursor: "pointer",
                                }}
                              >
                                <i
                                  className={`bx ${
                                    showPassword ? "bx-show" : "bx-hide"
                                  } fs-5 text-muted`}
                                ></i>
                              </span>
                            )}
                          </div>

                          {errors.password && (
                            <small className="text-danger">
                              {errors.password}
                            </small>
                          )}
                        </FormGroup>
                      </Col>

                      <Col md="4">
                        <FormGroup>
                          <Label>Joining Date</Label>
                          <Input
                            type="date"
                            value={formValues.joiningDate}
                            onChange={(e) =>
                              setFormValues({
                                ...formValues,
                                joiningDate: e.target.value,
                              })
                            }
                            readOnly={isReadOnly} //
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
                          placeholder={`Enter ${key}`}
                          value={formValues.ctc[key]}
                          onChange={(e) =>
                            setFormValues({
                              ...formValues,
                              ctc: { ...formValues.ctc, [key]: e.target.value },
                            })
                          }
                          readOnly={isReadOnly}
                          className={errors[`ctc-${key}`] ? "error-border" : ""}
                        />
                        {errors[`ctc-${key}`] && (
                          <small className="text-danger">
                            {errors[`ctc-${key}`]}
                          </small>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* ================= Roles & Responsibility ================= */}
                {activeStep === "Roles & Responsibility" && (
                  <Form>
                    <FormGroup className="roles-editor text-dark">
                      <Label className="d-flex align-items-center gap-1">
                        Key Performance Indicator – Detail
                      </Label>

                      <CKEditor
                        editor={ClassicEditor}
                        data={formValues.rolesDescription}
                        config={{
                          removePlugins: ["AutoGrow"],
                          toolbar: [
                            "bold",
                            "italic",
                            "link",
                            "bulletedList",
                            "numberedList",
                            "undo",
                            "redo",
                          ],
                        }}
                        onReady={(editor) => {
                          editorRef.current = editor;
                        }}
                        onChange={(event, editor) => {
                          if (isReadOnly) return; // EXTRA SAFETY
                          setFormValues({
                            ...formValues,
                            rolesDescription: editor.getData(),
                          });
                        }}
                      />
                    </FormGroup>
                  </Form>
                )}

                {/* ================= Work Experience ================= */}
                {activeStep === "Work Experience" &&
                  workExperienceList.map((we, index) => (
                    <Card className="mb-3 text-dark" key={index}>
                      <CardBody>
                        {!isReadOnly && workExperienceList.length > 1 && (
                          <div className="text-end mb-2  justify-content-end d-flex">
                            <button
                              color="link"
                              className="btn-press text-white p-2 border-0 d-flex align-items-center bg-red rounded-2"
                              onClick={() => handleRemoveWorkExperience(index)}
                            >
                              <i className="bx  bx-trash fs-5 "></i>
                            </button>
                          </div>
                        )}

                        <Row className="mb-2">
                          <Col md="3">
                            <FormGroup>
                              <Label>
                                Company Name{" "}
                                <span className="text-danger">*</span>
                              </Label>
                              <Input
                                placeholder="Enter Company Name"
                                value={we.company}
                                onChange={(e) => {
                                  const list = [...workExperienceList];
                                  list[index].company = e.target.value;
                                  setWorkExperienceList(list);
                                }}
                                readOnly={isReadOnly}
                                className={
                                  errors[`we-company-${index}`]
                                    ? "error-border"
                                    : ""
                                }
                              />
                              {errors[`we-company-${index}`] && (
                                <small className="text-danger">
                                  {errors[`we-company-${index}`]}
                                </small>
                              )}
                            </FormGroup>
                          </Col>

                          <Col md="3">
                            <FormGroup>
                              <Label>From Date</Label>
                              <Input
                                type="date"
                                value={we.fromDate}
                                onChange={(e) => {
                                  const list = [...workExperienceList];
                                  list[index].fromDate = e.target.value;
                                  setWorkExperienceList(list);
                                }}
                                readOnly={isReadOnly}
                              />
                            </FormGroup>
                          </Col>

                          <Col md="3">
                            <FormGroup>
                              <Label>To Date</Label>
                              <Input
                                type="date"
                                value={we.toDate}
                                onChange={(e) => {
                                  const list = [...workExperienceList];
                                  list[index].toDate = e.target.value;
                                  setWorkExperienceList(list);
                                }}
                                readOnly={isReadOnly}
                              />
                            </FormGroup>
                          </Col>

                          <Col md="3">
                            <FormGroup>
                              <Label>Salary</Label>
                              <Input
                                placeholder="Enter Salary"
                                value={we.salary}
                                onChange={(e) => {
                                  const list = [...workExperienceList];
                                  list[index].salary = e.target.value;
                                  setWorkExperienceList(list);
                                }}
                                readOnly={isReadOnly}
                              />
                            </FormGroup>
                          </Col>
                        </Row>

                        <Row className="mb-2">
                          <Col md="4">
                            <FormGroup>
                              <Label>
                                Position <span className="text-danger">*</span>
                              </Label>
                              <Input
                                placeholder="Enter Position"
                                value={we.position}
                                onChange={(e) => {
                                  const list = [...workExperienceList];
                                  list[index].position = e.target.value;
                                  setWorkExperienceList(list);
                                }}
                                readOnly={isReadOnly}
                                className={
                                  errors[`we-position-${index}`]
                                    ? "error-border"
                                    : ""
                                }
                              />
                              {errors[`we-position-${index}`] && (
                                <small className="text-danger">
                                  {errors[`we-position-${index}`]}
                                </small>
                              )}
                            </FormGroup>
                          </Col>

                          <Col md="4">
                            <FormGroup>
                              <Label>Reason for Leaving</Label>
                              <Input
                                placeholder="Enter Reason for Leaving"
                                value={we.reason}
                                onChange={(e) => {
                                  const list = [...workExperienceList];
                                  list[index].reason = e.target.value;
                                  setWorkExperienceList(list);
                                }}
                                readOnly={isReadOnly}
                              />
                            </FormGroup>
                          </Col>

                          <Col md="4">
                            <FormGroup>
                              <Label>Contact Person</Label>
                              <Input
                                placeholder="Enter Contact Person"
                                value={we.contactPerson}
                                onChange={(e) => {
                                  const list = [...workExperienceList];
                                  list[index].contactPerson = e.target.value;
                                  setWorkExperienceList(list);
                                }}
                                readOnly={isReadOnly}
                              />
                            </FormGroup>
                          </Col>
                        </Row>

                        <Row className="mb-2">
                          <Col md="4">
                            <FormGroup>
                              <Label>Email</Label>
                              <Input
                                placeholder="Enter Email"
                                value={we.email}
                                onChange={(e) => {
                                  const list = [...workExperienceList];
                                  list[index].email = e.target.value;
                                  setWorkExperienceList(list);
                                }}
                                readOnly={isReadOnly}
                              />
                            </FormGroup>
                          </Col>

                          <Col md="4">
                            <FormGroup>
                              <Label>Phone Number</Label>
                              <Input
                                placeholder="Enter Phone Number"
                                value={we.phone}
                                onChange={(e) => {
                                  const list = [...workExperienceList];
                                  list[index].phone = e.target.value;
                                  setWorkExperienceList(list);
                                }}
                                readOnly={isReadOnly}
                              />
                            </FormGroup>
                          </Col>

                          <Col md="4">
                            <FormGroup>
                              <Label>Description</Label>
                              <Input
                                placeholder="Enter Description"
                                value={we.description}
                                onChange={(e) => {
                                  const list = [...workExperienceList];
                                  list[index].description = e.target.value;
                                  setWorkExperienceList(list);
                                }}
                                readOnly={isReadOnly}
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  ))}

                {/* ================= Education ================= */}
                {activeStep === "Education" &&
                  educationList.map((edu, index) => (
                    <Card className="mb-3 text-dark" key={index}>
                      <CardBody>
                        {!isReadOnly && educationList.length > 1 && (
                          <div className="text-end mb-2 justify-content-end d-flex">
                            <button
                              className="btn-press text-white p-2 border-0 d-flex align-items-center bg-red rounded-2"
                              onClick={() => handleRemoveEducation(index)}
                            >
                              <i className="bx bx-trash fs-5 "></i>
                            </button>
                          </div>
                        )}

                        <Row>
                          <Col md="3">
                            <FormGroup>
                              <Label>
                                Board <span className="text-danger">*</span>
                              </Label>
                              <Input
                                placeholder="Enter Board"
                                value={edu.board}
                                onChange={(e) => {
                                  const list = [...educationList];
                                  list[index].board = e.target.value;
                                  setEducationList(list);
                                }}
                                readOnly={isReadOnly}
                                className={
                                  errors[`edu-board-${index}`]
                                    ? "error-border"
                                    : ""
                                }
                              />
                              {errors[`edu-board-${index}`] && (
                                <small className="text-danger">
                                  {errors[`edu-board-${index}`]}
                                </small>
                              )}
                            </FormGroup>
                          </Col>

                          <Col md="3">
                            <FormGroup>
                              <Label>
                                Field <span className="text-danger">*</span>
                              </Label>
                              <Input
                                placeholder="Enter Field"
                                value={edu.field}
                                onChange={(e) => {
                                  const list = [...educationList];
                                  list[index].field = e.target.value;
                                  setEducationList(list);
                                }}
                                readOnly={isReadOnly}
                                className={
                                  errors[`edu-field-${index}`]
                                    ? "error-border"
                                    : ""
                                }
                              />
                              {errors[`edu-field-${index}`] && (
                                <small className="text-danger">
                                  {errors[`edu-field-${index}`]}
                                </small>
                              )}
                            </FormGroup>
                          </Col>

                          <Col md="3">
                            <FormGroup>
                              <Label>
                                Year <span className="text-danger">*</span>
                              </Label>
                              <Input
                                placeholder="Enter Year"
                                value={edu.year}
                                onChange={(e) => {
                                  const list = [...educationList];
                                  list[index].year = e.target.value;
                                  setEducationList(list);
                                }}
                                readOnly={isReadOnly}
                                className={
                                  errors[`edu-year-${index}`]
                                    ? "error-border"
                                    : ""
                                }
                              />
                              {errors[`edu-year-${index}`] && (
                                <small className="text-danger">
                                  {errors[`edu-year-${index}`]}
                                </small>
                              )}
                            </FormGroup>
                          </Col>

                          <Col md="3">
                            <FormGroup>
                              <Label>
                                Percentage{" "}
                                <span className="text-danger">*</span>
                              </Label>
                              <Input
                                placeholder="Enter Percentage"
                                value={edu.percentage}
                                onChange={(e) => {
                                  const list = [...educationList];
                                  list[index].percentage = e.target.value;
                                  setEducationList(list);
                                }}
                                readOnly={isReadOnly}
                                className={
                                  errors[`edu-percentage-${index}`]
                                    ? "error-border"
                                    : ""
                                }
                              />
                              {errors[`edu-percentage-${index}`] && (
                                <small className="text-danger">
                                  {errors[`edu-percentage-${index}`]}
                                </small>
                              )}
                            </FormGroup>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  ))}

                {/* ================= Documents ================= */}
                {activeStep === "Documents" && (
                  <div className="documents-section text-dark">
                    <Row className="mb-4">
                      <Col md="3">
                        <FormGroup>
                          <Label>
                            Document Name <span className="text-danger">*</span>
                          </Label>
                          <Input
                            name="name"
                            value={documentForm.name}
                            onChange={handleDocumentChange}
                            placeholder="Enter Document Name"
                            className={
                              errors.documentName ? "error-border" : ""
                            }
                          />
                          {errors.documentName && (
                            <small className="text-danger">
                              {errors.documentName}
                            </small>
                          )}
                        </FormGroup>
                      </Col>

                      <Col md="3">
                        <FormGroup>
                          <Label>
                            Document Type <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="select"
                            name="type"
                            value={documentForm.type}
                            onChange={handleDocumentChange}
                            className={
                              errors.documentType ? "error-border" : ""
                            }
                          >
                            <option>Select Document Type</option>
                            <option>Aadhar</option>
                            <option>PAN</option>
                            <option>Resume</option>
                          </Input>
                          {errors.documentType && (
                            <small className="text-danger">
                              {errors.documentType}
                            </small>
                          )}
                        </FormGroup>
                      </Col>

                      <Col md="4">
                        <FormGroup>
                          <Label>
                            Upload Document{" "}
                            <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="file"
                            name="file"
                            innerRef={fileInputRef}
                            onChange={handleDocumentChange}
                            // Remove ref and display:none to show default choose file button
                          />
                          {errors.documentFile && (
                            <small className="text-danger d-block mt-1">
                              {errors.documentFile}
                            </small>
                          )}
                        </FormGroup>
                      </Col>
                    </Row>

                    <div className="table-responsive">
                      <table className="table table-bordered  table-light align-middle">
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
                                colSpan="4"
                                className="text-center text-muted"
                              >
                                No Documents Found
                              </td>
                            </tr>
                          ) : (
                            documentList.map((doc, index) => (
                              <tr key={doc.id}>
                                <td>{doc.id}</td>
                                <td>{doc.name}</td>
                                <td>{doc.type}</td>
                                <td className="d-flex gap-3">
                                  <button
                                    color="link"
                                    className=" border-0 btn-press p-2 align-items-center rounded-2 d-flex icon-css bg-white "
                                    onClick={() => previewDocument(doc.id)}
                                  >
                                    <i className="bx bx-show fs-5"></i>
                                  </button>
                                  <button
                                    color="link"
                                    className="text-red btn-press border-0 bg-white "
                                    onClick={() => handleDeleteDocument(doc.id)}
                                  >
                                    <i className="ri-delete-bin-line fs-16"></i>
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

export default withTranslation()(AddEditStaff);
