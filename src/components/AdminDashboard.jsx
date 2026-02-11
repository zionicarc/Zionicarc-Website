import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import {
    Layout, Eye, EyeOff, Lock, Unlock, ArrowLeft,
    Home, Info, Briefcase, Zap, Heart, Mail, Save, Plus, Trash2, X, LogOut, FileText,
    Lightbulb, Settings, Users, CheckCircle, Award, Compass, Layers, Box, HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ImageUpload from './ImageUpload';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

const IconMap = {
    Lightbulb, Settings, Users, CheckCircle, Award, Compass, Layers, Box,
    Home, Info, Briefcase, Zap, Heart, Mail, Layout, FileText
};

function AdminDashboard() {
    const { settings, updateSettings, loading } = useSite();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('general');
    const [activeLegalTab, setActiveLegalTab] = useState('privacy');
    const [localSettings, setLocalSettings] = useState(settings);
    const [isSaving, setIsSaving] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    // Sync local settings once Firebase data is loaded
    React.useEffect(() => {
        if (!loading) {
            setLocalSettings(settings);
        }
    }, [loading, settings]);

    // Handle Auth state
    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            alert('Login Failed: ' + error.message);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateSettings(localSettings);
            alert('Settings saved successfully to Firebase!');
        } catch (error) {
            alert('Error saving settings: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const updateField = (section, field, value) => {
        setLocalSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const updateListItem = (section, arrayKey, index, field, value) => {
        setLocalSettings(prev => {
            const newArray = [...prev[section][arrayKey]];
            newArray[index] = { ...newArray[index], [field]: value };
            return {
                ...prev,
                [section]: {
                    ...prev[section],
                    [arrayKey]: newArray
                }
            };
        });
    };

    const addListItem = (section, arrayKey, defaultValue) => {
        setLocalSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [arrayKey]: [...prev[section][arrayKey], defaultValue]
            }
        }));
    };

    const removeListItem = (section, arrayKey, index) => {
        setLocalSettings(prev => {
            const newArray = prev[section][arrayKey].filter((_, i) => i !== index);
            return {
                ...prev,
                [section]: {
                    ...prev[section],
                    [arrayKey]: newArray
                }
            };
        });
    };

    if (loading || authLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center p-6">
                <div className="w-full max-w-md bg-white border border-black/5 p-8 rounded-3xl shadow-xl">
                    <div className="flex justify-center mb-6">
                        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                            <ArrowLeft size={14} /> Back to Site
                        </button>
                    </div>
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-black/5 rounded-2xl flex items-center justify-center">
                            <Lock className="text-black w-8 h-8" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-outfit font-bold text-black text-center mb-2 uppercase tracking-widest">Admin Access</h1>
                    <p className="text-gray-600 text-center text-sm mb-8">Enter your secure credentials to manage the studio site.</p>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                            <input
                                type="email"
                                placeholder="admin@zionicarc.com"
                                className="w-full bg-[#fcfcfc] border border-black/5 rounded-xl px-4 py-4 text-black placeholder:text-gray-400 focus:outline-none focus:border-black/10 transition-all font-outfit"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-[#fcfcfc] border border-black/5 rounded-xl px-4 py-4 text-black placeholder:text-gray-400 focus:outline-none focus:border-black/10 transition-all font-outfit"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-black/90 transition-all active:scale-95 shadow-lg shadow-black/10">
                            Log In
                        </button>
                    </form>
                    <button onClick={() => navigate('/')} className="w-full mt-6 text-gray-500 text-xs uppercase tracking-widest hover:text-black transition-colors flex items-center justify-center gap-2">
                        <ArrowLeft size={12} /> Return to Site
                    </button>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'general', label: 'General', icon: Home },
        { id: 'hero', label: 'Hero', icon: Layout },
        { id: 'about', label: 'About', icon: Info },
        { id: 'vision', label: 'Vision', icon: Eye },
        { id: 'expertise', label: 'Expertise', icon: Briefcase },
        { id: 'approach', label: 'Approach', icon: Zap },
        { id: 'services', label: 'Services', icon: Heart },
        { id: 'projects', label: 'Projects', icon: Briefcase },
        { id: 'gallery', label: 'Gallery', icon: Layout },
        { id: 'whyChooseUs', label: 'Why Choose Us', icon: Heart },
        { id: 'contact', label: 'Contact', icon: Mail },
        { id: 'footer', label: 'Footer', icon: Info },
        { id: 'legal', label: 'Legal Docs', icon: FileText }
    ];

    return (
        <div className="min-h-screen bg-white text-black font-outfit">
            <nav className="border-b border-black/[0.03] bg-white/70 backdrop-blur-2xl sticky top-0 z-[100]">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-10 h-20 sm:h-28 flex items-center justify-between">
                    <div className="flex items-center gap-4 sm:gap-8">
                        <div className="group relative">
                            <div className="absolute inset-0 bg-black blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                            <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-black text-white rounded-[20px] flex items-center justify-center shadow-2xl transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-500">
                                <Unlock size={22} className="sm:w-[26px] sm:h-[26px]" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-sm sm:text-base font-black tracking-[0.3em] uppercase text-black leading-none mb-1.5">Zionicarc</h2>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Admin Console v2.1</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`group relative flex items-center gap-3 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] px-6 sm:px-10 py-3 sm:py-4 rounded-[18px] transition-all duration-500 overflow-hidden ${isSaving ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 active:scale-95'}`}
                        >
                            {!isSaving && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />}
                            <Save size={16} className={isSaving ? 'animate-pulse' : 'group-hover:scale-125 transition-transform duration-500'} />
                            <span className="relative">{isSaving ? 'Synchronizing...' : 'Sync Changes'}</span>
                        </button>

                        <div className="h-8 w-[1px] bg-black/5 hidden md:block" />

                        <button onClick={() => navigate('/')} className="hidden md:flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] px-8 py-4 bg-gray-50 text-gray-400 rounded-[18px] hover:bg-black hover:text-white transition-all duration-500 group">
                            <Eye size={14} className="group-hover:scale-110 transition-transform" />
                            <span>Preview</span>
                        </button>

                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden w-12 h-12 flex items-center justify-center text-black bg-gray-50 hover:bg-black hover:text-white rounded-[18px] transition-all duration-500 active:scale-90"
                        >
                            {isMenuOpen ? <X size={22} /> : <Layers size={22} />}
                        </button>

                        <button
                            onClick={handleLogout}
                            className="hidden sm:flex w-14 h-14 items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-[18px] transition-all duration-500 group"
                            title="Logout"
                        >
                            <LogOut size={22} className="group-hover:scale-110 group-hover:-translate-x-0.5 transition-all" />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown - Premium Glassmorphism Overlay */}
                {isMenuOpen && (
                    <div className="lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-3xl border-b border-black/[0.03] animate-in fade-in slide-in-from-top-4 duration-500 z-[90]">
                        <div className="p-8 space-y-3 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        setIsMenuOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-6 px-10 py-6 rounded-3xl text-[11px] font-black uppercase tracking-[0.25em] transition-all duration-500 ${activeTab === tab.id
                                        ? 'bg-black text-white shadow-2xl shadow-black/10 translate-x-1'
                                        : 'bg-white text-gray-400 hover:text-black hover:bg-gray-50'
                                        }`}
                                >
                                    <tab.icon size={20} className={activeTab === tab.id ? 'scale-110' : ''} />
                                    {tab.label}
                                </button>
                            ))}
                            <div className="pt-6">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-6 px-10 py-6 rounded-3xl text-[11px] font-black uppercase tracking-[0.25em] text-red-500 bg-red-50 hover:bg-red-100 transition-all duration-500"
                                >
                                    <LogOut size={20} /> Exit Console
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col lg:flex-row gap-10">

                    {/* Sidebar Tabs - Clean & Intuitive */}
                    <aside className="hidden lg:flex flex-col gap-2 shrink-0 w-64 xl:w-72">
                        <div className="sticky top-32 space-y-1">
                            <div className="px-4 mb-6">
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Management</p>
                            </div>
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-sm font-semibold transition-all duration-200 group ${activeTab === tab.id
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                                        }`}
                                >
                                    <tab.icon size={20} className={`shrink-0 ${activeTab === tab.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </aside>

                    {/* Editor Content Area - Clean Card */}
                    <div className="flex-1 min-w-0">
                        <div className="max-w-5xl bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm min-h-[700px] relative transition-all duration-300">

                            {activeTab === 'general' && (
                                <div className="space-y-12 animate-in fade-in duration-500">
                                    <header>
                                        <h3 className="text-2xl font-bold text-slate-900">Module Visibility</h3>
                                        <p className="text-slate-500 mt-1">Control which sections are visible on your public website.</p>
                                    </header>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { id: 'showAbout', label: 'About Us', info: 'Studio manifesto & story' },
                                            { id: 'showVision', label: 'Vision & Mission', info: 'Core guiding principles' },
                                            { id: 'showExpertise', label: 'Technical Expertise', info: 'Skills and tech stack' },
                                            { id: 'showApproach', label: 'Our Approach', info: 'Methodology and workflow' },
                                            { id: 'showServices', label: 'Services', info: 'Available service offerings' },
                                            { id: 'showProjects', label: 'Portfolio', info: 'Collection of completed works' },
                                            { id: 'showGallery', label: 'Visual Gallery', info: 'Exhibition of visual assets' },
                                            { id: 'showWhyChooseUs', label: 'Value Pillars', info: 'Why clients choose Zionicarc' },
                                            { id: 'showContact', label: 'Contact Section', info: 'Lead capture and inquiries' }
                                        ].map((toggle) => (
                                            <div key={toggle.id} className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl transition-all hover:bg-slate-100/50">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm">
                                                        <Layers size={18} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-slate-900 text-sm leading-none mb-1">{toggle.label}</h4>
                                                        <p className="text-xs text-slate-500">{toggle.info}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setLocalSettings(prev => ({ ...prev, [toggle.id]: !prev[toggle.id] }))}
                                                    className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none shrink-0 ${localSettings[toggle.id] ? 'bg-indigo-600' : 'bg-slate-300'}`}
                                                >
                                                    <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${localSettings[toggle.id] ? 'translate-x-6' : 'translate-x-0'}`} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'hero' && (
                                <div className="space-y-10 animate-in fade-in duration-500">
                                    <header>
                                        <h3 className="text-2xl font-bold text-slate-900">Hero Section</h3>
                                        <p className="text-slate-500 mt-1">Update the main title and introduction of your landing page.</p>
                                    </header>

                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Main Heading</label>
                                            <input
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all duration-200 font-medium"
                                                placeholder="Enter a powerful title..."
                                                value={localSettings.hero.title}
                                                onChange={(e) => updateField('hero', 'title', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Sub-heading Narrative</label>
                                            <textarea
                                                rows={4}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all duration-200 font-medium resize-none leading-relaxed"
                                                placeholder="Craft your story..."
                                                value={localSettings.hero.tagline}
                                                onChange={(e) => updateField('hero', 'tagline', e.target.value)}
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Primary Button Text</label>
                                                <input
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all duration-200 font-medium"
                                                    value={localSettings.hero.primaryBtn}
                                                    onChange={(e) => updateField('hero', 'primaryBtn', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Secondary Button Text</label>
                                                <input
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all duration-200 font-medium"
                                                    value={localSettings.hero.secondaryBtn}
                                                    onChange={(e) => updateField('hero', 'secondaryBtn', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'about' && (
                                <div className="space-y-10 animate-in fade-in duration-500">
                                    <header>
                                        <h3 className="text-2xl font-bold text-slate-900">About Story</h3>
                                        <p className="text-slate-500 mt-1">Manage the narrative and core identity of your studio.</p>
                                    </header>

                                    <div className="space-y-6 pt-4">
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Detailed Narrative</label>
                                            <textarea
                                                rows={12}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all duration-200 font-medium resize-none leading-relaxed"
                                                placeholder="Craft your agency manifesto..."
                                                value={localSettings.about.content}
                                                onChange={(e) => updateField('about', 'content', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'vision' && (
                                <div className="space-y-10 animate-in fade-in duration-500">
                                    <header>
                                        <h3 className="text-2xl font-bold text-slate-900">Vision & Mission</h3>
                                        <p className="text-slate-500 mt-1">Define the studio's future vision and core mission statement.</p>
                                    </header>

                                    <div className="space-y-8 pt-4">
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Section Header</label>
                                            <input
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all duration-200 font-medium"
                                                value={localSettings.vision.title}
                                                onChange={(e) => updateField('vision', 'title', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Mission Statement</label>
                                            <textarea
                                                rows={4}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all duration-200 font-medium resize-none leading-relaxed"
                                                value={localSettings.vision.description}
                                                onChange={(e) => updateField('vision', 'description', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'expertise' && (
                                <div className="space-y-10 animate-in fade-in duration-500">
                                    <header>
                                        <h3 className="text-2xl font-bold text-slate-900">Technical Expertise</h3>
                                        <p className="text-slate-500 mt-1">Highlight your technical strengths and professional skills.</p>
                                    </header>

                                    <div className="space-y-8 pt-4">
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Expertise Heading</label>
                                            <input
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all duration-200 font-medium"
                                                value={localSettings.expertise.title}
                                                onChange={(e) => updateField('expertise', 'title', e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center border-b border-slate-100 pb-5">
                                                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Skillset Matrix ({localSettings.expertise.items.length})</h4>
                                                <button
                                                    onClick={() => addListItem('expertise', 'items', { desc: 'New Strength', icon: 'Box' })}
                                                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
                                                >
                                                    <Plus size={16} /> New Skill
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
                                                {localSettings.expertise.items.map((item, idx) => (
                                                    <div key={idx} className="group p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-4 transition-all hover:bg-white hover:shadow-xl">
                                                        <div className="flex items-start gap-4">
                                                            <div className="space-y-2 shrink-0">
                                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Icon</label>
                                                                <select
                                                                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition-all uppercase"
                                                                    value={item.icon || 'Box'}
                                                                    onChange={(e) => updateListItem('expertise', 'items', idx, 'icon', e.target.value)}
                                                                >
                                                                    {Object.keys(IconMap).map(iconName => (
                                                                        <option key={iconName} value={iconName}>{iconName}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className="flex-1 space-y-2">
                                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Capability Description</label>
                                                                <textarea
                                                                    rows={3}
                                                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-600 focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all font-medium leading-relaxed resize-none"
                                                                    value={item.desc}
                                                                    onChange={(e) => updateListItem('expertise', 'items', idx, 'desc', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-end pt-2">
                                                            <button
                                                                onClick={() => removeListItem('expertise', 'items', idx)}
                                                                className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                            >
                                                                <Trash2 size={16} /> Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'approach' && (
                                <div className="space-y-10 animate-in fade-in duration-500">
                                    <header>
                                        <h3 className="text-2xl font-bold text-slate-900">Process & Method</h3>
                                        <p className="text-slate-500 mt-1">Outline the steps of your creative workflow.</p>
                                    </header>

                                    <div className="space-y-8 pt-4">
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Framework Title</label>
                                            <input
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all duration-200 font-medium"
                                                value={localSettings.approach.title}
                                                onChange={(e) => updateField('approach', 'title', e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            {localSettings.approach.steps.map((step, idx) => (
                                                <div key={idx} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-4 group relative transition-all hover:bg-slate-100/50">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">{idx + 1}</div>
                                                            <input
                                                                className="bg-transparent border-none focus:outline-none font-bold text-slate-900 w-full"
                                                                value={step.title}
                                                                onChange={(e) => updateListItem('approach', 'steps', idx, 'title', e.target.value)}
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={() => removeListItem('approach', 'steps', idx)}
                                                            className="p-1.5 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                    <textarea
                                                        rows={2}
                                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200 font-medium resize-none"
                                                        value={step.desc}
                                                        onChange={(e) => updateListItem('approach', 'steps', idx, 'desc', e.target.value)}
                                                    />
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => addListItem('approach', 'steps', { title: 'New Step', desc: 'Description' })}
                                                className="w-full p-4 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-all duration-200 font-bold text-xs uppercase tracking-wider"
                                            >
                                                <Plus size={16} /> Add Step
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'services' && (
                                <div className="animate-in fade-in duration-500">
                                    <header className="mb-8">
                                        <h3 className="text-2xl font-bold text-slate-900">Service Catalog</h3>
                                        <p className="text-slate-500 mt-1">Manage and curate your professional service offerings.</p>
                                    </header>

                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Section Title</label>
                                                <input
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all duration-200 font-medium"
                                                    value={localSettings.services.title}
                                                    onChange={(e) => updateField('services', 'title', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Section Caption</label>
                                                <input
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all duration-200 font-medium"
                                                    value={localSettings.services.caption}
                                                    onChange={(e) => updateField('services', 'caption', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center border-b border-slate-100 pb-5 sticky top-0 bg-white z-10">
                                                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Service Items ({localSettings.services.items.length})</h4>
                                                <button
                                                    onClick={() => addListItem('services', 'items', { title: 'New Service', desc: 'Description', img: '' })}
                                                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
                                                >
                                                    <Plus size={16} /> New Service
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 gap-6 pb-8">
                                                {localSettings.services.items.map((item, idx) => (
                                                    <div key={idx} className="group relative p-8 bg-slate-50 border border-slate-100 rounded-[32px] flex flex-col md:flex-row gap-8 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
                                                        <div className="md:w-64 shrink-0">
                                                            <div className="aspect-[4/5] rounded-2xl bg-white border border-slate-100 overflow-hidden relative shadow-inner group-hover:border-indigo-100 transition-colors">
                                                                <ImageUpload
                                                                    currentImage={item.img}
                                                                    onUploadComplete={(url) => updateListItem('services', 'items', idx, 'img', url)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 flex flex-col justify-between">
                                                            <div className="space-y-6">
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Service Name</label>
                                                                    <input
                                                                        className="w-full bg-transparent text-2xl font-bold text-slate-900 focus:outline-none border-b border-transparent focus:border-indigo-200 pb-2 transition-all"
                                                                        placeholder="Service Title"
                                                                        value={item.title}
                                                                        onChange={(e) => updateListItem('services', 'items', idx, 'title', e.target.value)}
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
                                                                    <textarea
                                                                        rows={3}
                                                                        className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-slate-600 text-base focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all font-medium leading-relaxed resize-none"
                                                                        placeholder="Briefly describe the results..."
                                                                        value={item.desc}
                                                                        onChange={(e) => updateListItem('services', 'items', idx, 'desc', e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-end pt-6">
                                                                <button
                                                                    onClick={() => window.confirm('Delete this service?') && removeListItem('services', 'items', idx)}
                                                                    className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-red-500 transition-colors"
                                                                >
                                                                    <Trash2 size={16} /> Delete Service
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'projects' && (
                                <div className="animate-in fade-in duration-500">
                                    <header className="mb-8">
                                        <h3 className="text-2xl font-bold text-slate-900">Project Portfolio</h3>
                                        <p className="text-slate-500 mt-1">Archive of digital milestones and creative outcomes.</p>
                                    </header>

                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Header Title</label>
                                                <input
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all duration-200 font-medium"
                                                    value={localSettings.projects.title}
                                                    onChange={(e) => updateField('projects', 'title', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Portfolio Caption</label>
                                                <input
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all duration-200 font-medium"
                                                    value={localSettings.projects.caption}
                                                    onChange={(e) => updateField('projects', 'caption', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center border-b border-slate-100 pb-5 sticky top-0 bg-white z-10">
                                                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Milestones ({localSettings.projects.items.length})</h4>
                                                <button
                                                    onClick={() => addListItem('projects', 'items', { title: 'New Project', category: 'Design', platform: 'Web', year: '2024', img: '', link: '#' })}
                                                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
                                                >
                                                    <Plus size={16} /> New Record
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 gap-8 pb-8">
                                                {localSettings.projects.items.map((item, idx) => (
                                                    <div key={idx} className="group relative p-10 bg-slate-50 border border-slate-100 rounded-[48px] flex flex-col xl:flex-row gap-10 hover:bg-white hover:shadow-2xl transition-all duration-300">
                                                        <div className="xl:w-72 shrink-0">
                                                            <div className="aspect-[4/5] rounded-[32px] bg-white border border-slate-100 overflow-hidden relative shadow-inner group-hover:border-indigo-100 transition-colors">
                                                                <ImageUpload
                                                                    currentImage={item.img}
                                                                    onUploadComplete={(url) => updateListItem('projects', 'items', idx, 'img', url)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 flex flex-col justify-between py-2">
                                                            <div className="space-y-10">
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Outcome Name</label>
                                                                    <input
                                                                        className="w-full bg-transparent text-3xl font-black text-slate-900 focus:outline-none placeholder:text-slate-100 italic"
                                                                        placeholder="Project Title"
                                                                        value={item.title}
                                                                        onChange={(e) => updateListItem('projects', 'items', idx, 'title', e.target.value)}
                                                                    />
                                                                </div>
                                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                                                    <div className="space-y-2">
                                                                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Vertical</label>
                                                                        <input className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition-all uppercase" value={item.category} onChange={(e) => updateListItem('projects', 'items', idx, 'category', e.target.value)} />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Medium</label>
                                                                        <input className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition-all uppercase" value={item.platform} onChange={(e) => updateListItem('projects', 'items', idx, 'platform', e.target.value)} />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Cycle</label>
                                                                        <input className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition-all uppercase" value={item.year} onChange={(e) => updateListItem('projects', 'items', idx, 'year', e.target.value)} />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Public Link</label>
                                                                        <input className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition-all" value={item.link} onChange={(e) => updateListItem('projects', 'items', idx, 'link', e.target.value)} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-end pt-8">
                                                                <button
                                                                    onClick={() => window.confirm('Archive this milestone?') && removeListItem('projects', 'items', idx)}
                                                                    className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-red-500 transition-colors"
                                                                >
                                                                    <Trash2 size={16} /> Archive Record
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'gallery' && (
                                <div className="space-y-10 animate-in fade-in duration-500">
                                    <header>
                                        <h3 className="text-2xl font-bold text-slate-900">Visual Gallery</h3>
                                        <p className="text-slate-500 mt-1">Curate and organize your visual portfolio into collections.</p>
                                    </header>

                                    <div className="space-y-8 pt-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Archive Title</label>
                                                <input
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all duration-200 font-medium"
                                                    value={localSettings.gallery.title}
                                                    onChange={(e) => updateField('gallery', 'title', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Curation Narrative</label>
                                                <input
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all duration-200 font-medium"
                                                    value={localSettings.gallery.description}
                                                    onChange={(e) => updateField('gallery', 'description', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            <div className="flex justify-between items-center border-b border-slate-100 pb-5">
                                                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Collections ({(localSettings.gallery.sections || []).length})</h4>
                                                <button
                                                    onClick={() => addListItem('gallery', 'sections', { title: 'New Portfolio', images: [] })}
                                                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
                                                >
                                                    <Plus size={16} /> New Collection
                                                </button>
                                            </div>

                                            <div className="space-y-12">
                                                {localSettings.gallery.sections?.map((section, sIdx) => (
                                                    <div key={sIdx} className="p-8 bg-slate-50 border border-slate-100 rounded-[40px] space-y-8 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
                                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200 pb-6">
                                                            <div className="flex-1 space-y-2">
                                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Collection Identity</label>
                                                                <input
                                                                    className="w-full bg-transparent text-2xl font-bold text-slate-900 focus:outline-none border-b border-transparent focus:border-indigo-200 pb-1 transition-all"
                                                                    placeholder="Collection Title"
                                                                    value={section.title}
                                                                    onChange={(e) => updateListItem('gallery', 'sections', sIdx, 'title', e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="flex items-center gap-6">
                                                                <div className="w-48">
                                                                    <ImageUpload
                                                                        onUploadComplete={(url) => {
                                                                            setLocalSettings(prev => {
                                                                                const newSections = [...prev.gallery.sections];
                                                                                newSections[sIdx] = {
                                                                                    ...newSections[sIdx],
                                                                                    images: [...newSections[sIdx].images, { url, title: 'New Image' }]
                                                                                };
                                                                                return { ...prev, gallery: { ...prev.gallery, sections: newSections } };
                                                                            });
                                                                        }}
                                                                    />
                                                                </div>
                                                                <button
                                                                    onClick={() => window.confirm('Delete this collection?') && removeListItem('gallery', 'sections', sIdx)}
                                                                    className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-red-500 transition-colors"
                                                                >
                                                                    <Trash2 size={16} /> Delete
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                                            {section.images.map((img, iIdx) => (
                                                                <div key={iIdx} className="group/img relative aspect-[3/4] rounded-3xl overflow-hidden border border-slate-200 bg-white flex flex-col shadow-sm transition-all hover:shadow-md">
                                                                    <div className="flex-1 relative overflow-hidden">
                                                                        <img src={img.url} alt="" className="w-full h-full object-cover transition-all duration-700 group-hover/img:scale-110" />
                                                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/img:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                                                                            <button
                                                                                onClick={() => {
                                                                                    if (window.confirm('Delete this image?')) {
                                                                                        setLocalSettings(prev => {
                                                                                            const newSections = [...prev.gallery.sections];
                                                                                            newSections[sIdx] = {
                                                                                                ...newSections[sIdx],
                                                                                                images: newSections[sIdx].images.filter((_, i) => i !== iIdx)
                                                                                            };
                                                                                            return { ...prev, gallery: { ...prev.gallery, sections: newSections } };
                                                                                        });
                                                                                    }
                                                                                }}
                                                                                className="w-10 h-10 flex items-center justify-center bg-white text-red-500 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all"
                                                                            >
                                                                                <Trash2 size={18} />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                    <div className="p-4 border-t border-slate-100">
                                                                        <input
                                                                            className="w-full bg-transparent text-[10px] font-bold uppercase tracking-widest text-slate-600 focus:outline-none"
                                                                            value={img.title}
                                                                            onChange={(e) => {
                                                                                setLocalSettings(prev => {
                                                                                    const newSections = [...prev.gallery.sections];
                                                                                    const newImages = [...newSections[sIdx].images];
                                                                                    newImages[iIdx] = { ...newImages[iIdx], title: e.target.value };
                                                                                    newSections[sIdx] = { ...newSections[sIdx], images: newImages };
                                                                                    return { ...prev, gallery: { ...prev.gallery, sections: newSections } };
                                                                                });
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'whyChooseUs' && (
                                <div className="space-y-10 animate-in fade-in duration-500">
                                    <header>
                                        <h3 className="text-2xl font-bold text-slate-900">Value Proposition</h3>
                                        <p className="text-slate-500 mt-1">Define the core pillars and differentiation factors of your brand.</p>
                                    </header>

                                    <div className="space-y-8 pt-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Section Title</label>
                                                <input
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all duration-200 font-medium"
                                                    value={localSettings.whyChooseUs.title}
                                                    onChange={(e) => updateField('whyChooseUs', 'title', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Value Statement</label>
                                                <input
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all duration-200 font-medium"
                                                    value={localSettings.whyChooseUs.description}
                                                    onChange={(e) => updateField('whyChooseUs', 'description', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center border-b border-slate-100 pb-5">
                                                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Pillars ({localSettings.whyChooseUs.items.length})</h4>
                                                <button
                                                    onClick={() => addListItem('whyChooseUs', 'items', { title: 'New Pillar', description: 'Description', icon: 'Zap' })}
                                                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
                                                >
                                                    <Plus size={16} /> New Pillar
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {localSettings.whyChooseUs.items.map((item, idx) => (
                                                    <div key={idx} className="group p-8 bg-slate-50 border border-slate-100 rounded-[32px] space-y-6 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
                                                        <div className="flex items-start gap-6">
                                                            <div className="space-y-2 shrink-0">
                                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Icon</label>
                                                                <select
                                                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition-all uppercase"
                                                                    value={item.icon || 'Zap'}
                                                                    onChange={(e) => updateListItem('whyChooseUs', 'items', idx, 'icon', e.target.value)}
                                                                >
                                                                    {Object.keys(IconMap).map(iconName => (
                                                                        <option key={iconName} value={iconName}>{iconName}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className="flex-1 space-y-2">
                                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Label</label>
                                                                <input
                                                                    className="w-full bg-transparent text-xl font-bold text-slate-900 focus:outline-none border-b border-transparent focus:border-indigo-200 pb-1 transition-all"
                                                                    placeholder="Pillar Title"
                                                                    value={item.title}
                                                                    onChange={(e) => updateListItem('whyChooseUs', 'items', idx, 'title', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
                                                            <textarea
                                                                rows={3}
                                                                className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-slate-600 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all font-medium leading-relaxed resize-none"
                                                                placeholder="Explain the pattern..."
                                                                value={item.description}
                                                                onChange={(e) => updateListItem('whyChooseUs', 'items', idx, 'description', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="flex justify-end pt-2">
                                                            <button
                                                                onClick={() => window.confirm('Delete this pillar?') && removeListItem('whyChooseUs', 'items', idx)}
                                                                className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-red-500 transition-colors"
                                                            >
                                                                <Trash2 size={16} /> Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'contact' && (
                                <div className="space-y-10 animate-in fade-in duration-500">
                                    <header>
                                        <h3 className="text-2xl font-bold text-slate-900">Communication Hub</h3>
                                        <p className="text-slate-500 mt-1">Manage contact triggers and inquiry channels for client engagement.</p>
                                    </header>

                                    <div className="space-y-8 pt-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">CTA Heading</label>
                                                <input
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all duration-200 font-medium"
                                                    value={localSettings.contact.title}
                                                    onChange={(e) => updateField('contact', 'title', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">CTA Narrative</label>
                                                <textarea
                                                    rows={3}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all duration-200 font-medium resize-none"
                                                    value={localSettings.contact.description}
                                                    onChange={(e) => updateField('contact', 'description', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Inquiry Email</label>
                                                <input
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition-all"
                                                    value={localSettings.contact.email}
                                                    onChange={(e) => updateField('contact', 'email', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Direct Line</label>
                                                <input
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition-all"
                                                    value={localSettings.contact.phone}
                                                    onChange={(e) => updateField('contact', 'phone', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">WhatsApp ID</label>
                                                <input
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition-all"
                                                    placeholder="91xxxxxxxxxx"
                                                    value={localSettings.contact.whatsapp}
                                                    onChange={(e) => updateField('contact', 'whatsapp', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'footer' && (
                                <div className="space-y-12 animate-in fade-in duration-500">
                                    <header>
                                        <h3 className="text-2xl font-bold text-slate-900">Brand Foundation</h3>
                                        <p className="text-slate-500 mt-1">Manage global brand identity and structural footer elements.</p>
                                    </header>

                                    <div className="space-y-8 pt-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Brand Name</label>
                                                <input
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all duration-200 font-bold tracking-tight"
                                                    value={localSettings.footer.brandName}
                                                    onChange={(e) => updateField('footer', 'brandName', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Copyright Statement</label>
                                                <input
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all duration-200 font-medium"
                                                    value={localSettings.footer.copyright}
                                                    onChange={(e) => updateField('footer', 'copyright', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Tagline</label>
                                                <textarea
                                                    rows={3}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all duration-200 font-medium resize-none"
                                                    value={localSettings.footer.tagline}
                                                    onChange={(e) => updateField('footer', 'tagline', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Brand Quote</label>
                                                <textarea
                                                    rows={3}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all duration-200 font-medium italic resize-none"
                                                    value={localSettings.footer.quote}
                                                    onChange={(e) => updateField('footer', 'quote', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="p-8 bg-slate-900 rounded-[32px] text-white space-y-8 overflow-hidden relative">
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                                            <div>
                                                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Architect Credits</h4>
                                                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">Design and development attribution.</p>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Developer Name</label>
                                                    <input
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:bg-white/10 focus:outline-none transition-all"
                                                        value={localSettings.footer.developerName}
                                                        onChange={(e) => updateField('footer', 'developerName', e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Developer Link</label>
                                                    <input
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 focus:bg-white/10 focus:outline-none transition-all"
                                                        value={localSettings.footer.developerLink}
                                                        onChange={(e) => updateField('footer', 'developerLink', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'legal' && (
                                <div className="animate-in fade-in duration-500">
                                    <header className="mb-8">
                                        <h3 className="text-2xl font-bold text-slate-900">Legal Documents</h3>
                                        <p className="text-slate-500 mt-1">Manage privacy policies and service agreements.</p>
                                    </header>

                                    <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl w-fit mb-8">
                                        <button
                                            onClick={() => setActiveLegalTab('privacy')}
                                            className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeLegalTab === 'privacy' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                        >
                                            Privacy Policy
                                        </button>
                                        <button
                                            onClick={() => setActiveLegalTab('terms')}
                                            className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeLegalTab === 'terms' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                        >
                                            Terms of Service
                                        </button>
                                    </div>

                                    <div className="space-y-8">
                                        {activeLegalTab === 'privacy' && (
                                            <div className="space-y-8 animate-in fade-in duration-500">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6 sticky top-0 bg-white z-10">
                                                    <div className="space-y-1">
                                                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Privacy Policy Sections ({(localSettings.privacyPolicy?.sections || []).length})</h4>
                                                        <p className="text-xs text-slate-400 font-medium">Last updated: {localSettings.privacyPolicy?.lastUpdated || 'Never'}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => addListItem('privacyPolicy', 'sections', { title: 'New Module', content: 'Inception of policy details...' })}
                                                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
                                                    >
                                                        <Plus size={16} /> New Section
                                                    </button>
                                                </div>

                                                <div className="space-y-6 pb-8">
                                                    {localSettings.privacyPolicy?.sections?.map((section, idx) => (
                                                        <div key={idx} className="p-8 bg-slate-50 border border-slate-100 rounded-[32px] space-y-6 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
                                                            <div className="flex justify-between items-center gap-6 border-b border-slate-200 pb-4">
                                                                <div className="flex-1 space-y-2">
                                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Module Identity</label>
                                                                    <input
                                                                        className="w-full bg-transparent text-xl font-bold text-slate-900 focus:outline-none placeholder:text-slate-300 italic"
                                                                        value={section.title}
                                                                        onChange={(e) => updateListItem('privacyPolicy', 'sections', idx, 'title', e.target.value)}
                                                                    />
                                                                </div>
                                                                <button
                                                                    onClick={() => window.confirm('Delete this legal section?') && removeListItem('privacyPolicy', 'sections', idx)}
                                                                    className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-red-500 transition-colors"
                                                                >
                                                                    <Trash2 size={16} /> Delete
                                                                </button>
                                                            </div>
                                                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Primary Mandate</label>
                                                                    <textarea
                                                                        rows={6}
                                                                        className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-slate-600 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all font-medium leading-relaxed resize-none"
                                                                        value={section.content}
                                                                        onChange={(e) => updateListItem('privacyPolicy', 'sections', idx, 'content', e.target.value)}
                                                                    />
                                                                </div>
                                                                <div className="space-y-6">
                                                                    <div className="space-y-2">
                                                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Governance Matrix (Newline Separated)</label>
                                                                        <textarea
                                                                            rows={4}
                                                                            className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-slate-600 text-xs font-bold tracking-wider focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all leading-relaxed resize-none"
                                                                            placeholder="Point Alpha&#10;Point Beta"
                                                                            value={section.listItems ? section.listItems.join('\n') : ''}
                                                                            onChange={(e) => {
                                                                                const items = e.target.value.split('\n').filter(i => i.trim() !== '');
                                                                                updateListItem('privacyPolicy', 'sections', idx, 'listItems', items);
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Secondary Clause</label>
                                                                        <textarea
                                                                            rows={2}
                                                                            className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-slate-400 text-xs font-medium focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all leading-relaxed resize-none"
                                                                            value={section.secondaryContent || ''}
                                                                            onChange={(e) => updateListItem('privacyPolicy', 'sections', idx, 'secondaryContent', e.target.value)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {activeLegalTab === 'terms' && (
                                            <div className="space-y-8 animate-in fade-in duration-500">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6 sticky top-0 bg-white z-10">
                                                    <div className="space-y-1">
                                                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Terms of Engagement ({(localSettings.termsOfService?.sections || []).length})</h4>
                                                        <p className="text-xs text-slate-400 font-medium">Last updated: {localSettings.termsOfService?.lastUpdated || 'Never'}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => addListItem('termsOfService', 'sections', { title: 'New Clause', content: 'Statement of terms...' })}
                                                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
                                                    >
                                                        <Plus size={16} /> New Clause
                                                    </button>
                                                </div>

                                                <div className="space-y-6 pb-8">
                                                    {localSettings.termsOfService?.sections?.map((section, idx) => (
                                                        <div key={idx} className="p-8 bg-slate-50 border border-slate-100 rounded-[32px] space-y-6 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
                                                            <div className="flex justify-between items-center gap-6 border-b border-slate-200 pb-4">
                                                                <div className="flex-1 space-y-2">
                                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Clause Identity</label>
                                                                    <input
                                                                        className="w-full bg-transparent text-xl font-bold text-slate-900 focus:outline-none placeholder:text-slate-300 italic"
                                                                        value={section.title}
                                                                        onChange={(e) => updateListItem('termsOfService', 'sections', idx, 'title', e.target.value)}
                                                                    />
                                                                </div>
                                                                <button
                                                                    onClick={() => window.confirm('Delete this clause?') && removeListItem('termsOfService', 'sections', idx)}
                                                                    className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-red-500 transition-colors"
                                                                >
                                                                    <Trash2 size={16} /> Delete
                                                                </button>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Contractual Statement</label>
                                                                <textarea
                                                                    rows={8}
                                                                    className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-slate-600 text-base focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all font-medium leading-relaxed resize-none italic"
                                                                    value={section.content}
                                                                    onChange={(e) => updateListItem('termsOfService', 'sections', idx, 'content', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AdminDashboard;
