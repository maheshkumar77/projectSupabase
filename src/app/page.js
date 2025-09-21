"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap } from "lucide-react";

export default function SchoolWelcomePage() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-400 opacity-30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-400 opacity-20 rounded-full blur-3xl animate-ping"></div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 text-center max-w-4xl px-6"
      >
        {/* Title */}
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-5xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-2xl"
        >
          Welcome to
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-amber-500 mt-2">
            Bright Future Academy
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto"
        >
          Where curious minds explore, discover, and grow. Empowering students to achieve excellence in academics, arts, and character.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-10 flex flex-col sm:flex-row justify-center gap-6"
        >
          <Link
            href="/signup"
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-2xl shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-2"
          >
            Enroll Now <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 bg-white/20 border border-white/30 text-white font-bold rounded-2xl backdrop-blur-lg hover:bg-white/40 transition flex items-center justify-center gap-2"
          >
            Student Portal <GraduationCap className="w-5 h-5" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Floating Elements for UI spice */}
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="absolute top-20 left-10 bg-white/20 p-4 rounded-2xl backdrop-blur-lg shadow-xl"
      >
        <div className="flex items-center gap-2 text-white">
          <BookOpen className="w-5 h-5" />
          <span className="font-semibold">Learning</span>
        </div>
      </motion.div>
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 6, delay: 1 }}
        className="absolute bottom-24 right-10 bg-white/20 p-4 rounded-2xl backdrop-blur-lg shadow-xl"
      >
        <div className="flex items-center gap-2 text-white">
          <GraduationCap className="w-5 h-5" />
          <span className="font-semibold">Growth</span>
        </div>
      </motion.div>

      {/* Additional decorative elements */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-sm"
      >
        Scroll to explore
      </motion.div>
    </section>
  );
}