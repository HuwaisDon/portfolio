import React from 'react';

interface BuildingModalProps {
  buildingId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const BuildingModal: React.FC<BuildingModalProps> = ({ buildingId, isOpen, onClose }) => {
  const content: Record<string, { title: string; content: React.ReactNode }> = {
    about: {
      title: 'About Me',
      content: (
        <div className="modal-content">
          <h2>Huwais Al Qurni A</h2>
          <p className="subtitle">Data Analyst / Data Engineer</p>
          <div className="section">
            <h3>Summary</h3>
            <p>
              Computer Science graduate with specialization in Artificial Intelligence and Data Science. 
              Currently working as a Data Engineer intern in a data-focused backend role. Experienced in Python programming, 
              SQL, data processing, and database operations with hands-on exposure to healthcare systems.
            </p>
          </div>
          <div className="section">
            <h3>Location</h3>
            <p>Kalpakkam, India</p>
          </div>
          <div className="section">
            <h3>Education</h3>
            <p><strong>B.Tech – Computer Science Engineering (AI & DS)</strong></p>
            <p>Hindustan Institute of Technology and Science</p>
            <p>08/2021 - 05/2025 | Padur, Tamil Nadu</p>
          </div>
        </div>
      ),
    },
    projects: {
      title: 'Projects',
      content: (
        <div className="modal-content">
          <h2>My Projects</h2>
          <div className="project">
            <h3>🤖 synthetic-identity-npc</h3>
            <p className="description">
              Experimental architecture for psychologically persistent NPC cognition
            </p>
            <ul>
              <li>Designed cognitive agent loop using Python</li>
              <li>Implemented persistence layer for conversational game NPCs</li>
              <li>Integrated memory stores to sustain psychological context</li>
            </ul>
            <p className="date">
              <a href="https://github.com/HuwaisDon/synthetic-identity-npc" target="_blank" rel="noopener noreferrer" style={{ color: '#4ecdc4', textDecoration: 'none' }}>
                🔗 View Repository
              </a>
            </p>
          </div>
          <div className="project">
            <h3>🛡️ Network-Intrusion-Detection-System</h3>
            <p className="description">
              Machine learning classification engine for detecting network threats
            </p>
            <ul>
              <li>Analyzed structured network logs and packet fields using Pandas & NumPy</li>
              <li>Developed traffic analysis and anomaly detection models in Python</li>
              <li>Implemented rule-based alerts for intrusion detection</li>
            </ul>
            <p className="date">
              <a href="https://github.com/HuwaisDon/Network-Intrusion-Detection-System" target="_blank" rel="noopener noreferrer" style={{ color: '#4ecdc4', textDecoration: 'none' }}>
                🔗 View Repository
              </a>
            </p>
          </div>
          <div className="project">
            <h3>📊 Gemini-Data-Analyze</h3>
            <p className="description">
              Automated data cleaning and analytics tool powered by Gemini API
            </p>
            <ul>
              <li>Leveraged Google Gemini LLM API as an autonomous data agent</li>
              <li>Built Python data cleaning, profiling, and reporting pipelines</li>
              <li>Generated automated descriptive analytics directly from CSV/SQL data sources</li>
            </ul>
            <p className="date">
              <a href="https://github.com/HuwaisDon/Gemini-Data-Analyze" target="_blank" rel="noopener noreferrer" style={{ color: '#4ecdc4', textDecoration: 'none' }}>
                🔗 View Repository
              </a>
            </p>
          </div>
        </div>
      ),
    },
    work: {
      title: 'Work Experience',
      content: (
        <div className="modal-content">
          <h2>Experience</h2>
          <div className="job">
            <h3>📊 Data Engineer – Intern</h3>
            <p className="company">ADA Global (Digital Analytics)</p>
            <p className="date">12/2025 | Kalpakkam, India</p>
            <ul>
              <li>Implemented backend data logic for Emergency Department workflows</li>
              <li>Developed Python scripts to process structured healthcare messages</li>
              <li>Extracted and organized patient details and clinical measurements</li>
              <li>Performed SQL queries and PostgreSQL database operations</li>
              <li>Supported data validation and field mapping</li>
            </ul>
          </div>
          <div className="job">
            <h3>🔬 Data Science Intern</h3>
            <p className="company">Pantech Solutions</p>
            <p className="date">05/2023 - 06/2023 | India</p>
            <ul>
              <li>Performed data analysis using Python, Pandas, and NumPy</li>
              <li>Implemented Python-based data visualization with Matplotlib</li>
              <li>Explored machine learning models and preprocessing techniques</li>
            </ul>
          </div>
          <div className="job">
            <h3>🔐 Cybersecurity Virtual Intern</h3>
            <p className="company">Tata Forage</p>
            <p className="date">07/2024 | India</p>
            <ul>
              <li>Learned Identity and Access Management (IAM) principles</li>
              <li>Studied access control and role management</li>
              <li>Simulated risk assessment and incident response tasks</li>
            </ul>
          </div>
        </div>
      ),
    },
    contact: {
      title: 'Contact & Links',
      content: (
        <div className="modal-content">
          <h2>Get In Touch</h2>
          <div className="contact-info">
            <div className="contact-item">
              <h3>📱 Phone</h3>
              <p>+91 9597989272</p>
            </div>
            <div className="contact-item">
              <h3>📧 Email</h3>
              <p>huwaisalqurini@gmail.com</p>
            </div>
            <div className="contact-item">
              <h3>💼 LinkedIn</h3>
              <p>
                <a 
                  href="https://linkedin.com/in/huwaisalqurni" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  linkedin.com/in/huwaisalqurni
                </a>
              </p>
            </div>
            <div className="contact-item">
              <h3>🐙 GitHub</h3>
              <p>
                <a 
                  href="https://github.com/huwaisdon" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  github.com/huwaisdon
                </a>
              </p>
            </div>
          </div>
        </div>
      ),
    },
    lab: {
      title: 'Skills & Technologies',
      content: (
        <div className="modal-content">
          <h2>Technical Skills</h2>
          <div className="skills-grid">
            <div className="skill-category">
              <h4>🐍 Programming</h4>
              <div className="skill-tags">
                <span>Python</span>
                <span>JavaScript</span>
                <span>SQL</span>
              </div>
            </div>
            <div className="skill-category">
              <h4>📊 Data & Analysis</h4>
              <div className="skill-tags">
                <span>Pandas</span>
                <span>NumPy</span>
                <span>Matplotlib</span>
                <span>PostgreSQL</span>
              </div>
            </div>
            <div className="skill-category">
              <h4>🎨 Web & Frontend</h4>
              <div className="skill-tags">
                <span>React</span>
                <span>Three.js</span>
                <span>WordPress</span>
              </div>
            </div>
            <div className="skill-category">
              <h4>🛠️ Tools & Platforms</h4>
              <div className="skill-tags">
                <span>Git</span>
                <span>VS Code</span>
                <span>PyCharm</span>
                <span>Gmail</span>
              </div>
            </div>
            <div className="skill-category">
              <h4>🔐 Specialized</h4>
              <div className="skill-tags">
                <span>Data Structures</span>
                <span>Cybersecurity</span>
                <span>IAM</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  };

  const sectionData = buildingId ? content[buildingId] : null;

  if (!isOpen || !sectionData) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        {sectionData.content}
      </div>
    </div>
  );
};

export default BuildingModal;
