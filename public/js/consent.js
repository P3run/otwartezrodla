function hideBanner() {
    document.getElementById('cookie-consent-banner').style.display = 'none';
}

if (localStorage.getItem('consentMode') === null) {

    document.getElementById('accept').addEventListener('click', function() {
        setConsent({
            necessary: false,
            analytics: true,
            preferences: false,
            marketing: false,
            security: false
        });
        hideBanner();
    });
    document.getElementById('reject').addEventListener('click', function() {
        setConsent({
            necessary: false,
            analytics: false,
            preferences: false,
            marketing: false,
            security: false
        });
        hideBanner();
    });
    document.getElementById('cookie-consent-banner').style.display = 'block';
} else {
  hideBanner();
}

function setConsent(consent) {
    const consentMode = {
        'functionality_storage': consent.necessary ? 'granted' : 'denied',
        'security_storage': consent.security ? 'granted' : 'denied',
        'ad_storage': consent.marketing ? 'granted' : 'denied',
        'ad_user_data': consent.marketing ? 'granted' : 'denied',
        'ad_personalization': consent.marketing ? 'granted' : 'denied',
        'analytics_storage': consent.analytics ? 'granted' : 'denied',
        'personalization_storage': consent.preferences ? 'granted' : 'denied',
    };
    gtag('consent', 'update', consentMode);
    localStorage.setItem('consentMode', JSON.stringify(consentMode));
}