/**
 * SMS Service for Automated Notifications
 * Handles Fast2SMS integration using a CORS proxy for browser-side requests.
 */

const FAST2SMS_API_KEY = "7ogH80WcIj9NDGazYF5dLnpkm3xPil6MsqCKfeSv1Jrh2ZREAw3omE5VrqZxp2MBkAUD9f0QLH6hsgyz";

/**
 * Sends an SMS to a specific number via Fast2SMS.
 * Uses a CORS-safe proxy since Fast2SMS blocks direct browser requests.
 * @param {string} phoneNumber - The recipient's phone number
 * @param {string} message - The SMS message body
 */
async function sendAutomatedSMS(phoneNumber, message) {
    if (!phoneNumber || !message) {
        console.warn("[SMS Service] Missing phone or message.");
        return;
    }

    // Normalize phone number (must be 10 digits)
    const normalizedPhone = phoneNumber.replace(/\D/g, "").slice(-10);
    if (normalizedPhone.length !== 10) {
        console.warn(`[SMS Service] Invalid phone number: ${phoneNumber}`);
        return;
    }

    // The Fast2SMS API endpoint
    const fast2smsUrl = `https://www.fast2sms.com/dev/bulkV2?authorization=${FAST2SMS_API_KEY}&route=q&message=${encodeURIComponent(message)}&flash=0&numbers=${normalizedPhone}`;

    // Use allorigins.win as a CORS proxy to relay the request server-side
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(fast2smsUrl)}`;

    try {
        console.log(`[SMS Service] Dispatching SMS to ${normalizedPhone}...`);

        const response = await fetch(proxyUrl);
        const data = await response.json();

        // allorigins returns the API response inside data.contents (as a string)
        const result = JSON.parse(data.contents || "{}");

        if (result.return === true) {
            console.log(`[SMS Service] ✅ SMS delivered to ${normalizedPhone}. Request ID: ${result.request_id}`);
        } else {
            console.error(`[SMS Service] ❌ Fast2SMS rejected: `, result);
        }
    } catch (error) {
        console.error(`[SMS Service] Failed to send SMS to ${normalizedPhone}:`, error.message);
    }
}

// Export for use across the site
window.smsService = {
    send: sendAutomatedSMS
};
