console.log('🚀 Starting comprehensive UI cleanup...');

// 1. Remove CSS text immediately
function removeAllCSSText() {
    console.log('🧹 Removing CSS text...');

    // Find all text nodes
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
        const text = node.textContent || '';
        if (text.includes('background: #FF0000') ||
            text.includes('.whatsapp-icon') ||
            text.includes('background-color: #25D366') ||
            text.includes('} .whatsapp-icon {') ||
            text.includes('!important; }')) {
            textNodes.push(node);
        }
    }

    let removedCount = 0;
    textNodes.forEach(node => {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
            removedCount++;
        }
    });

    console.log(`✅ Removed ${removedCount} CSS text nodes`);
    return removedCount;
}

// 2. Fix theme button styling
function fixThemeButton() {
    console.log('🎨 Fixing theme button...');

    const themeButton = document.querySelector('app-floating-theme-button .floating-theme-btn');
    if (themeButton) {
        // Apply clean circle design
        Object.assign(themeButton.style, {
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            borderRadius: '50%',
            width: '56px',
            height: '56px',
            padding: '0',
            margin: '0',
            gap: '0',
            fontSize: '0',
            outline: 'none',
            border: 'none',
            boxShadow: '0 8px 25px rgba(124, 58, 237, 0.3)',
            transition: 'all 0.3s ease'
        });

        // Hide theme text
        const themeText = themeButton.querySelector('.theme-text');
        if (themeText) {
            themeText.style.display = 'none';
        }

        // Fix theme icon
        const themeIcon = themeButton.querySelector('.theme-icon');
        if (themeIcon) {
            Object.assign(themeIcon.style, {
                fontSize: '24px',
                width: '24px',
                height: '24px',
                color: 'white',
                margin: '0',
                padding: '0'
            });
        }

        console.log('✅ Theme button fixed');
    } else {
        console.log('⚠️ Theme button not found');
    }
}

// 3. Fix WhatsApp button
function fixWhatsAppButton() {
    console.log('💬 Fixing WhatsApp button...');

    const whatsappButton = document.querySelector('.contact-floating-button button');
    if (whatsappButton) {
        // Clean design
        Object.assign(whatsappButton.style, {
            background: 'linear-gradient(135deg, #25d366 0%, #20c55a 100%)',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            border: 'none',
            outline: 'none',
            position: 'relative',
            boxShadow: '0 8px 25px rgba(37, 211, 102, 0.3)',
            transition: 'all 0.3s ease'
        });

        // Remove any pseudo-elements
        const style = document.createElement('style');
        style.textContent = `
            .contact-floating-button button::before,
            .contact-floating-button button::after {
                display: none !important;
            }
        `;
        document.head.appendChild(style);

        console.log('✅ WhatsApp button fixed');
    } else {
        console.log('⚠️ WhatsApp button not found');
    }

    // Hide WhatsApp text
    const whatsappText = document.querySelector('.contact-floating-button span');
    if (whatsappText) {
        whatsappText.style.display = 'none';
        console.log('✅ WhatsApp text hidden');
    }
}

// 4. Force visibility of floating elements
function forceFloatingVisibility() {
    console.log('👁️ Forcing floating elements visibility...');

    // Theme button container
    const themeContainer = document.querySelector('app-floating-theme-button');
    if (themeContainer) {
        Object.assign(themeContainer.style, {
            position: 'fixed',
            bottom: '140px',
            right: '20px',
            zIndex: '99999',
            visibility: 'visible',
            opacity: '1',
            display: 'block',
            pointerEvents: 'auto'
        });
    }

    // WhatsApp button
    const whatsappContainer = document.querySelector('.contact-floating-button');
    if (whatsappContainer) {
        Object.assign(whatsappContainer.style, {
            position: 'fixed',
            bottom: '70px',
            right: '20px',
            zIndex: '10000',
            visibility: 'visible',
            opacity: '1',
            display: 'flex',
            pointerEvents: 'auto'
        });
    }

    console.log('✅ Floating elements visibility forced');
}

// 5. Add hover effects
function addHoverEffects() {
    console.log('✨ Adding hover effects...');

    // Theme button hover
    const themeButton = document.querySelector('app-floating-theme-button .floating-theme-btn');
    if (themeButton) {
        themeButton.addEventListener('mouseenter', () => {
            themeButton.style.transform = 'translateY(-2px) scale(1.05)';
            themeButton.style.boxShadow = '0 12px 35px rgba(124, 58, 237, 0.4)';
            themeButton.style.background = 'linear-gradient(135deg, #8b5cf6, #a855f7)';
        });

        themeButton.addEventListener('mouseleave', () => {
            themeButton.style.transform = 'translateY(0) scale(1)';
            themeButton.style.boxShadow = '0 8px 25px rgba(124, 58, 237, 0.3)';
            themeButton.style.background = 'linear-gradient(135deg, #7c3aed, #a855f7)';
        });
    }

    // WhatsApp button hover
    const whatsappButton = document.querySelector('.contact-floating-button button');
    if (whatsappButton) {
        whatsappButton.addEventListener('mouseenter', () => {
            whatsappButton.style.transform = 'translateY(-2px) scale(1.05)';
            whatsappButton.style.boxShadow = '0 12px 35px rgba(37, 211, 102, 0.4)';
        });

        whatsappButton.addEventListener('mouseleave', () => {
            whatsappButton.style.transform = 'translateY(0) scale(1)';
            whatsappButton.style.boxShadow = '0 8px 25px rgba(37, 211, 102, 0.3)';
        });
    }

    console.log('✅ Hover effects added');
}

// Run all fixes
function runAllFixes() {
    removeAllCSSText();
    fixThemeButton();
    fixWhatsAppButton();
    forceFloatingVisibility();
    addHoverEffects();

    console.log('🎉 All fixes applied successfully!');
    console.log('🔄 Running periodic cleanup every 2 seconds...');

    // Run cleanup periodically
    let cleanupRuns = 0;
    const cleanupInterval = setInterval(() => {
        const removed = removeAllCSSText();
        cleanupRuns++;

        if (removed > 0) {
            console.log(`🔧 Periodic cleanup removed ${removed} CSS text elements`);
        }

        // Stop after 30 seconds
        if (cleanupRuns > 15) {
            clearInterval(cleanupInterval);
            console.log('🛑 Periodic cleanup stopped');
        }
    }, 2000);
}

// Execute immediately
runAllFixes();
