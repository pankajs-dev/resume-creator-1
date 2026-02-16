import "../../assets/css/Main.css";
import "animate.css";

export default function ResumeFormat1({
  formData,
  updateField,
  updateArrayItem,
}) {
  return (
    <div className=" shadow-lg bg-white rounded-3 p-3">
      <div className="bg-light border-2 border border-secondary  p-3">
        <div className="d-flex flex-column align-items-end">
          <label
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => updateField("name", e.currentTarget.textContent)}
            className="fs-3 fw-bolder text-tale custom-focus px-1 mb-0 lh-sm"
          >
            {formData.name}
          </label>

          <label
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => updateField("profile", e.currentTarget.textContent)}
            className="fs-6 text-aqua custom-focus px-1  lh-sm"
          >
            {formData.profile}
          </label>

          <div className="mb-0 lh-sm monospace text-dark fw-bold">
            <label
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                updateField(
                  "mob",
                  e.currentTarget.textContent.replace(/\D/g, "").slice(0, 10)
                )
              }
              className="text-dark custom-focus px-1 mb-0 lh-sm"
            >
              <small>{formData.mob}</small>
            </label>
            {"|"}
            <label
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => updateField("email", e.currentTarget.textContent)}
              className="text-dark custom-focus px-1 mb-0 lh-sm"
            >
              <small>{formData.email}</small>
            </label>
          </div>

          <div>
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => updateField("city", e.currentTarget.textContent)}
              className="text-dark fw-bold custom-focus  mb-0 lh-sm"
            >
              <small>{formData.city}</small>
            </span>
            {", "}
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => updateField("state", e.currentTarget.textContent)}
              className="text-dark fw-bold custom-focus  mb-0 lh-sm"
            >
              <small>{formData.state}</small>
            </span>
            {" ["}
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                updateField("country", e.currentTarget.textContent)
              }
              className="text-dark fw-bold custom-focus  mb-0 lh-sm"
            >
              <small>{formData.country}</small>
            </span>
            {"]"}
          </div>

          <label
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => updateField("summary", e.currentTarget.textContent)}
            className=" fs-6 text-dark custom-focus px-1 mt-2 mb-2 lh-sm"
          >
            <small>{formData.summary}</small>
          </label>
        </div>

        <div className="horizontal-bar"></div>

        <div className="row">
          <div className=" col-12 col-md-6">
            <div className="d-flex gap-2 flex-column">
              <label className="fs-6 text-tale fw-bold custom-focus px-1 lh-sm">
                Job Experience
              </label>

              <div className="row ">
                {formData.jobDetails.map((data, index) => (
                  <div key={index} className="col-12">
                    <div className="d-flex flex-column">
                      <label
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          updateArrayItem(
                            "jobDetails",
                            index,
                            "company",
                            e.currentTarget.textContent
                          )
                        }
                        className="text-tale fw-bold custom-focus px-1 mb-0 lh-sm"
                      >
                        {data.company}
                      </label>
                      <label
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          updateArrayItem(
                            "jobDetails",
                            index,
                            "cprofile",
                            e.currentTarget.textContent
                          )
                        }
                        className=" text-dark  custom-focus px-1 mb-0 lh-sm"
                      >
                        <small> {data.cprofile}</small>
                      </label>
                      <label
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          updateArrayItem(
                            "jobDetails",
                            index,
                            "workSummary",
                            e.currentTarget.textContent
                          )
                        }
                        className="fs-6 text-dark custom-focus px-1  lh-sm"
                      >
                        <small>{data.workSummary}</small>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="horizontal-bar"></div>

            <div className="d-flex flex-column gap-2">
              <label className="fs-6 text-tale fw-bold custom-focus px-1 lh-sm">
                Education
              </label>

              <div className="row ">
                {formData.education.map((data, index) => (
                  <div key={index} className="col-12 col-md-6">
                    <div className="d-flex flex-column">
                      <label
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          updateArrayItem(
                            "education",
                            index,
                            "degree",
                            e.currentTarget.textContent
                          )
                        }
                        className="text-tale fw-bold custom-focus px-1 mb-0 lh-sm"
                      >
                        {data.degree}
                      </label>
                      <label
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          updateArrayItem(
                            "education",
                            index,
                            "college",
                            e.currentTarget.textContent
                          )
                        }
                        className=" text-dark  custom-focus px-1 mb-0 lh-sm"
                      >
                        {data.college}
                      </label>

                      <label
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          updateArrayItem(
                            "education",
                            index,
                            "year",
                            e.currentTarget.textContent
                          )
                        }
                        className="fs-6 text-dark custom-focus px-1 mb-0 lh-sm"
                      >
                        <small>{data.year}</small>
                      </label>
                      <label
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          updateArrayItem(
                            "education",
                            index,
                            "percentile",
                            e.currentTarget.textContent
                          )
                        }
                        className="fs-6 text-dark custom-focus px-1  lh-sm"
                      >
                        <small>{data.percentile}%</small>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className=" col-12 col-md-6 px-md-3">
            <div className="d-flex flex-column ">
              <label className="fs-6 text-tale fw-bold custom-focus px-1 lh-sm">
                Skills
              </label>
              <label
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) =>
                  updateField(
                    "skill",
                    e.currentTarget.textContent.split(",").map((s) => s.trim())
                  )
                }
                className=" text-dark custom-focus px-1 "
              >
                {formData.skill.join(", ")}
              </label>
            </div>
            <div className="horizontal-bar"></div>

            <div className="d-flex flex-column">
              <label className="fs-6 text-tale fw-bold custom-focus px-1 lh-sm">
                Languages
              </label>
              <label
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) =>
                  updateField(
                    "languages",
                    e.currentTarget.textContent.split(",").map((s) => s.trim())
                  )
                }
                className=" text-dark custom-focus px-1 "
              >
                {formData.languages.join(", ")}
              </label>
            </div>

            <div className="horizontal-bar"></div>

            <div className="d-flex flex-column">
              <label className="fs-6 text-tale fw-bold custom-focus px-1 lh-sm">
                Hobbies
              </label>
              <label
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) =>
                  updateField(
                    "hobbies",
                    e.currentTarget.textContent.split(",").map((s) => s.trim())
                  )
                }
                className=" text-dark custom-focus px-1 "
              >
                {formData.hobbies.join(", ")}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
