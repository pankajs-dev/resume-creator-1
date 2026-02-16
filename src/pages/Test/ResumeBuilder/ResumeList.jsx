import { useState } from "react";
import { useEffect, useRef } from "react";
import { Container, Row, Col, Card, CardBody, Input } from "reactstrap";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Common/Breadcrumb";
import "../../assets/css/Main.css";
import "../../assets/ResumeBuilderCss/Modal.css";
import { withTranslation } from "react-i18next";
import "animate.css";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import "remixicon/fonts/remixicon.css";
import { confirmDelete, downloadSWAL } from "../../pages/Utility/swal";
import ResumeEdit from "./ResumeEdit";
import Swal from "sweetalert2";

function ResumeList(props) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, []);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const showLoader = async (ms = 500) => {
    setLoading(true);
    await delay(ms);
    setLoading(false);
  };
  const fetchResumes = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/ords/demo123/resume/list",
      );

      const result = await response.json();

      // ORDS returns { items: [] }
      const mapped = result.items.map((r) => ({
        id: r.id,
        name: r.full_name,
        profile: r.profile,
        mob: r.mobile,
        email: r.email,
        dob: r.dob,

        // skills comes as string: ["Java","React"]
        skill: r.skills ? JSON.parse(r.skills).join(", ") : "",
      }));

      setData(mapped);
      await delay(500); // 0.5 second
    } catch (err) {
      console.error("Error fetching resumes", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchResumeById = async (id, openMode = "view") => {
    try {
      const res = await fetch(
        `http://localhost:8080/ords/demo123/resume/view/${id}`,
      );

      const data = await res.json();
      const r = data.items[0];

      if (!r) {
        Swal.fire({
          icon: "error",
          title: "Not Found",
          text: "Resume not found",
          timer: 2000,
          confirmButtonColor: "#01536e",
        });
        return;
      }

      const mapped = {
        id: r.id,
        name: r.full_name,
        profile: r.profile,
        mob: r.mobile,
        email: r.email,
        dob: r.dob,
        address: r.full_address,
        summary: r.summary,
        resume_format: r.resume_format,
        skill: r.skills ? JSON.parse(r.skills).join(", ") : "",
        languages: r.languages ? JSON.parse(r.languages).join(", ") : "",
        hobbies: r.hobbies ? JSON.parse(r.hobbies).join(", ") : "",

        jobDetails: r.job_exp ? JSON.parse(r.job_exp) : [],
        education: r.education ? JSON.parse(r.education) : [],
      };

      setSelectedResume(mapped);
      setTimeout(() => setMode(openMode), 0); // 🔥 dynamic
    } catch (err) {
      console.error("View API error", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:8080/ords/demo123/resume/delete/${id}`,

        { method: "DELETE" },
      );

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Resume deleted successfully.",
          timer: 2000,
          confirmButtonColor: "#01536e",
        });
        fetchResumes();
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "Unable to delete Resume",
          timer: 2000,
          confirmButtonColor: "#01536e",
        });
      }
    } catch (err) {
      console.error("Delete err", err);
      Swal.fire("Error", "Server error", "error");
    }
  };

  const navigate = useNavigate();

  const DisabledInput = ({ value }) => (
    <input
      type="text"
      className="form-control rounded-3 p-2 bg-light mt-2 cursor-not-allowed"
      value={value || ""}
      disabled
    />
  );
  const [mode, setMode] = useState("list"); // list | edit | view
  const [selectedResume, setSelectedResume] = useState(null);
  const [content, setContent] = useState("Personal");
  const [isExiting, setIsExiting] = useState(false);
  const [openMenu, setOpenMenu] = useState({
    rowId: null,
    type: null, // "download" | "dropdown"
  });

  const closeViewModal = async () => {
    setLoading(true);

    await delay(300);

    setSelectedResume(null);
    setContent("Personal");
    setMode("list");

    setLoading(false);
  };

  const menuRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu({ rowId: null, type: null });
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  return (
    <div className="page-content ">
      {loading && (
        <div className="page-loader">
          <div className="page-loader-spinner"></div>
        </div>
      )}
      <Container fluid>
        <Breadcrumb
          title={props.t("Resume")}
          breadcrumbItem={props.t("Resume List")}
        />
        <div className="px-3">
          {mode === "list" && (
            <Card>
              <CardBody>
                {mode === "list" && (
                  <Row>
                    {/* ================= TOP BAR ================= */}
                    <Col md={12} className=" p-2 ms-1">
                      <Row className="align-items-center  ">
                        {/* Show entries */}
                        <Col
                          xs={6}
                          md={2}
                          className="d-flex align-items-center "
                        >
                          <Input type="select" className="border-light  border">
                            <option>Show 50</option>
                            <option>Show 25</option>
                            <option>Show 10</option>
                          </Input>
                        </Col>

                        {/* Search + Add Button */}
                        <Col xs={6} md={10}>
                          <Row className="justify-content-end align-items-center me-2 gap-5 ">
                            <Col
                              md={4}
                              className="d-flex bg-white text-secondary border  border-light align-items-center rounded-2"
                            >
                              <i className="ri-search-line ms-2"></i>
                              <Input
                                type="search"
                                className="border-0"
                                placeholder="Search..."
                              />
                            </Col>

                            <Col
                              md={2}
                              className="d-flex gap-2 justify-content-end"
                              onClick={async () => {
                                await showLoader();
                                navigate("/resumeForm");
                              }}
                            >
                              <button className="btn-press p-2 d-flex align-items-center text-white border-0 bg-tale rounded-2">
                                <i className="bx bx-plus fw-bold fs-5"></i>
                                <span className="ms-2 fw-bold me-2">
                                  ADD RESUME
                                </span>
                              </button>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>

                    {/* ================= TABLE ================= */}
                    <Col md={12} className="mt-2">
                      <div className="table-responsive">
                        <table className="table table-bordered table-hover  ">
                          <thead className="table-light">
                            <tr>
                              <th>ID</th>
                              <th>Name</th>
                              <th>Profile</th>
                              <th>Mobile</th>
                              <th>Email</th>
                              <th>Skills</th>
                              <th>Date-Of-Birth</th>
                              <th>Actions</th>
                            </tr>
                          </thead>

                          <tbody className="align-middle">
                            {loading ? (
                              <tr>
                                <td colSpan="8" className="text-center">
                                  Loading...
                                </td>
                              </tr>
                            ) : data.length > 0 ? (
                              data.map((row, index) => (
                                <tr key={index}>
                                  <td>{row.id}</td>
                                  <td>{row.name}</td>
                                  <td>{row.profile}</td>
                                  <td>{row.mob}</td>
                                  <td>{row.email}</td>
                                  <td>{row.skill}</td>
                                  <td>{row.dob}</td>

                                  <td>
                                    <div
                                      className="position-relative d-flex gap-2"
                                      ref={menuRef}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {/* View Button */}
                                      <button
                                        className="btn-press p-2 d-flex align-items-center rounded-2 icon-css bg-white"
                                        onClick={async () => {
                                          setLoading(true);
                                          await fetchResumeById(row.id, "view");
                                          await delay(400);
                                          setLoading(false);
                                        }}
                                      >
                                        <i className="bx bx-show fs-5"></i>
                                      </button>
                                      {/* Download Button */}
                                      <button
                                        className="btn-press p-2 d-flex align-items-center rounded-2 icon-css bg-white"
                                        onClick={() =>
                                          setOpenMenu({
                                            rowId: row.id,
                                            type:
                                              openMenu.rowId === row.id &&
                                              openMenu.type === "download"
                                                ? null
                                                : "download",
                                          })
                                        }
                                      >
                                        <i className="bx bx-download fs-5"></i>
                                      </button>

                                      {openMenu.rowId === row.id &&
                                        openMenu.type === "download" && (
                                          <div className="dropdown-menu show shadow-lg">
                                            <button
                                              className="btn-press icon-css border-0 d-flex align-items-center gap-2 bg-white"
                                              onClick={() => {
                                                downloadSWAL("WORD");
                                                setOpenMenu({
                                                  rowId: null,
                                                  type: null,
                                                });
                                              }}
                                            >
                                              <i className="bx bxs-file-doc fs-5"></i>
                                              <span className="text-dark">
                                                WORD
                                              </span>
                                            </button>

                                            <button
                                              className="btn-press border-0 icon-css d-flex align-items-center gap-2 bg-white "
                                              onClick={() => {
                                                downloadSWAL("PDF");
                                                setOpenMenu({
                                                  rowId: null,
                                                  type: null,
                                                });
                                              }}
                                            >
                                              <i className="bx bxs-file-pdf fs-5"></i>
                                              <span className="text-dark">
                                                PDF
                                              </span>
                                            </button>
                                          </div>
                                        )}

                                      {/* 3 Dots Button */}
                                      <button
                                        className="btn-press p-2 d-flex align-items-center rounded-2 icon-css bg-white"
                                        onClick={() =>
                                          setOpenMenu({
                                            rowId: row.id,
                                            type:
                                              openMenu.rowId === row.id &&
                                              openMenu.type === "dropdown"
                                                ? null
                                                : "dropdown",
                                          })
                                        }
                                      >
                                        <i className="bx bx-dots-horizontal fs-5"></i>
                                      </button>

                                      {openMenu.rowId === row.id &&
                                        openMenu.type === "dropdown" && (
                                          <div className="dropdown-menu show shadow-lg">
                                            <button
                                              className="btn-press icon-css border-0 d-flex align-items-center gap-2 bg-white"
                                              onClick={async () => {
                                                setLoading(true);
                                                await fetchResumeById(
                                                  row.id,
                                                  "edit",
                                                );
                                                await delay(400);
                                                setLoading(false);
                                                setOpenMenu({
                                                  rowId: null,
                                                  type: null,
                                                });
                                              }}
                                            >
                                              <i className="bx bxs-pencil fs-5"></i>
                                              <span className="text-dark">
                                                Edit
                                              </span>
                                            </button>

                                            <button
                                              className="btn-press border-0 d-flex align-items-center gap-2 bg-white text-red"
                                              onClick={() => {
                                                confirmDelete(() =>
                                                  handleDelete(row.id),
                                                );
                                                setOpenMenu({
                                                  rowId: null,
                                                  type: null,
                                                });
                                              }}
                                            >
                                              <i className="bx bxs-trash fs-5"></i>
                                              <span>Delete</span>
                                            </button>
                                          </div>
                                        )}
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="8" className="text-center">
                                  No records found.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </Col>
                  </Row>
                )}
              </CardBody>
            </Card>
          )}

          {/*View Modal*/}
          <Modal
            isOpen={mode === "view"}
            toggle={closeViewModal}
            size="xl"
            centered
            scrollable
            className="modal-fullscreen"
          >
            <ModalHeader className="rounded " toggle={closeViewModal}>
              <span className="text-tale fw-bolder"> Full Details</span>
            </ModalHeader>

            <ModalBody>
              {selectedResume && (
                <div className="d-flex gap-4 ">
                  <div className="bg-#f8f8fb shadow-lg p-3 text-dark w-25 rounded d-flex flex-column ">
                    <h6
                      className={`p-2 cursor-pointer ${
                        content === "Personal"
                          ? "bg-tale text-white rounded"
                          : ""
                      }`}
                      onClick={() => setContent("Personal")}
                    >
                      Personal Details
                    </h6>
                    <h6
                      className={`p-2 cursor-pointer ${
                        content === "Summary"
                          ? "bg-tale text-white rounded"
                          : ""
                      }`}
                      onClick={() => setContent("Summary")}
                    >
                      Summary
                    </h6>
                    <h6
                      className={`p-2 cursor-pointer ${
                        content === "Job Experience"
                          ? "bg-tale text-white rounded"
                          : ""
                      }`}
                      onClick={() => setContent("Job Experience")}
                    >
                      Job Experience
                    </h6>
                    <h6
                      className={`p-2 cursor-pointer ${
                        content === "Education"
                          ? "bg-tale text-white rounded"
                          : ""
                      }`}
                      onClick={() => setContent("Education")}
                    >
                      Education
                    </h6>

                    <h6
                      className={`p-2 cursor-pointer ${
                        content === "Skills" ? "bg-tale text-white rounded" : ""
                      }`}
                      onClick={() => setContent("Skills")}
                    >
                      Skill Set
                    </h6>
                    <h6
                      className={`p-2 cursor-pointer ${
                        content === "Languages"
                          ? "bg-tale text-white rounded"
                          : ""
                      }`}
                      onClick={() => setContent("Languages")}
                    >
                      Languages
                    </h6>
                    <h6
                      className={`p-2 cursor-pointer ${
                        content === "Hobbies"
                          ? "bg-tale text-white rounded"
                          : ""
                      }`}
                      onClick={() => setContent("Hobbies")}
                    >
                      Hobbies
                    </h6>
                  </div>
                  <div className=" w-75">
                    <Container fluid className="d-flex flex-column ">
                      {/* ================= PERSONAL DETAILS================= */}
                      {content === "Personal" && (
                        <Row className="rounded-3 bg-#f8f8fb shadow-lg">
                          <Col
                            xs={12}
                            className="p-2 fw-bolder fs-5 text-tale mb-0"
                          >
                            Personal Deatails -
                          </Col>

                          <Col xs={12}>
                            <Card className="text-dark">
                              <CardBody>
                                <Row>
                                  <Col md={3}>
                                    <strong>Resume ID :</strong>
                                    <DisabledInput value={selectedResume.id} />
                                  </Col>
                                </Row>

                                <Row className="mt-2">
                                  <Col md={3}>
                                    <strong>Full Name :</strong>
                                    <DisabledInput
                                      value={selectedResume.name}
                                    />
                                  </Col>

                                  <Col md={3}>
                                    <strong>Profile :</strong>
                                    <DisabledInput
                                      value={selectedResume.profile}
                                    />
                                  </Col>

                                  <Col md={3}>
                                    <strong>Mobile :</strong>
                                    <DisabledInput value={selectedResume.mob} />
                                  </Col>

                                  <Col md={3}>
                                    <strong>Email :</strong>
                                    <DisabledInput
                                      value={selectedResume.email}
                                    />
                                  </Col>
                                </Row>

                                <Row className="mt-2">
                                  <Col md={3}>
                                    <strong>Date of Birth :</strong>
                                    <DisabledInput value={selectedResume.dob} />
                                  </Col>

                                  <Col md={6}>
                                    <strong>Address :</strong>
                                    <DisabledInput
                                      value={selectedResume.address}
                                    />
                                  </Col>
                                </Row>
                              </CardBody>
                            </Card>
                          </Col>
                        </Row>
                      )}

                      {/* ================= SUMMARY ================= */}
                      {content === "Summary" && (
                        <Row className="m-1 rounded-3 bg-#f8f8fb  shadow-lg">
                          <Col xs={12} className="p-2 fw-bolder fs-5 text-tale">
                            Summary -
                          </Col>

                          <Col xs={12}>
                            <Card className="text-dark">
                              <textarea
                                className="form-control rounded-3 p-2 bg-light"
                                value={selectedResume.summary}
                                disabled
                                rows={4}
                              />
                            </Card>
                          </Col>
                        </Row>
                      )}

                      {/* ================= JOB EXPERIENCE ================= */}
                      {content === "Job Experience" && (
                        <Row className="m-1 rounded-3 bg-#f8f8fb  shadow-lg">
                          <Col xs={12} className="p-2 fw-bolder fs-5 text-tale">
                            Job Experience -
                          </Col>

                          <Col xs={12}>
                            <Row>
                              {selectedResume?.jobDetails?.map((job, index) => (
                                <Col md={6} key={index} className="mb-3">
                                  <Card className=" text-dark ">
                                    <p>
                                      <strong>Company :</strong>{" "}
                                      <DisabledInput value={job.company} />
                                    </p>
                                    <p>
                                      <strong>Profile :</strong>{" "}
                                      <DisabledInput value={job.cprofile} />
                                    </p>
                                    <p>
                                      <strong>Work Summary :</strong>{" "}
                                      <textarea
                                        className="form-control rounded-4 p-2 bg-light mt-1"
                                        value={job.workSummary}
                                        disabled
                                        rows={3}
                                      />
                                    </p>
                                  </Card>
                                </Col>
                              ))}
                            </Row>
                          </Col>
                        </Row>
                      )}

                      {/* ================= EDUCATION ================= */}
                      {content === "Education" && (
                        <Row className="m-1 rounded-3 bg-#f8f8fb  shadow-lg">
                          <Col xs={12} className="p-2 fw-bolder fs-5 text-tale">
                            Education -
                          </Col>

                          <Col xs={12}>
                            <Row>
                              {selectedResume?.education?.map((edu, index) => (
                                <Col md={6} key={index} className="mb-3">
                                  <Card className=" text-dark">
                                    <p>
                                      <strong>Degree :</strong>{" "}
                                      <DisabledInput value={edu.degree} />
                                    </p>
                                    <p>
                                      <strong>College :</strong>{" "}
                                      <DisabledInput value={edu.college} />
                                    </p>
                                    <p>
                                      <strong>Passing Year :</strong>{" "}
                                      <DisabledInput value={edu.year} />
                                    </p>
                                    <p>
                                      <strong>Percentile :</strong>{" "}
                                      <DisabledInput value={edu.percentile} />
                                    </p>
                                  </Card>
                                </Col>
                              ))}
                            </Row>
                          </Col>
                        </Row>
                      )}

                      {/* ================= SKILLS ================= */}
                      {content === "Skills" && (
                        <Row className="m-1 rounded-3 bg-#f8f8fb  shadow-lg">
                          <Col xs={12} className="p-2 fw-bolder fs-5 text-tale">
                            Skills -
                          </Col>

                          <Col xs={12}>
                            <Card className="text-dark">
                              <DisabledInput value={selectedResume.skill} />
                            </Card>
                          </Col>
                        </Row>
                      )}

                      {/* ================= LANGUAGES ================= */}
                      {content === "Languages" && (
                        <Row className="m-1 rounded-3 bg-#f8f8fb  shadow-lg">
                          <Col xs={12} className="p-2 fw-bolder fs-5 text-tale">
                            Languages -
                          </Col>

                          <Col xs={12}>
                            <Card className="text-dark">
                              <DisabledInput value={selectedResume.languages} />
                            </Card>
                          </Col>
                        </Row>
                      )}

                      {/* ================= HOBBIES ================= */}
                      {content === "Hobbies" && (
                        <Row className="m-1 rounded-3 bg-#f8f8fb  shadow-lg">
                          <Col
                            xs={12}
                            className="p-2 fw-bolder fs-5 text-tale "
                          >
                            Hobbies -
                          </Col>

                          <Col xs={12}>
                            <Card className="text-dark">
                              <DisabledInput value={selectedResume.hobbies} />
                            </Card>
                          </Col>
                        </Row>
                      )}
                    </Container>
                  </div>
                </div>
              )}
            </ModalBody>
          </Modal>

          {mode === "edit" && selectedResume && (
            <div
              className={`animate__animated animate__fast ${
                isExiting ? "animate__fadeOut" : "animate__fadeIn"
              }`}
            >
              <ResumeEdit
                row={selectedResume}
                onCancel={async () => {
                  setIsExiting(true);
                  setLoading(true);

                  setTimeout(() => {
                    setIsExiting(false);
                    setMode("list");
                    setSelectedResume(null);
                    setLoading(false);
                  }, 300);
                }}
                onSave={async () => {
                  setIsExiting(true);
                  setLoading(true);

                  setTimeout(async () => {
                    await fetchResumes();
                    setIsExiting(false);
                    setMode("list");
                    setSelectedResume(null);
                    setLoading(false);
                  }, 300);
                }}
              />
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
export default withTranslation()(ResumeList);
