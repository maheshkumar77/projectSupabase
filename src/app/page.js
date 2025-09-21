"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-pink-500 opacity-30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-yellow-400 opacity-20 rounded-full blur-3xl animate-ping"></div>

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
          className="text-6xl md:text-7xl font-extrabold text-white leading-tight drop-shadow-2xl"
        >
          Build the Future with
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-red-500"> Next.js </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto"
        >
          Supercharge your ideas with cutting-edge tools, lightning performance, and an experience that wows your users.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-10 flex justify-center gap-6"
        >
          <Link
            href="/signup"
            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-yellow-400 text-black font-bold rounded-2xl shadow-xl hover:scale-105 transition-transform flex items-center gap-2"
          >
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 bg-white/20 border border-white/30 text-white font-bold rounded-2xl backdrop-blur-lg hover:bg-white/40 transition"
          >
            Login
          </Link>
        </motion.div>
      </motion.div>

      {/* Floating Cards for UI spice */}
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="absolute top-20 left-20 bg-white/20 p-6 rounded-2xl backdrop-blur-lg shadow-xl"
      >
        <h3 className="text-white font-semibold">⚡ Fast</h3>
      </motion.div>
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
        className="absolute bottom-24 right-24 bg-white/20 p-6 rounded-2xl backdrop-blur-lg shadow-xl"
      >
        <h3 className="text-white font-semibold">🚀 Modern</h3>
      </motion.div>
    </section>
  );
}
