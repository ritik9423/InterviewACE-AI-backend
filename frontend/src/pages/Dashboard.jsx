import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiClock, FiCheckCircle, FiChevronRight, FiLogOut, FiX, FiBriefcase, FiAperture, FiTrendingUp, FiAward, FiPieChart, FiActivity, FiChevronDown } from 'react-icons/fi';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
    const [sessions, setSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    
    // New Session Form State
    const [role, setRole] = useState('Frontend Developer');
    const [experience, setExperience] = useState(2);
    const [topics, setTopics] = useState('');
    const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

    const roles = [
        "Frontend Developer",
        "Backend Developer",
        "Fullstack Engineer",
        "Cloud Architect",
        "AI Engineer"
    ];

    const navigate = useNavigate();

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const { data } = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
                setSessions(data.data || []);
            } catch (error) {
                console.error('Failed to fetch sessions', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSessions();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success('Logged out successfully');
        navigate('/login');
    };

    const handleCreateSession = async (e) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            const { data } = await axiosInstance.post(API_PATHS.SESSION.CREATE, {
                role,
                experience: parseInt(experience),
                topicsToFocus: topics || 'General',
                questions: [] // Ensure questions is sent if needed by controller
            });
            toast.success('Interview path initialized');
            // Backend returns { success: true, data: session }
            navigate(`/interview-prep/${data.data._id}`);
        } catch (error) {
            console.error("Create session error:", error);
            toast.error('Failed to initialize session');
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="min-h-screen text-white">
            <main className="pt-20 md:pt-24 pb-12 md:pb-16 px-4 md:px-6 max-w-7xl mx-auto">
                {/* --- Header Section --- */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 md:mb-12 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="flex items-center gap-2.5 mb-3">
                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20 rounded-full">Unlimited Access</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-2 font-heading leading-none">
                            Welcome back, <span className="text-indigo-400">{user.name || 'Developer'}</span>
                        </h1>
                        <p className="text-slate-500 text-sm font-medium">Your preparation is <span className="text-emerald-400">84% complete</span>. Ready for the next stage?</p>
                    </motion.div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsModalOpen(true)}
                            className="w-full sm:flex-1 lg:flex-none flex items-center justify-center gap-2.5 px-6 py-3 bg-white text-black font-black rounded-xl transition-all shadow-xl hover:shadow-white/10 text-sm"
                        >
                            <FiPlus className="text-lg" /> New Session
                        </motion.button>
                        <button 
                            onClick={handleLogout}
                            className="w-full sm:w-auto flex items-center justify-center p-3 glass rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                        >
                            <FiLogOut className="text-lg" />
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* --- Main Content (Left) --- */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Stats Dashboard */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                            {[
                                { label: "Success Rate", val: "92%", icon: <FiTrendingUp />, color: "from-emerald-500/20 to-emerald-500/5", iconColor: "text-emerald-400" },
                                { label: "Global Rank", val: "#1,204", icon: <FiAward />, color: "from-amber-500/20 to-amber-500/5", iconColor: "text-amber-400" },
                                { label: "Time Invested", val: "42h", icon: <FiClock />, color: "from-indigo-500/20 to-indigo-500/5", iconColor: "text-indigo-400" }
                            ].map((stat, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ y: -4, border: '1px solid rgba(255,255,255,0.15)' }}
                                    className="p-5 md:p-6 glass rounded-2xl md:rounded-3xl border border-white/5 group transition-all duration-300"
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-5 bg-gradient-to-br ${stat.color} ${stat.iconColor} shadow-inner`}>
                                        {stat.icon}
                                    </div>
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1.5">{stat.label}</p>
                                    <p className="text-2xl font-black text-white font-heading tracking-tight">{stat.val}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Recent Activity */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-black text-white font-heading flex items-center gap-2.5">
                                    <FiActivity className="text-indigo-400" /> Session History
                                </h2>
                                <button className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Clear All</button>
                            </div>
                            
                            <div className="space-y-3">
                                {isLoading ? (
                                    [1, 2, 3].map(i => (
                                        <div key={i} className="h-20 glass rounded-2xl animate-pulse border border-white/5" />
                                    ))
                                ) : sessions.length > 0 ? (
                                    sessions.map((session, i) => (
                                        <motion.div
                                            key={session._id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <Link 
                                                to={`/interview-prep/${session._id}`}
                                                className="block p-3.5 md:p-4 glass rounded-xl md:rounded-2xl hover:bg-white/[0.05] hover:border-white/10 transition-all group border border-white/5 relative overflow-hidden"
                                            >
                                                <div className="flex items-center justify-between relative z-10">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 md:w-11 md:h-11 bg-indigo-500/10 text-indigo-400 rounded-lg md:rounded-xl flex items-center justify-center text-lg md:text-xl group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-105 transition-all duration-300">
                                                            <FiBriefcase />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-black text-sm md:text-base text-white group-hover:text-white transition-colors font-heading leading-tight">{session.role}</h3>
                                                            <div className="flex items-center gap-2 md:gap-3 mt-1">
                                                                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-500">{session.experience} YRS EXP</span>
                                                                <span className="w-1 h-1 bg-slate-700 rounded-full" />
                                                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                                                                    <div className="w-1 h-1 bg-emerald-400 rounded-full" />
                                                                    <span className="text-[8px] font-black uppercase tracking-widest leading-none">Complete</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 group-hover:text-slate-400 transition-colors hidden sm:inline">Review</span>
                                                        <FiChevronRight className="text-slate-600 group-hover:text-indigo-400 transition-all transform group-hover:translate-x-1 text-xl" />
                                                    </div>
                                                </div>
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </Link>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="p-12 md:p-16 text-center glass rounded-3xl border-2 border-dashed border-white/5">
                                        <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-full flex items-center justify-center text-xl md:text-2xl mx-auto mb-5 text-slate-600">
                                            <FiPieChart />
                                        </div>
                                        <h3 className="text-lg font-bold mb-1.5">No Sessions Yet</h3>
                                        <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">Start your first AI-powered interview to see your detailed metrics.</p>
                                        <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-500 transition-all text-sm">Begin Now</button>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* --- Sidebar (Right) --- */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Performance Trend */}
                        <section className="glass-thick p-6 md:p-8 rounded-3xl border border-white/10 relative overflow-hidden group">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg font-black font-heading tracking-tight uppercase tracking-[0.05em]">Velocity</h3>
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-lg border border-white/5">
                                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Live</span>
                                </div>
                            </div>
                            <div className="h-40 w-full relative">
                                <svg viewBox="0 0 400 150" className="w-full h-full overflow-visible">
                                    <path 
                                        d="M0,120 Q50,110 100,80 T200,40 T300,60 T400,20" 
                                        fill="none" 
                                        stroke="url(#grad)" 
                                        strokeWidth="4" 
                                        strokeLinecap="round"
                                        className="drop-shadow-[0_0_12px_rgba(99,102,241,0.6)] animate-dash transition-all duration-1000"
                                    />
                                    <circle cx="400" cy="20" r="4" className="fill-white animate-pulse drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                                    <defs>
                                        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#818cf8" />
                                            <stop offset="100%" stopColor="#c084fc" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] mt-4">
                                    <span>Mon</span>
                                    <span>Wed</span>
                                    <span>Fri</span>
                                    <span>Sun</span>
                                </div>
                            </div>
                            <div className="mt-8 p-3.5 md:p-4 bg-indigo-600/10 rounded-xl md:rounded-2xl border border-indigo-500/20 backdrop-blur-md">
                                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-1">Precision Guide</p>
                                <p className="text-xs text-indigo-100/80 font-medium leading-relaxed italic">"Intensive focus on <span className="text-white font-bold">System Architecture</span> will yield a 15% velocity increase."</p>
                            </div>
                        </section>

                        <section className="p-8 rounded-3xl bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 relative overflow-hidden group">
                           <div className="relative z-10">
                                <span className="px-2.5 py-1 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-full mb-4 inline-block">Active Benefit</span>
                                <h3 className="text-xl font-black mb-1 font-heading">AI Powerhouse</h3>
                                <p className="text-slate-400 text-xs mb-6 leading-relaxed">Your account has been upgraded to the highest synchronization tier. Enjoy unlimited interview generations.</p>
                                <button className="w-full py-3 bg-white text-black font-black rounded-xl hover:bg-slate-100 transition-all active:scale-95 shadow-xl text-xs">
                                    View Full Analytics
                                </button>
                           </div>
                           <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-700" />
                        </section>
                    </div>
                </div>
            </main>

            {/* --- New Session Modal --- */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 40 }}
                            className="relative w-full max-w-lg glass-thick p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-[0_0_100px_rgba(79,70,229,0.1)] border border-white/10"
                        >
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-6 right-6 md:top-8 md:right-8 p-2 text-slate-500 hover:text-white transition-colors"
                            >
                                <FiX className="text-xl" />
                            </button>

                            <div className="mb-8 md:mb-10 text-center">
                                <div className="w-14 h-14 md:w-16 md:h-16 bg-indigo-600 text-white rounded-xl md:rounded-2xl flex items-center justify-center text-2xl md:text-3xl mx-auto mb-5 md:mb-6 shadow-2xl shadow-indigo-600/30">
                                    <FiAperture className="animate-spin-slow" />
                                </div>
                                <h2 className="text-xl md:text-2xl font-black mb-2 font-heading uppercase tracking-tighter">Initialize AI</h2>
                                <p className="text-slate-500 text-[11px] md:text-sm font-medium">Fine-tune the interviewer to match your career target.</p>
                            </div>

                            <form onSubmit={handleCreateSession} className="space-y-6">
                                <div>
                                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Core Specialization</label>
                                    <div className="relative">
                                        <div 
                                            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                                            className="w-full px-5 py-3.5 bg-white/5 border border-white/5 rounded-xl focus:border-indigo-500/50 outline-none transition-all text-white font-bold cursor-pointer text-sm flex items-center justify-between group hover:bg-white/10"
                                        >
                                            <span>{role}</span>
                                            <motion.div
                                                animate={{ rotate: isRoleDropdownOpen ? 180 : 0 }}
                                                className="text-slate-500 group-hover:text-white transition-colors"
                                            >
                                                <FiChevronDown className="text-lg" />
                                            </motion.div>
                                        </div>

                                        <AnimatePresence>
                                            {isRoleDropdownOpen && (
                                                <>
                                                    <motion.div 
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        onClick={() => setIsRoleDropdownOpen(false)}
                                                        className="fixed inset-0 z-[110]"
                                                    />
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                        className="absolute top-full left-0 right-0 mt-2 p-2 bg-[#0f172a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[120] overflow-hidden"
                                                    >
                                                        {roles.map((r) => (
                                                            <motion.div
                                                                key={r}
                                                                whileHover={{ x: 4, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                                                                onClick={() => {
                                                                    setRole(r);
                                                                    setIsRoleDropdownOpen(false);
                                                                }}
                                                                className={`px-4 py-3 rounded-xl cursor-pointer text-sm font-bold transition-all flex items-center justify-between ${
                                                                    role === r ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:text-white'
                                                                }`}
                                                            >
                                                                {r}
                                                                {role === r && <FiCheckCircle className="text-indigo-400" />}
                                                            </motion.div>
                                                        ))}
                                                    </motion.div>
                                                </>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Experience Level</label>
                                        <input 
                                            type="number" 
                                            value={experience}
                                            onChange={(e) => setExperience(e.target.value)}
                                            className="w-full px-5 py-3.5 bg-white/5 border border-white/5 rounded-xl focus:border-indigo-500/50 outline-none transition-all text-white font-bold text-sm"
                                            min="0" max="20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Algorithm Sensitivity</label>
                                        <div className="w-full px-5 py-3.5 bg-indigo-600/10 border border-indigo-500/20 rounded-xl text-indigo-400 flex items-center gap-2.5 font-black text-[9px] uppercase tracking-widest leading-none">
                                            High Fidelity
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Custom Topics</label>
                                    <input 
                                        type="text" 
                                        placeholder="React, Node.js, System Design..." 
                                        value={topics}
                                        onChange={(e) => setTopics(e.target.value)}
                                        className="w-full px-5 py-3.5 bg-white/5 border border-white/5 rounded-xl focus:border-indigo-500/50 outline-none transition-all text-white font-medium placeholder:text-slate-500 text-sm" 
                                    />
                                </div>

                                <button 
                                    disabled={isCreating}
                                    className="w-full py-4 bg-white text-black font-black text-lg rounded-xl hover:bg-slate-100 transition-all shadow-2xl shadow-indigo-500/5 active:scale-[0.98] mt-2 disabled:opacity-50"
                                >
                                    {isCreating ? 'Synchronizing Neural Link...' : 'Sync Session'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
export default Dashboard;