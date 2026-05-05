import React from "react";

import courseImg01 from "../../assests/images/web-development.png";
import courseImg02 from "../../assests/images/kids-learning.png";
import courseImg03 from "../../assests/images/seo.png";
import courseImg04 from "../../assests/images/ui-ux.png";

import "./free-course.css";

const freeCourseData = [
  {
    id: "01",
    title: "Basic Web Development Course",
    imgUrl: courseImg01,
    students: 5.3,
    rating: 1.7,
  },
  {
    id: "02",
    title: "Coding for Junior Basic Course",
    imgUrl: courseImg02,
    students: 5.3,
    rating: 1.7,
  },
  {
    id: "03",
    title: "Search Engine Optimization - Basic",
    imgUrl: courseImg03,
    students: 5.3,
    rating: 1.7,
  },
  {
    id: "04",
    title: "Basic UI/UX Design - Figma",
    imgUrl: courseImg04,
    students: 5.3,
    rating: 1.7,
  },
];

const FreeCourse = () => {
  return (
    <section>
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center mb-5">
            <h2 className="fw-bold">Our Free Courses</h2>
          </div>

          {freeCourseData.map((course) => (
            <div className="col-lg-3 col-md-4 mb-4" key={course.id}>
              <div className="card h-100 shadow-sm border-0">
                <img
                  src={course.imgUrl}
                  className="card-img-top"
                  alt={course.title}
                />
                <div className="card-body text-center">
                  <h5 className="card-title fw-bold">{course.title}</h5>
                  <p className="mb-1">
                    <i className="ri-user-line me-1"></i>
                    {course.students}k Students
                  </p>
                  <p className="mb-0">
                    <i className="ri-star-fill text-warning me-1"></i>
                    {course.rating} Rating
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FreeCourse;
