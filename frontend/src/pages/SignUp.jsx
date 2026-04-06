import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { FiArrowLeft } from 'react-icons/fi';

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data } = await axiosInstance.post(API_PATHS.AUTH.SIGNUP, { name, email, password });
            // Backend returns { success: true, data: { ..., token } }
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data));
            toast.success('Welcome to the future of prep!', { icon: '🚀' });
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative z-10 w-full max-w-sm sm:max-w-md"
            >
                <div className="glass-thick p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-white/10 relative overflow-hidden">
                    <Link to="/" className="absolute top-6 left-8 md:top-8 md:left-10 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all flex items-center gap-2 group/back">
                        <FiArrowLeft className="group-hover/back:-translate-x-1 transition-transform" /> Home
                    </Link>
                    <div className="text-center mb-8 md:mb-10 mt-4">
                        <h1 className="text-2xl md:text-3xl font-black text-white mb-2 font-heading uppercase tracking-tighter">Join the Elite</h1>
                        <p className="text-slate-500 text-xs md:text-sm font-medium">Start your journey to mastery today.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 ml-1">Full Name</label>
                            <input 
                                required
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-5 py-3.5 bg-white/5 border border-white/5 rounded-xl focus:border-indigo-500/50 outline-none transition-all text-white font-medium placeholder:text-slate-800 text-sm" 
                                placeholder="John Doe" 
                            />
                        </div>
                        <div>
                            <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 ml-1">Identity (Email)</label>
                            <input 
                                required
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-3.5 bg-white/5 border border-white/5 rounded-xl focus:border-indigo-500/50 outline-none transition-all text-white font-medium placeholder:text-slate-800 text-sm" 
                                placeholder="name@domain.com" 
                            />
                        </div>
                        <div>
                            <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 ml-1">Access Key (Password)</label>
                            <input 
                                required
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-3.5 bg-white/5 border border-white/5 rounded-xl focus:border-indigo-500/50 outline-none transition-all text-white font-medium placeholder:text-slate-800 text-sm" 
                                placeholder="••••••••" 
                            />
                        </div>
                        
                        <button 
                            disabled={isLoading}
                            className="w-full py-4 bg-indigo-600 text-white font-black text-lg rounded-xl hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-500/25 active:scale-[0.98] mt-4 disabled:opacity-50"
                        >
                            {isLoading ? 'Registering...' : 'Get Started'}
                        </button>
                    </form>

                    <p className="mt-10 text-center text-slate-500 text-sm font-medium">
                        Already have an identity? <Link to="/login" className="text-indigo-400 font-black hover:text-indigo-300 transition-colors">Sign In here</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default SignUp;