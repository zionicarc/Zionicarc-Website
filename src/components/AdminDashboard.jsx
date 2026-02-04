import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import {
    Layout, Eye, EyeOff, Lock, Unlock, ArrowLeft,
    Home, Info, Briefcase, Zap, Heart, Mail, Save
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const { settings, updateSettings } = useSite();
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState('general');
    const [localSettings, setLocalSettings] = useState(settings);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'Jobisam_30') {
            setIsAuthenticated(true);
        } else {
            alert('Incorrect Password');
        }
    };

    const handleSave = () => {
        updateSettings(localSettings);
        alert('Settings saved successfully!');
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
        const newItems = [...localSettings[section][arrayKey]];
        newItems[index] = { ...newItems[index], [field]: value };
        setLocalSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [arrayKey]: newItems
            }
        }));
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
                    <button onClick={() => navigate('/')} className="w-full mt-6 text-gray-600 text-xs uppercase tracking-widest hover:text-white transition-colors flex items-center justify-center gap-2">
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
        { id: 'expertise', label: 'Expertise', icon: Briefcase },
        { id: 'approach', label: 'Approach', icon: Zap },
        { id: 'services', label: 'Services', icon: Heart },
        { id: 'projects', label: 'Projects', icon: Briefcase },
        { id: 'whyChooseUs', label: 'Why Choose Us', icon: Heart },
        { id: 'contact', label: 'Contact', icon: Mail },
        { id: 'footer', label: 'Footer', icon: Info }
    ];

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-outfit">
            <nav className="border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-white text-black rounded-lg">
                            <Unlock size={18} />
                        </div>
                        <h2 className="text-lg font-bold tracking-widest uppercase">CMS Dashboard</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 bg-white text-black text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded-full hover:bg-gray-200 transition-all"
                        >
                            <Save size={14} /> Save Changes
                        </button>
                        <button onClick={() => navigate('/')} className="text-xs font-bold uppercase tracking-widest px-6 py-2.5 border border-white/10 rounded-full hover:bg-white hover:text-black transition-all">
                            Live Site
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
                                className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-black' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </aside>

                    {/* Editor Content */}
                    <div className="flex-1 space-y-8">
                        <div className="bg-neutral-900 border border-white/5 rounded-3xl p-8 shadow-xl">

                            {activeTab === 'general' && (
                                <div className="space-y-12">
                                    <header>
                                        <h3 className="text-2xl font-bold uppercase tracking-tight mb-2">Global Settings</h3>
                                        <p className="text-gray-500 text-sm">Manage high-level feature visibility across the site.</p>
                                    </header>
                                    <div className="flex items-center justify-between p-6 bg-black/40 rounded-2xl border border-white/5">
                                        <div>
                                            <h4 className="font-bold uppercase mb-1">Projects Section</h4>
                                            <p className="text-xs text-gray-500 italic">Toggle "Our Work" section and navigation links.</p>
                                        </div>
                                        <button
                                            onClick={() => setLocalSettings(prev => ({ ...prev, showProjects: !prev.showProjects }))}
                                            className={`relative w-20 h-10 rounded-full transition-all flex items-center px-1 ${localSettings.showProjects ? 'bg-white' : 'bg-white/5 border border-white/10'}`}
                                        >
                                            <div className={`w-8 h-8 rounded-full transition-all flex items-center justify-center ${localSettings.showProjects ? 'bg-black translate-x-10' : 'bg-gray-800'}`}>
                                                {localSettings.showProjects ? <Eye size={14} className="text-white" /> : <EyeOff size={14} className="text-gray-400" />}
                                            </div>
                                        </button>
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
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Big Title (HTML Allowed)</label>
                                            <input
                                                className="w-full bg-black border border-white/5 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-white/20 transition-all"
                                                value={localSettings.hero.title}
                                                onChange={(e) => updateField('hero', 'title', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Tagline / Subtitle</label>
                                            <textarea
                                                rows={3}
                                                className="w-full bg-black border border-white/5 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-white/20 transition-all resize-none"
                                                value={localSettings.hero.tagline}
                                                onChange={(e) => updateField('hero', 'tagline', e.target.value)}
                                            />
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
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Section Title</label>
                                            <input
                                                className="w-full bg-black border border-white/5 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-white/20 transition-all"
                                                value={localSettings.about.title}
                                                onChange={(e) => updateField('about', 'title', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Narrative Description</label>
                                            <textarea
                                                rows={6}
                                                className="w-full bg-black border border-white/5 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-white/20 transition-all resize-none leading-relaxed"
                                                value={localSettings.about.description}
                                                onChange={(e) => updateField('about', 'description', e.target.value)}
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
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Header</label>
                                                <input className="w-full bg-black border border-white/5 rounded-xl px-4 py-4 text-white" value={localSettings.expertise.title} onChange={(e) => updateField('expertise', 'title', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Caption</label>
                                                <input className="w-full bg-black border border-white/5 rounded-xl px-4 py-4 text-white" value={localSettings.expertise.caption} onChange={(e) => updateField('expertise', 'caption', e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Expertise Bullets</label>
                                            {localSettings.expertise.items.map((item, idx) => (
                                                <div key={idx} className="p-6 bg-black/40 border border-white/5 rounded-2xl flex gap-4">
                                                    <div className="flex-1 space-y-4">
                                                        <textarea
                                                            rows={2}
                                                            className="w-full bg-black/50 border border-white/5 rounded-lg px-4 py-2 text-sm text-gray-300"
                                                            value={item.desc}
                                                            onChange={(e) => updateListItem('expertise', 'items', idx, 'desc', e.target.value)}
                                                        />
                                                        <div className="flex items-center gap-4">
                                                            <span className="text-[10px] text-gray-600 uppercase font-bold">Icon:</span>
                                                            <input className="bg-transparent border-b border-white/10 text-xs py-1" value={item.icon} onChange={(e) => updateListItem('expertise', 'items', idx, 'icon', e.target.value)} />
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
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Section Title</label>
                                                <input className="w-full bg-black border border-white/5 rounded-xl px-4 py-4 text-white" value={localSettings.approach.title} onChange={(e) => updateField('approach', 'title', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Sub-caption</label>
                                                <input className="w-full bg-black border border-white/5 rounded-xl px-4 py-4 text-white" value={localSettings.approach.description} onChange={(e) => updateField('approach', 'description', e.target.value)} />
                                            </div>
                                        </div>
                                        {localSettings.approach.steps.map((step, idx) => (
                                            <div key={idx} className="p-6 bg-black/40 border border-white/5 rounded-2xl space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <span className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold text-xs">{step.no}</span>
                                                    <input className="flex-1 bg-transparent text-xl font-bold border-b border-white/10" value={step.title} onChange={(e) => updateListItem('approach', 'steps', idx, 'title', e.target.value)} />
                                                </div>
                                                <textarea className="w-full bg-black/50 border border-white/5 rounded-lg px-4 py-3 text-sm text-gray-400" rows={3} value={step.desc} onChange={(e) => updateListItem('approach', 'steps', idx, 'desc', e.target.value)} />
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
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Title</label>
                                                <input className="w-full bg-black border border-white/5 rounded-xl px-4 py-4 text-white" value={localSettings.services.title} onChange={(e) => updateField('services', 'title', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Caption</label>
                                                <input className="w-full bg-black border border-white/5 rounded-xl px-4 py-4 text-white" value={localSettings.services.caption} onChange={(e) => updateField('services', 'caption', e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {localSettings.services.items.map((item, idx) => (
                                                <div key={idx} className="p-6 bg-black/40 border border-white/5 rounded-2xl space-y-4">
                                                    <input className="w-full bg-transparent text-lg font-bold border-b border-white/10" value={item.title} onChange={(e) => updateListItem('services', 'items', idx, 'title', e.target.value)} />
                                                    <input className="w-full bg-transparent text-xs text-gray-400 uppercase tracking-widest" value={item.subtitle} onChange={(e) => updateListItem('services', 'items', idx, 'subtitle', e.target.value)} />
                                                    <textarea className="w-full bg-black/50 border border-white/5 rounded-lg px-4 py-3 text-sm text-gray-500" rows={3} value={item.desc} onChange={(e) => updateListItem('services', 'items', idx, 'desc', e.target.value)} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'projects' && (
                                <div className="space-y-8">
                                    <header>
                                        <h3 className="text-2xl font-bold uppercase tracking-tight mb-2">Projects Section</h3>
                                        <p className="text-gray-500 text-sm">Update the header and "View All" button text.</p>
                                    </header>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Section Title</label>
                                            <input className="w-full bg-black border border-white/5 rounded-xl px-4 py-4 text-white" value={localSettings.projects.title} onChange={(e) => updateField('projects', 'title', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Link Text (e.g. View All Projects)</label>
                                            <input className="w-full bg-black border border-white/5 rounded-xl px-4 py-4 text-white" value={localSettings.projects.description} onChange={(e) => updateField('projects', 'description', e.target.value)} />
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
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Section Title</label>
                                                <input className="w-full bg-black border border-white/5 rounded-xl px-4 py-4 text-white" value={localSettings.whyChooseUs.title} onChange={(e) => updateField('whyChooseUs', 'title', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Subtitle</label>
                                                <input className="w-full bg-black border border-white/5 rounded-xl px-4 py-4 text-white" value={localSettings.whyChooseUs.description} onChange={(e) => updateField('whyChooseUs', 'description', e.target.value)} />
                                            </div>
                                        </div>
                                        {localSettings.whyChooseUs.reasons.map((item, idx) => (
                                            <div key={idx} className="p-6 bg-black/40 border border-white/5 rounded-2xl space-y-4">
                                                <input className="w-full bg-transparent text-xl font-bold border-b border-white/10" value={item.title} onChange={(e) => updateListItem('whyChooseUs', 'reasons', idx, 'title', e.target.value)} />
                                                <textarea className="w-full bg-black/50 border border-white/5 rounded-lg px-4 py-3 text-sm text-gray-400" rows={3} value={item.desc} onChange={(e) => updateListItem('whyChooseUs', 'reasons', idx, 'desc', e.target.value)} />
                                                <div className="flex items-center gap-4">
                                                    <span className="text-[10px] text-gray-600 uppercase font-bold">Icon:</span>
                                                    <input className="bg-transparent border-b border-white/10 text-xs py-1" value={item.icon} onChange={(e) => updateListItem('whyChooseUs', 'reasons', idx, 'icon', e.target.value)} />
                                                </div>
                                            </div>
                                        ))}
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
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Heading</label>
                                            <input className="w-full bg-black border border-white/5 rounded-xl px-4 py-4 text-white" value={localSettings.contact.title} onChange={(e) => updateField('contact', 'title', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Brief Text</label>
                                            <textarea className="w-full bg-black border border-white/5 rounded-xl px-4 py-4 text-white rows={3}" value={localSettings.contact.description} onChange={(e) => updateField('contact', 'description', e.target.value)} />
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
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Brand Tagline</label>
                                            <textarea className="w-full bg-black border border-white/5 rounded-xl px-4 py-4 text-white rows={2}" value={localSettings.footer.tagline} onChange={(e) => updateField('footer', 'tagline', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Address / Location</label>
                                            <input className="w-full bg-black border border-white/5 rounded-xl px-4 py-4 text-white" value={localSettings.footer.address} onChange={(e) => updateField('footer', 'address', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Operating / Call Timings</label>
                                            <input className="w-full bg-black border border-white/5 rounded-xl px-4 py-4 text-white" value={localSettings.footer.timings} onChange={(e) => updateField('footer', 'timings', e.target.value)} />
                                        </div>
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
