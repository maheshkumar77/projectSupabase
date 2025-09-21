"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MainPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // Use direct access without {}
      if (parsedUser.user_metadata?.role === "student") router.push("/studentdash");
      else if (parsedUser.user_metadata?.role === "teacher") router.push("/tedashboard");
      else if (parsedUser.user_metadata?.role === "headteacher") router.push("/hedashboard");
      else router.push("/error");
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-xl font-semibold text-gray-600">Redirecting...</p>
    </div>
  );
}
