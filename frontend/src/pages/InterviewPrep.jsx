import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiChevronRight, FiCheckCircle, FiInfo, FiArrowLeft, FiLoader, FiCpu, FiMessageSquare, FiActivity, FiAperture } from 'react-icons/fi';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { toast } from 'react-hot-toast';

const InterviewPrep = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [evaluation, setEvaluation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [error, setError] = useState(null);
    const [isRetrying, setIsRetrying] = useState(false);

    const fetchSession = async (showLoading = true) => {
        if (showLoading) setIsLoading(true);
        setError(null);
        try {
            const { data } = await axiosInstance.get(`/api/ai/session/${id}`);
            const sessionData = data.data;
            setSession(sessionData);
            
            if (sessionData && sessionData.questions && sessionData.questions.length > 0) {
                setQuestions(sessionData.questions);
            } else if (!isRetrying) {
                handleGenerateQuestions();
            }
        } catch (err) {
            console.error("Fetch session error:", err);
            const msg = err.response?.data?.message || 'Failed to load session trace';
            setError(msg);
            toast.error(msg);
            
            // Only redirect on 404 or 401
            if (err.response?.status === 404 || err.response?.status === 401) {
                navigate('/dashboard');
            }
        } finally {
            if (showLoading) setIsLoading(false);
        }
    };

    const handleGenerateQuestions = async () => {
        setIsRetrying(true);
        try {
            const genRes = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS, { sessionId: id });
            setQuestions(genRes.data.data);
            setError(null);
            toast.success('AI Neural link established!');
        } catch (err) {
            console.error("Generation error:", err);
            const msg = err.response?.data?.message || 'Matrix Generation Failure';
            setError(msg);
            toast.error(msg);
        } finally {
            setIsRetrying(false);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSession();
    }, [id]);

    const handleEvaluate = async () => {
        if (!answer.trim()) return toast.error('Please enter an answer');
        setIsSubmitting(true);
        try {
            const { data } = await axiosInstance.post(API_PATHS.AI.EVALUATE, {
                question: questions[currentIndex].question,
                answer
            });
            setEvaluation(data.data);
            if (data.data.score >= 80) toast.success('Excellent Answer!', { icon: '🔥' });
        } catch (error) {
            toast.error('Evaluation failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setAnswer('');
            setEvaluation(null);
        } else {
            setShowSummary(true);
        }
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#020617]">
            <div className="flex flex-col items-center gap-6">
                <div className="relative">
                    <FiCpu className="text-6xl text-indigo-500 animate-pulse relative z-10" />
                    <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 animate-pulse">Synchronizing AI Neural Link</p>
                <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        className="w-full h-full bg-indigo-500"
                    />
                </div>
            </div>
        </div>
    );

    if (error && questions.length === 0) return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-[#020617]">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full glass-thick p-12 rounded-[3rem] text-center border border-red-500/20 shadow-2xl shadow-red-500/5"
            >
                <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-8 border border-red-500/20">
                    <FiActivity className="animate-pulse" />
                </div>
                <h1 className="text-2xl font-black mb-4 font-heading uppercase tracking-tighter">System Link Failure</h1>
                <p className="text-slate-400 mb-10 text-sm font-medium leading-relaxed italic">"{error}"</p>
                
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={() => id ? handleGenerateQuestions() : fetchSession()}
                        disabled={isRetrying}
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-black rounded-2xl hover:bg-slate-100 transition-all shadow-xl active:scale-95 disabled:opacity-50"
                    >
                        {isRetrying ? <FiLoader className="animate-spin text-xl" /> : <FiAperture className="text-xl" />}
                        {isRetrying ? 'RECONNECTING...' : 'RETRY NEURAL SYNC'}
                    </button>
                    <Link to="/dashboard" className="px-6 py-4 text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">
                        Abort Mission
                    </Link>
                </div>
            </motion.div>
        </div>
    );

    if (showSummary) return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="max-w-xl w-full glass-thick p-16 rounded-[4rem] text-center border border-indigo-500/20 shadow-2xl shadow-indigo-500/10"
            >
                <div className="w-24 h-24 bg-emerald-500 text-white rounded-[2rem] flex items-center justify-center text-5xl mx-auto mb-10 shadow-2xl shadow-emerald-500/30">
                    <FiCheckCircle />
                </div>
                <h1 className="text-4xl font-black mb-4 font-heading uppercase tracking-tighter">Session Complete</h1>
                <p className="text-slate-400 mb-12 text-lg font-medium leading-relaxed">You've successfully mastered the interview track for <span className="text-white font-bold">{session?.role}</span>.</p>
                <Link to="/dashboard" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-black rounded-2xl hover:bg-slate-100 transition-all shadow-xl active:scale-95 text-lg">
                    Return to Dashboard
                </Link>
            </motion.div>
        </div>
    );

    const question = questions[currentIndex];

    return (
        <div className="min-h-screen text-white relative">
            <header className="fixed top-0 left-0 right-0 z-[100] glass border-b border-white/5 h-16 md:h-18 transition-all flex items-center px-4 md:px-8 justify-between backdrop-blur-3xl">
                <div className="flex items-center gap-3 md:gap-6">
                    <Link 
                        to="/dashboard" 
                        className="flex items-center gap-2 group p-2 md:px-4 md:py-2 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-white/5 active:scale-95"
                    >
                        <FiArrowLeft className="text-base md:text-lg group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">Go Back</span>
                    </Link>
                    <div className="w-px h-6 bg-white/10 hidden sm:block" />
                    <div>
                        <h2 className="font-black text-white tracking-tight font-heading text-xs md:text-base truncate max-w-[100px] sm:max-w-none">{session?.role}</h2>
                        <div className="flex items-center gap-2 mt-0.5">
                             <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                             <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400">Question {currentIndex + 1} of {questions.length}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 md:gap-8">
                    <div className="hidden lg:block w-32 md:w-36 h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-out" 
                            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                        />
                    </div>
                    <Link 
                        to="/dashboard" 
                        className="px-4 py-2 md:px-6 md:py-2.5 bg-indigo-600 text-white rounded-lg md:rounded-xl text-[10px] md:text-[11px] font-black uppercase tracking-[0.1em] hover:bg-indigo-500 active:scale-95 transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2"
                    >
                        Dashboard
                        <FiChevronRight className="hidden sm:inline" />
                    </Link>
                </div>
            </header>

            <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.02, y: -10 }}
                        className="space-y-10"
                    >
                        {/* Question Card */}
                        <div className="p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] glass-thick border border-indigo-500/20 shadow-2xl shadow-indigo-500/5 relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="flex items-start gap-4 md:gap-5 mb-5 md:mb-6">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 text-white rounded-lg md:rounded-2xl flex items-center justify-center text-lg md:text-xl font-black shadow-xl shadow-indigo-600/30 shrink-0 group-hover:rotate-6 group-hover:scale-105 transition-all duration-500">
                                        Q
                                    </div>
                                    <h1 className="text-xl sm:text-2xl md:text-3xl font-black leading-tight font-heading tracking-tight">{question?.question}</h1>
                                </div>
                                <div className="flex items-center gap-2.5 ml-12 md:ml-16 text-slate-500 italic text-[10px] md:text-xs font-medium">
                                    <div className="w-4 h-px bg-slate-800" />
                                    <FiMessageSquare className="text-indigo-400/70" />
                                    <span>Execute a structured technical response.</span>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/[0.03] rounded-full blur-[80px] -mr-24 -mt-24 group-hover:bg-indigo-600/10 transition-all duration-1000" />
                        </div>

                        {/* Input Area */}
                        {!evaluation ? (
                            <div className="relative group">
                                <textarea
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    placeholder="Enter your response here..."
                                    className="w-full h-64 md:h-80 p-6 md:p-8 glass-thick rounded-2xl md:rounded-[2.5rem] focus:border-indigo-500/40 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all resize-none text-base md:text-lg text-slate-200 placeholder:text-slate-800 font-medium leading-relaxed border border-white/5 shadow-inner"
                                />
                                <button
                                    onClick={handleEvaluate}
                                    disabled={isSubmitting || !answer.trim()}
                                    className="absolute bottom-4 right-4 md:bottom-7 md:right-7 p-3.5 md:p-4.5 bg-white text-black rounded-xl md:rounded-2xl shadow-2xl hover:bg-slate-100 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed group-hover:shadow-[0_0_50px_rgba(255,255,255,0.1)] flex items-center gap-2 group/btn"
                                >
                                    <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest ml-2 group-hover/btn:mr-1 transition-all">Submit</span>
                                    {isSubmitting ? <FiLoader className="animate-spin text-xl" /> : <FiSend className="text-xl md:text-2xl" />}
                                </button>
                            </div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6 md:space-y-8"
                            >
                                <div className="glass-thick p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 md:mb-10 gap-4 relative z-10">
                                        <div className="flex items-center gap-3.5">
                                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-xl md:text-2xl ${evaluation.score >= 80 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'} shadow-inner`}>
                                                <FiActivity />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-white font-heading leading-tight uppercase tracking-tight">AI Evaluation</h3>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mt-0.5">Neural Response Analysis</p>
                                            </div>
                                        </div>
                                        <div className={`px-5 py-2 md:px-6 md:py-2.5 rounded-2xl font-black text-base md:text-lg border-2 flex items-baseline gap-1 ${evaluation.score >= 80 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                            <span className="text-[10px] md:text-xs uppercase tracking-tighter opacity-50">Score</span>
                                            {evaluation.score}%
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-8 relative z-10">
                                        <div className="p-5 md:p-6 bg-white/[0.03] rounded-2xl border border-white/5">
                                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 md:mb-4 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                                                Constructive Feedback
                                            </p>
                                            <p className="text-slate-300 leading-relaxed text-sm md:text-base font-medium">"{evaluation.feedback}"</p>
                                        </div>
                                        
                                        <div className="p-6 md:p-8 bg-gradient-to-br from-indigo-600/[0.1] to-purple-600/[0.1] rounded-2xl md:rounded-3xl border border-indigo-500/20 relative group/gold">
                                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-4 flex items-center gap-2">
                                                <FiInfo className="animate-pulse" /> The Gold Standard Output
                                            </p>
                                            <p className="text-indigo-50/90 leading-relaxed text-sm md:text-base font-medium selection:bg-indigo-500/30">{evaluation.perfectAnswer}</p>
                                            <div className="absolute top-4 right-6 text-indigo-500/20 text-4xl font-black italic opacity-0 group-hover/gold:opacity-100 transition-opacity select-none">AI</div>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-600/[0.02] rounded-full blur-[100px] pointer-events-none" />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={handleNext}
                                    className="w-full py-4 bg-white text-black font-black text-lg md:text-xl rounded-xl md:rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2.5 shadow-2xl active:scale-[0.98]"
                                >
                                    {currentIndex < questions.length - 1 ? 'Next Challenge' : 'Finalize Trajectory'} <FiChevronRight className="text-xl md:text-2xl" />
                                </motion.button>
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};
export default InterviewPrep;