// Emergency CSS Text Cleanup Script
// Copy and paste this into your browser console (F12) to immediately remove CSS text

(function cleanupCSSText() {
    console.log('🔧 Starting CSS text cleanup...');

    // Function to remove CSS text
    function removeCSSText() {
        let removedCount = 0;

        // Method 1: Remove text nodes containing CSS
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
                text.includes('} .whatsapp-icon {')) {
                textNodes.push(node);
            }
        }

        textNodes.forEach(node => {
            if (node.parentNode) {
                node.parentNode.removeChild(node);
                removedCount++;
            }
        });

        // Method 2: Hide elements containing CSS text
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            const text = element.textContent || '';
            const hasChildren = element.children.length > 0;

            if (!hasChildren && (
                text.trim().startsWith('background: #FF0000') ||
                text.trim().startsWith('.whatsapp-icon') ||
                text.includes('background-color: #25D366 !important')
            )) {
                element.style.display = 'none';
                element.style.visibility = 'hidden';
                element.style.position = 'absolute';
                element.style.left = '-99999px';
                removedCount++;
            }
        });

        return removedCount;
    }

    // Run cleanup
    const removed = removeCSSText();
    console.log(`✅ Removed ${removed} CSS text elements`);

    // Force theme button visibility
    const themeButton = document.querySelector('app-floating-theme-button');
    if (themeButton) {
        themeButton.style.position = 'fixed';
        themeButton.style.bottom = '140px';
        themeButton.style.right = '20px';
        themeButton.style.zIndex = '99999';
        themeButton.style.display = 'block';
        themeButton.style.visibility = 'visible';
        themeButton.style.opacity = '1';
        console.log('✅ Theme button forced visible');
    }

    console.log('🎉 CSS cleanup complete!');
})();

// Auto-run cleanup every 2 seconds for 30 seconds
let cleanupCount = 0;
const cleanupInterval = setInterval(() => {
    cleanupCount++;
    if (cleanupCount > 15) {  // Stop after 30 seconds
        clearInterval(cleanupInterval);
        console.log('🛑 Auto-cleanup stopped');
        return;
    }

    // Quick cleanup
    const textNodes = [];
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    let node;
    while (node = walker.nextNode()) {
        const text = node.textContent || '';
        if (text.includes('background: #FF0000') ||
            text.includes('.whatsapp-icon') ||
            text.includes('background-color: #25D366')) {
            textNodes.push(node);
        }
    }

    textNodes.forEach(node => {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    });

    if (textNodes.length > 0) {
        console.log(`🔧 Auto-cleanup removed ${textNodes.length} CSS text elements`);
    }
}, 2000);
