"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const DashboardPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  // Fetch user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push("/login");
    }
  }, [router]);

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Navbar */}
      <nav className="flex justify-between items-center bg-blue-600 text-white p-4 rounded mb-6">
        <h1 className="text-xl font-bold">MyApp</h1>
        <div className="flex gap-4 items-center">
          <span>
            👋 {user.user_metadata?.username} ({user.user_metadata?.role})
          </span>
          <button
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            onClick={() => {
              localStorage.removeItem("user");
              router.push("/login");
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Dashboard Profile */}
      <div className="bg-white rounded-xl shadow-md p-6 max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>

        <div className="space-y-2">
          <p>
            <strong>Username:</strong> {user.user_metadata?.username || "N/A"}
          </p>
          <p>
            <strong>Role:</strong> {user.user_metadata?.role || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          {user.user_metadata?.mobile && (
            <p>
              <strong>Mobile:</strong> {user.user_metadata.mobile}
            </p>
          )}
          {user.user_metadata?.age && (
            <p>
              <strong>Age:</strong> {user.user_metadata.age}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
