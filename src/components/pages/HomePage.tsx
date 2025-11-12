import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-400 flex flex-col items-center justify-center">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-extrabold text-white drop-shadow-lg mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 animate-gradient">
            LearnHub: Your Path to Success
          </span>
        </h1>
        <p className="text-xl text-white/80 mb-6">
          Discover interactive, activity-based courses and track your progress!
        </p>
        <motion.button
          whileHover={{ scale: 1.08, backgroundColor: "#fbbf24" }}
          className="px-8 py-3 rounded-full bg-white text-purple-600 font-bold shadow-lg hover:shadow-2xl transition-all"
        >
          Browse Courses
        </motion.button>
      </motion.div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mb-16">
        {[
          {
            title: "Scroll & Learn Modules",
            desc: "Engage with interactive, scroll-based lessons and activities.",
            icon: "📜",
          },
          {
            title: "Track Your Progress",
            desc: "Visual dashboards and certificates for every achievement.",
            icon: "📈",
          },
          {
            title: "Multi-Language Support",
            desc: "Learn in English, Hindi, Tamil, or Telugu.",
            icon: "🌐",
          },
        ].map((f, i) => (
          <motion.div
            key={f.title}
            whileHover={{ scale: 1.05, boxShadow: "0 8px 32px #a78bfa" }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl flex flex-col items-center"
          >
            <div className="text-5xl mb-4">{f.icon}</div>
            <h3 className="text-xl font-bold text-purple-700 mb-2">{f.title}</h3>
            <p className="text-gray-700">{f.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Animated Stats */}
      <div className="flex gap-8 mb-16">
        {[
          { label: "Active Learners", value: "12,000+" },
          { label: "Expert Courses", value: "25+" },
          { label: "Completion Rate", value: "98%" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.1, backgroundColor: "#f3e8ff" }}
            className="bg-white/90 rounded-xl px-8 py-6 shadow-lg text-center"
          >
            <div className="text-3xl font-extrabold text-purple-600">{stat.value}</div>
            <div className="text-gray-600">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-white mb-4">
          Ready to transform your learning journey?
        </h2>
        <motion.button
          whileHover={{ scale: 1.08, backgroundColor: "#a78bfa" }}
          className="px-8 py-3 rounded-full bg-yellow-400 text-purple-700 font-bold shadow-lg hover:shadow-2xl transition-all"
        >
          Start Learning Now
        </motion.button>
      </motion.div>
    </div>
  );
}