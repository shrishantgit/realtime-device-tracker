const socket = io();

// Check if browser supports Geolocation
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit('send-location', { latitude, longitude });
        },
        (error) => {
            console.error(error);
        },
        {
            enableHighAccuracy: false, // Changed to false for faster, less strict loading
            timeout: 20000,            // Increased from 5000 to 20000 (20 seconds)
            maximumAge: 0,
        }
    );
}

// Initialize the map, default centered at 0, 0 with zoom 16
const map = L.map("map").setView([0, 0], 19);

// Setup map tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const markers = {};