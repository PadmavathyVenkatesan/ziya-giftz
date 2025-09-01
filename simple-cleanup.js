// Simple CSS Text Cleanup - Paste this into browser console
(function() {
    console.log('🧹 Running simple CSS text cleanup...');

    // Find all elements that might contain CSS text
    const elements = document.querySelectorAll('*');
    let removed = 0;

    elements.forEach(element => {
        const text = element.textContent || '';

        // If element has no children and contains CSS text, hide it
        if (element.children.length === 0 && (
            text.includes('background: #FF0000') ||
            text.includes('.whatsapp-icon') ||
            text.includes('background-color: #25D366') ||
            text.includes('} .whatsapp-icon {')
        )) {
            element.style.display = 'none';
            element.style.visibility = 'hidden';
            element.style.position = 'absolute';
            element.style.left = '-99999px';
            removed++;
        }
    });

    console.log(`✅ Hid ${removed} CSS text elements`);

    // Force floating buttons to be visible
    const themeBtn = document.querySelector('app-floating-theme-button');
    if (themeBtn) {
        themeBtn.style.position = 'fixed';
        themeBtn.style.bottom = '140px';
        themeBtn.style.right = '20px';
        themeBtn.style.zIndex = '99999';
        themeBtn.style.display = 'block';
        themeBtn.style.visibility = 'visible';
        themeBtn.style.opacity = '1';
    }

    const whatsappBtn = document.querySelector('.contact-floating-button');
    if (whatsappBtn) {
        whatsappBtn.style.position = 'fixed';
        whatsappBtn.style.bottom = '70px';
        whatsappBtn.style.right = '20px';
        whatsappBtn.style.zIndex = '10000';
        whatsappBtn.style.display = 'flex';
        whatsappBtn.style.visibility = 'visible';
        whatsappBtn.style.opacity = '1';
    }

    console.log('🎉 Cleanup complete!');
})();
