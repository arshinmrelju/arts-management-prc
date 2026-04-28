import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp, collection, query, orderBy, limit, onSnapshot } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { firebaseConfig } from "../core/firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
window.auth = auth;

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

// Real-time Visitor Logs
function initTerminalLogs() {
    const logWindow = document.getElementById('log-window');
    logWindow.innerHTML = '<div class="log-line">Connecting to Central Archive Feed...</div>';

    const logsQuery = query(collection(db, "visitor_logs"), orderBy("timestamp", "desc"), limit(50));

    onSnapshot(logsQuery, (snapshot) => {
        logWindow.innerHTML = ''; // Clear window to rebuild ordered list
        
        const docs = [];
        snapshot.forEach(doc => docs.push(doc.data()));
        
        // Render in reverse so newest is at the bottom (or top depending on preference)
        // Standard terminal logs usually have newest at bottom. We queried desc to get the 50 newest, so let's reverse them to print chronologically.
        docs.reverse().forEach(data => {
            const line = document.createElement('div');
            line.className = 'log-line';
            
            const timeStr = data.timestamp ? new Date(data.timestamp.toDate()).toLocaleTimeString() : "Pending";
            const ip = data.ip || "Unknown IP";
            const device = data.device || "Unknown Device";
            const page = data.page || "Unknown Page";

            line.textContent = `[${timeStr}] > ${ip} | ${device} | ${page}`;
            logWindow.appendChild(line);
        });

        logWindow.scrollTop = logWindow.scrollHeight;
    }, (error) => {
        console.error("Error fetching visitor logs:", error);
        logWindow.innerHTML = '<div class="log-line" style="color: red;">Error: Archive connection severed.</div>';
    });
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
            btn.innerHTML = '<span class="btn-text">OPEN GATE</span>';
            btn.className = 'gate-toggle-btn btn-open';
            statusMsg.textContent = "MAINTENANCE ACTIVE";
            statusMsg.style.color = "#ef4444";
            if (badge) {
                badge.textContent = "UNLOCKED";
                badge.className = "badge-active role-public"; // Using an existing role class or just reset
                badge.style.background = "rgba(239,68,68,0.15)";
                badge.style.color = "#ef4444";
                badge.style.borderColor = "rgba(239,68,68,0.3)";
            }
        } else {
            btn.innerHTML = '<span class="btn-text">LOCK GATE</span>';
            btn.className = 'gate-toggle-btn btn-locked';
            statusMsg.textContent = "SYSTEM LIVE";
            statusMsg.style.color = "#10b981";
            if (badge) {
                badge.textContent = "LOCKED";
                badge.className = "badge-active role-admin";
                badge.style.background = "rgba(16,185,129,0.15)";
                badge.style.color = "#10b981";
                badge.style.borderColor = "rgba(16,185,129,0.3)";
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
