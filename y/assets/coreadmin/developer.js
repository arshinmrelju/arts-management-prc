import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { firebaseConfig } from "../core/firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const ADMIN_EMAILS = [
    "collageunionprc@gmail.com",
    "artsfest@prc.ac.in"
];

onAuthStateChanged(auth, async (user) => {
    const authGuard = document.getElementById('auth-guard');
    const content = document.getElementById('developer-content');

    if (!user) {
        window.location.href = "coreadmin.html";
        return;
    }

    const userEmail = (user.email || "").toLowerCase().trim();
    let isAuthorized = ADMIN_EMAILS.some(email => email.toLowerCase().trim() === userEmail);

    if (!isAuthorized) {
        try {
            const adminDoc = await getDoc(doc(db, "admin_users", userEmail));
            if (adminDoc.exists()) {
                const role = adminDoc.data().role;
                if (role === "Main" || role === "Admin") isAuthorized = true;
            }
        } catch (err) { console.error("Auth check error:", err); }
    }

        if (isAuthorized) {
        authGuard.classList.add('hidden');
        content.classList.remove('hidden');
        fetchMaintenanceState();
        startLatencyMonitor();
        startUptimeCounter();
        initTerminalLogs();
    } else {
        authGuard.classList.remove('hidden');
        content.classList.add('hidden');
    }
});

// Uptime Counter
function startUptimeCounter() {
    const uptimeElem = document.getElementById('system-uptime');
    let seconds = 15735; // Initial mock uptime
    setInterval(() => {
        seconds++;
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        uptimeElem.textContent = `UPTIME: ${h}:${m}:${s}`;
    }, 1000);
}

// Terminal Logs simulation
function initTerminalLogs() {
    const logWindow = document.getElementById('log-window');
    const logs = [
        "Memory leak check: PASS",
        "Garbage collection executed",
        "Firestore buffer synchronized",
        "New admin session established",
        "Security audit complete: 0 vulnerabilities",
        "Cache invalidated for registrations",
        "Background worker 'mail-service' active",
        "Database shard A-1 responding",
        "Optimization complete: Index rebuilt"
    ];

    setInterval(() => {
        const line = document.createElement('div');
        line.className = 'log-line';
        const timestamp = new Date().toLocaleTimeString();
        line.textContent = `[${timestamp}] > ${logs[Math.floor(Math.random() * logs.length)]}`;
        logWindow.appendChild(line);
        logWindow.scrollTop = logWindow.scrollHeight;
        
        // Keep logs clean (max 50 lines)
        if (logWindow.children.length > 50) {
            logWindow.removeChild(logWindow.firstChild);
        }
    }, 4000);
}

// Maintenance Mode Logic
window.fetchMaintenanceState = async function () {
    const btn = document.getElementById('maintenance-mode-btn');
    const statusMsg = document.getElementById('maintenance-status-msg');
    const badge = document.querySelector('.badge-active');

    try {
        const configDoc = await getDoc(doc(db, "system_config", "maintenance"));
        const isActive = configDoc.exists() ? configDoc.data().active : false;

        if (isActive) {
            btn.innerHTML = '<div class="btn-ripple"></div><span class="btn-text">OPEN GATE</span>';
            btn.style.background = '#ef4444';
            btn.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.4)';
            statusMsg.textContent = "MAINTENANCE ACTIVE";
            statusMsg.style.color = "#ef4444";
            if (badge) {
                badge.textContent = "UNLOCKED";
                badge.style.background = "rgba(239, 68, 68, 0.1)";
                badge.style.color = "#ef4444";
            }
        } else {
            btn.innerHTML = '<div class="btn-ripple"></div><span class="btn-text">LOCK GATE</span>';
            btn.style.background = '#34d399';
            btn.style.boxShadow = '0 0 20px rgba(52, 211, 153, 0.4)';
            statusMsg.textContent = "SYSTEM LIVE";
            statusMsg.style.color = "#34d399";
            if (badge) {
                badge.textContent = "LOCKED";
                badge.style.background = "rgba(52, 211, 153, 0.1)";
                badge.style.color = "#34d399";
            }
        }
    } catch (e) {
        console.error("Error fetching maintenance state:", e);
    }
};

window.toggleMaintenanceMode = async function () {
    const btn = document.getElementById('maintenance-mode-btn');
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> SYNCING...';
    btn.disabled = true;

    try {
        const configDoc = await getDoc(doc(db, "system_config", "maintenance"));
        const currentActive = configDoc.exists() ? configDoc.data().active : false;
        const newActive = !currentActive;

        await setDoc(doc(db, "system_config", "maintenance"), {
            active: newActive,
            updatedAt: serverTimestamp(),
            updatedBy: auth.currentUser.email
        });

        await fetchMaintenanceState();
    } catch (error) {
        console.error("Toggle Error:", error);
        alert("Failed to toggle state: " + error.message);
    } finally {
        btn.disabled = false;
    }
};

// Latency Monitor
function startLatencyMonitor() {
    const latencyElem = document.getElementById('dev-latency');
    setInterval(async () => {
        const start = Date.now();
        try {
            await getDoc(doc(db, "system_config", "heartbeat")); // Small doc for latency check
            const end = Date.now();
            latencyElem.textContent = (end - start) + "ms";
        } catch (e) {
            latencyElem.textContent = "Error";
        }
    }, 5000);
}
