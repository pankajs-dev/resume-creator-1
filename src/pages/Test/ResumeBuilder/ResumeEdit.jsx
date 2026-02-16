import { useEffect, useState } from "react";
import { Row, Col, Card, CardBody, Container } from "reactstrap";
import "../../assets/css/Main.css";
import "animate.css";
import Swal from "sweetalert2";

import ResumeFormat1 from "./ResumeFormat1";
import ResumeFormat2 from "./ResumeFormat2";

const EditableInput = ({ value, onChange, maxLength }) => (
  <input
    type="text"
    className="form-control rounded-3 p-2 bg-white"
    value={value ?? ""}
    onChange={onChange}
    maxLength={maxLength}
  />
);

const EditableTextarea = ({ value, onChange, rows = 3 }) => (
  <textarea
    className="form-control rounded-4 p-2 bg-white"
    rows={rows}
    value={value ?? ""}
    onChange={onChange}
  />
);

export default function ResumeEdit({ row, onCancel, onSave }) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    profile: "",
    mob: "",
    email: "",
    dob: "",
    address: "",
    resume_format: "", // 👈 add this
    summary: "",
    jobDetails: [],
    education: [],
    skill: [],
    languages: [],
    hobbies: [],
  });

  const splitAddress = (address) => {
    const parts = address.split(",");

    const address1 = parts[0]?.trim() || "";
    const address2 = parts[1]?.trim() || "";
    const city = parts[2]?.trim() || "";
    const state = parts[3]?.trim() || "";

    const countryMatch = address.match(/\(([^)]+)\)/);
    const pinMatch = address.match(/PIN\s*-\s*(\d+)/i);

    return {
      address1,
      address2,
      city,
      state,
      country: countryMatch ? countryMatch[1] : "",
      zip: pinMatch ? pinMatch[1] : "",
    };
  };

  const handleSave = async () => {
    const addr = splitAddress(formData.address);

    const payload = {
      id: formData.id,
      name: formData.name,
      profile: formData.profile,
      mob: formData.mob,
      email: formData.email,
      dob: formData.dob,

      address1: addr.address1,
      address2: addr.address2,
      city: addr.city,
      state: addr.state,
      country: addr.country,
      zip: addr.zip,

      summary: formData.summary,

      jobDetails: JSON.stringify(formData.jobDetails),
      education: JSON.stringify(formData.education),
      skill: JSON.stringify(formData.skill),
      languages: JSON.stringify(formData.languages),
      hobbies: JSON.stringify(formData.hobbies),
    };

    const res = await fetch(
      "http://localhost:8080/ords/demo123/resume/update",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (res.ok) {
      Swal.fire({
        icon: "Success",
        title: "Updates completed",
        text: "Resume details updated successfully",
        timer: 2000,
        confirmButtonColor: "#01536e",
      });
      onSave(); // optional refresh
    } else {
      Swal.fire({
        icon: "error",
        title: "Updates Failed",
        text: "Unable to update.",
        timer: 2000,
        confirmButtonColor: "#01536e",
      });
    }
  };

  // Load row data into state when the component mounts
  useEffect(() => {
    if (row) {
      setFormData({
        jobDetails: row.jobDetails || [],
        education: row.education || [],
        skill: row.skill ? row.skill.split(",") : [],
        languages: row.languages ? row.languages.split(",") : [],
        hobbies: row.hobbies ? row.hobbies.split(",") : [],
        summary: row.summary || "",
        resume_format: row.resume_format || "", // 👈
        name: row.name || "",
        profile: row.profile || "",
        mob: row.mob || "",
        email: row.email || "",
        dob: row.dob || "",
        address: row.address || "",
        id: row.id || "",
      });
    }
  }, [row]);

  // Reusable Input Components

  const DisabledInput = ({ value }) => (
    <input
      type="text"
      className="form-control rounded-3 p-2 bg-light cursor-not-allowed"
      value={value ?? ""}
      disabled
    />
  );

  // Helper to update state safely
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

  return (
    <div>
      <Row className="d-flex align-items-center ">
        <Col md={3} xs={6}>
          <h3 className="text-tale fw-bolder ">Edit Details</h3>
        </Col>
        <Col md={9} xs={6}>
          <div className="d-flex justify-content-end gap-4 p-1 mb-3">
            <button
              className="btn-press bg-tale text-white p-2  rounded-2 border-0 d-flex  align-items-center  btn-press"
              onClick={() => handleSave()}
            >
              <i className="bx bx-save fs-5"></i>
              <span className=" ms-2 me-2 fw-bold">SAVE </span>
            </button>

            <button
              className="btn-press bg-red text-white p-2  rounded-2 border-0 d-flex  align-items-center  btn-press"
              onClick={onCancel}
            >
              <i className="bx bx-x fs-4"></i>
              <span className=" ms-2 me-2 fw-bold">CANCEL </span>
            </button>
          </div>
        </Col>
      </Row>
      <div className="horizontal-bar mb-4"></div>
      <Row className="g-2 ">
        <div className="d-flex gap-4 ">
          <div className="bg-white shadow-lg p-3 text-dark w-50 rounded d-flex flex-column ">
            {/*Personal Details*/}
            <Card className="shadow-lg rounded-3 text-dark ">
              <CardBody>
                <h5 className="text-tale fw-semibold mb-2">Personal Details</h5>
                <Row className="mb-2">
                  <Col md={3}>
                    <label className="fw-semibold">Resume ID</label>
                    <DisabledInput value={formData.id} />
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col md={3}>
                    <label className="fw-semibold">Full Name</label>
                    <EditableInput
                      value={formData.name}
                      onChange={(e) => updateField("name", e.target.value)}
                    />
                  </Col>
                  <Col md={3}>
                    <label className="fw-semibold">Profile</label>
                    <EditableInput
                      value={formData.profile}
                      onChange={(e) => updateField("profile", e.target.value)}
                    />
                  </Col>
                  <Col md={3}>
                    <label className="fw-semibold">Phone</label>
                    <EditableInput
                      value={formData.mob}
                      onChange={(e) =>
                        updateField("mob", e.target.value.replace(/\D/g, ""))
                      }
                      maxLength={10}
                    />
                  </Col>
                  <Col md={3}>
                    <label className="fw-semibold">Email</label>
                    <EditableInput
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col md={3}>
                    <label className="fw-semibold">Date of Birth</label>
                    <EditableInput
                      value={formData.dob}
                      onChange={(e) => updateField("dob", e.target.value)}
                    />
                  </Col>
                  <Col md={6}>
                    <label className="fw-semibold">Address</label>
                    <EditableInput
                      value={formData.address}
                      onChange={(e) => updateField("address", e.target.value)}
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>
            {/*Summary*/}
            <Card className="shadow-lg rounded-3 ">
              <CardBody>
                <h5 className="text-tale fw-semibold mb-2">Summary</h5>
                <EditableTextarea
                  value={formData.summary}
                  onChange={(e) => updateField("summary", e.target.value)}
                  rows={4}
                />
              </CardBody>
            </Card>
            {/*Job*/}
            <Card className="shadow-lg rounded-3 p-3 text-dark ">
              <h5 className="text-tale fw-semibold mb-2">Job Experience</h5>

              <Row>
                {formData.jobDetails.map((job, index) => (
                  <Col md={6} key={index} className="mb-2">
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
                    />

                    <label className="fw-semibold mt-2">Profile</label>
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
                    />

                    <label className="fw-semibold mt-2">Work Summary</label>
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
                    />

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
            <Card className="shadow-lg rounded-3 text-dark p-3 ">
              <h5 className="text-tale fw-semibold mb-2">Education</h5>

              <Row>
                {formData.education.map((edu, index) => (
                  <Col md={6} key={index} className="mb-2">
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
                    />

                    <label className="fw-semibold mt-2">College</label>
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
                    />

                    <label className="fw-semibold mt-2">Passing Year</label>
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
                    />

                    <label className="fw-semibold mt-2">Percentile</label>
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
                    />

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
                <h5 className="text-tale fw-semibold mb-2">Skills</h5>

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
                <h5 className="text-tale fw-semibold mb-2">Languages</h5>

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
                <h5 className="text-tale fw-semibold mb-2">Hobbies</h5>

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
          </div>
          {/*FROM here */}
          <div
            className=" rounded-3 p-3 
            d-flex flex-column w-50 overflow-auto"
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
            </div>
          </div>
          {/*To here */}
        </div>
      </Row>
    </div>
    
  );
}



