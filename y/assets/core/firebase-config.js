import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

// Shared Firebase Configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCrjARB6MTC5s_sMPHzf3a1yW1ajHTKHU4",
  authDomain: "unionartsprc.firebaseapp.com",
  databaseURL: "https://unionartsprc-default-rtdb.firebaseio.com",
  projectId: "unionartsprc",
  storageBucket: "unionartsprc.firebasestorage.app",
  messagingSenderId: "812219989202",
  appId: "1:812219989202:web:cb94548572e7dcb5cc810b",
  measurementId: "G-WR8DBND5YD"
};

// --- Maintenance Mode Check ---
try {
  let appCheck;
  try {
      appCheck = initializeApp(firebaseConfig, "MaintenanceCheckApp");
  } catch (e) {
      // Ignore if already initialized due to duplicate imports
  }

  if (appCheck) {
      const dbCheck = getFirestore(appCheck);

      async function checkMaintenanceMode() {
          const path = window.location.pathname.toLowerCase();
          // Bypass maintenance check for admin portals
          if (path.includes('coreadmin') || path.includes('admin') || path.includes('stagemanager')) {
              return;
          }
          
          try {
              const docSnap = await getDoc(doc(dbCheck, "system_config", "maintenance"));
              if (docSnap.exists() && docSnap.data().active) {
                  // Completely hijack the document and stop all subsequent execution
                  document.documentElement.innerHTML = `
                      <head>
                          <meta charset="UTF-8">
                          <meta name="viewport" content="width=device-width, initial-scale=1.0">
                          <title>System Maintenance</title>
                          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
                          <style>
                              body { background: #030712; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 100vh; margin: 0; color: white; font-family: 'Inter', sans-serif; }
                              .m-box { text-align: center; max-width: 600px; padding: 2rem; background: rgba(255,255,255,0.03); border-radius: 2rem; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
                              ul { text-align: left; background: rgba(255,255,255,0.05); padding: 1.5rem 2rem; border-radius: 1rem; list-style: none; margin-top: 2rem; }
                              li { margin-bottom: 0.8rem; color: #cbd5e1; }
                              li:last-child { margin-bottom: 0; }
                              i.fa-check-circle { color: #f59e0b; margin-right: 0.5rem; }
                          </style>
                      </head>
                      <body>
                          <div class="m-box">
                              <i class="fas fa-tools" style="font-size: 5rem; color: #f59e0b; margin-bottom: 1.5rem;"></i>
                              <h1 style="font-size: 2.2rem; margin-bottom: 1rem;">System Maintenance</h1>
                              <p style="font-size: 1.1rem; color: #94a3b8; line-height: 1.6;">We are currently performing scheduled maintenance to improve your experience. Please check back shortly.</p>
                              <ul>
                                  <li><i class="fas fa-check-circle"></i> Service optimizations</li>
                                  <li><i class="fas fa-check-circle"></i> Data integrity syncs</li>
                                  <li><i class="fas fa-check-circle"></i> Applying security patches</li>
                              </ul>
                          </div>
                      </body>
                  `;
                  // Halts network requests and parsing immediately
                  window.stop();
              }
          } catch (e) {
              console.error("Maintenance check failed:", e);
          }
      }

      if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', checkMaintenanceMode);
      } else {
          checkMaintenanceMode();
      }
  }
} catch (globalErr) {
  console.error("Maintenance check script error:", globalErr);
}
