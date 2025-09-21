"use client";

import { useEffect, useState } from "react";
import { getUserDataByEmail, stuMark } from "../../../action/auth";
import "./style.css"

export default function StudentLookup() {
  const [student, setStudent] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("scores");

  useEffect(() => {
    const fetchStudentAndResult = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.email) return;

      try {
        setLoading(true);
        // 1️⃣ Fetch student info
        const studentRes = await getUserDataByEmail(user.email, "student");
        console.log("Student API response:", studentRes);
        setStudent(studentRes.user);

        // 2️⃣ Fetch results
        if (studentRes.user?.student_id) {
          const resultRes = await stuMark(studentRes.user.student_id, "student");
          console.log("Raw result from API:", resultRes);
          
          if (resultRes.user) {
            setResult(resultRes.user);  // ✅ take first row
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentAndResult();
  }, []);

  // Calculate overall performance
  const calculatePerformance = () => {
    if (!result) return 0;
    const subjects = ['math', 'english', 'science', 'pt', 'botany'];
    const total = subjects.reduce((sum, subject) => sum + (parseInt(result[subject]) || 0), 0);
    return (total / (subjects.length * 100)) * 100;
  };

  const performancePercentage = calculatePerformance();

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your academic data...</p>
      </div>
    );
  }

  return (
    <div className="student-dashboard">
      <header className="dashboard-header">
        <h1>Student Dashboard</h1>
        <div className="header-decoration">
          <div className="decoration-circle"></div>
          <div className="decoration-circle"></div>
          <div className="decoration-circle"></div>
        </div>
      </header>

      {student ? (
        <div className="dashboard-content">
          <div className="student-profile-card">
            <div className="profile-header">
              <div className="avatar">
                {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="profile-info">
                <h2>{student.name}</h2>
                <p>{student.email}</p>
              </div>
            </div>
            
            <div className="profile-details">
              <div className="detail-item">
                <span className="detail-label">Class</span>
                <span className="detail-value">{student.class|| "Not specified"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Studet ID</span>
                <span className="detail-value">{student.student_id || "Not assigned"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">School ID</span>
                <span className="detail-value">{student.school_id}</span>
              </div>
            </div>
          </div>

          <div className="performance-section">
            <div className="performance-card">
              <h3>Overall Performance</h3>
              <div className="performance-chart">
                <div className="circular-progress">
                  <svg viewBox="0 0 100 100">
                    <circle className="progress-bg" cx="50" cy="50" r="45"></circle>
                    <circle 
                      className="progress-bar" 
                      cx="50" cy="50" r="45" 
                      style={{ strokeDashoffset: 283 - (283 * performancePercentage) / 100 }}
                    ></circle>
                  </svg>
                  <div className="progress-text">
                    <span>{performancePercentage.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="performance-legend">
                  <div className="legend-item">
                    <span className="legend-color excellent"></span>
                    <span>Excellent (90-100%)</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color good"></span>
                    <span>Good (70-89%)</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color average"></span>
                    <span>Average (50-69%)</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color needs-improvement"></span>
                    <span>Needs Improvement (0-49%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="scores-section">
            <div className="section-header">
              <h2>Academic Performance</h2>
              <div className="tab-nav">
                <button 
                  className={activeTab === "scores" ? "tab-active" : ""}
                  onClick={() => setActiveTab("scores")}
                >
                  Subject Scores
                </button>
                <button 
                  className={activeTab === "analysis" ? "tab-active" : ""}
                  onClick={() => setActiveTab("analysis")}
                >
                  Performance Analysis
                </button>
              </div>
            </div>

            {activeTab === "scores" ? (
              <div className="scores-table-container">
                {result ? (
                  <table className="scores-table">
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Score</th>
                        <th>Remark</th>
                        <th>Performance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { subject: "Math", score: result.math, remark: result.math_remark },
                        { subject: "English", score: result.english, remark: result.english_remark },
                        { subject: "Science", score: result.science, remark: result.science_remark },
                        { subject: "PT", score: result.pt, remark: result.pt_remark },
                        { subject: "Botany", score: result.botany, remark: result.botany_remark }
                      ].map((item, index) => {
                        const scoreValue = parseInt(item.score) || 0;
                        const performanceLevel = 
                          scoreValue >= 90 ? "excellent" :
                          scoreValue >= 70 ? "good" :
                          scoreValue >= 50 ? "average" : "needs-improvement";
                          
                        return (
                          <tr key={index} className="fade-in-row" style={{ animationDelay: `${index * 0.1}s` }}>
                            <td>
                              <span className="subject-icon">{item.subject.charAt(0)}</span>
                              {item.subject}
                            </td>
                            <td>
                              <div className="score-display">
                                <span className="score-value">{item.score}</span>
                                <span className="score-max">/100</span>
                              </div>
                            </td>
                            <td>
                              <span className={`remark-tag ${performanceLevel}`}>
                                {item.remark || "No remark"}
                              </span>
                            </td>
                            <td>
                              <div className="performance-bar">
                                <div 
                                  className={`performance-fill ${performanceLevel}`}
                                  style={{ width: `${scoreValue}%` }}
                                ></div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="no-data-message">
                    <p>No score data available yet.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="analysis-tab">
                <h3>Subject Performance Comparison</h3>
                <div className="bar-chart">
                  {result && [
                    { subject: "Math", score: result.math },
                    { subject: "English", score: result.english },
                    { subject: "Science", score: result.science },
                    { subject: "PT", score: result.pt },
                    { subject: "Botany", score: result.botany }
                  ].map((item, index) => {
                    const scoreValue = parseInt(item.score) || 0;
                    const performanceLevel = 
                      scoreValue >= 90 ? "excellent" :
                      scoreValue >= 70 ? "good" :
                      scoreValue >= 50 ? "average" : "needs-improvement";
                      
                    return (
                      <div key={index} className="chart-item">
                        <span className="chart-label">{item.subject}</span>
                        <div className="chart-bar-container">
                          <div 
                            className={`chart-bar ${performanceLevel}`}
                            style={{ width: `${scoreValue}%` }}
                          >
                            <span className="chart-value">{scoreValue}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="error-state">
          <div className="error-icon">!</div>
          <h3>Unable to load student data</h3>
          <p>Please check your connection and try again.</p>
        </div>
      )}
    </div>
  );
}