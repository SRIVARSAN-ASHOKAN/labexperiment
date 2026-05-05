
import React, { useState } from 'react';
import axios from 'axios';
import './course-register.css';

const CourseRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    organisation: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/course-register', {
        ...formData,
        registrationDate: new Date().toISOString(),
        status: 'pending'
      });
      alert("Registered Successfully");
      setFormData({
        name: '',
        email: '',
        contact: '',
        organisation: ''
      });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error);
      } else {
        alert('Registration failed. Please try again.');
      }
    }
  };

  return (
    <section className="course-register">
      <div className="container">
        <div className="register-content">
          <h2>Register for Course</h2>
          <p>Join thousands of learners and advance your skills with our expert-led courses</p>
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="input-wrapper">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <div className="input-wrapper">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <div className="input-wrapper">
                <input
                  type="tel"
                  name="contact"
                  placeholder="Contact Number"
                  value={formData.contact}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <div className="input-wrapper">
                <input
                  type="text"
                  name="organisation"
                  placeholder="Organisation/Company"
                  value={formData.organisation}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <button type="submit" className="register-btn">
                Register Now
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CourseRegister;