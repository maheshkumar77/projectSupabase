"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../utils/supabase/server";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  // Create Supabase client
  const [supabase, setSupabase] = useState(null);
  useEffect(() => {
    async function initSupabase() {


      const client = await createClient();
      setSupabase(client);
    }
    initSupabase();
  }, []);

  // Fetch user session
  useEffect(() => {
    if (!supabase) return;

    async function getUser() {
      const {
        data: { user }, error
      } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();
  }, [supabase]);

  // Logout function
  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between shadow-md">
      {/* Left side */}
      <div className="flex items-center gap-6">
        <h1
          className="text-xl font-bold cursor-pointer"
          onClick={() => router.push("/")}
        >
          MyApp
        </h1>
        <button
          onClick={() => router.push("/activity")}
          className="hover:underline"
        >
          Activity
        </button>
        <button
          onClick={() => router.push("/remarks")}
          className="hover:underline"
        >
          Remarks
        </button>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="font-medium text-amber-300">
  👋 {user?.user_metadata?.username || "No Name"} ({user?.user_metadata?.role || "No Role"}) - {user?.email || "No Email"}
</span>

            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="bg-green-500 px-3 py-1 rounded hover:bg-green-600"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
