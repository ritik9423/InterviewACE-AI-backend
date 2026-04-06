import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiCpu, FiMessageSquare, FiTarget, FiZap, FiCheck, FiArrowRight, FiShield, FiStar, FiActivity, FiGlobe, FiLayers, FiTrendingUp } from 'react-icons/fi';

const LandingPage = () => {
    return (
        <div className="relative min-h-screen">
            
            <main className="relative z-10">
                {/* --- Hero Section --- */}
                <section className="pt-32 md:pt-40 pb-16 md:pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl"
                    >
                        <motion.span 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="px-4 py-1.5 text-[9px] font-black tracking-[0.3em] text-indigo-400 uppercase bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-8 inline-block"
                        >
                            Revolutionizing Technical Preparation
                        </motion.span>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-white mb-6 md:mb-8 leading-[0.95] font-heading">
                            Master the <br className="hidden sm:block" />
                            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-gradient-flow">
                                Technical Stage
                            </span>
                        </h1>
                        <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed font-medium">
                            The world's most advanced AI interview simulator. 
                            Built on Gemini 2.0 Flash for real-time, expert-level technical feedback.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link 
                                to="/signup" 
                                className="w-full sm:w-auto px-8 py-3.5 bg-white text-black font-black rounded-xl hover:bg-slate-100 transition-all shadow-2xl hover:shadow-white/10 active:scale-95 text-base"
                            >
                                Get Started Free
                            </Link>
                            <Link 
                                to="/login" 
                                className="w-full sm:w-auto px-8 py-3.5 glass border-white/10 text-white font-bold rounded-xl hover:bg-white/5 transition-all text-base flex items-center justify-center gap-2.5"
                            >
                                <FiActivity className="text-indigo-400" /> Login
                            </Link>
                        </div>
                    </motion.div>

                    {/* Stats Ribbon */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-16 md:mt-24 w-full grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 border-y border-white/5 py-8 md:py-10"
                    >
                        {[
                            { label: "AI Accuracy", val: "99.4%" },
                            { label: "Questions", val: "10k+" },
                            { label: "Developers", val: "50k+" },
                            { label: "Latency", val: "< 1s" }
                        ].map((s, i) => (
                            <div key={i} className="text-center">
                                <p className="text-xl md:text-2xl font-black text-white font-heading">{s.val}</p>
                                <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">{s.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </section>

                {/* --- Bento Features Grid --- */}
                <section id="features" className="px-6 py-24 max-w-7xl mx-auto scroll-mt-16">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-4 font-heading tracking-tight">Engineered for Excellence</h2>
                        <p className="text-slate-500 max-w-xl mx-auto font-medium text-sm">Powerful features designed to bridge the gap between candidate and elite engineer.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Large Featured Card */}
                        <motion.div 
                            whileHover={{ y: -5 }}
                            className="md:col-span-2 lg:row-span-2 glass-thick p-8 md:p-10 rounded-[2.5rem] border border-indigo-500/20 relative overflow-hidden group flex flex-col justify-center min-h-[360px] md:min-h-[460px]"
                        >
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-2xl shadow-indigo-600/30">
                                    <FiCpu className="text-white" />
                                </div>
                                <h3 className="text-3xl font-black text-white mb-4 font-heading leading-tight">Gemini 2.0 Flash Core</h3>
                                <p className="text-slate-400 max-w-lg leading-relaxed text-lg font-medium">Our proprietary integration with Google's latest model ensures deep technical understanding, context-aware feedback, and zero latency during your sessions.</p>
                            </div>
                            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[80px] transition-all group-hover:bg-indigo-600/20" />
                        </motion.div>

                        {/* Smaller Cards - Enforced Height for Alignment */}
                        <motion.div whileHover={{ y: -5 }} className="glass p-8 rounded-[2rem] border border-white/5 flex flex-col justify-between min-h-[220px]">
                            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                                <FiMessageSquare className="text-xl text-purple-400" />
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-white mb-2 font-heading">Real-time Analysis</h4>
                                <p className="text-slate-400 text-xs font-medium leading-relaxed">Instant scoring and constructive feedback on every answer.</p>
                            </div>
                        </motion.div>

                        <motion.div whileHover={{ y: -5 }} className="glass p-8 rounded-[2rem] border border-white/5 flex flex-col justify-between min-h-[220px]">
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
                                <FiTarget className="text-xl text-emerald-400" />
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-white mb-2 font-heading">Targeted Role Prep</h4>
                                <p className="text-slate-400 text-xs font-medium leading-relaxed">Custom tracks for Frontend, Backend, AI, and DevOps.</p>
                            </div>
                        </motion.div>

                        {/* Bottom Row Wide Card */}
                        <motion.div 
                            whileHover={{ y: -5 }}
                            className="md:col-span-2 lg:col-span-3 glass p-8 md:p-12 rounded-[2.5rem] border border-white/5 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-10"
                        >
                            <div className="max-w-xl text-center lg:text-left">
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-3 inline-block">Industry Standard</span>
                                <h3 className="text-xl md:text-2xl font-black text-white mb-3 font-heading">Production-Grade Mockups</h3>
                                <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed">Every question is calibrated to top-tier company standards (Google, Meta, Netflix). Get ready for the big leagues.</p>
                            </div>
                            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                               {['System Design', 'Scalability', 'Algorithms'].map((tag) => (
                                 <div key={tag} className="px-3 py-2 md:px-4 md:py-2.5 glass-thick rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-300 border border-white/10 shrink-0">
                                   {tag}
                                 </div>
                               ))}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* --- Pricing Section --- */}
                <section id="pricing" className="px-6 py-20 md:py-24 max-w-7xl mx-auto scroll-mt-16">
                    <div className="text-center mb-16 md:mb-20">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-4 font-heading tracking-tight">Premium Intelligence</h2>
                        <p className="text-slate-500 font-medium text-xs">Choose the plan that fits your career goals.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                        {[
                            { name: "Free", price: "0", features: ["5 AI Sessions", "Standard Questions", "Community Support"], desc: "Perfect for exploration." },
                            { name: "Pro", price: "29", features: ["Unlimited AI Sessions", "Gemini 2.0 Flash Elite", "Custom Roadmaps", "Expert Analysis"], premium: true, desc: "Best for serious candidates." },
                            { name: "Team", price: "99", features: ["Everything in Pro", "Collaborative Prep", "SSO & Analytics", "Dedicated Support"], desc: "Ideal for bootcamps." }
                        ].map((plan, i) => (
                            <motion.div 
                                key={i}
                                whileHover={{ y: -8 }}
                                className={`flex flex-col p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] border ${plan.premium ? 'bg-indigo-600 border-indigo-400 shadow-2xl shadow-indigo-600/20' : 'glass border-white/5'} transition-all`}
                            >
                                <div className="mb-6 md:mb-8 text-center md:text-left min-h-0 md:min-h-[120px]">
                                    <h3 className={`text-lg md:text-xl font-black mb-1 md:mb-2 font-heading uppercase tracking-tighter text-white`}>{plan.name}</h3>
                                    <p className={`text-[10px] md:text-xs font-medium mb-3 md:mb-4 ${plan.premium ? 'text-indigo-100/70' : 'text-slate-500'}`}>{plan.desc}</p>
                                    <div className="flex items-baseline justify-center md:justify-start gap-1">
                                        <span className="text-3xl md:text-4xl font-black text-white font-heading">${plan.price}</span>
                                        <span className={`text-[9px] md:text-[10px] uppercase tracking-widest font-black ${plan.premium ? 'text-indigo-200' : 'text-slate-500'}`}>/mo</span>
                                    </div>
                                </div>
                                
                                <div className="flex-1">
                                    <ul className="space-y-3 md:space-y-4 mb-8 md:mb-10">
                                        {plan.features.map((f, j) => (
                                            <li key={j} className="flex items-center gap-2.5 md:gap-3 text-[10px] md:text-[11px] font-bold uppercase tracking-tight">
                                                <div className={`w-4 h-4 md:w-5 md:h-5 rounded-md flex items-center justify-center shrink-0 ${plan.premium ? 'bg-white/20' : 'bg-indigo-500/10'}`}>
                                                    <FiCheck className={`text-[8px] md:text-[10px] ${plan.premium ? 'text-white' : 'text-indigo-400'}`} /> 
                                                </div>
                                                <span className={plan.premium ? 'text-indigo-50' : 'text-slate-300'}>{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button className={`w-full py-3 md:py-4 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all active:scale-95 ${plan.premium ? 'bg-white text-black hover:bg-slate-100' : 'glass hover:bg-white/5 text-white'}`}>
                                    Get Started
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* --- Final CTA --- */}
                <section className="px-6 py-20 md:py-32 max-w-6xl mx-auto text-center">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="p-8 md:p-16 rounded-[2.5rem] md:rounded-[3rem] bg-gradient-to-br from-indigo-700 to-purple-800 relative overflow-hidden group shadow-[0_40px_100px_rgba(79,70,229,0.15)]"
                    >
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-6xl font-black text-white mb-4 md:mb-6 font-heading leading-tight tracking-tighter">Ready to bridge the gap?</h2>
                            <p className="text-indigo-100 mb-8 md:mb-10 text-lg md:text-xl max-w-xl mx-auto font-medium leading-relaxed opacity-80">Join 50,000+ developers mastering their careers with InterviewAce AI.</p>
                            <Link to="/signup" className="inline-flex items-center gap-3 px-8 py-4 md:px-10 md:py-5 bg-white text-black font-black rounded-xl md:rounded-2xl hover:bg-slate-100 transition-all shadow-3xl active:scale-95 text-base md:text-lg uppercase tracking-widest">
                                Start Your Journey <FiArrowRight className="text-xl" />
                            </Link>
                        </div>
                        <div className="absolute top-0 right-0 w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-white/5 rounded-full blur-[100px] -mr-24 md:-mr-32 -mt-24 md:-mt-32 group-hover:scale-110 transition-transform duration-1000" />
                    </motion.div>
                </section>
                {/* --- About / Mission Section --- */}
                <section id="about" className="px-6 py-24 max-w-7xl mx-auto scroll-mt-20 border-t border-white/5">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="space-y-8"
                        >
                            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight font-heading">
                                Democratizing <br />
                                <span className="text-indigo-500">Technical Excellence</span>
                            </h2>
                            <p className="text-slate-400 text-lg leading-relaxed font-medium">
                                We believe the distance between a talented developer and an elite role shouldn't be defined by nerves or lack of resources. 
                                <br /><br />
                                InterviewAce AI was built to provide production-grade, real-time feedback that mimics the intensity of a FAANG interview, powered by the latest in large language models.
                            </p>
                            <div className="flex items-center gap-6">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-950 bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white overflow-hidden">
                                           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Trusted by 50k+ Engineers</p>
                            </div>
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="glass-thick p-10 rounded-[3rem] border border-white/10 relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <FiShield className="text-2xl text-emerald-400" />
                                    <div>
                                        <h4 className="text-white font-black text-sm uppercase tracking-widest">Privacy First</h4>
                                        <p className="text-slate-500 text-[10px] font-bold">Your data is encrypted and never shared.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <FiGlobe className="text-2xl text-indigo-400" />
                                    <div>
                                        <h4 className="text-white font-black text-sm uppercase tracking-widest">Global Standards</h4>
                                        <p className="text-slate-500 text-[10px] font-bold">Matching Silicon Valley's highest bars.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <FiTrendingUp className="text-2xl text-purple-400" />
                                    <div>
                                        <h4 className="text-white font-black text-sm uppercase tracking-widest">Career Growth</h4>
                                        <p className="text-slate-500 text-[10px] font-bold">92% of users secure offers within 60 days.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            {/* --- Footer --- */}
            <footer id="about" className="px-8 py-32 border-t border-white/5 relative z-10 scroll-mt-20">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-20">
                   <div className="max-w-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                                <span className="text-white font-black text-lg italic font-heading">A</span>
                            </div>
                            <span className="text-2xl font-black text-white font-heading tracking-tight">InterviewAce <span className="text-indigo-400">AI</span></span>
                        </div>
                        <p className="text-slate-500 text-lg leading-relaxed mb-10 font-medium">Elevating the global standard for technical preparation through advanced artificial intelligence.</p>
                        <div className="flex items-center gap-3 px-5 py-2 bg-emerald-500/5 text-emerald-400 border border-emerald-500/10 rounded-full w-fit">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Operational Status Normal</span>
                        </div>
                   </div>
                   
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-16 md:gap-32 w-full md:w-auto">
                        <div>
                            <h4 className="text-white font-black uppercase text-[11px] tracking-[0.3em] mb-8">Product</h4>
                            <ul className="space-y-5 text-sm text-slate-500 font-bold">
                                <li><a href="#features" className="hover:text-white transition-colors uppercase tracking-widest text-[10px]">Features</a></li>
                                <li><a href="#" className="hover:text-white transition-colors uppercase tracking-widest text-[10px]">Integrations</a></li>
                                <li><a href="#" className="hover:text-white transition-colors uppercase tracking-widest text-[10px]">Roadmap</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-black uppercase text-[11px] tracking-[0.3em] mb-8">Resources</h4>
                            <ul className="space-y-5 text-sm text-slate-500 font-bold">
                                <li><a href="#" className="hover:text-white transition-colors uppercase tracking-widest text-[10px]">Docs</a></li>
                                <li><a href="#" className="hover:text-white transition-colors uppercase tracking-widest text-[10px]">API Reference</a></li>
                                <li><a href="#" className="hover:text-white transition-colors uppercase tracking-widest text-[10px]">Blog</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-black uppercase text-[11px] tracking-[0.3em] mb-8">Company</h4>
                            <ul className="space-y-5 text-sm text-slate-500 font-bold">
                                <li><a href="#" className="hover:text-white transition-colors uppercase tracking-widest text-[10px]">Privacy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors uppercase tracking-widest text-[10px]">Security</a></li>
                                <li><a href="#" className="hover:text-white transition-colors uppercase tracking-widest text-[10px]">Status</a></li>
                            </ul>
                        </div>
                   </div>
                </div>
                <div className="max-w-7xl mx-auto mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
                    <p className="text-slate-600 text-[10px] font-black tracking-[0.3em] uppercase">© 2026 INTERVIEWACE AI. ALL RIGHTS RESERVED.</p>
                    <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                        <a href="#" className="hover:text-white transition-colors">GitHub</a>
                        <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};
export default LandingPage;