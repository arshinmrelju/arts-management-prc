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
      // Ignore duplicate
  }

  if (appCheck) {
      const dbCheck = getFirestore(appCheck);

      async function checkMaintenanceMode() {
          const path = window.location.pathname.toLowerCase();
          if (path.includes('coreadmin') || path.includes('admin') || path.includes('stagemanager')) {
              return;
          }
          
          try {
              const docSnap = await getDoc(doc(dbCheck, "system_config", "maintenance"));
              if (docSnap.exists() && docSnap.data().active === true) {
                  const applyLock = () => {
                      // Prevent multiple injections
                      if (document.getElementById('maint-lock')) return;
                      
                      const overlay = document.createElement('div');
                      overlay.id = 'maint-lock';
                      overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #030712; display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 2147483647; color: white; font-family: "Inter", sans-serif;';
                      overlay.innerHTML = `
                          <div style="text-align: center; max-width: 600px; padding: 2rem; background: rgba(255,255,255,0.03); border-radius: 2rem; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                              <h1 style="font-size: 2.2rem; margin-bottom: 1rem; color: #f59e0b;">System Maintenance</h1>
                              <p style="font-size: 1.1rem; color: #94a3b8; line-height: 1.6;">We are currently performing scheduled maintenance to improve your experience. Please check back shortly.</p>
                          </div>
                      `;
                      
                      document.body.appendChild(overlay);
                      document.body.style.overflow = 'hidden';
                      
                      // Hide other body children
                      Array.from(document.body.children).forEach(child => {
                          if (child.id !== 'maint-lock' && child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE') {
                              child.style.display = 'none';
                          }
                      });
                  };

                  if (document.body) {
                      applyLock();
                  } else {
                      document.addEventListener('DOMContentLoaded', applyLock);
                  }
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
  console.error("Maintenance global error:", globalErr);
}
