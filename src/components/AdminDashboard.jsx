import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { Layout, Eye, EyeOff, Lock, Unlock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const { settings, updateSettings } = useSite();
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    // Simple hardcoded password for demonstration
    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'zionic123') {
            setIsAuthenticated(true);
        } else {
            alert('Incorrect Password');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
                <div className="w-full max-w-md bg-neutral-900 border border-white/10 p-8 rounded-3xl shadow-2xl">
                    <div className="flex justify-center mb-8">
                        <div className="p-4 bg-white/5 rounded-2xl">
                            <Lock className="text-white w-8 h-8" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-outfit font-bold text-white text-center mb-2 uppercase tracking-widest">Admin Access</h1>
                    <p className="text-gray-500 text-center text-sm mb-8">Enter your secure credentials to manage the studio site.</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            placeholder="Enter Password"
                            className="w-full bg-black border border-white/5 rounded-xl px-4 py-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-white/20 transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button className="w-full bg-white text-black py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95">
                            Login Dashboard
                        </button>
                    </form>

                    <button
                        onClick={() => navigate('/')}
                        className="w-full mt-6 text-gray-600 text-xs uppercase tracking-widest hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={12} /> Return to Site
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-outfit">
            {/* Header */}
            <nav className="border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-white text-black rounded-lg">
                            <Unlock size={18} />
                        </div>
                        <h2 className="text-lg font-bold tracking-widest uppercase">Studio Control</h2>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="text-xs font-bold uppercase tracking-widest px-6 py-2 border border-white/10 rounded-full hover:bg-white hover:text-black transition-all"
                    >
                        Live Site
                    </button>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

                    {/* Sidebar Info */}
                    <div className="md:col-span-4 space-y-8">
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-white/30 mb-4">Dashboard</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Welcome to the Z'IONIC ARC control center. Here you can manage section visibility and core site data.
                            </p>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-bold">System Status</p>
                            <div className="flex items-center gap-2 text-green-500 text-sm font-bold">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                Operational
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="md:col-span-8 space-y-6">
                        <div className="bg-neutral-900 border border-white/5 rounded-3xl p-8 space-y-8 shadow-xl">
                            <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-6">
                                    <div className={`p-4 rounded-2xl transition-all ${settings.showProjects ? 'bg-white text-black' : 'bg-white/5 text-gray-600'}`}>
                                        <Layout size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold tracking-tight mb-1 uppercase">Our Work (Projects)</h4>
                                        <p className="text-sm text-gray-500">Toggle the visibility of the projects section on the main page.</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => updateSettings({ showProjects: !settings.showProjects })}
                                    className={`relative w-24 h-12 rounded-full transition-all duration-300 flex items-center px-1.5 ${settings.showProjects ? 'bg-white' : 'bg-white/5 border border-white/10'}`}
                                >
                                    <div className={`w-9 h-9 rounded-full transition-all duration-300 flex items-center justify-center ${settings.showProjects ? 'bg-black translate-x-12' : 'bg-gray-800'}`}>
                                        {settings.showProjects ? <Eye size={16} className="text-white" /> : <EyeOff size={16} className="text-gray-400" />}
                                    </div>
                                </button>
                            </div>

                            {/* Add more controls below similarly */}
                            <div className="pt-8 border-t border-white/5 opacity-50 cursor-not-allowed">
                                <div className="flex items-center gap-6">
                                    <div className="p-4 rounded-2xl bg-white/5 text-gray-800">
                                        <EyeOff size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold tracking-tight mb-1 uppercase text-gray-600">Site Metadata Editor</h4>
                                        <p className="text-sm text-gray-700 italic">Feature coming soon in next update.</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
