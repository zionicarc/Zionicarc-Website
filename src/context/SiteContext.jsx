import React, { createContext, useContext, useState, useEffect } from 'react';

const SiteContext = createContext();

export const SiteProvider = ({ children }) => {
    // Load initial settings from localStorage or defaults
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('siteSettings');
        return saved ? JSON.parse(saved) : {
            showProjects: true,
            siteTitle: "Z'IONIC ARC",
            // Add more dynamic content fields here
        };
    });

    // Persist to localStorage whenever settings change
    useEffect(() => {
        localStorage.setItem('siteSettings', JSON.stringify(settings));
    }, [settings]);

    const updateSettings = (newSettings) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    return (
        <SiteContext.Provider value={{ settings, updateSettings }}>
            {children}
        </SiteContext.Provider>
    );
};

export const useSite = () => useContext(SiteContext);
