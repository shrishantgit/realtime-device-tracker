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
            enableHighAccuracy: true,
            timeout: 5000,            
            maximumAge: 0,
        }
    );
}

// Initialize the map, default centered at 0, 0 with zoom 19
const map = L.map("map").setView([0, 0], 19);

// Setup map tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const markers = {};

// Handle incoming locations
socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude], 19);

    if (markers[id]) {
        // If marker already exists, just update position
        markers[id].setLatLng([latitude, longitude]);
    } else {
        // Otherwise, create a new marker and add it
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

// Handle disconnected users
socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});  