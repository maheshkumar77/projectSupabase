"use client";

import { useEffect, useState } from "react";
import { getUserDataByEmail, resultAll, updateStudentMark } from "../../../action/auth";

export default function TeacherLookup() {
  const [teacher, setTeacher] = useState(null);
  const [studentMarks, setStudentMarks] = useState([]);
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(true);
  const [updateStatus, setUpdateStatus] = useState({});

  useEffect(() => {
    const fetchTeacherAndMarks = async () => {
      try {
        setLoading(true);
        const teacherRes = await getUserDataByEmail(
          "mulanidhiprasad568@gmail.com",
          "teacher"
        );

        if (!teacherRes.user) return;

        setTeacher(teacherRes.user);
        setSubject(teacherRes.user.subject || "");

        // Fetch all student marks
        const Res = await resultAll();
        setStudentMarks(Res.user || []);
      } catch (err) {
        console.error("Error fetching teacher or marks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherAndMarks();
  }, []);

  // Update mark/remark
  const handleUpdate = async (studentId, newMark, newRemark, subjectField) => {
    try {
      setUpdateStatus(prev => ({ ...prev, [studentId]: "updating" }));
      
      await updateStudentMark(studentId, newMark, newRemark, subjectField);
      
      setStudentMarks((prev) =>
        prev.map((s) =>
          s.student_id === studentId
            ? {
                ...s,
                [subjectField]: newMark,
                [`${subjectField}_remark`]: newRemark,
              }
            : s
        )
      );
      
      setUpdateStatus(prev => ({ ...prev, [studentId]: "success" }));
      
      // Clear success status after 2 seconds
      setTimeout(() => {
        setUpdateStatus(prev => ({ ...prev, [studentId]: "" }));
      }, 2000);
      
    } catch (err) {
      console.error("Update failed:", err);
      setUpdateStatus(prev => ({ ...prev, [studentId]: "error" }));
      
      // Clear error status after 3 seconds
      setTimeout(() => {
        setUpdateStatus(prev => ({ ...prev, [studentId]: "" }));
      }, 3000);
    }
  };

  // Stats
  const marksOnly = studentMarks
    .map((s) => s[subject.toLowerCase()])
    .filter((m) => m !== undefined && m !== null);
  const avgMark = marksOnly.length
    ? (marksOnly.reduce((a, b) => a + b, 0) / marksOnly.length).toFixed(2)
    : 0;
  const maxMark = marksOnly.length ? Math.max(...marksOnly) : 0;
  const minMark = marksOnly.length ? Math.min(...marksOnly) : 0;

  // Subjects for tabs
  const subjects = ["Math", "English", "Science", "PT", "Botany"];
  const [activeSubject, setActiveSubject] = useState(subjects[0].toLowerCase());

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-6 transform transition-all duration-300 hover:shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Teacher Dashboard</h1>
              <p className="text-gray-400 mt-2">Manage student grades and performance</p>
            </div>
            {teacher && (
              <div className="flex items-center mt-4 md:mt-0">
                <div className="bg-purple-700 h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-lg animate-pulse">
                  {teacher.name ? teacher.name.charAt(0).toUpperCase() : "T"}
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-white">{teacher.name}</h3>
                  <p className="text-sm text-gray-400">{teacher.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {teacher ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Teacher Info Card */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 lg:col-span-1 transform transition-all duration-300 hover:scale-[1.02]">
              <h2 className="text-xl font-semibold text-white mb-4">Teacher Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Teacher ID</p>
                  <p className="font-medium text-white">{teacher.teacherid}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Name</p>
                  <p className="font-medium text-white">{teacher.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="font-medium text-white">{teacher.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Subject</p>
                  <p className="font-medium text-purple-400">{teacher.subject}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">School ID</p>
                  <p className="font-medium text-white">{teacher.school_id}</p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 lg:col-span-2 transform transition-all duration-300 hover:shadow-xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h2 className="text-xl font-semibold text-white mb-4 md:mb-0">Student Marks</h2>
                
                {/* Stats */}
                <div className="flex space-x-4">
                  <div className="bg-blue-900 px-3 py-2 rounded-lg transform transition-all duration-300 hover:scale-105">
                    <p className="text-xs text-blue-300">Average</p>
                    <p className="font-bold text-blue-200">{avgMark}</p>
                  </div>
                  <div className="bg-green-900 px-3 py-2 rounded-lg transform transition-all duration-300 hover:scale-105">
                    <p className="text-xs text-green-300">Highest</p>
                    <p className="font-bold text-green-200">{maxMark}</p>
                  </div>
                  <div className="bg-red-900 px-3 py-2 rounded-lg transform transition-all duration-300 hover:scale-105">
                    <p className="text-xs text-red-300">Lowest</p>
                    <p className="font-bold text-red-200">{minMark}</p>
                  </div>
                </div>
              </div>

              {/* Subject Tabs */}
              <div className="border-b border-gray-700 mb-6">
                <nav className="-mb-px flex space-x-8 overflow-x-auto">
                  {subjects.map((subj) => (
                    <button
                      key={subj}
                      onClick={() => setActiveSubject(subj.toLowerCase())}
                      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                        activeSubject === subj.toLowerCase()
                          ? "border-purple-500 text-purple-400"
                          : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-500"
                      }`}
                    >
                      {subj}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Student Marks Table */}
              {studentMarks.length > 0 ? (
                <div className="overflow-x-auto rounded-lg">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Student ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Class
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Mark
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Remark
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                      {studentMarks.map((s, index) => (
                        <tr 
                          key={s.student_id} 
                          className="hover:bg-gray-750 transition-all duration-300"
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                            {s.student_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {s.class_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              className="w-20 px-3 py-1 border border-gray-600 rounded-md text-sm bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                              value={s[activeSubject] || ""}
                              onChange={(e) =>
                                setStudentMarks((prev) =>
                                  prev.map((st) =>
                                    st.student_id === s.student_id
                                      ? { ...st, [activeSubject]: Number(e.target.value) }
                                      : st
                                  )
                                )
                              }
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="text"
                              className="w-32 px-3 py-1 border border-gray-600 rounded-md text-sm bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                              value={s[`${activeSubject}_remark`] || ""}
                              onChange={(e) =>
                                setStudentMarks((prev) =>
                                  prev.map((st) =>
                                    st.student_id === s.student_id
                                      ? { ...st, [`${activeSubject}_remark`]: e.target.value }
                                      : st
                                  )
                                )
                              }
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() =>
                                handleUpdate(
                                  s.student_id,
                                  s[activeSubject],
                                  s[`${activeSubject}_remark`],
                                  activeSubject
                                )
                              }
                              disabled={updateStatus[s.student_id] === "updating"}
                              className={`px-3 py-1 rounded-md text-white text-sm transition-all duration-300 transform hover:scale-105 ${
                                updateStatus[s.student_id] === "updating" 
                                  ? "bg-gray-600 cursor-not-allowed" 
                                  : updateStatus[s.student_id] === "success"
                                    ? "bg-green-700 hover:bg-green-600"
                                    : updateStatus[s.student_id] === "error"
                                      ? "bg-red-700 hover:bg-red-600 animate-pulse"
                                      : "bg-purple-700 hover:bg-purple-600"
                              }`}
                            >
                              {updateStatus[s.student_id] === "updating" 
                                ? "Updating..." 
                                : updateStatus[s.student_id] === "success" 
                                  ? "✓ Updated" 
                                  : updateStatus[s.student_id] === "error" 
                                    ? "Try Again" 
                                    : "Update"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 animate-pulse">
                  <div className="mx-auto h-12 w-12 text-gray-600">
                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-400">No students</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by adding students to your class.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl shadow-md p-6 text-center transform transition-all duration-300 hover:scale-[1.01]">
            <p className="text-gray-400">Unable to load teacher data. Please try again.</p>
          </div>
        )}
      </div>

      {/* Custom animations */}
      <style jsx>{`
        tr {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .bg-gray-750 {
          background-color: #374151;
        }
        
        .hover\\:bg-gray-750:hover {
          background-color: #374151;
        }
      `}</style>
    </div>
  );
}