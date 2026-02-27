import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import {
    Home, Info, Eye, Briefcase, Zap, Heart, Mail, Save, Plus, Trash2, FileText,
    LogOut, ArrowLeft, Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

function AdminDashboard() {
    const { settings, updateSettings, syncLegalToFirebase, getDefaultLegalDocuments, loading } = useSite();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('general');
    const [activeLegalTab, setActiveLegalTab] = useState('privacy');
    const [localSettings, setLocalSettings] = useState(settings);
    const [isSaving, setIsSaving] = useState(false);
    const [isSyncingLegal, setIsSyncingLegal] = useState(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!loading) {
            setLocalSettings(settings);
        }
    }, [loading, settings]);

    React.useEffect(() => {
        if (!auth) {
            setUser({ email: 'local-dev@admin.com' });
            setAuthLoading(false);
            return;
        }
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!auth) {
            if (email && password) {
                setUser({ email: email });
                return;
            }
            alert('Please enter email and password');
            return;
        }
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            alert('Login Failed: ' + error.message);
        }
    };

    const handleLogout = async () => {
        if (!auth) {
            setUser(null);
            navigate('/');
            return;
        }
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
            alert('✅ Settings saved successfully!');
        } catch (error) {
            alert('❌ Error saving: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const updateField = (section, field, value) => {
        setLocalSettings(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
    };

    const updateListItem = (section, arrayKey, index, field, value) => {
        setLocalSettings(prev => {
            const newArray = [...prev[section][arrayKey]];
            newArray[index] = { ...newArray[index], [field]: value };
            return {
                ...prev,
                [section]: { ...prev[section], [arrayKey]: newArray }
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
                [section]: { ...prev[section], [arrayKey]: newArray }
            };
        });
    };

    const toggleSection = (section) => {
        setLocalSettings(prev => ({
            ...prev,
            [`show${section.charAt(0).toUpperCase() + section.slice(1)}`]: !prev[`show${section.charAt(0).toUpperCase() + section.slice(1)}`]
        }));
    };

    if (loading || authLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="text-white w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
                        <p className="text-gray-600 mt-2">Enter your credentials to continue</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@example.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <button 
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Login
                        </button>
                    </form>
                    <button 
                        onClick={() => navigate('/')}
                        className="w-full mt-4 text-gray-600 hover:text-gray-900 text-sm flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={16} /> Back to Website
                    </button>
                </div>
            </div>
        );
    }

    const navItems = [
        { id: 'general', label: 'General Settings', icon: Home },
        { id: 'hero', label: 'Hero Section', icon: Home },
        { id: 'about', label: 'About', icon: Info },
        { id: 'vision', label: 'Vision', icon: Eye },
        { id: 'expertise', label: 'Expertise', icon: Briefcase },
        { id: 'approach', label: 'Approach', icon: Zap },
        { id: 'services', label: 'Services', icon: Heart },
        { id: 'projects', label: 'Projects', icon: Briefcase },
        { id: 'gallery', label: 'Gallery', icon: Home },
        { id: 'whyChooseUs', label: 'Why Choose Us', icon: Heart },
        { id: 'contact', label: 'Contact', icon: Mail },
        { id: 'footer', label: 'Footer', icon: Info },
        { id: 'legal', label: 'Legal', icon: FileText }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="px-3 sm:px-4 py-3 sm:py-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 sm:mb-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Home className="text-white" size={18} />
                            </div>
                            <div>
                                <h1 className="text-base sm:text-xl font-bold text-gray-900">Z'IONIC ARC Admin</h1>
                                <p className="text-xs text-gray-500 hidden sm:block">Content Management System</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                                onClick={() => navigate('/')}
                                className="flex-1 sm:flex-none px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center justify-center gap-2 transition-colors"
                            >
                                <ArrowLeft size={14} /> 
                                <span className="sm:inline">Site</span>
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors shadow-md text-sm"
                            >
                                <Save size={14} />
                                {isSaving ? 'Saving...' : 'Save'}
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300"
                                title="Logout"
                            >
                                <LogOut size={16} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>

                    {/* Horizontal Navigation - Wrapping Grid */}
                    <div className="mt-2 sm:mt-4">
                        <nav className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 py-2 sm:px-3 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                                            activeTab === item.id
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                        }`}
                                    >
                                        <Icon size={16} className="flex-shrink-0" />
                                        <span className="text-center leading-tight">{item.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="p-3 sm:p-6">
                <div className="max-w-7xl mx-auto">
                        
                        {/* General Settings */}
                        {activeTab === 'general' && (
                            <div className="space-y-4 sm:space-y-6">
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">General Settings</h2>
                                    <p className="text-sm sm:text-base text-gray-600">Control which sections appear on your website</p>
                                </div>
                                
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                                    <div className="flex gap-2 sm:gap-3">
                                        <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
                                        <div className="text-xs sm:text-sm text-blue-900">
                                            <p className="font-semibold mb-1">Welcome to the Admin Panel!</p>
                                            <p>You can edit all website content from here. Toggle sections on/off below, then use the navigation to edit each section's content.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Section Visibility</h3>
                                    <div className="space-y-2 sm:space-y-3">
                                        {['about', 'vision', 'expertise', 'approach', 'services', 'projects', 'gallery', 'whyChooseUs', 'contact'].map(section => {
                                            const isVisible = localSettings[`show${section.charAt(0).toUpperCase() + section.slice(1)}`];
                                            return (
                                                <label key={section} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                                                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                                        <span className="text-sm sm:text-base font-medium text-gray-700 capitalize truncate">{section.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                        {isVisible ? (
                                                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded whitespace-nowrap">Visible</span>
                                                        ) : (
                                                            <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs font-medium rounded whitespace-nowrap">Hidden</span>
                                                        )}
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        checked={isVisible}
                                                        onChange={() => toggleSection(section)}
                                                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 flex-shrink-0"
                                                    />
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quick Stats</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                                        <div className="p-3 sm:p-4 bg-blue-50 rounded-lg">
                                            <div className="text-xl sm:text-2xl font-bold text-blue-600">{localSettings.services?.items?.length || 0}</div>
                                            <div className="text-xs sm:text-sm text-gray-600">Services</div>
                                        </div>
                                        <div className="p-3 sm:p-4 bg-green-50 rounded-lg">
                                            <div className="text-xl sm:text-2xl font-bold text-green-600">{localSettings.projects?.items?.length || 0}</div>
                                            <div className="text-xs sm:text-sm text-gray-600">Projects</div>
                                        </div>
                                        <div className="p-3 sm:p-4 bg-purple-50 rounded-lg">
                                            <div className="text-xl sm:text-2xl font-bold text-purple-600">{localSettings.expertise?.items?.length || 0}</div>
                                            <div className="text-xs sm:text-sm text-gray-600">Expertise</div>
                                        </div>
                                        <div className="p-3 sm:p-4 bg-orange-50 rounded-lg">
                                            <div className="text-xl sm:text-2xl font-bold text-orange-600">{localSettings.gallery?.sections?.length || 0}</div>
                                            <div className="text-xs sm:text-sm text-gray-600">Gallery</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Hero Section */}
                        {activeTab === 'hero' && (
                            <div className="space-y-4 sm:space-y-6">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Hero Section</h2>
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 space-y-3 sm:space-y-4">
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Title</label>
                                        <input
                                            type="text"
                                            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={localSettings.hero?.title || ''}
                                            onChange={(e) => updateField('hero', 'title', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Tagline</label>
                                        <textarea
                                            rows="3"
                                            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={localSettings.hero?.tagline || ''}
                                            onChange={(e) => updateField('hero', 'tagline', e.target.value)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                        <div>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Primary Button</label>
                                            <input
                                                type="text"
                                                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={localSettings.hero?.primaryBtn || ''}
                                                onChange={(e) => updateField('hero', 'primaryBtn', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Secondary Button</label>
                                            <input
                                                type="text"
                                                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={localSettings.hero?.secondaryBtn || ''}
                                                onChange={(e) => updateField('hero', 'secondaryBtn', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* About Section */}
                        {activeTab === 'about' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">About Section</h2>
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={localSettings.about?.title || ''}
                                            onChange={(e) => updateField('about', 'title', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                                        <textarea
                                            rows="6"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={localSettings.about?.content || ''}
                                            onChange={(e) => updateField('about', 'content', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Vision Section */}
                        {activeTab === 'vision' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Vision Section</h2>
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={localSettings.vision?.title || ''}
                                            onChange={(e) => updateField('vision', 'title', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                        <textarea
                                            rows="8"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={localSettings.vision?.description || ''}
                                            onChange={(e) => updateField('vision', 'description', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Services Section */}
                        {activeTab === 'services' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Services Section</h2>
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={localSettings.services?.title || ''}
                                            onChange={(e) => updateField('services', 'title', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
                                        <textarea
                                            rows="2"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={localSettings.services?.caption || ''}
                                            onChange={(e) => updateField('services', 'caption', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">Service Items</h3>
                                    <button
                                        onClick={() => addListItem('services', 'items', { title: 'New Service', desc: 'Description', img: '' })}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        <Plus size={18} /> Add Service
                                    </button>
                                </div>
                                <div className="max-h-[600px] overflow-y-auto pr-2 space-y-4 admin-scroll">
                                    {localSettings.services?.items?.map((service, idx) => (
                                        <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold text-gray-900">Service {idx + 1}</h3>
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm('Delete this service?')) {
                                                            removeListItem('services', 'items', idx);
                                                        }
                                                    }}
                                                    className="text-red-600 hover:text-red-700 flex items-center gap-1"
                                                >
                                                    <Trash2 size={16} /> Delete
                                                </button>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    value={service.title}
                                                    onChange={(e) => updateListItem('services', 'items', idx, 'title', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                                <textarea
                                                    rows="3"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    value={service.desc}
                                                    onChange={(e) => updateListItem('services', 'items', idx, 'desc', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    value={service.img}
                                                    onChange={(e) => updateListItem('services', 'items', idx, 'img', e.target.value)}
                                                    placeholder="https://images.unsplash.com/photo-xxx or any image URL"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">Use a direct image URL (e.g. https://images.unsplash.com/photo-...). Right‑click the image on Unsplash → Copy image address. Do not paste the photo page link (unsplash.com/photos/...).</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Projects Section */}
                        {activeTab === 'projects' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Projects Section</h2>
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={localSettings.projects?.title || ''}
                                            onChange={(e) => updateField('projects', 'title', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={localSettings.projects?.caption || ''}
                                            onChange={(e) => updateField('projects', 'caption', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">Project Items</h3>
                                    <button
                                        onClick={() => addListItem('projects', 'items', { title: 'New Project', category: 'Category', platform: 'Web', year: '2024', img: '', link: '#' })}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        <Plus size={18} /> Add Project
                                    </button>
                                </div>
                                <div className="max-h-[600px] overflow-y-auto pr-2 space-y-4 admin-scroll">
                                    {localSettings.projects?.items?.map((project, idx) => (
                                        <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold text-gray-900">Project {idx + 1}</h3>
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm('Delete this project?')) {
                                                            removeListItem('projects', 'items', idx);
                                                        }
                                                    }}
                                                    className="text-red-600 hover:text-red-700 flex items-center gap-1"
                                                >
                                                    <Trash2 size={16} /> Delete
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                                    <input
                                                        type="text"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        value={project.title}
                                                        onChange={(e) => updateListItem('projects', 'items', idx, 'title', e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                                    <input
                                                        type="text"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        value={project.category}
                                                        onChange={(e) => updateListItem('projects', 'items', idx, 'category', e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                                                    <input
                                                        type="text"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        value={project.platform}
                                                        onChange={(e) => updateListItem('projects', 'items', idx, 'platform', e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                                                    <input
                                                        type="text"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        value={project.year}
                                                        onChange={(e) => updateListItem('projects', 'items', idx, 'year', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    value={project.img}
                                                    onChange={(e) => updateListItem('projects', 'items', idx, 'img', e.target.value)}
                                                    placeholder="https://example.com/image.jpg"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Link</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    value={project.link}
                                                    onChange={(e) => updateListItem('projects', 'items', idx, 'link', e.target.value)}
                                                    placeholder="#"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Contact Section */}
                        {activeTab === 'contact' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={localSettings.contact?.title || ''}
                                            onChange={(e) => updateField('contact', 'title', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                        <textarea
                                            rows="3"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={localSettings.contact?.description || ''}
                                            onChange={(e) => updateField('contact', 'description', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={localSettings.contact?.email || ''}
                                            onChange={(e) => updateField('contact', 'email', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                        <input
                                            type="tel"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={localSettings.contact?.phone || ''}
                                            onChange={(e) => updateField('contact', 'phone', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
                                        <input
                                            type="tel"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={localSettings.contact?.whatsapp || ''}
                                            onChange={(e) => updateField('contact', 'whatsapp', e.target.value)}
                                            placeholder="919986598000"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Footer Section */}
                        {activeTab === 'footer' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Footer Settings</h2>
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={localSettings.footer?.tagline || ''}
                                            onChange={(e) => updateField('footer', 'tagline', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Quote</label>
                                        <textarea
                                            rows="3"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={localSettings.footer?.quote || ''}
                                            onChange={(e) => updateField('footer', 'quote', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Call Timings</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={localSettings.footer?.timings || ''}
                                            onChange={(e) => updateField('footer', 'timings', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={localSettings.footer?.brandName || ''}
                                            onChange={(e) => updateField('footer', 'brandName', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Copyright Text</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={localSettings.footer?.copyright || ''}
                                            onChange={(e) => updateField('footer', 'copyright', e.target.value)}
                                            placeholder="All Rights Reserved."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Developer Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={localSettings.footer?.developerName || ''}
                                            onChange={(e) => updateField('footer', 'developerName', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Developer Link (optional)</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={localSettings.footer?.developerLink || ''}
                                            onChange={(e) => updateField('footer', 'developerLink', e.target.value)}
                                            placeholder="https://developer-website.com"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Expertise Section */}
                        {activeTab === 'expertise' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Expertise Section</h2>
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={localSettings.expertise?.title || ''}
                                            onChange={(e) => updateField('expertise', 'title', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
                                        <textarea
                                            rows="2"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={localSettings.expertise?.caption || ''}
                                            onChange={(e) => updateField('expertise', 'caption', e.target.value)}
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-gray-900">Expertise Items</h3>
                                        <button
                                            onClick={() => addListItem('expertise', 'items', { desc: 'New expertise item', icon: 'Lightbulb' })}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            <Plus size={18} /> Add Item
                                        </button>
                                    </div>
                                    <div className="max-h-[600px] overflow-y-auto pr-2 space-y-4 admin-scroll">
                                    {localSettings.expertise?.items?.map((item, idx) => (
                                        <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold text-gray-900">Item {idx + 1}</h4>
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm('Delete this item?')) {
                                                            removeListItem('expertise', 'items', idx);
                                                        }
                                                    }}
                                                    className="text-red-600 hover:text-red-700 flex items-center gap-1"
                                                >
                                                    <Trash2 size={16} /> Delete
                                                </button>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                                <textarea
                                                    rows="2"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    value={item.desc}
                                                    onChange={(e) => updateListItem('expertise', 'items', idx, 'desc', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Icon Name</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    value={item.icon}
                                                    onChange={(e) => updateListItem('expertise', 'items', idx, 'icon', e.target.value)}
                                                    placeholder="Lightbulb, Settings, Users, CheckCircle"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Approach Section */}
                        {activeTab === 'approach' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Approach Section</h2>
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={localSettings.approach?.title || ''}
                                            onChange={(e) => updateField('approach', 'title', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                        <textarea
                                            rows="3"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={localSettings.approach?.description || ''}
                                            onChange={(e) => updateField('approach', 'description', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-gray-900">Approach Steps</h3>
                                        <button
                                            onClick={() => addListItem('approach', 'steps', { title: 'New Step', desc: 'Description' })}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            <Plus size={18} /> Add Step
                                        </button>
                                    </div>
                                    <div className="max-h-[600px] overflow-y-auto pr-2 space-y-4 admin-scroll">
                                    {localSettings.approach?.steps?.map((step, idx) => (
                                        <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold text-gray-900">Step {idx + 1}</h4>
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm('Delete this step?')) {
                                                            removeListItem('approach', 'steps', idx);
                                                        }
                                                    }}
                                                    className="text-red-600 hover:text-red-700 flex items-center gap-1"
                                                >
                                                    <Trash2 size={16} /> Delete
                                                </button>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    value={step.title}
                                                    onChange={(e) => updateListItem('approach', 'steps', idx, 'title', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                                <textarea
                                                    rows="3"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    value={step.desc}
                                                    onChange={(e) => updateListItem('approach', 'steps', idx, 'desc', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Why Choose Us Section */}
                        {activeTab === 'whyChooseUs' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Us Section</h2>
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={localSettings.whyChooseUs?.title || ''}
                                            onChange={(e) => updateField('whyChooseUs', 'title', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                        <textarea
                                            rows="2"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={localSettings.whyChooseUs?.description || ''}
                                            onChange={(e) => updateField('whyChooseUs', 'description', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-gray-900">Reasons</h3>
                                        <button
                                            onClick={() => addListItem('whyChooseUs', 'items', { title: 'New Reason', description: 'Description', icon: 'Award' })}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            <Plus size={18} /> Add Reason
                                        </button>
                                    </div>
                                    <div className="max-h-[600px] overflow-y-auto pr-2 space-y-4 admin-scroll">
                                    {localSettings.whyChooseUs?.items?.map((item, idx) => (
                                        <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold text-gray-900">Reason {idx + 1}</h4>
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm('Delete this reason?')) {
                                                            removeListItem('whyChooseUs', 'items', idx);
                                                        }
                                                    }}
                                                    className="text-red-600 hover:text-red-700 flex items-center gap-1"
                                                >
                                                    <Trash2 size={16} /> Delete
                                                </button>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    value={item.title}
                                                    onChange={(e) => updateListItem('whyChooseUs', 'items', idx, 'title', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                                <textarea
                                                    rows="3"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    value={item.description}
                                                    onChange={(e) => updateListItem('whyChooseUs', 'items', idx, 'description', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Icon Name</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    value={item.icon}
                                                    onChange={(e) => updateListItem('whyChooseUs', 'items', idx, 'icon', e.target.value)}
                                                    placeholder="Award, Users, Settings"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Gallery Section */}
                        {activeTab === 'gallery' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Gallery Section</h2>
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={localSettings.gallery?.title || ''}
                                            onChange={(e) => updateField('gallery', 'title', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                        <textarea
                                            rows="2"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={localSettings.gallery?.description || ''}
                                            onChange={(e) => updateField('gallery', 'description', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-gray-900">Gallery Sections</h3>
                                        <button
                                            onClick={() => addListItem('gallery', 'sections', { title: 'New Section', images: [] })}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            <Plus size={18} /> Add Section
                                        </button>
                                    </div>
                                    <div className="max-h-[600px] overflow-y-auto pr-2 space-y-4 admin-scroll">
                                    {localSettings.gallery?.sections?.map((section, idx) => (
                                        <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold text-gray-900">Section {idx + 1}</h4>
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm('Delete this section?')) {
                                                            removeListItem('gallery', 'sections', idx);
                                                        }
                                                    }}
                                                    className="text-red-600 hover:text-red-700 flex items-center gap-1"
                                                >
                                                    <Trash2 size={16} /> Delete
                                                </button>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    value={section.title}
                                                    onChange={(e) => updateListItem('gallery', 'sections', idx, 'title', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Images (one URL per line)</label>
                                                <textarea
                                                    rows="4"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                                                    value={section.images?.map(img => `${img.url}|${img.title || ''}`).join('\n') || ''}
                                                    onChange={(e) => {
                                                        const lines = e.target.value.split('\n').filter(l => l.trim());
                                                        const images = lines.map(line => {
                                                            const [url, title] = line.split('|');
                                                            return { url: url.trim(), title: title?.trim() || '' };
                                                        });
                                                        updateListItem('gallery', 'sections', idx, 'images', images);
                                                    }}
                                                    placeholder="https://example.com/image1.jpg|Image Title&#10;https://example.com/image2.jpg|Another Title"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">Format: URL|Title (one per line)</p>
                                            </div>
                                        </div>
                                    ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Legal Section */}
                        {activeTab === 'legal' && (
                            <div className="space-y-6">
                                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">Legal Documents</h2>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => {
                                                if (!getDefaultLegalDocuments) return;
                                                const defaults = getDefaultLegalDocuments();
                                                setLocalSettings(prev => ({
                                                    ...prev,
                                                    privacyPolicy: defaults.privacyPolicy,
                                                    termsOfService: defaults.termsOfService
                                                }));
                                                alert('✅ Loaded latest Privacy Policy and Terms of Service into the form. Click Save to persist.');
                                            }}
                                            disabled={!getDefaultLegalDocuments}
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <FileText size={16} />
                                            Load Latest Text
                                        </button>
                                        <button
                                            onClick={async () => {
                                                if (!syncLegalToFirebase) return;
                                                setIsSyncingLegal(true);
                                                try {
                                                    await syncLegalToFirebase();
                                                    alert('✅ Privacy Policy and Terms of Service synced to Firebase successfully!');
                                                } catch (err) {
                                                    alert('❌ Error syncing to Firebase: ' + err.message);
                                                } finally {
                                                    setIsSyncingLegal(false);
                                                }
                                            }}
                                            disabled={!syncLegalToFirebase || isSyncingLegal}
                                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Save size={16} />
                                            {isSyncingLegal ? 'Syncing...' : 'Sync Legal to Firebase'}
                                        </button>
                                    </div>
                                </div>

                                {/* Sub Navigation for Legal */}
                                <div className="flex gap-3 mb-6 border-b border-gray-200">
                                    <button
                                        onClick={() => setActiveLegalTab('privacy')}
                                        className={`px-6 py-3 font-medium text-sm transition-all ${
                                            activeLegalTab === 'privacy'
                                                ? 'border-b-2 border-blue-600 text-blue-600'
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        Privacy Policy
                                    </button>
                                    <button
                                        onClick={() => setActiveLegalTab('terms')}
                                        className={`px-6 py-3 font-medium text-sm transition-all ${
                                            activeLegalTab === 'terms'
                                                ? 'border-b-2 border-blue-600 text-blue-600'
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        Terms of Service
                                    </button>
                                </div>

                                {/* Privacy Policy Tab */}
                                {activeLegalTab === 'privacy' && (
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-900">Privacy Policy</h3>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Last Updated</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    value={localSettings.privacyPolicy?.lastUpdated || ''}
                                                    onChange={(e) => updateField('privacyPolicy', 'lastUpdated', e.target.value)}
                                                    placeholder="February 27, 2026"
                                                />
                                            </div>
                                            <div className="flex items-center justify-between pt-4">
                                                <h4 className="font-semibold text-gray-900">Privacy Policy Sections</h4>
                                                <button
                                                    onClick={() => addListItem('privacyPolicy', 'sections', { title: 'New Section', content: 'Content here...' })}
                                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                                >
                                                    <Plus size={16} /> Add Section
                                                </button>
                                            </div>
                                            <div className="max-h-[500px] overflow-y-auto pr-2 space-y-4 admin-scroll">
                                                {localSettings.privacyPolicy?.sections?.map((section, idx) => (
                                                    <div key={idx} className="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-medium text-gray-700">Section {idx + 1}</span>
                                                            <button
                                                                onClick={() => {
                                                                    if (window.confirm('Delete this section?')) {
                                                                        removeListItem('privacyPolicy', 'sections', idx);
                                                                    }
                                                                }}
                                                                className="text-red-600 hover:text-red-700"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                                                            <input
                                                                type="text"
                                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                value={section.title}
                                                                onChange={(e) => updateListItem('privacyPolicy', 'sections', idx, 'title', e.target.value)}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-600 mb-1">Content</label>
                                                            <textarea
                                                                rows="4"
                                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                value={section.content}
                                                                onChange={(e) => updateListItem('privacyPolicy', 'sections', idx, 'content', e.target.value)}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-600 mb-1">List Items (one per line, optional)</label>
                                                            <textarea
                                                                rows="3"
                                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                value={section.listItems?.join('\n') || ''}
                                                                onChange={(e) => {
                                                                    const items = e.target.value.split('\n').filter(i => i.trim());
                                                                    updateListItem('privacyPolicy', 'sections', idx, 'listItems', items.length > 0 ? items : undefined);
                                                                }}
                                                                placeholder="Item 1&#10;Item 2&#10;Item 3"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-600 mb-1">Secondary Content (optional)</label>
                                                            <textarea
                                                                rows="2"
                                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                value={section.secondaryContent || ''}
                                                                onChange={(e) => updateListItem('privacyPolicy', 'sections', idx, 'secondaryContent', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Terms of Service Tab */}
                                {activeLegalTab === 'terms' && (
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-900">Terms of Service</h3>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Last Updated</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    value={localSettings.termsOfService?.lastUpdated || ''}
                                                    onChange={(e) => updateField('termsOfService', 'lastUpdated', e.target.value)}
                                                    placeholder="February 27, 2026"
                                                />
                                            </div>
                                            <div className="flex items-center justify-between pt-4">
                                                <h4 className="font-semibold text-gray-900">Terms Sections</h4>
                                                <button
                                                    onClick={() => addListItem('termsOfService', 'sections', { title: 'New Clause', content: 'Terms content...' })}
                                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                                >
                                                    <Plus size={16} /> Add Section
                                                </button>
                                            </div>
                                            <div className="max-h-[500px] overflow-y-auto pr-2 space-y-4 admin-scroll">
                                                {localSettings.termsOfService?.sections?.map((section, idx) => (
                                                    <div key={idx} className="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-medium text-gray-700">Clause {idx + 1}</span>
                                                            <button
                                                                onClick={() => {
                                                                    if (window.confirm('Delete this clause?')) {
                                                                        removeListItem('termsOfService', 'sections', idx);
                                                                    }
                                                                }}
                                                                className="text-red-600 hover:text-red-700"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                                                            <input
                                                                type="text"
                                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                value={section.title}
                                                                onChange={(e) => updateListItem('termsOfService', 'sections', idx, 'title', e.target.value)}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-600 mb-1">Content</label>
                                                            <textarea
                                                                rows="5"
                                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                value={section.content}
                                                                onChange={(e) => updateListItem('termsOfService', 'sections', idx, 'content', e.target.value)}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-600 mb-1">List Items (one per line, optional)</label>
                                                            <textarea
                                                                rows="3"
                                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                value={section.listItems?.join('\n') || ''}
                                                                onChange={(e) => {
                                                                    const items = e.target.value.split('\n').filter(i => i.trim());
                                                                    updateListItem('termsOfService', 'sections', idx, 'listItems', items.length > 0 ? items : undefined);
                                                                }}
                                                                placeholder="Item 1&#10;Item 2&#10;Item 3"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
        </div>
    );
}

export default AdminDashboard;
