import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getFirestore, collection, addDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
import { firebaseConfig } from "/assets/core/firebase-config.js";

// Initialize Firebase for analytics
// We use a specific app name to avoid conflicting with the main app if it's already initialized
const analyticsApp = initializeApp(firebaseConfig, "Analytics_App");
const db = getFirestore(analyticsApp);

async function logVisitor() {
    try {
        // 1. Fetch IP Address
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const ipAddress = ipData.ip || "Unknown IP";

        // 2. Gather Device Info
        const userAgent = navigator.userAgent;
        let deviceName = "Unknown Device";
        
        if (/windows phone/i.test(userAgent)) { deviceName = "Windows Phone"; }
        else if (/android/i.test(userAgent)) { deviceName = "Android"; }
        else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) { deviceName = "iOS"; }
        else if (/Macintosh/.test(userAgent)) { deviceName = "Mac OS"; }
        else if (/Windows/.test(userAgent)) { deviceName = "Windows PC"; }
        else if (/Linux/.test(userAgent)) { deviceName = "Linux"; }

        // 3. Get Current Page
        const pageVisited = window.location.pathname.split('/').pop() || 'index.html';

        // 4. Save to Firestore
        const docRef = await addDoc(collection(db, "visitor_logs"), {
            ip: ipAddress,
            device: deviceName,
            userAgent: userAgent,
            page: pageVisited,
            timestamp: serverTimestamp()
        });

        // 5. Attempt High-Precision Geolocation
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    // Update the log with real coordinates if user permits
                    await updateDoc(docRef, {
                        precision_lat: latitude,
                        precision_lon: longitude,
                        precision_source: 'GPS_UPLINK'
                    });
                } catch (updateErr) {
                    // Fail silently
                }
            }, null, { enableHighAccuracy: true, timeout: 5000 });
        }
        
    } catch (error) {
        // Silently fail - tracking shouldn't break the user experience
        console.warn("Analytics tracking failed:", error.message);
    }
}

// Execute the tracking function once the DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', logVisitor);
} else {
    logVisitor();
}
