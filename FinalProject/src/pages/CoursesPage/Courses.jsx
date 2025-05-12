import React, { useState, useEffect } from "react";
import CoursesCard from "../../components/cards/CoursesCard";
function All_courses() {
  const [courses, setCourses] = useState([]);

  const fetchcourses = async () => {
    try {
      const response = await fetch("http://localhost:3002/Courses");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchcourses();
  }, []);

  return (
    <div className="coursesPageContainer">
      {courses.rows &&
        courses.rows.map((course) => (
          <CoursesCard
            key={course.id}
            Name={course.name + ":"}
            Description={course.description}
            price={course.price}
            participantsnumber={course.participantsnumber}
            age={course.age}
            date={course.date}
            photo={course.photo}
          />
        ))}
    </div>
  );
}

export default All_courses;
