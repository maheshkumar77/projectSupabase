"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { resultAll, getUserdetails } from "../../../action/auth";

export default function HeadDashboard() {
  const router = useRouter();
  const [headdata, setHeaddata] = useState(null);
  const [teacher, setTeacher] = useState([]);
  const [student, setStudent] = useState([]);
  const [allClassesData, setAllClassesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    maxMath: { value: 0, student: "" },
    minMath: { value: 100, student: "" },
    maxEnglish: { value: 0, student: "" },
    minEnglish: { value: 100, student: "" },
    maxScience: { value: 0, student: "" },
    minScience: { value: 100, student: "" },
    maxPT: { value: 0, student: "" },
    minPT: { value: 100, student: "" },
    maxBotany: { value: 0, student: "" },
    minBotany: { value: 100, student: "" }
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setHeaddata(parsedUser);

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await resultAll();
        if (res?.status === "success") {
          setStudent(res.data || []);
          
          // Calculate max and min marks for each subject
          if (res.data && res.data.length > 0) {
            calculateSubjectStats(res.data);
          }
        }

        const tdata = await getUserdetails();
        if (tdata?.data) {
          setTeacher(tdata.data);
        }

        // Combine students and teachers as "allClassesData"
        setAllClassesData([
          { type: "Students", count: res?.data?.length || 0, icon: "🎓", color: "blue" },
          { type: "Teachers", count: tdata?.data?.length || 0, icon: "👨‍🏫", color: "green" },
        ]);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // Function to calculate max and min marks for each subject
  const calculateSubjectStats = (students) => {
    const newStats = { ...stats };
    
    students.forEach(student => {
      // Math
      if (student.math > newStats.maxMath.value) {
        newStats.maxMath = { value: student.math, student: student.name || `Student ${student.student_id}` };
      }
      if (student.math < newStats.minMath.value) {
        newStats.minMath = { value: student.math, student: student.name || `Student ${student.student_id}` };
      }
      
      // English
      if (student.english > newStats.maxEnglish.value) {
        newStats.maxEnglish = { value: student.english, student: student.name || `Student ${student.student_id}` };
      }
      if (student.english < newStats.minEnglish.value) {
        newStats.minEnglish = { value: student.english, student: student.name || `Student ${student.student_id}` };
      }
      
      // Science
      if (student.science > newStats.maxScience.value) {
        newStats.maxScience = { value: student.science, student: student.name || `Student ${student.student_id}` };
      }
      if (student.science < newStats.minScience.value) {
        newStats.minScience = { value: student.science, student: student.name || `Student ${student.student_id}` };
      }
      
      // PT
      if (student.pt > newStats.maxPT.value) {
        newStats.maxPT = { value: student.pt, student: student.name || `Student ${student.student_id}` };
      }
      if (student.pt < newStats.minPT.value) {
        newStats.minPT = { value: student.pt, student: student.name || `Student ${student.student_id}` };
      }
      
      // Botany
      if (student.botany > newStats.maxBotany.value) {
        newStats.maxBotany = { value: student.botany, student: student.name || `Student ${student.student_id}` };
      }
      if (student.botany < newStats.minBotany.value) {
        newStats.minBotany = { value: student.botany, student: student.name || `Student ${student.student_id}` };
      }
    });
    
    setStats(newStats);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 p-6">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, type: "spring", stiffness: 100 }}
        className="text-4xl font-bold text-center text-indigo-700 mb-8 pt-4"
      >
        Welcome, {headdata?.email || "Head Teacher"} 👑
      </motion.h1>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allClassesData.map((cls, cIdx) => (
            <motion.div
              key={cIdx}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: cIdx * 0.2, duration: 0.5 }}
              className={`bg-white rounded-2xl shadow-xl p-6 border-l-4 ${
                cls.color === "blue" ? "border-blue-500" : "border-green-500"
              } transform transition-all duration-300 hover:scale-105`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">{cls.type}</h2>
                  <p className="text-gray-600 mt-1">Total Count</p>
                  <p className="text-4xl font-bold text-gray-900 mt-2">{cls.count}</p>
                </div>
                <div className="text-5xl">{cls.icon}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Student Performance Analytics */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">Student Performance Analytics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Math */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 text-center mb-3">Math</h3>
              <div className="space-y-2">
                <div className="bg-blue-100 p-2 rounded">
                  <p className="text-sm text-blue-700">Highest</p>
                  <p className="font-bold text-blue-900">{stats.maxMath.value}</p>
                  <p className="text-xs text-blue-600 truncate">{stats.maxMath.student}</p>
                </div>
                <div className="bg-blue-200 p-2 rounded">
                  <p className="text-sm text-blue-700">Lowest</p>
                  <p className="font-bold text-blue-900">{stats.minMath.value}</p>
                  <p className="text-xs text-blue-600 truncate">{stats.minMath.student}</p>
                </div>
              </div>
            </div>
            
            {/* English */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 text-center mb-3">English</h3>
              <div className="space-y-2">
                <div className="bg-green-100 p-2 rounded">
                  <p className="text-sm text-green-700">Highest</p>
                  <p className="font-bold text-green-900">{stats.maxEnglish.value}</p>
                  <p className="text-xs text-green-600 truncate">{stats.maxEnglish.student}</p>
                </div>
                <div className="bg-green-200 p-2 rounded">
                  <p className="text-sm text-green-700">Lowest</p>
                  <p className="font-bold text-green-900">{stats.minEnglish.value}</p>
                  <p className="text-xs text-green-600 truncate">{stats.minEnglish.student}</p>
                </div>
              </div>
            </div>
            
            {/* Science */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 text-center mb-3">Science</h3>
              <div className="space-y-2">
                <div className="bg-purple-100 p-2 rounded">
                  <p className="text-sm text-purple-700">Highest</p>
                  <p className="font-bold text-purple-900">{stats.maxScience.value}</p>
                  <p className="text-xs text-purple-600 truncate">{stats.maxScience.student}</p>
                </div>
                <div className="bg-purple-200 p-2 rounded">
                  <p className="text-sm text-purple-700">Lowest</p>
                  <p className="font-bold text-purple-900">{stats.minScience.value}</p>
                  <p className="text-xs text-purple-600 truncate">{stats.minScience.student}</p>
                </div>
              </div>
            </div>
            
            {/* PT */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800 text-center mb-3">PT</h3>
              <div className="space-y-2">
                <div className="bg-yellow-100 p-2 rounded">
                  <p className="text-sm text-yellow-700">Highest</p>
                  <p className="font-bold text-yellow-900">{stats.maxPT.value}</p>
                  <p className="text-xs text-yellow-600 truncate">{stats.maxPT.student}</p>
                </div>
                <div className="bg-yellow-200 p-2 rounded">
                  <p className="text-sm text-yellow-700">Lowest</p>
                  <p className="font-bold text-yellow-900">{stats.minPT.value}</p>
                  <p className="text-xs text-yellow-600 truncate">{stats.minPT.student}</p>
                </div>
              </div>
            </div>
            
            {/* Botany */}
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-semibold text-red-800 text-center mb-3">Botany</h3>
              <div className="space-y-2">
                <div className="bg-red-100 p-2 rounded">
                  <p className="text-sm text-red-700">Highest</p>
                  <p className="font-bold text-red-900">{stats.maxBotany.value}</p>
                  <p className="text-xs text-red-600 truncate">{stats.maxBotany.student}</p>
                </div>
                <div className="bg-red-200 p-2 rounded">
                  <p className="text-sm text-red-700">Lowest</p>
                  <p className="font-bold text-red-900">{stats.minBotany.value}</p>
                  <p className="text-xs text-red-600 truncate">{stats.minBotany.student}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* User Profile Card */}
        {headdata && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Your Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Username</p>
                <p className="text-lg font-medium text-gray-900">{headdata.metadata?.username || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="text-lg font-medium text-gray-900">{headdata.email}</p>
              </div>
              <div>
                <p className="text-gray-600">Role</p>
                <p className="text-lg font-medium text-gray-900">{headdata.metadata?.role || "Head Teacher"}</p>
              </div>
              <div>
                <p className="text-gray-600">User ID</p>
                <p className="text-lg font-medium text-gray-900">{headdata.id}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="flex justify-center mt-8"
      >
        <button
          className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 flex items-center"
          onClick={() => {
            localStorage.removeItem("user");
            router.push("/login");
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
          Logout
        </button>
      </motion.div>
    </div>
  );
}