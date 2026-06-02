// General setup
document.documentElement.classList.add('js-ready');


import './js/carousel.js';
import './js/dashboard.js';
import './js/auth.js';
import './js/modal.js';
import './js/sidebar.js';
import './js/notifications.js';
import './js/current-affairs.js';
import './js/mock-simulator.js';

// Inject WhatsApp Floating Button globally
function injectWhatsAppButton() {
    if (document.querySelector('.whatsapp-float-btn')) return;
    
    const waBtn = document.createElement('a');
    waBtn.href = "https://wa.me/918520929943?text=Hi%20QuasiBanking,%20I%20want%20details%20about%20your%20banking%20courses.";
    waBtn.target = "_blank";
    waBtn.rel = "noopener noreferrer";
    waBtn.className = "whatsapp-float-btn";
    waBtn.setAttribute('aria-label', 'Chat with QuasiBanking on WhatsApp');
    waBtn.innerHTML = `
        <i class="fab fa-whatsapp"></i>
        <span class="whatsapp-btn-text">Chat With Us</span>
    `;
    
    document.body.appendChild(waBtn);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectWhatsAppButton);
} else {
    injectWhatsAppButton();
}


