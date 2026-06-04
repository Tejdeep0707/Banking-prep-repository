export const EMAIL_CONFIG = {
  SERVICE_ID: "service_kmac21m",
  TEMPLATE_ID: "template_eujenbs",
  PUBLIC_KEY: "UcBnIGAfB_WFi3XUi"
};

export function loadEmailJS() {
    return new Promise((resolve) => {
        if (window.emailjs) {
            if (EMAIL_CONFIG.PUBLIC_KEY) {
                window.emailjs.init({ publicKey: EMAIL_CONFIG.PUBLIC_KEY });
            }
            resolve(window.emailjs);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
        script.async = true;
        script.onload = () => {
            if (window.emailjs && EMAIL_CONFIG.PUBLIC_KEY) {
                window.emailjs.init({ publicKey: EMAIL_CONFIG.PUBLIC_KEY });
            }
            resolve(window.emailjs);
        };
        script.onerror = () => resolve(null);
        document.body.appendChild(script);
    });
}
