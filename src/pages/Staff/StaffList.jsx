import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Table,
  Button,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import Switch from "react-switch";
import Swal from "sweetalert2";

import "../../assets/css/Main.css";

import Breadcrumb from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";

const StaffList = (props) => {
  const navigate = useNavigate();

  const [selectedRow, setSelectedRow] = useState(null);

  const toggleStatus = (index) => {
    const updated = [...apiData];
    updated[index].status = !updated[index].status;
    setApiData(updated);
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStaffList = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/ords/demo123/staff/list/",
      );

      if (!response.ok) {
        throw new Error("Failed to fetch staff list");
      }

      const data = await response.json();

      // Map ORDS JSON → UI format
      const mappedData = data.items.map((item) => ({
        id: item.emp_id,
        name: item.name,
        designation: item.designation,
        phone: item.phone_number,
        email: item.company_email,
        joiningDate: item.joining_date,
        status: true, // default (you can map DB column later)
      }));

      setApiData(mappedData);
      await delay(500); // 0.5 second
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Unable to load staff data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Staff | Ambrella Consultancy";

    fetchStaffList();
  }, []);

  return (
    <div className="page-content ">
      {loading && (
        <div className="page-loader">
          <div className="page-loader-spinner"></div>
        </div>
      )}
      <Container fluid>
        {/* PAGE TITLE */}
        <Breadcrumb
          title={props.t("Staff")}
          breadcrumbItem={props.t("Staff List")}
        />

        <div className="px-3">
          <Card>
            <CardBody>
              <Row>
                {/* ================= TOP BAR ================= */}
                <Col md={12} className="p-2 ms-1">
                  <Row className="align-items-center">
                    {/* Show entries */}
                    <Col xs={6} md={2} className="d-flex align-items-center">
                      <Input type="select" className="border-light  border">
                        <option>Show 50</option>
                        <option>Show 25</option>
                        <option>Show 10</option>
                      </Input>
                    </Col>

                    {/* Search + Buttons */}
                    <Col xs={6} md={10}>
                      <Row className="justify-content-end align-items-center me-2 gap-5">
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
                        >
                          <button
                            className="p-2 btn-press px-3 py-2 d-flex align-items-center text-white border-0 bg-tale rounded-2"
                            onClick={() => {
                              setLoading(true); // show loader
                              setTimeout(() => {
                                navigate("/staff/add");
                                setLoading(false);
                              }, 500);
                            }}
                          >
                            <i className="bx bx-plus fw-bold fs-5"></i>{" "}
                            <span className="ms-2 fw-bold me-2">STAFF</span>
                          </button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>

                {/* ================= TABLE ================= */}
                <Col md={12} className="mt-2">
                  <div className="table-responsive">
                    <Table
                      responsive
                      className="table align-left table-hover table-bordered table-nowrap"
                    >
                      <thead className="table-light">
                        <tr>
                          <th>Emp Id</th>
                          <th>Name</th>
                          <th>Designation</th>
                          <th>Phone no</th>
                          <th>Email Id</th>
                          <th>Joining Date</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>

                      <tbody className="align-middle">
                        {loading ? (
                          <tr>
                            <td colSpan="8" className="text-center">
                              Loading staff data...
                            </td>
                          </tr>
                        ) : apiData.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="text-center">
                              No staff records found
                            </td>
                          </tr>
                        ) : (
                          apiData.map((staff, index) => (
                            <tr
                              key={staff.id}
                              className={
                                selectedRow === index ? "table-active" : ""
                              }
                              onClick={() => setSelectedRow(index)}
                              style={{ cursor: "pointer" }}
                            >
                              <td>{staff.id}</td>
                              <td>{staff.name}</td>
                              <td>{staff.designation}</td>
                              <td>{staff.phone}</td>
                              <td>{staff.email}</td>
                              <td>{staff.joiningDate}</td>

                              {/* STATUS */}
                              <td>
                                <Switch
                                  checked={staff.status}
                                  onChange={() => toggleStatus(index)}
                                  onColor="#01536e"
                                  offColor="#e0e0e0"
                                  uncheckedIcon={false}
                                  checkedIcon={false}
                                  height={18}
                                  width={36}
                                />
                              </td>

                              {/* ACTIONS */}
                              <td>
                                <div className="d-flex gap-2">
                                  {/* VIEW */}
                                  <button
                                    className="btn-press p-2 align-items-center rounded-2 d-flex icon-css bg-white"
                                    title="View"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setLoading(true); // show loader
                                      setTimeout(() => {
                                        navigate(`/staff/view/${staff.id}`, {});
                                        setLoading(false); // optional if you want loader until navigation finishes
                                      }, 500); // small delay for spinner to show
                                    }}
                                  >
                                    <i className="bx bx-show fs-5"></i>
                                  </button>

                                  {/* EDIT */}
                                  <button
                                    className="btn-press p-2 align-items-center rounded-2 d-flex icon-css bg-white "
                                    title="Edit"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setLoading(true); // show loader
                                      setTimeout(() => {
                                        navigate(`/staff/edit/${staff.id}`, {
                                          state: { staff, isReadOnly: false },
                                        });
                                        setLoading(false); // optional
                                      }, 500);
                                    }}
                                  >
                                    <i className="bx bx-pencil fs-5"></i>
                                  </button>

                                  {/* DELETE */}
                                  <button
                                    className="btn-press p-2 align-items-center rounded-2 d-flex text-red bg-white border-1"
                                    title="Delete"
                                    onClick={(e) => {
                                      e.stopPropagation();

                                      Swal.fire({
                                        title: "Are you sure?",
                                        text: "This staff record will be permanently deleted!",
                                        icon: "warning",
                                        showCancelButton: true,
                                        confirmButtonColor: "#01536e",
                                        cancelButtonColor: "red",
                                        confirmButtonText: "Yes, delete it!",
                                        cancelButtonText: "Cancel",
                                      }).then(async (result) => {
                                        if (result.isConfirmed) {
                                          try {
                                            const res = await fetch(
                                              `http://localhost:8080/ords/demo123/staff/delete/${staff.id}`,
                                              { method: "DELETE" },
                                            );

                                            if (!res.ok) {
                                              throw new Error("Delete failed");
                                            }

                                            // ✅ Remove from UI only after DB success
                                            setApiData((prev) =>
                                              prev.filter(
                                                (_, i) => i !== index,
                                              ),
                                            );

                                            Swal.fire({
                                              title: "Deleted!",
                                              text: "Staff has been deleted.",
                                              icon: "success",
                                              confirmButtonColor: "#01536e",
                                            });
                                          } catch (err) {
                                            console.error(err);
                                            Swal.fire(
                                              "Error",
                                              "Unable to delete staff",
                                              "error",
                                            );
                                          }
                                        }
                                      });
                                    }}
                                  >
                                    <i className="fas fa-trash fs-5"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </Table>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default withTranslation()(StaffList);
