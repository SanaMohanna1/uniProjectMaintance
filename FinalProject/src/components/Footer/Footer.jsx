import React from "react";
import "./Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faFacebook,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

function Footer() {
  return (
    <div className="footer" style={{marginTop: "100px"}}>
      <div className="footer-content">
        <h2 className="H2_">Art Planet</h2>
        <div className="footer-links">
          <div className="footer-links-div">
            <h4 className="H4_">Our Services</h4>
            <a className="classA" href="/login">
              Login
            </a>
            <a className="classA" href="#">
              Help Center : call +972547752
            </a>
          </div>
          <div className="footer-links-div">
            <h4 className="H4_">Customer Support</h4>
            <a className="classA" href="#">
              Contact Us
            </a>
            <div className="contact-info">
              <div className="email-info">
                <FontAwesomeIcon className="email_" icon={faEnvelope} />
                <span>RahafSadi@gmail.com</span>
              </div>
              <div className="location-info">
                <FontAwesomeIcon className="location_" icon={faLocationDot} />
                <span>Nazareth-3054</span>
              </div>
            </div>
          </div>
          <div className="footer-links-div">
            <h4 className="H4_">Social Media</h4>
            <div className="social-media">
              <p>
                <FontAwesomeIcon className="insta" icon={faInstagram} />{" "}
                rahaf.sadi8
              </p>
              <p>
                <FontAwesomeIcon className="face" icon={faFacebook} /> rahaf
                sadi
              </p>
              <p>
                <FontAwesomeIcon className="whats" icon={faWhatsapp} />{" "}
                +972-523548884
              </p>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="footer-below">
        <p className="footer-below_p">
          © {new Date().getFullYear()} ArtPlanet. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Footer;
