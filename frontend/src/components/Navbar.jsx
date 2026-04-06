import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiChevronRight, FiLogOut } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const token = localStorage.getItem('token');



  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setIsOpen(false), [location]);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  // Hide Navbar in the Interview Prep session - must be after all hooks
  if (location.pathname.startsWith('/interview-prep')) return null;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${scrolled ? 'h-16 glass-thick border-b border-white/10 shadow-2xl shadow-black/50' : 'h-20 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group transition-all shrink-0">
          <div className="w-8 h-8 md:w-9 md:h-9 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg shadow-indigo-500/25">
            <span className="text-white font-black text-base md:text-lg italic font-heading">A</span>
          </div>
          <span className="text-base md:text-lg font-extrabold tracking-tight text-white group-hover:text-indigo-400 transition-colors font-heading">InterviewAce <span className="text-indigo-500">AI</span></span>
        </Link>

        {/* Desktop Links - Show on Large Tablet / Laptop */}
        <div className="hidden lg:flex items-center gap-8">
          <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="text-[10px] font-black text-slate-400 hover:text-white transition-all uppercase tracking-widest">Features</a>
          <a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')} className="text-[10px] font-black text-slate-400 hover:text-white transition-all uppercase tracking-widest">Pricing</a>
          <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="text-[10px] font-black text-slate-400 hover:text-white transition-all uppercase tracking-widest">About</a>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <div className="hidden lg:flex items-center gap-1">
            {!token ? (
              <>
                <Link to="/login" className="px-4 py-2 text-[10px] font-black text-slate-400 hover:text-white transition-all uppercase tracking-widest">Login</Link>
                <Link to="/signup" className="px-5 py-2.5 text-[10px] font-black bg-white text-black rounded-lg hover:bg-slate-100 transition-all active:scale-95 shadow-xl uppercase tracking-[0.1em]">
                  Get Started
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/dashboard" className="px-5 py-2.5 text-[10px] font-black bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-indigo-500/25 uppercase tracking-[0.1em]">
                  Dashboard
                </Link>
                <button 
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/';
                  }}
                  className="p-2.5 text-slate-400 hover:text-white glass rounded-lg border border-white/5 transition-all"
                >
                  <FiLogOut className="text-sm" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-white hover:bg-white/5 rounded-lg transition-colors border border-white/5"
          >
            {isOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-slate-950/98 backdrop-blur-3xl border-b border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            <div className="px-6 py-8 space-y-6">
              <div className="flex flex-col gap-4">
                <a href="#features" onClick={(e) => { scrollToSection(e, 'features'); setIsOpen(false); }} className="flex items-center justify-between group p-2">
                  <span className="text-xs font-black text-slate-400 group-hover:text-white transition-colors uppercase tracking-[0.2em]">Features</span>
                  <FiChevronRight className="text-slate-600 group-hover:text-indigo-400 transition-all" />
                </a>
                <a href="#pricing" onClick={(e) => { scrollToSection(e, 'pricing'); setIsOpen(false); }} className="flex items-center justify-between group p-2">
                  <span className="text-xs font-black text-slate-400 group-hover:text-white transition-colors uppercase tracking-[0.2em]">Pricing</span>
                  <FiChevronRight className="text-slate-600 group-hover:text-indigo-400 transition-all" />
                </a>
                <a href="#about" onClick={(e) => { scrollToSection(e, 'about'); setIsOpen(false); }} className="flex items-center justify-between group p-2">
                  <span className="text-xs font-black text-slate-400 group-hover:text-white transition-colors uppercase tracking-[0.2em]">About</span>
                  <FiChevronRight className="text-slate-600 group-hover:text-indigo-400 transition-all" />
                </a>
              </div>

              <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                {!token ? (
                  <>
                    <Link to="/login" className="flex items-center justify-center p-4 glass rounded-xl text-[10px] font-black uppercase tracking-widest text-white">Login</Link>
                    <Link to="/signup" className="flex items-center justify-center p-4 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest">Sign Up</Link>
                  </>
                ) : (
                  <div className="col-span-2 grid grid-cols-4 gap-2">
                    <Link to="/dashboard" className="col-span-3 flex items-center justify-center p-4 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Dashboard</Link>
                    <button 
                      onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        window.location.href = '/';
                      }}
                      className="flex items-center justify-center glass rounded-xl text-white"
                    >
                      <FiLogOut />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
export default Navbar;