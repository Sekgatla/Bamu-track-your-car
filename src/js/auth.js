// =============================================
// BAMU CUSTOMER — AUTH GUARD
// Import this on every page except index.html
// =============================================
import { getSession } from './storage.js';

const session = getSession();

if (!session || !session.customerId) {
  window.location.href = './index.html';
} else {
  // Inject user name into sidebar greeting
  document.addEventListener('DOMContentLoaded', () => {
    const greetEl = document.getElementById('sidebar-user-name');
    if (greetEl) greetEl.textContent = session.name || 'Customer';

    // Inject unread alert count badge
    const badgeEl = document.getElementById('alerts-nav-badge');
    if (badgeEl) {
      try {
        const alerts = JSON.parse(localStorage.getItem('bamu_alerts') || '[]');
        const unread = alerts.filter(a => a.customerId === session.customerId && !a.read).length;
        if (unread > 0) {
          badgeEl.textContent = unread;
          badgeEl.style.display = 'inline-flex';
        } else {
          badgeEl.style.display = 'none';
        }
      } catch {}
    }
  });
}

export { session };
