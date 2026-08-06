// =============================================
// BAMU CUSTOMER — STORAGE MODULE
// All localStorage CRUD operations
// =============================================

export function generateId(prefix = 'id') {
  return prefix + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
}

// ---- CUSTOMERS ----
export function getCustomers() {
  try { return JSON.parse(localStorage.getItem('bamu_customers') || '[]'); }
  catch { return []; }
}

export function findCustomerByEmail(email) {
  return getCustomers().find(c => c.email.toLowerCase() === email.toLowerCase()) || null;
}

export function findCustomerById(id) {
  return getCustomers().find(c => c.id === id) || null;
}

// ---- VEHICLES ----
export function getVehicles() {
  try { return JSON.parse(localStorage.getItem('bamu_vehicles') || '[]'); }
  catch { return []; }
}

export function getVehicleById(id) {
  return getVehicles().find(v => v.id === id) || null;
}

export function getVehicleByCustomerId(customerId) {
  return getVehicles().find(v => v.customerId === customerId) || null;
}

// ---- TRACKERS ----
export function getTrackers() {
  try { return JSON.parse(localStorage.getItem('bamu_trackers') || '[]'); }
  catch { return []; }
}

export function getTrackerById(id) {
  return getTrackers().find(t => t.id === id) || null;
}

// ---- ALERTS ----
export function getAlerts() {
  try { return JSON.parse(localStorage.getItem('bamu_alerts') || '[]'); }
  catch { return []; }
}

export function getAlertsByVehicle(vehicleId) {
  return getAlerts().filter(a => a.vehicleId === vehicleId);
}

export function getAlertsByCustomer(customerId) {
  return getAlerts().filter(a => a.customerId === customerId);
}

export function markAlertReadCustomer(alertId) {
  const alerts = getAlerts();
  const idx = alerts.findIndex(a => a.id === alertId);
  if (idx !== -1) {
    alerts[idx].read = true;
    localStorage.setItem('bamu_alerts', JSON.stringify(alerts));
  }
}

// ---- TRIPS ----
export function getTrips() {
  try { return JSON.parse(localStorage.getItem('bamu_trips') || '[]'); }
  catch { return []; }
}

export function getTripsByVehicle(vehicleId) {
  return getTrips().filter(t => t.vehicleId === vehicleId);
}

export function getTripsByCustomer(customerId) {
  return getTrips().filter(t => t.customerId === customerId);
}

// ---- SESSION ----
export function getSession() {
  try { return JSON.parse(localStorage.getItem('bamu_session') || 'null'); }
  catch { return null; }
}

export function setSession(sessionObj) {
  localStorage.setItem('bamu_session', JSON.stringify(sessionObj));
}

export function clearSession() {
  localStorage.removeItem('bamu_session');
}

// =============================================
// SEED DATA — initialise if not present
// =============================================
(function seedData() {
  if (localStorage.getItem('bamu_customers')) return; // already seeded

  const now = new Date();
  const iso = (d) => d.toISOString();
  const ago = (mins) => new Date(now.getTime() - mins * 60 * 1000).toISOString();

  const customers = [
    { id: 'c1', name: 'Thabo Nkosi', email: 'thabo@bamu.co.za', password: 'pass1234', phone: '+27 71 234 5678', vehicleId: 'v1', createdAt: '2025-01-15T08:00:00Z' },
    { id: 'c2', name: 'Lerato Dlamini', email: 'lerato@bamu.co.za', password: 'pass1234', phone: '+27 82 345 6789', vehicleId: 'v2', createdAt: '2025-02-10T09:00:00Z' },
  ];

  const vehicles = [
    { id: 'v1', customerId: 'c1', make: 'Toyota', model: 'Fortuner', year: 2022, plate: 'GP 123-456', color: 'Pearl White', trackerId: 't1', lat: -25.9344, lng: 28.0147, speed: 0, battery: 87, status: 'parked', lastSeen: iso(now), odometer: 45280 },
    { id: 'v2', customerId: 'c2', make: 'Ford', model: 'Ranger', year: 2021, plate: 'JHB 789-012', color: 'Silver', trackerId: 't2', lat: -26.1053, lng: 28.1053, speed: 72, battery: 64, status: 'moving', lastSeen: iso(now), odometer: 62150 },
    { id: 'v3', customerId: null, make: 'VW', model: 'Polo', year: 2023, plate: 'NW 456-789', color: 'Blue', trackerId: null, lat: -25.7463, lng: 28.1883, speed: 0, battery: 0, status: 'offline', lastSeen: null, odometer: 12000 },
  ];

  const trackers = [
    { id: 't1', serialNumber: 'VO-2024-A001', brand: 'Vo', vehicleId: 'v1', status: 'active', battery: 87, lastPing: iso(now), canCutEngine: true, engineCutStatus: 'running' },
    { id: 't2', serialNumber: 'VO-2024-A002', brand: 'Vo', vehicleId: 'v2', status: 'active', battery: 64, lastPing: iso(now), canCutEngine: false, engineCutStatus: 'running' },
    { id: 't3', serialNumber: 'VO-2024-A003', brand: 'Vo', vehicleId: null, status: 'unassigned', battery: 100, lastPing: null, canCutEngine: false, engineCutStatus: 'running' },
    { id: 't4', serialNumber: 'VO-2024-A004', brand: 'Vo', vehicleId: null, status: 'unassigned', battery: 100, lastPing: null, canCutEngine: false, engineCutStatus: 'running' },
  ];

  const alerts = [
    { id: 'a1', vehicleId: 'v1', customerId: 'c1', type: 'hijack-zone', message: 'Vehicle entered high-risk hijacking zone near Diepsloot', lat: -25.9344, lng: 28.0147, timestamp: ago(30), read: false },
    { id: 'a2', vehicleId: 'v2', customerId: 'c2', type: 'speeding', message: 'Speed alert: 72km/h in 60km/h zone', lat: -26.1053, lng: 28.1053, timestamp: ago(90), read: false },
    { id: 'a3', vehicleId: 'v2', customerId: 'c2', type: 'stolen-zone', message: 'Vehicle entered stolen vehicle recovery zone — East Rand', lat: -26.2305, lng: 28.2205, timestamp: ago(1440), read: true },
  ];

  const trips = [
    { id: 'tr1', vehicleId: 'v1', customerId: 'c1', startTime: ago(1440), endTime: ago(1320), startLat: -25.7463, startLng: 28.1883, endLat: -25.9344, endLng: 28.0147, distance: 34.2, maxSpeed: 120, avgSpeed: 78 },
    { id: 'tr2', vehicleId: 'v1', customerId: 'c1', startTime: ago(2880), endTime: ago(2736), startLat: -25.9344, startLng: 28.0147, endLat: -26.2041, endLng: 28.0473, distance: 28.7, maxSpeed: 110, avgSpeed: 65 },
    { id: 'tr3', vehicleId: 'v2', customerId: 'c2', startTime: ago(1440), endTime: ago(1380), startLat: -26.1053, startLng: 28.1053, endLat: -26.2672, endLng: 27.8584, distance: 47.5, maxSpeed: 130, avgSpeed: 85 },
  ];

  localStorage.setItem('bamu_customers', JSON.stringify(customers));
  localStorage.setItem('bamu_vehicles', JSON.stringify(vehicles));
  localStorage.setItem('bamu_trackers', JSON.stringify(trackers));
  localStorage.setItem('bamu_alerts', JSON.stringify(alerts));
  localStorage.setItem('bamu_trips', JSON.stringify(trips));
})();
