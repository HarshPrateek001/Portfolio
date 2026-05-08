import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Connect</h4>
            <p>
              <a
                href="https://www.linkedin.com/in/harsh-prateek-9a3b0c4d3e2f"
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
              >
                LinkedIn — harshprateek
              </a>
            </p>
            <h4>Resume</h4>
            <p>
              <a
                href="/Harsh_Prateek.pdf"
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
              >
                View CV / Resume
              </a>
            </p>
            <h4>Education</h4>
            <p>
              Masters Of Computer Application, NSHM College Of Management and Technology, Durgapur — 2023–Present
            </p>
            <p>
              Bachelors Of Computer Application, NSHM College Of Management and Technology, Durgapur — 2020–2023
            </p>
          </div>
          <div className="contact-box">
            <h4>Social</h4>
            <a
              href="https://github.com/harshprateek001"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              GitHub <MdArrowOutward />
            </a>
            <a
              href="https://www.linkedin.com/in/harsh-prateek-9a3b0c4d3e2f"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              LinkedIn <MdArrowOutward />
            </a>
            <a
              href="https://www.instagram.com/_gupta_ji_officials_/"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Instagram <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by <span>Harsh Prateek</span>
            </h2>
            <h5>
              <MdCopyright /> 2026
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
