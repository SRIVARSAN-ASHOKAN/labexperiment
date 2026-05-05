import React from "react";
import { Container, Row, Col, ListGroup, ListGroupItem } from "reactstrap";

import "./footer.css";

const footerQuickLinks = [
  {
    display: "Home",
    url: "#",
  },
  {
    display: "About US",
    url: "#",
  },

  {
    display: "Courses",
    url: "#",
  },

  {
    display: "Blog",
    url: "#",
  },
];

const footerInfoLinks = [
  {
    display: "Privacy Policy",
    url: "#",
  },
  {
    display: "Membership",
    url: "#",
  },

  {
    display: "Purchases Guide",
    url: "#",
  },

  {
    display: "Terms of Service",
    url: "#",
  },
];

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
  <div className="row">
    <div className="col-lg-3 col-md-6 mb-4">
      <h2 className="d-flex align-items-center gap-1">
        <i className="ri-pantone-line"></i>
      </h2>

      <div className="follows">
        <p className="mb-0">Follow us on social media</p>
        <span>
          <a href="#">
            <i className="ri-facebook-line"></i>
          </a>
        </span>
        <span>
          <a href="#">
            <i className="ri-instagram-line"></i>
          </a>
        </span>
        <span>
          <a href="#">
            <i className="ri-linkedin-line"></i>
          </a>
        </span>
        <span>
          <a href="#">
            <i className="ri-twitter-line"></i>
          </a>
        </span>
      </div>
    </div>

    <div className="col-lg-3 col-md-6 mb-4">
      <h6 className="fw-bold">Explore</h6>
      <ul className="list-group link__list">
        {footerQuickLinks.map((item, index) => (
          <li key={index} className="list-group-item border-0 ps-0 link__item">
            <a href={item.url}>{item.display}</a>
          </li>
        ))}
      </ul>
    </div>

    <div className="col-lg-3 col-md-6 mb-4">
      <h6 className="fw-bold">Information</h6>
      <ul className="list-group link__list">
        {footerInfoLinks.map((item, index) => (
          <li key={index} className="list-group-item border-0 ps-0 link__item">
            <a href={item.url}>{item.display}</a>
          </li>
        ))}
      </ul>
    </div>

    <div className="col-lg-3 col-md-6">
      <h6 className="fw-bold">Get in Touch</h6>
      <p>Address: Perundurai, India</p>
      <p>Phone: +91 000000000000</p>
      <p>Email: support@learners.com</p>
    </div>
  </div>
</div>
      <div className="footer__bottom text-center">
        <p className="mb-0">
          &copy; {new Date().getFullYear()} Learners. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
