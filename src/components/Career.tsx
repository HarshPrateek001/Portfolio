import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Front-End Developer</h4>
                <h5>Riyo Advertising</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Contributing to core company products, building responsive and user-friendly 
              UIs using Next.js and Tailwind CSS. Focused on clean code practices, 
              reusable component structures, and optimizing website performance.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Front-End Developer</h4>
                <h5>Infotrixs (Internship)</h5>
              </div>
              <h3>2023–24</h3>
            </div>
            <p>
              Collaborated with cross-functional teams to design front-end requirements. 
              Created and maintained CSS style sheets and established a maintainable 
              front-end design system for faster feature development.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
