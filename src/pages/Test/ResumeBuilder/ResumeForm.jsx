import { useState } from "react";
import { Row, Col, Card, CardBody, Container } from "reactstrap";
import "../../assets/css/Main.css";

import "animate.css";
import { withTranslation } from "react-i18next";
import Breadcrumb from "../../components/Common/Breadcrumb";
import ResumeFormat2 from "./ResumeFormat2";
import ResumeFormat1 from "./ResumeFormat1";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const EditableInput = ({ value, onChange, placeholder, maxLength, error }) => (
  <input
    type="text"
    className={`formStyle ${error ? "input-error" : ""}`}
    value={value || ""}
    onChange={onChange}
    placeholder={placeholder}
    maxLength={maxLength}
  />
);

const EditableDate = ({ value, onChange, className }) => (
  <input
    type="date"
    className={`formStyle ${className || ""}`}
    value={value ?? ""}
    onChange={onChange}
  />
);

const EditableTextarea = ({ value, onChange, rows = 3, placeholder }) => (
  <textarea
    className="formStyle2 "
    rows={rows}
    value={value ?? ""}
    onChange={onChange}
    placeholder={placeholder}
  />
);

function ResumeForm({ onCancel, onSave, t }) {
  const [formData, setFormData] = useState({
    name: "",
    profile: "",
    mob: "",
    email: "",
    doj: "",
    dob: "",
    maritalstatus: "Married",
    gender: "Male",
    address1: "",
    address2: "",
    city: "",
    country: "",
    state: "",
    pin: "",
    summary: "",
    resume_format: "",
    jobDetails: [{ company: "", cprofile: "", workSummary: "" }],
    education: [{ degree: "", college: "", year: "", percentile: "" }],
    skill: [""],
    languages: [""],
    hobbies: [""],
  });

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full Name is required";

    if (!formData.profile.trim()) newErrors.profile = "Profile is required";

    if (!formData.mob || formData.mob.length !== 10)
      newErrors.mob = "Enter valid 10 digit mobile";

    if (!formData.email) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.dob) newErrors.dob = "Date of birth required";

    if (!formData.address1.trim()) newErrors.address1 = "Address is required";

    if (!formData.city.trim()) newErrors.city = "City required";

    if (!formData.state.trim()) newErrors.state = "State required";

    if (!formData.country.trim()) newErrors.country = "Country required";

    if (!formData.pin || formData.pin.length !== 6)
      newErrors.pin = "Enter 6 digit ZIP";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fix highlighted fields",
      });
      return;
    }

    try {
      Swal.fire({
        title: "Saving Resume...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const payload = {
        full_name: formData.name,
        profile: formData.profile,
        mobile: formData.mob,
        email: formData.email,
        marital_status: formData.maritalstatus,
        dob: formData.dob,
        gender: formData.gender,
        address1: formData.address1,
        address2: formData.address2,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        zip: formData.pin,
        summary: formData.summary,
        resume_format: formData.resume_format,
        job_exp: JSON.stringify(formData.jobDetails),
        education: JSON.stringify(formData.education),
        skills: JSON.stringify(formData.skill),
        languages: JSON.stringify(formData.languages),
        hobbies: JSON.stringify(formData.hobbies),
      };

      const res = await fetch(
        "http://localhost:8080/ords/demo123/resume/save",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const text = await res.text();
      Swal.close();

      const data = JSON.parse(text);

      if (data.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Saved!",
          text: "Resume saved successfully",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => navigate("/resume"));
      } else {
        Swal.fire({
          icon: "error",
          title: "Save Failed",
          text: data.error || "Something went wrong",
        });
      }
    } catch (err) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Unable to save resume.",
      });
    }
  };

  // Helper to update state safely
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // remove error for this field
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const updateArrayItem = (arrayName, index, field, value) => {
    setFormData((prev) => {
      const updatedArray = [...prev[arrayName]];
      updatedArray[index] = { ...updatedArray[index], [field]: value };
      return { ...prev, [arrayName]: updatedArray };
    });
  };

  const emptyJob = {
    company: "",
    cprofile: "",
    workSummary: "",
  };

  const emptyEducation = {
    degree: "",
    college: "",
    year: "",
    percentile: "",
  };

  const addJob = () => {
    setFormData((prev) => ({
      ...prev,
      jobDetails: [...prev.jobDetails, emptyJob],
    }));
  };

  const removeJob = (index) => {
    setFormData((prev) => ({
      ...prev,
      jobDetails: prev.jobDetails.filter((_, i) => i !== index),
    }));
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, emptyEducation],
    }));
  };

  const removeEducation = (index) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const addItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const updateItem = (field, index, value) => {
    setFormData((prev) => {
      const updated = [...prev[field]];
      updated[index] = value;
      return { ...prev, [field]: updated };
    });
  };

  const [isExiting, setIsExiting] = useState(false);
  return (
    <div
      className={`page-content animate__animated animate__fast ${
        isExiting ? "animate__fadeOut" : "animate__fadeIn"
      }`}
    >
      <Container fluid>
        <Breadcrumb title={t("Resume")} breadcrumbItem={t("Create Resume")} />

        <div className="px-3">
          <div className="bg-white p-2 rounded">
            <Row className=" d-flex align-items-center px-3  ">
              <Col md={3} xs={6}>
                <h3 className="text-tale fw-bolder ">Create Resume</h3>
              </Col>
              <Col md={9} xs={6}>
                <div className="d-flex justify-content-end gap-4 p-1 mb-3">
                  {" "}
                  <button
                    className="btn-press bg-tale text-white p-2  rounded-2 border-0 d-flex  align-items-center  btn-press"
                    onClick={handleSave}
                  >
                    <i className="bx bx-save fs-4"></i>
                    <span className=" ms-2 me-2 fw-bold">SAVE </span>
                  </button>
                  <button
                    className="btn-press bg-red text-white p-2  rounded-2 border-0 d-flex align-items-center  btn-press"
                    onClick={() => {
                      setIsExiting(true);

                      setTimeout(() => {
                        navigate("/resume");
                      }, 300); // must match animate__fast
                    }}
                  >
                    <i className="bx bx-x fs-4"></i>
                    <span className="ms-2 fw-bold me-2">CLOSE</span>
                  </button>
                </div>
              </Col>
            </Row>

            <div className="px-3">
              <div className="horizontal-bar "></div>
            </div>

            <Row className="g-2 ">
              <Col
                xs={12}
                lg={6}
                className="p-3 text-dark rounded d-flex flex-column "
              >
                {/*Personal Details*/}
                <Card className="shadow-lg rounded-3 text-dark ">
                  <CardBody>
                    <div className="d-flex align-items-center gap-5 mb-3">
                      <h5 className="text-tale fw-bold lh-2 mb-0">
                        Select Option :{" "}
                      </h5>
                      <select
                        value={formData.resume_format}
                        className="rounded-3 p-1 border-0 text-white bg-tale pe-5  "
                        onChange={(e) =>
                          updateField("resume_format", e.target.value)
                        }
                      >
                        <option value="option" className="text-dark bg-white ">
                          Select Resume Format
                        </option>

                        <option
                          value="ResumeFormat1"
                          className="text-dark bg-white "
                        >
                          Resume Format 1
                        </option>
                        <option
                          value="ResumeFormat2"
                          className="text-dark bg-white"
                        >
                          Resume Format 2
                        </option>
                        <option
                          value="ResumeFormat3"
                          className="text-dark bg-white"
                        >
                          Resume Format 3
                        </option>
                      </select>
                    </div>

                    <div className="horizontal-bar"></div>

                    <h5 className="text-tale fw-semibold mt-3 mb-2 cursor-pointer">
                      Personal Details
                    </h5>

                    <Row className="mb-2 text-secondary">
                      <Col md={6} xs={12}>
                        <label className="fw-semibold ">
                          Full Name<span className="text-danger">*</span>
                        </label>
                        <EditableInput
                          value={formData.name}
                          onChange={(e) => updateField("name", e.target.value)}
                          placeholder={"Enter Full Name"}
                          error={errors.name}
                        />
                        {errors.name && (
                          <small className="text-danger">{errors.name}</small>
                        )}
                      </Col>
                      <Col md={6} xs={12}></Col>

                      <Col md={4} xs={12}>
                        <label className="fw-semibold mt-2">
                          Profile<span className="text-danger">*</span>
                        </label>
                        <EditableInput
                          value={formData.profile}
                          onChange={(e) =>
                            updateField("profile", e.target.value)
                          }
                          placeholder={"Enter Profile"}
                          error={errors.profile}
                        />
                        {errors.profile && (
                          <small className="text-danger">
                            {errors.profile}
                          </small>
                        )}
                      </Col>
                      <Col md={4} xs={12}>
                        <label className="fw-semibold mt-2">
                          Mobile<span className="text-danger">*</span>
                        </label>
                        <div className="d-flex align-items-center gap-1 formStyle p-0 overflow-none">
                          <Col md={3} className="formStyle px-1 text-muted ">
                            +91
                          </Col>
                          <input
                            type="tel"
                            className={`formStyle3 ${errors.mob ? "input-error" : ""}`}
                            value={formData.mob}
                            maxLength={10}
                            onChange={(e) =>
                              updateField(
                                "mob",
                                e.target.value.replace(/\D/g, ""),
                              )
                            }
                            placeholder={"Enter Mobile"}
                          />
                        </div>
                        {errors.mob && (
                          <small className="text-danger">{errors.mob}</small>
                        )}
                      </Col>
                      <Col md={4} xs={12}>
                        <label className="fw-semibold mt-2">
                          Email<span className="text-danger">*</span>
                        </label>
                        <EditableInput
                          value={formData.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          placeholder={"Enter Email"}
                          error={errors.email}
                        />
                        {errors.email && (
                          <small className="text-danger">{errors.email}</small>
                        )}
                      </Col>
                    </Row>
                    <Row className="text-secondary">
                      <Col md={4} xs={12}>
                        <label className="fw-semibold ">
                          Marital Status<span className="text-danger">*</span>
                        </label>

                        <select
                          value={formData.maritalstatus}
                          onChange={(e) =>
                            updateField("maritalstatus", e.target.value)
                          }
                          className="formStyle text-secondary"
                        >
                          <option value="Married">Married</option>
                          <option value="Not Married">Not Married</option>
                        </select>
                      </Col>
                      <Col md={4} xs={12}>
                        <label className="fw-semibold">
                          Date of Birth<span className="text-danger">*</span>
                        </label>
                        <EditableDate
                          value={formData.dob}
                          onChange={(e) => updateField("dob", e.target.value)}
                          className={errors.dob ? "input-error" : ""}
                        />
                        {errors.dob && (
                          <small className="text-danger">{errors.dob}</small>
                        )}
                      </Col>
                      <Col md={4} xs={12}>
                        <label className="fw-semibold ">
                          Gender<span className="text-danger">*</span>
                        </label>

                        <select
                          value={formData.gender}
                          onChange={(e) =>
                            updateField("gender", e.target.value)
                          }
                          className="formStyle text-secondary "
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </Col>
                      <Col md={12} xs={12} className="mt-2">
                        <label className="fw-semibold">
                          Address Line 1<span className="text-danger">*</span>
                        </label>
                        <EditableInput
                          value={formData.address1}
                          onChange={(e) =>
                            updateField("address1", e.target.value)
                          }
                          placeholder={"Address Line 1"}
                          error={errors.address1}
                        />
                        {errors.address1 && (
                          <small className="text-danger">
                            {errors.address1}
                          </small>
                        )}
                      </Col>
                      <Col md={12} xs={12} className="mt-2">
                        <label className="fw-semibold">Address Line 2</label>
                        <EditableInput
                          value={formData.address2}
                          onChange={(e) =>
                            updateField("address2", e.target.value)
                          }
                          placeholder={"Address Line 2"}
                        />
                      </Col>

                      <Col md={4} xs={12} className="mt-2">
                        <label className="fw-semibold">
                          City<span className="text-danger">*</span>
                        </label>
                        <EditableInput
                          value={formData.city}
                          onChange={(e) => updateField("city", e.target.value)}
                          placeholder={"City"}
                          error={errors.city}
                        />
                        {errors.city && (
                          <small className="text-danger">{errors.city}</small>
                        )}
                      </Col>
                      <Col md={4} xs={12} className="mt-2">
                        <label className="fw-semibold">
                          State<span className="text-danger">*</span>
                        </label>
                        <EditableInput
                          value={formData.state}
                          onChange={(e) => updateField("state", e.target.value)}
                          placeholder={"State"}
                          error={errors.state}
                        />
                        {errors.state && (
                          <small className="text-danger">{errors.state}</small>
                        )}
                      </Col>
                      <Col md={4} xs={12} className="mt-2">
                        <label className="fw-semibold">
                          Country<span className="text-danger">*</span>
                        </label>
                        <EditableInput
                          value={formData.country}
                          onChange={(e) =>
                            updateField("country", e.target.value)
                          }
                          placeholder={"Country"}
                          error={errors.country}
                        />
                        {errors.country && (
                          <small className="text-danger">
                            {errors.country}
                          </small>
                        )}
                      </Col>
                      <Col md={4} xs={12} className="mt-2">
                        <label className="fw-semibold">
                          Postal/ZIP Code<span className="text-danger">*</span>
                        </label>
                        <EditableInput
                          value={formData.pin}
                          onChange={(e) =>
                            updateField(
                              "pin",
                              e.target.value.replace(/\D/g, ""),
                            )
                          }
                          maxLength={6}
                          placeholder={"ZIP Code"}
                          error={errors.pin}
                        />
                        {errors.pin && (
                          <small className="text-danger">{errors.pin}</small>
                        )}
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                {/*Summary*/}
                <Card className="shadow-lg rounded-3 ">
                  <CardBody>
                    <h5 className="text-tale fw-semibold mb-2 cursor-pointer">
                      Summary
                    </h5>

                    <EditableTextarea
                      value={formData.summary}
                      onChange={(e) => updateField("summary", e.target.value)}
                      rows={4}
                      placeholder={"Your job profile Summary...."}
                    />
                  </CardBody>
                </Card>
                {/*Job Experience*/}
                <Card className="shadow-lg rounded-3 p-3 text-dark ">
                  <h5 className="text-tale fw-semibold mb-2 cursor-pointer">
                    Job Experience
                  </h5>

                  <Row>
                    {formData.jobDetails.map((job, index) => (
                      <Col
                        xs={12}
                        md={12}
                        key={index}
                        className="mb-2 text-secondary"
                      >
                        <Row>
                          <Col md={6}>
                            <label className="fw-semibold">Company</label>
                            <EditableInput
                              value={job.company}
                              onChange={(e) =>
                                updateArrayItem(
                                  "jobDetails",
                                  index,
                                  "company",
                                  e.target.value,
                                )
                              }
                              placeholder={"Company Name"}
                            />
                          </Col>

                          <Col md={6}>
                            <label className="fw-semibold ">Profile</label>
                            <EditableInput
                              value={job.cprofile}
                              onChange={(e) =>
                                updateArrayItem(
                                  "jobDetails",
                                  index,
                                  "cprofile",
                                  e.target.value,
                                )
                              }
                              placeholder={"Company Profile"}
                            />
                          </Col>
                        </Row>

                        <Row>
                          <Col md={12}>
                            <label className="fw-semibold mt-2">
                              Work Summary
                            </label>
                            <EditableTextarea
                              value={job.workSummary}
                              onChange={(e) =>
                                updateArrayItem(
                                  "jobDetails",
                                  index,
                                  "workSummary",
                                  e.target.value,
                                )
                              }
                              placeholder={"Work Summary here..."}
                            />
                          </Col>
                        </Row>

                        {formData.jobDetails.length > 1 && (
                          <button
                            className=" btn-press p-2 mt-2 d-flex align-items-center text-white border-0 bg-red rounded-2"
                            onClick={() => removeJob(index)}
                          >
                            <i className="bx bx-trash fs-5"></i>{" "}
                            <span className="ms-2 fw-bold me-2">Remove</span>
                          </button>
                        )}
                      </Col>
                    ))}
                  </Row>

                  <div className="d-flex justify-content-start">
                    <button
                      className=" btn-press p-2 d-flex align-items-center text-white border-0 bg-tale rounded-2"
                      onClick={addJob}
                    >
                      <i className="bx bx-plus fw-bold fs-5"></i>{" "}
                      <span className="ms-2 fw-bold me-2">Add Job</span>
                    </button>
                  </div>
                </Card>
                {/*Education*/}
                <Card className="shadow-lg rounded-3 text-secondary p-3 ">
                  <h5 className="text-tale fw-semibold mb-2 cursor-pointer">
                    Education
                  </h5>

                  <Row>
                    {formData.education.map((edu, index) => (
                      <Col md={12} key={index} className="mb-3">
                        <Row>
                          <Col md={6}>
                            <label className="fw-semibold">Degree</label>
                            <EditableInput
                              value={edu.degree}
                              onChange={(e) =>
                                updateArrayItem(
                                  "education",
                                  index,
                                  "degree",
                                  e.target.value,
                                )
                              }
                              placeholder={"Degree"}
                            />
                          </Col>
                          <Col md={6}>
                            <label className="fw-semibold ">College</label>
                            <EditableInput
                              value={edu.college}
                              onChange={(e) =>
                                updateArrayItem(
                                  "education",
                                  index,
                                  "college",
                                  e.target.value,
                                )
                              }
                              placeholder={"College"}
                            />
                          </Col>
                        </Row>

                        <Row>
                          <Col xs={12} md={6}>
                            <label className="fw-semibold mt-2">
                              Passing Year
                            </label>
                            <EditableInput
                              value={edu.year}
                              onChange={(e) =>
                                updateArrayItem(
                                  "education",
                                  index,
                                  "year",
                                  e.target.value,
                                )
                              }
                              placeholder={"Year"}
                            />
                          </Col>

                          <Col xs={12} md={6}>
                            <label className="fw-semibold mt-2">
                              Percentile
                            </label>
                            <EditableInput
                              value={edu.percentile}
                              onChange={(e) =>
                                updateArrayItem(
                                  "education",
                                  index,
                                  "percentile",
                                  e.target.value,
                                )
                              }
                              placeholder={"%"}
                            />
                          </Col>
                        </Row>

                        {formData.education.length > 1 && (
                          <button
                            className=" btn-press p-2 mt-2 d-flex align-items-center text-white border-0 bg-red rounded-2"
                            onClick={() => removeEducation(index)}
                          >
                            <i className="bx bx-trash fs-5"></i>{" "}
                            <span className="ms-2 fw-bold me-2">Remove</span>
                          </button>
                        )}
                      </Col>
                    ))}
                  </Row>

                  <div className="d-flex justify-content-start">
                    <button
                      className=" btn-press p-2 d-flex align-items-center text-white border-0 bg-tale rounded-2"
                      onClick={addEducation}
                    >
                      <i className="bx bx-plus fw-bold fs-5"></i>{" "}
                      <span className="ms-2 fw-bold me-2">Add Education</span>
                    </button>
                  </div>
                </Card>
                {/*Skills*/}
                <Card className="shadow-lg rounded-3">
                  <CardBody>
                    <h5 className="text-tale fw-semibold mb-2 cursor-pointer">
                      Skills
                    </h5>

                    {formData.skill.map((item, index) => (
                      <div
                        key={index}
                        className="d-flex align-items-center justify-content-center gap-2 mb-2"
                      >
                        <EditableInput
                          value={item}
                          onChange={(e) =>
                            updateItem("skill", index, e.target.value)
                          }
                          placeholder={"Skills"}
                        />
                        <button
                          className="btn-press p-2 align-items-center rounded-2  text-white
                                 bg-red border-0 d-flex "
                          onClick={() => removeItem("skill", index)}
                        >
                          <i className="bx bx-trash fs-5 "></i>
                        </button>
                      </div>
                    ))}

                    <button
                      className="btn-press p-2 d-flex align-items-center text-white border-0 bg-tale rounded-2"
                      onClick={() => addItem("skill")}
                    >
                      <i className="bx bx-plus fw-bold fs-5"></i>{" "}
                      <span className="ms-2 fw-bold me-2">Add Skill</span>
                    </button>
                  </CardBody>
                </Card>
                {/*Languages*/}
                <Card className="shadow-lg rounded-3 ">
                  <CardBody>
                    <h5 className="text-tale fw-semibold mb-2 cursor-pointer">
                      Languages
                    </h5>

                    {formData.languages.map((item, index) => (
                      <div
                        key={index}
                        className="d-flex gap-2 align-items-center justify-content-center  mb-2"
                      >
                        <EditableInput
                          value={item}
                          onChange={(e) =>
                            updateItem("languages", index, e.target.value)
                          }
                          placeholder={"Languages"}
                        />
                        <button
                          className="btn-press p-2 align-items-center rounded-2  text-white
                                 bg-red border-0 d-flex "
                          onClick={() => removeItem("languages", index)}
                        >
                          <i className="bx bx-trash fs-5 "></i>
                        </button>
                      </div>
                    ))}

                    <button
                      className="btn-press bg-tale text-white p-2  rounded-2 border-0 d-flex  align-items-center  btn-press"
                      onClick={() => addItem("languages")}
                    >
                      <i className="bx bx-plus fw-bold fs-5"></i>{" "}
                      <span className="ms-2 fw-bold me-2">Add Language</span>
                    </button>
                  </CardBody>
                </Card>
                {/*Hobbies*/}
                <Card className="shadow-lg rounded-3 ">
                  <CardBody>
                    <h5 className="text-tale fw-semibold mb-2 cursor-pointer">
                      Hobbies
                    </h5>

                    {formData.hobbies.map((item, index) => (
                      <div
                        key={index}
                        className="d-flex gap-2 align-items-center justify-content-center  mb-2"
                      >
                        <EditableInput
                          value={item}
                          onChange={(e) =>
                            updateItem("hobbies", index, e.target.value)
                          }
                          placeholder={"Hobbies"}
                        />
                        <button
                          className="btn-press p-2 align-items-center rounded-2  text-white
                                 bg-red border-0 d-flex "
                          onClick={() => removeItem("hobbies", index)}
                        >
                          <i className="bx bx-trash fs-5 "></i>
                        </button>
                      </div>
                    ))}

                    <button
                      className="btn-press bg-tale text-white p-2  rounded-2 border-0 d-flex  align-items-center  btn-press"
                      onClick={() => addItem("hobbies")}
                    >
                      <i className="bx bx-plus fw-bold fs-5"></i>{" "}
                      <span className="ms-2 fw-bold me-2">Add Hobby</span>
                    </button>
                  </CardBody>
                </Card>
              </Col>

              {formData.resume_format !== "option" && (
                <Col
                  xs={12}
                  lg={6}
                  className="  d-flex flex-column text-dark p-3"
                >
                  <div
                    key={formData.resume_format}
                    className="shadow-lg rounded-3 p-3 animate__animated animate__fadeInUp animate__faster
            d-flex  flex-column w-100 overflow-auto"
                  >
                    <h4 className="text-tale fw-bold text-center ">
                      <u>Resume Preview</u>
                    </h4>
                    <div id="resumePreview" className="mb-5">
                      {formData.resume_format === "ResumeFormat1" && (
                        <ResumeFormat1
                          formData={formData}
                          updateField={updateField}
                          updateArrayItem={updateArrayItem}
                        />
                      )}

                      {formData.resume_format === "ResumeFormat2" && (
                        <ResumeFormat2
                          formData={formData}
                          updateField={updateField}
                          updateArrayItem={updateArrayItem}
                        />
                      )}
                      {formData.resume_format === "ResumeFormat3" &&
                        "Resume Format3"}
                    </div>
                  </div>
                </Col>
              )}
            </Row>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default withTranslation()(ResumeForm);
