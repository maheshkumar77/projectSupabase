"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/dist/server/api-utils";
import { createClient } from "../utils/supabase/server";
import { headers } from "next/headers";


export async function signUp(form) {
  const supabase = await createClient();

  const { username, email, password, confirmPassword, role } = form;

  if (!username || !email || !password || !confirmPassword || !role) {
    return { status: "❌ All fields are required", user: null };
  }

  if (password !== confirmPassword) {
    return { status: "❌ Passwords do not match", user: null };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, role },
    },
  });
   const plainUser = {
    id: data.user.id,
    email: data.user.email,
    username: data.user.user_metadata?.username,
    role: data.user.user_metadata?.role,
  };

  if (error) return { status: error.message, user: null };
  if (data?.user?.identities?.length === 0)
    return { status: "❌ User with this email already exists", user: null };

  revalidatePath("/", "layout");
  return { status: "success", user: plainUser  };
}




export async function signIn(form) {
  const supabase = await createClient();

  const { email, password } = form;

  if (!email || !password) {
    return { status: "❌ All fields are required", user: null };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      status: "❌ " + error.message,
      user: null,
    };
  }

  // Revalidate home layout
  revalidatePath("/", "layout");

  return {
    status: "success",
    user: data.user, // ✅ correct user object
  };
}





  

export async function getUserDataByEmail(email, role) {
  const supabase = await createClient();
  try {
    let table;
    if (role === "student") table = "student";
    else if (role === "teacher") table = "teachers";
    else return { status: "❌ Invalid user role", user: null };

    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("email", email)
      .maybeSingle(); // returns null if not found

    if (error) {
      return { status: "❌ " + error.message, user: null };
    }

    if (!data) {
      return { status: "❌ User not found", user: null };
    }

    return {
      status: "success",
      user: data, // returns the user object
    };
  } catch (err) {
    return { status: "❌ " + err.message, user: null };
  }
}




export async function stuMark(id,role) {
   console.log("🔥 stuMark called with:", id, role);
  const supabase = await createClient();
  try{
if (role !== "student") {
      return { status: "❌ Invalid user role", user: null };
    }
    const { data, error } = await supabase
  .from('results')
  .select('*')
  .eq('student_id', id)
  .maybeSingle();;

console.log(data);
 if (error) {
      return { status: "❌ " + error.message, user: null };
    }

    if (!data) {
      return { status: "❌ Student not found", user: null };
    }

    return {
      status: "success",
      user: data, // this is the student object
    };

  }catch(err){
    return { status: "❌ " + err.message, user: null };
  }
}







export async function updateStudentMark( studentId, mark, remark) {
  const supabase = await createClient();

  try {
    // 1️⃣ Get teacher info
    const { data , error } = await supabase
      .from('result')
    .update({ 
      math: mark, 
      math_remark: remark 
    })
    .eq('student_id', studentId)
    .maybeSingle();

    if (teacherErr || !teacher) {
      return { status: "❌ Teacher not found" };
    }

   
    

    if (error) {
      return { status: "❌ " + error.message };
    }

    return { status: "✅ Success", updated: data };
  } catch (err) {
    return { status: "❌ " + err.message };
  }
}


export async function resultAll() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("results")           // table name should be a string
      .select("*")              // select all columns
        // filter where subject equals the passed subject

      console.log(data);
     if (error) {
      return { status: "❌ " + error.message, user: null };
    }


    if (!data) {
      return { status: "❌ User not found", user: null };
    }

    return {
      status: "success",
      user: data, // returns the user object
    };
  } catch (err) {
    console.error("Error fetching results:", err.message);
    return [];
  }
}



export async function getUserdetails() {
  const supabase = await createClient();
  try {


    const { data, error } = await supabase
      .from(teachers)
      .select("*")

    if (error) {
      return { status: "❌ " + error.message, user: null };
    }

    if (!data) {
      return { status: "❌ User not found", user: null };
    }

    return {
      status: "success",
      user: data, // returns the user object
    };
  } catch (err) {
    return { status: "❌ " + err.message, user: null };
  }
}
   
