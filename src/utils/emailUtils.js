export const handleEmailClick = (e, email = 'zionicarc@gmail.com') => {
    e.preventDefault();

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
        // On mobile, mailto is the most reliable way to trigger app selection or the default mail app.
        // Some users may prefer the Gmail app specifically, but forcing it via deep links (googlegmail://)
        // is risky if the app isn't installed.
        window.location.href = `mailto:${email}`;
    } else {
        // On desktop, force opening Gmail in a new tab to avoid system defaults like Outlook.
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`, '_blank');
    }
};

export const handlePhoneClick = (e, phone = '+919986598000') => {
    // We don't necessarily preventDefault here to allow standard behavior as fallback,
    // but explicitly setting location.href can solve some mobile webview issues.
    window.location.href = `tel:${phone}`;
};

export const handleWhatsAppClick = (e, phone = '919986598000') => {
    // Ensuring it opens in a new tab/app correctly
    const url = `https://wa.me/${phone}`;
    window.open(url, '_blank', 'noopener,noreferrer');
};
