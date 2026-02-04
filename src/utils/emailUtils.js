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
