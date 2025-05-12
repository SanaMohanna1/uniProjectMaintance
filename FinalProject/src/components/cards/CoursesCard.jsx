import React from "react";
import "./CoursesCard.css";
export default function CoursesCard(props) {
    console.log(`${process.env.PUBLIC_URL}${props.photo}`);
    return (
        <div className="CoursesCard-item">
            <div className="CoursesCard-text">
                <h3>{props.Name}</h3>
                <p><h5>Description:</h5>{props.Description}</p>
                <p><h5>Price:</h5>{props.price}₪</p>
                <p><h5>Participnts number:</h5>{props.participantsnumber}</p>
                <p><h5>Ages:</h5>{props.age}</p>
                <p><h5>Start date:</h5>{props.date}</p>
                <h5>interested? call us : 0523548884</h5>
            </div>
            <img className="CourseImg" src={`${process.env.PUBLIC_URL}${props.photo}`} alt="Course" />
        </div>
    );

}
