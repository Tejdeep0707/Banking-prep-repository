/**
 * Sanitizes a string for safe rendering in HTML templates,
 * preventing cross-site scripting (XSS) and HTML injection attacks.
 * @param {string} str
 * @returns {string}
 */
export function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    const val = String(str);
    return val.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
}
