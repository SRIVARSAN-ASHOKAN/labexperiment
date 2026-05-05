import React, { Fragment } from "react";
import Header from "../components/Header/Header";
import HeroSection from "../components/Hero-Section/HeroSection";
import CourseRegister from '../components/Course-Register/CourseRegister';
import AboutUs from "../components/About-us/AboutUs";
import Courses from "../components/Courses-section/Courses";
import Features from "../components/Feature-section/Features";
import FreeCourse from "../components/Free-course-section/FreeCourse";


import Footer from "../components/Footer/Footer";

const Home = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <AboutUs />
      <Courses />
      <FreeCourse />
      <Features />
      <CourseRegister />
      <Footer />
    </>
  );
};

export default Home;
