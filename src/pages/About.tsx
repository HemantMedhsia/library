import { motion } from "framer-motion";
import { Info, Heart, Target, Users, Rocket, Code } from "lucide-react";
import Headbar from "../components/dashboard/Headbar";

export default function About() {
    return (
        <>
            <Headbar />
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen p-6 bg-gradient-to-b from-emerald-50 to-emerald-100"
            >
                <div className="max-w-5xl mx-auto space-y-10">
                    {/* Header Section */}
                    <div className="text-center space-y-3">
                        <motion.h1
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl font-bold text-emerald-700"
                        >
                            About pOCKet 💸
                        </motion.h1>
                        <p className="text-emerald-500 text-sm md:text-base">
                            Smart, simple, and elegant — track your finances with ease.
                        </p>
                    </div>

                    {/* About Card */}
                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-md p-8 border border-emerald-100"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <Info className="text-emerald-600" />
                            <h2 className="text-2xl font-semibold text-emerald-700">
                                What is pOCKet?
                            </h2>
                        </div>
                        <p className="text-emerald-700 leading-relaxed">
                            pOCKet is your personal expense tracker designed to help you take
                            control of your finances with clarity and simplicity. From daily
                            spending to monthly analytics, pOCKet turns numbers into insights
                            — empowering you to make smarter financial decisions every day.
                        </p>
                    </motion.div>

                    {/* Mission + Features */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <motion.div
                            whileHover={{ y: -4 }}
                            className="p-6 rounded-2xl bg-gradient-to-br from-emerald-100/80 to-white shadow-sm border border-emerald-100"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Target className="text-emerald-600" />
                                <h3 className="text-xl font-semibold text-emerald-700">
                                    Our Mission
                                </h3>
                            </div>
                            <p className="text-emerald-700 text-sm leading-relaxed">
                                To help people manage their money effortlessly and stay mindful
                                about where every rupee goes — all while enjoying a beautiful,
                                interactive experience.
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -4 }}
                            className="p-6 rounded-2xl bg-gradient-to-br from-emerald-100/80 to-white shadow-sm border border-emerald-100"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Heart className="text-emerald-600" />
                                <h3 className="text-xl font-semibold text-emerald-700">
                                    Why You’ll Love It
                                </h3>
                            </div>
                            <ul className="list-disc ml-5 text-emerald-700 text-sm space-y-1">
                                <li>Beautiful and intuitive UI</li>
                                <li>Real-time analytics & charts</li>
                                <li>Quick expense logging</li>
                                <li>Seamless editing & deletion</li>
                                <li>Cloud-ready integration</li>
                            </ul>
                        </motion.div>
                    </div>

                    {/* Developer Section */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="bg-white/70 backdrop-blur-lg border border-emerald-100 rounded-2xl shadow-md p-8 text-center"
                    >
                        <div className="flex flex-col items-center space-y-3">
                            <Users className="text-emerald-600" size={30} />
                            <h2 className="text-2xl font-semibold text-emerald-700">
                                Meet the Creator
                            </h2>
                            <p className="text-emerald-600 text-sm max-w-md">
                                Built with ❤️ by <span className="font-medium">Hemant and Vedansh</span> — a
                                passionate developer focused on building clean, scalable, and
                                modern web applications using React, TypeScript, and Spring Boot.
                            </p>
                        </div>
                    </motion.div>
                    {/* Footer */}
                    <motion.footer
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-center py-6 text-emerald-600 text-sm"
                    >
                        <div className="flex justify-center items-center gap-2">
                            <Rocket size={16} className="text-emerald-500" />
                            <p>pOCKet — Smarter way to track your money 💚</p>
                        </div>
                        <p className="mt-2 text-xs text-emerald-400">
                            © {new Date().getFullYear()} Hemant and Vedansh | Built with React + Spring Boot
                        </p>
                    </motion.footer>
                </div>
            </motion.div>
        </>
    );
}
