import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import {
    Layout, Eye, EyeOff, Lock, Unlock, ArrowLeft,
    Home, Info, Briefcase, Zap, Heart, Mail, Save, Plus, Trash2, X, LogOut, FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ImageUpload from './ImageUpload';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

export default function AdminDashboard() {
    const { settings, updateSettings, loading } = useSite();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('general');
    const [activeLegalTab, setActiveLegalTab] = useState('privacy');
    const [localSettings, setLocalSettings] = useState(settings);
    const [isSaving, setIsSaving] = useState(false);
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
                    <div className="flex justify-center mb-8">
                        <div className="p-4 bg-black/5 rounded-2xl">
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
        { id: 'whyChooseUs', label: 'Why Choose Us', icon: Heart },
        { id: 'contact', label: 'Contact', icon: Mail },
        { id: 'footer', label: 'Footer', icon: Info },
        { id: 'legal', label: 'Legal Docs', icon: FileText }
    ];

    return (
        <div className="min-h-screen bg-white text-black font-outfit">
            <nav className="border-b border-black/5 bg-white/90 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-black text-white rounded-lg">
                            <Unlock size={18} />
                        </div>
                        <h2 className="text-lg font-bold tracking-widest uppercase">CMS Dashboard</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded-full transition-all shadow-lg ${isSaving ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-black text-white hover:bg-black/90 shadow-black/10 active:scale-95'}`}
                        >
                            <Save size={14} /> {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button onClick={() => navigate('/')} className="text-xs font-bold uppercase tracking-widest px-6 py-2.5 border border-black/10 rounded-full hover:bg-black hover:text-white transition-all">
                            Live Site
                        </button>
                        <button
                            onClick={handleLogout}
                            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Sidebar Tabs */}
                    <aside className="lg:w-64 flex flex-col gap-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all border ${activeTab === tab.id
                                    ? 'bg-gray-100 text-black border-black/10 shadow-inner'
                                    : 'bg-white text-gray-400 border-black/5 shadow-sm hover:shadow-md hover:text-black'
                                    }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </aside>

                    {/* Editor Content */}
                    <div className="flex-1 space-y-8">
                        <div className="bg-[#fcfcfc] border border-black/5 rounded-3xl p-8 shadow-sm">

                            {activeTab === 'general' && (
                                <div className="space-y-12">
                                    <header>
                                        <h3 className="text-2xl font-bold uppercase tracking-tight mb-2">Global Settings</h3>
                                        <p className="text-gray-500 text-sm">Manage high-level feature visibility across the site.</p>
                                    </header>
                                    <div className="space-y-4">
                                        {[
                                            { id: 'showAbout', label: 'About Us Section' },
                                            { id: 'showVision', label: 'Our Vision Section' },
                                            { id: 'showExpertise', label: 'Our Expertise Section' },
                                            { id: 'showApproach', label: 'Our Approach Section' },
                                            { id: 'showServices', label: 'Our Services Section' },
                                            { id: 'showProjects', label: 'Our Work (Projects) Section' },
                                            { id: 'showWhyChooseUs', label: 'Why Choose Us Section' },
                                            { id: 'showContact', label: 'Contact Section' }
                                        ].map((toggle) => (
                                            <div key={toggle.id} className="flex items-center justify-between p-5 bg-white rounded-2xl border border-black/5 shadow-sm">
                                                <div>
                                                    <h4 className="font-bold uppercase mb-1 text-black text-xs">{toggle.label}</h4>
                                                    <p className="text-[10px] text-gray-400 italic font-medium tracking-tight">Toggle visibility in Navbar and on Home Page.</p>
                                                </div>
                                                <button
                                                    onClick={() => setLocalSettings(prev => ({ ...prev, [toggle.id]: !prev[toggle.id] }))}
                                                    className={`relative w-16 h-8 rounded-full transition-all flex items-center px-1 ${localSettings[toggle.id] ? 'bg-black' : 'bg-gray-100 border border-black/5'}`}
                                                >
                                                    <div className={`w-6 h-6 rounded-full transition-all flex items-center justify-center ${localSettings[toggle.id] ? 'bg-white translate-x-8' : 'bg-gray-300'}`}>
                                                        {localSettings[toggle.id] ? <Eye size={12} className="text-black" /> : <EyeOff size={12} className="text-gray-600" />}
                                                    </div>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'hero' && (
                                <div className="space-y-8">
                                    <header>
                                        <h3 className="text-2xl font-bold uppercase tracking-tight mb-2">Hero Section</h3>
                                        <p className="text-gray-500 text-sm">Edit the landing message and tagline.</p>
                                    </header>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Hero Title</label>
                                            <input
                                                className="w-full bg-white border border-black/5 rounded-xl px-4 py-4 text-black focus:outline-none focus:border-black/10 transition-all font-outfit"
                                                value={localSettings.hero.title}
                                                onChange={(e) => updateField('hero', 'title', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Tagline / Subtitle</label>
                                            <textarea
                                                rows={3}
                                                className="w-full bg-white border border-black/5 rounded-xl px-4 py-4 text-black focus:outline-none focus:border-black/10 transition-all resize-none leading-relaxed font-outfit"
                                                value={localSettings.hero.tagline}
                                                onChange={(e) => updateField('hero', 'tagline', e.target.value)}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Primary Button</label>
                                                <input className="w-full bg-white border border-black/5 rounded-xl px-4 py-4 text-black font-outfit" value={localSettings.hero.primaryBtn} onChange={(e) => updateField('hero', 'primaryBtn', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Secondary Button</label>
                                                <input className="w-full bg-white border border-black/5 rounded-xl px-4 py-4 text-black font-outfit" value={localSettings.hero.secondaryBtn} onChange={(e) => updateField('hero', 'secondaryBtn', e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'about' && (
                                <div className="space-y-8">
                                    <header>
                                        <h3 className="text-2xl font-bold uppercase tracking-tight mb-2">About Section</h3>
                                        <p className="text-gray-500 text-sm">The core story of your studio.</p>
                                    </header>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Section Title</label>
                                            <input
                                                className="w-full bg-white border border-black/5 rounded-xl px-4 py-4 text-black focus:outline-none focus:border-black/10 transition-all font-outfit"
                                                value={localSettings.about.title}
                                                onChange={(e) => updateField('about', 'title', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Narrative Description</label>
                                            <textarea
                                                rows={6}
                                                className="w-full bg-white border border-black/5 rounded-xl px-4 py-4 text-black focus:outline-none focus:border-black/10 transition-all resize-none leading-relaxed font-outfit"
                                                value={localSettings.about.description}
                                                onChange={(e) => updateField('about', 'description', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'vision' && (
                                <div className="space-y-8">
                                    <header>
                                        <h3 className="text-2xl font-bold uppercase tracking-tight mb-2">Vision Section</h3>
                                        <p className="text-gray-500 text-sm">Define your studio's long-term aspirations.</p>
                                    </header>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Section Title</label>
                                            <input
                                                className="w-full bg-white border border-black/5 rounded-xl px-4 py-4 text-black focus:outline-none focus:border-black/10 transition-all font-outfit"
                                                value={localSettings.vision.title}
                                                onChange={(e) => updateField('vision', 'title', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Vision Statement</label>
                                            <textarea
                                                rows={6}
                                                className="w-full bg-white border border-black/5 rounded-xl px-4 py-4 text-black focus:outline-none focus:border-black/10 transition-all resize-none leading-relaxed font-outfit"
                                                value={localSettings.vision.description}
                                                onChange={(e) => updateField('vision', 'description', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'expertise' && (
                                <div className="space-y-8">
                                    <header>
                                        <h3 className="text-2xl font-bold uppercase tracking-tight mb-2">Our Expertise</h3>
                                        <p className="text-gray-500 text-sm">Managing the specialty value containers.</p>
                                    </header>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Header</label>
                                                <input className="w-full bg-white border border-black/5 rounded-xl px-4 py-4 text-black font-outfit" value={localSettings.expertise.title} onChange={(e) => updateField('expertise', 'title', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Caption</label>
                                                <input className="w-full bg-white border border-black/5 rounded-xl px-4 py-4 text-black font-outfit" value={localSettings.expertise.caption} onChange={(e) => updateField('expertise', 'caption', e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Expertise Bullets</label>
                                                <button onClick={() => addListItem('expertise', 'items', { desc: 'New Expertise', icon: 'Box' })} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest bg-black/5 hover:bg-black text-gray-500 hover:text-white px-3 py-1 rounded-lg transition-all">
                                                    <Plus size={10} /> Add Item
                                                </button>
                                            </div>
                                            {localSettings.expertise.items.map((item, idx) => (
                                                <div key={idx} className="p-6 bg-white border border-black/5 rounded-2xl flex gap-4 shadow-sm relative group">
                                                    <div className="flex-1 space-y-4">
                                                        <textarea
                                                            rows={2}
                                                            className="w-full bg-gray-50 border border-black/5 rounded-lg px-4 py-2 text-sm text-gray-700 font-outfit"
                                                            value={item.desc}
                                                            onChange={(e) => updateListItem('expertise', 'items', idx, 'desc', e.target.value)}
                                                        />
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-4">
                                                                <span className="text-[10px] text-gray-400 uppercase font-bold">Icon:</span>
                                                                <input className="bg-transparent border-b border-black/10 text-xs py-1 text-black font-outfit" value={item.icon} onChange={(e) => updateListItem('expertise', 'items', idx, 'icon', e.target.value)} />
                                                            </div>
                                                            <button onClick={() => window.confirm('Are you sure you want to delete this item?') && removeListItem('expertise', 'items', idx)} className="absolute top-4 right-4 w-auto p-0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'approach' && (
                                <div className="space-y-8">
                                    <header>
                                        <h3 className="text-2xl font-bold uppercase tracking-tight mb-2">Our Approach</h3>
                                        <p className="text-gray-500 text-sm">Manage the strategic steps and descriptive header.</p>
                                    </header>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Section Title</label>
                                                <input className="w-full bg-white border border-black/5 rounded-xl px-4 py-4 text-black font-outfit" value={localSettings.approach.title} onChange={(e) => updateField('approach', 'title', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Sub-caption</label>
                                                <input className="w-full bg-white border border-black/5 rounded-xl px-4 py-4 text-black font-outfit" value={localSettings.approach.description} onChange={(e) => updateField('approach', 'description', e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center mb-4">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Approach Steps</label>
                                            <button onClick={() => addListItem('approach', 'steps', { no: '04', title: 'New Step', desc: 'Description' })} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest bg-black/5 hover:bg-black text-gray-500 hover:text-white px-3 py-1 rounded-lg transition-all">
                                                <Plus size={10} /> Add Step
                                            </button>
                                        </div>
                                        {localSettings.approach.steps.map((step, idx) => (
                                            <div key={idx} className="p-6 bg-white border border-black/5 rounded-2xl space-y-4 relative group shadow-sm">
                                                <button onClick={() => window.confirm('Are you sure you want to delete this step?') && removeListItem('approach', 'steps', idx)} className="absolute top-4 right-4 w-auto p-0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all">
                                                    <Trash2 size={16} />
                                                </button>
                                                <div className="flex items-center gap-4">
                                                    <input className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-xs text-center font-outfit" value={step.no} onChange={(e) => updateListItem('approach', 'steps', idx, 'no', e.target.value)} />
                                                    <input className="flex-1 bg-transparent text-xl font-bold border-b border-black/10 text-black font-outfit" value={step.title} onChange={(e) => updateListItem('approach', 'steps', idx, 'title', e.target.value)} />
                                                </div>
                                                <textarea className="w-full bg-gray-50 border border-black/5 rounded-lg px-4 py-3 text-sm text-gray-600 font-outfit" rows={3} value={step.desc} onChange={(e) => updateListItem('approach', 'steps', idx, 'desc', e.target.value)} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'services' && (
                                <div className="space-y-8">
                                    <header>
                                        <h3 className="text-2xl font-bold uppercase tracking-tight mb-2">Service Catalog</h3>
                                        <p className="text-gray-500 text-sm">Manage the detailed service grid.</p>
                                    </header>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Title</label>
                                                <input className="w-full bg-white border border-black/5 rounded-xl px-4 py-4 text-black font-outfit" value={localSettings.services.title} onChange={(e) => updateField('services', 'title', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Caption</label>
                                                <input className="w-full bg-white border border-black/5 rounded-xl px-4 py-4 text-black font-outfit" value={localSettings.services.caption} onChange={(e) => updateField('services', 'caption', e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center mb-4">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Service Items</label>
                                            <button onClick={() => addListItem('services', 'items', { title: 'New Service', subtitle: 'Category', desc: 'Description', img: '' })} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest bg-black/5 hover:bg-black text-gray-500 hover:text-white px-3 py-1 rounded-lg transition-all">
                                                <Plus size={10} /> Add Service
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {localSettings.services.items.map((item, idx) => (
                                                <div key={idx} className="p-6 bg-white border border-black/5 rounded-2xl space-y-4 relative group shadow-sm">
                                                    <button onClick={() => window.confirm('Are you sure you want to delete this service?') && removeListItem('services', 'items', idx)} className="absolute top-4 right-4 w-auto p-0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all">
                                                        <Trash2 size={16} />
                                                    </button>
                                                    <input className="w-full bg-transparent text-lg font-bold border-b border-black/10 text-black font-outfit" value={item.title} onChange={(e) => updateListItem('services', 'items', idx, 'title', e.target.value)} />
                                                    <input className="w-full bg-transparent text-xs text-gray-400 uppercase tracking-widest font-outfit" value={item.subtitle} onChange={(e) => updateListItem('services', 'items', idx, 'subtitle', e.target.value)} />
                                                    <textarea className="w-full bg-gray-50 border border-black/5 rounded-lg px-4 py-3 text-sm text-gray-500 font-outfit" rows={3} value={item.desc} onChange={(e) => updateListItem('services', 'items', idx, 'desc', e.target.value)} />

                                                    <div className="pt-2">
                                                        <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Service Image</label>
                                                        <ImageUpload
                                                            currentImage={item.img}
                                                            onUploadComplete={(url) => updateListItem('services', 'items', idx, 'img', url)}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}


                            {activeTab === 'projects' && (
                                <div className="space-y-8">
                                    <header className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-2xl font-bold uppercase tracking-tight mb-2">Projects Section</h3>
                                            <p className="text-gray-500 text-sm">Update the header and "View All" button text.</p>
                                        </div>
                                        <div className="flex items-center gap-4 bg-white border border-black/5 p-4 rounded-2xl shadow-sm">
                                            <div className="text-right">
                                                <h4 className="font-bold uppercase text-[10px] text-black">Section Visibility</h4>
                                                <p className="text-[9px] text-gray-400 font-medium">Toggle on the Home Page</p>
                                            </div>
                                            <button
                                                onClick={() => setLocalSettings(prev => ({ ...prev, showProjects: !prev.showProjects }))}
                                                className={`relative w-14 h-7 rounded-full transition-all flex items-center px-1 ${localSettings.showProjects ? 'bg-black' : 'bg-gray-100 border border-black/5'}`}
                                            >
                                                <div className={`w-5 h-5 rounded-full transition-all flex items-center justify-center ${localSettings.showProjects ? 'bg-white translate-x-7' : 'bg-gray-300'}`}>
                                                    {localSettings.showProjects ? <Eye size={10} className="text-black" /> : <EyeOff size={10} className="text-gray-600" />}
                                                </div>
                                            </button>
                                        </div>
                                    </header>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Section Title</label>
                                            <input className="w-full bg-white border border-black/5 rounded-xl px-4 py-4 text-black font-outfit" value={localSettings.projects.title} onChange={(e) => updateField('projects', 'title', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Link Text (e.g. View All Projects)</label>
                                            <input className="w-full bg-white border border-black/5 rounded-xl px-4 py-4 text-black font-outfit" value={localSettings.projects.description} onChange={(e) => updateField('projects', 'description', e.target.value)} />
                                        </div>

                                        <div className="space-y-4 pt-6 mt-6 border-t border-black/5">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Project List Items</label>
                                                <button onClick={() => addListItem('projects', 'items', { name: 'New Project', location: 'Location', type: 'Design', img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=2670&auto=format&fit=crop' })} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest bg-black/5 hover:bg-black text-gray-500 hover:text-white px-3 py-1 rounded-lg transition-all">
                                                    <Plus size={10} /> Add Project
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {localSettings.projects.items.map((item, idx) => (
                                                    <div key={idx} className="p-6 bg-white border border-black/5 rounded-2xl space-y-4 relative group shadow-sm">
                                                        <button onClick={() => window.confirm('Are you sure you want to delete this project?') && removeListItem('projects', 'items', idx)} className="absolute top-4 right-4 w-auto p-0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all">
                                                            <Trash2 size={16} />
                                                        </button>
                                                        <div className="flex gap-4">
                                                            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-black/10 bg-gray-50">
                                                                <img src={item.img} alt="" className="w-full h-full object-cover opacity-80" />
                                                            </div>
                                                            <div className="flex-1 space-y-3">
                                                                <input className="w-full bg-transparent text-sm font-bold border-b border-black/10 text-black font-outfit" placeholder="Name" value={item.name} onChange={(e) => updateListItem('projects', 'items', idx, 'name', e.target.value)} />
                                                                <input className="w-full bg-transparent text-xs text-gray-500 border-b border-black/10 font-outfit" placeholder="Location" value={item.location} onChange={(e) => updateListItem('projects', 'items', idx, 'location', e.target.value)} />
                                                                <input className="w-full bg-transparent text-[10px] text-gray-400 uppercase tracking-widest border-b border-black/10 font-outfit" placeholder="Type" value={item.type} onChange={(e) => updateListItem('projects', 'items', idx, 'type', e.target.value)} />

                                                                <div className="pt-2">
                                                                    <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Project Image</label>
                                                                    <ImageUpload
                                                                        currentImage={item.img}
                                                                        onUploadComplete={(url) => updateListItem('projects', 'items', idx, 'img', url)}
                                                                        acceptedFiles="image/png, image/jpeg, image/jpg"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'whyChooseUs' && (
                                <div className="space-y-8">
                                    <header>
                                        <h3 className="text-2xl font-bold uppercase tracking-tight mb-2">Why Choose Us</h3>
                                        <p className="text-gray-500 text-sm">Update the value proposition and reasons.</p>
                                    </header>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Section Title</label>
                                                <input className="w-full bg-white border border-black/5 rounded-xl px-4 py-4 text-black font-outfit" value={localSettings.whyChooseUs.title} onChange={(e) => updateField('whyChooseUs', 'title', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Subtitle</label>
                                                <input className="w-full bg-white border border-black/5 rounded-xl px-4 py-4 text-black font-outfit" value={localSettings.whyChooseUs.description} onChange={(e) => updateField('whyChooseUs', 'description', e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center mb-4">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Value Proposition Items</label>
                                            <button onClick={() => addListItem('whyChooseUs', 'reasons', { title: 'New Reason', desc: 'Description', icon: 'Award' })} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest bg-black/5 hover:bg-black text-gray-500 hover:text-white px-3 py-1 rounded-lg transition-all">
                                                <Plus size={10} /> Add Reason
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4">
                                            {localSettings.whyChooseUs.reasons.map((item, idx) => (
                                                <div key={idx} className="p-6 bg-white border border-black/5 rounded-2xl space-y-4 relative group shadow-sm">
                                                    <button onClick={() => window.confirm('Are you sure you want to delete this reason?') && removeListItem('whyChooseUs', 'reasons', idx)} className="absolute top-4 right-4 w-auto p-0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all">
                                                        <Trash2 size={16} />
                                                    </button>
                                                    <input className="w-full bg-transparent text-xl font-bold border-b border-black/10 text-black font-outfit" value={item.title} onChange={(e) => updateListItem('whyChooseUs', 'reasons', idx, 'title', e.target.value)} />
                                                    <textarea className="w-full bg-gray-50 border border-black/5 rounded-lg px-4 py-3 text-sm text-gray-600 font-outfit" rows={2} value={item.desc} onChange={(e) => updateListItem('whyChooseUs', 'reasons', idx, 'desc', e.target.value)} />
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-[10px] text-gray-400 uppercase font-bold">Icon:</span>
                                                        <input className="bg-transparent border-b border-black/10 text-xs py-1 text-black font-outfit" value={item.icon} onChange={(e) => updateListItem('whyChooseUs', 'reasons', idx, 'icon', e.target.value)} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'contact' && (
                                <div className="space-y-8">
                                    <header>
                                        <h3 className="text-2xl font-bold uppercase tracking-tight mb-2">Contact Section</h3>
                                        <p className="text-gray-500 text-sm">Update the call to action.</p>
                                    </header>
                                    <div className="space-y-6">
                                        <div className="p-6 bg-black/5 rounded-2xl border border-black/10 mb-8">
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-black mb-2">Section: Start a Project</h4>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">This controls the main heading and subtext in the Contact section.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Heading (e.g. Start a Project)</label>
                                            <input className="w-full bg-white border border-black/5 rounded-xl px-4 py-4 text-black font-outfit" value={localSettings.contact.title} onChange={(e) => updateField('contact', 'title', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Brief Text / Description</label>
                                            <textarea className="w-full bg-white border border-black/5 rounded-xl px-4 py-4 text-black rows={3} font-outfit leading-relaxed" value={localSettings.contact.description} onChange={(e) => updateField('contact', 'description', e.target.value)} />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-outfit pt-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                                                <input className="w-full bg-white border border-black/5 rounded-xl px-4 py-4 text-black font-outfit" value={localSettings.contact.email} onChange={(e) => updateField('contact', 'email', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Phone Number</label>
                                                <input className="w-full bg-white border border-black/5 rounded-xl px-4 py-4 text-black font-outfit" value={localSettings.contact.phone} onChange={(e) => updateField('contact', 'phone', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">WhatsApp (digits only)</label>
                                                <input className="w-full bg-white border border-black/5 rounded-xl px-4 py-4 text-black font-outfit" placeholder="919986598000" value={localSettings.contact.whatsapp} onChange={(e) => updateField('contact', 'whatsapp', e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'footer' && (
                                <div className="space-y-8">
                                    <header>
                                        <h3 className="text-2xl font-bold uppercase tracking-tight mb-2">Footer Details</h3>
                                        <p className="text-gray-500 text-sm">Manage brand tagline and business info.</p>
                                    </header>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Brand Name</label>
                                                <input className="w-full bg-white border border-black/5 rounded-xl px-4 py-4 text-black font-outfit" value={localSettings.footer.brandName} onChange={(e) => updateField('footer', 'brandName', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Copyright Text</label>
                                                <input className="w-full bg-white border border-black/5 rounded-xl px-4 py-4 text-black font-outfit" value={localSettings.footer.copyright} onChange={(e) => updateField('footer', 'copyright', e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Brand Tagline</label>
                                            <textarea className="w-full bg-white border border-black/5 rounded-xl px-4 py-4 text-black rows={2} font-outfit leading-relaxed" value={localSettings.footer.tagline} onChange={(e) => updateField('footer', 'tagline', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Footer Quote</label>
                                            <textarea className="w-full bg-white border border-black/5 rounded-xl px-4 py-4 text-black rows={2} font-outfit leading-relaxed italic" value={localSettings.footer.quote} onChange={(e) => updateField('footer', 'quote', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Operating / Call Timings</label>
                                            <input className="w-full bg-white border border-black/5 rounded-xl px-4 py-4 text-black font-outfit" value={localSettings.footer.timings} onChange={(e) => updateField('footer', 'timings', e.target.value)} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-black/5">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Developer Agency Name</label>
                                                <input className="w-full bg-white border border-black/5 rounded-xl px-4 py-4 text-black font-outfit" value={localSettings.footer.developerName} onChange={(e) => updateField('footer', 'developerName', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Developer Agency Link</label>
                                                <input className="w-full bg-white border border-black/5 rounded-xl px-4 py-4 text-black font-outfit" value={localSettings.footer.developerLink} onChange={(e) => updateField('footer', 'developerLink', e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'legal' && (
                                <div className="space-y-12">
                                    <header>
                                        <h3 className="text-2xl font-bold uppercase tracking-tight mb-2">Legal Documents</h3>
                                        <p className="text-gray-500 text-sm">Manage Privacy Policy and Terms of Service.</p>
                                    </header>

                                    {/* Sub-Tabs */}
                                    <div className="flex gap-8 border-b border-black/5">
                                        <button
                                            onClick={() => setActiveLegalTab('privacy')}
                                            className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all ${activeLegalTab === 'privacy' ? 'text-black border-b-2 border-black' : 'text-gray-400 hover:text-gray-600'}`}
                                        >
                                            Privacy Policy
                                        </button>
                                        <button
                                            onClick={() => setActiveLegalTab('terms')}
                                            className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all ${activeLegalTab === 'terms' ? 'text-black border-b-2 border-black' : 'text-gray-400 hover:text-gray-600'}`}
                                        >
                                            Terms of Service
                                        </button>
                                    </div>

                                    {/* Privacy Policy */}
                                    {activeLegalTab === 'privacy' && (
                                        <div className="space-y-6 animate-fadeIn">
                                            <div className="flex items-center justify-between pb-4 border-b border-black/5">
                                                <h4 className="text-lg font-bold uppercase tracking-widest">Privacy Policy Content</h4>
                                                <button onClick={() => addListItem('privacyPolicy', 'sections', { title: 'New Section', content: 'Section content...' })} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest bg-black/5 hover:bg-black text-gray-500 hover:text-white px-3 py-1 rounded-lg transition-all">
                                                    <Plus size={10} /> Add Section
                                                </button>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Last Updated Text</label>
                                                <input
                                                    className="w-full bg-white border border-black/5 rounded-xl px-4 py-4 text-black font-outfit"
                                                    value={localSettings.privacyPolicy?.lastUpdated || ''}
                                                    onChange={(e) => setLocalSettings(prev => ({ ...prev, privacyPolicy: { ...prev.privacyPolicy, lastUpdated: e.target.value } }))}
                                                />
                                            </div>

                                            <div className="space-y-4">
                                                {localSettings.privacyPolicy?.sections?.map((section, idx) => (
                                                    <div key={idx} className="p-6 bg-white border border-black/5 rounded-2xl space-y-4 relative group shadow-sm">
                                                        <button onClick={() => window.confirm('Are you sure you want to delete this section?') && removeListItem('privacyPolicy', 'sections', idx)} className="absolute top-4 right-4 w-auto p-0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all">
                                                            <Trash2 size={16} />
                                                        </button>

                                                        <div className="space-y-2">
                                                            <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Section Title</label>
                                                            <input className="w-full bg-transparent text-sm font-bold border-b border-black/10 text-black font-outfit py-2" value={section.title} onChange={(e) => updateListItem('privacyPolicy', 'sections', idx, 'title', e.target.value)} />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Content</label>
                                                            <textarea className="w-full bg-gray-50 border border-black/5 rounded-lg px-4 py-3 text-sm text-gray-600 font-outfit leading-relaxed" rows={3} value={section.content} onChange={(e) => updateListItem('privacyPolicy', 'sections', idx, 'content', e.target.value)} />
                                                        </div>

                                                        {/* Simple List Items Management */}
                                                        <div className="space-y-2">
                                                            <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400">List Items (One per line)</label>
                                                            <textarea
                                                                className="w-full bg-gray-50 border border-black/5 rounded-lg px-4 py-3 text-sm text-gray-600 font-outfit"
                                                                rows={3}
                                                                placeholder="Item 1&#10;Item 2&#10;Item 3"
                                                                value={section.listItems ? section.listItems.join('\n') : ''}
                                                                onChange={(e) => {
                                                                    const items = e.target.value.split('\n').filter(i => i.trim() !== '');
                                                                    updateListItem('privacyPolicy', 'sections', idx, 'listItems', items);
                                                                }}
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Secondary Content (After List)</label>
                                                            <textarea className="w-full bg-gray-50 border border-black/5 rounded-lg px-4 py-3 text-sm text-gray-600 font-outfit leading-relaxed" rows={2} value={section.secondaryContent || ''} onChange={(e) => updateListItem('privacyPolicy', 'sections', idx, 'secondaryContent', e.target.value)} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Terms of Service */}
                                    {activeLegalTab === 'terms' && (
                                        <div className="space-y-6 animate-fadeIn">
                                            <div className="flex items-center justify-between pb-4 border-b border-black/5">
                                                <h4 className="text-lg font-bold uppercase tracking-widest">Terms of Service Content</h4>
                                                <button onClick={() => addListItem('termsOfService', 'sections', { title: 'New Section', content: 'Section content...' })} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest bg-black/5 hover:bg-black text-gray-500 hover:text-white px-3 py-1 rounded-lg transition-all">
                                                    <Plus size={10} /> Add Section
                                                </button>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Last Updated Text</label>
                                                <input
                                                    className="w-full bg-white border border-black/5 rounded-xl px-4 py-4 text-black font-outfit"
                                                    value={localSettings.termsOfService?.lastUpdated || ''}
                                                    onChange={(e) => setLocalSettings(prev => ({ ...prev, termsOfService: { ...prev.termsOfService, lastUpdated: e.target.value } }))}
                                                />
                                            </div>

                                            <div className="space-y-4">
                                                {localSettings.termsOfService?.sections?.map((section, idx) => (
                                                    <div key={idx} className="p-6 bg-white border border-black/5 rounded-2xl space-y-4 relative group shadow-sm">
                                                        <button onClick={() => window.confirm('Are you sure you want to delete this section?') && removeListItem('termsOfService', 'sections', idx)} className="absolute top-4 right-4 w-auto p-0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all">
                                                            <Trash2 size={16} />
                                                        </button>

                                                        <div className="space-y-2">
                                                            <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Section Title</label>
                                                            <input className="w-full bg-transparent text-sm font-bold border-b border-black/10 text-black font-outfit py-2" value={section.title} onChange={(e) => updateListItem('termsOfService', 'sections', idx, 'title', e.target.value)} />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Content</label>
                                                            <textarea className="w-full bg-gray-50 border border-black/5 rounded-lg px-4 py-3 text-sm text-gray-600 font-outfit leading-relaxed" rows={3} value={section.content} onChange={(e) => updateListItem('termsOfService', 'sections', idx, 'content', e.target.value)} />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400">List Items (One per line)</label>
                                                            <textarea
                                                                className="w-full bg-gray-50 border border-black/5 rounded-lg px-4 py-3 text-sm text-gray-600 font-outfit"
                                                                rows={3}
                                                                placeholder="Item 1&#10;Item 2"
                                                                value={section.listItems ? section.listItems.join('\n') : ''}
                                                                onChange={(e) => {
                                                                    const items = e.target.value.split('\n').filter(i => i.trim() !== '');
                                                                    updateListItem('termsOfService', 'sections', idx, 'listItems', items);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
