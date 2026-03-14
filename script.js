// Data: Stores in the mall
const stores = [
    { id: 's1', name: 'Zara', category: 'fashion', x: 100, y: 100, w: 150, h: 100, unit: '101', color: '#ffd1dc' },
    { id: 's2', name: 'H&M', category: 'fashion', x: 100, y: 200, w: 150, h: 150, unit: '102', color: '#ffd1dc' },
    { id: 's3', name: 'Apple Store', category: 'electronics', x: 750, y: 100, w: 150, h: 150, unit: '103', color: '#d0e1f9' },
    { id: 's4', name: 'Samsung', category: 'electronics', x: 750, y: 250, w: 150, h: 100, unit: '104', color: '#d0e1f9' },
    { id: 's5', name: 'Food Court', category: 'food', x: 350, y: 100, w: 300, h: 200, unit: 'FC1', color: '#ffdfba' },
    { id: 's6', name: 'Starbucks', category: 'food', x: 250, y: 400, w: 100, h: 100, unit: 'K1', color: '#ffdfba' },
    { id: 's7', name: 'Restrooms', category: 'services', x: 100, y: 600, w: 100, h: 100, unit: 'R1', color: '#e0e0e0' },
    { id: 's8', name: 'Information', category: 'services', x: 450, y: 400, w: 100, h: 50, unit: 'I1', color: '#e0e0e0' },
    { id: 's9', name: 'Nike', category: 'fashion', x: 750, y: 500, w: 150, h: 200, unit: '105', color: '#ffd1dc' },
    { id: 's10', name: 'GameStop', category: 'electronics', x: 550, y: 600, w: 150, h: 100, unit: '106', color: '#d0e1f9' },
    { id: 's11', name: 'Burger King', category: 'food', x: 250, y: 600, w: 150, h: 100, unit: 'FC2', color: '#ffdfba' }
];

// Graph for routing (simplified)
const nodes = {
    'kiosk': { x: 500, y: 400 },
    'n1': { x: 300, y: 350 },
    'n2': { x: 700, y: 350 },
    'n3': { x: 300, y: 550 },
    'n4': { x: 700, y: 550 },
    's1': { x: 250, y: 150 },
    's2': { x: 250, y: 275 },
    's3': { x: 750, y: 175 },
    's4': { x: 750, y: 300 },
    's5': { x: 500, y: 300 },
    's6': { x: 300, y: 450 },
    's7': { x: 200, y: 650 },
    's8': { x: 500, y: 450 },
    's9': { x: 750, y: 600 },
    's10': { x: 625, y: 600 },
    's11': { x: 325, y: 600 }
};

// State
let currentCategory = 'all';
let searchQuery = '';
let selectedStoreId = null;
let zoomLevel = 1;
let panX = 0;
let panY = 0;
let isDragging = false;
let startX, startY;

// DOM Elements
const directoryList = document.getElementById('directoryList');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearch');
const categoryBtns = document.querySelectorAll('.category-btn');
const storesGroup = document.getElementById('storesGroup');
const storeInfoPanel = document.getElementById('storeInfoPanel');
const closePanelBtn = document.getElementById('closePanel');
const navigateBtn = document.getElementById('navigateBtn');
const routePath = document.getElementById('routePath');
const destPin = document.getElementById('destPin');
const mapWrapper = document.getElementById('mapWrapper');
const mallMap = document.getElementById('mallMap');
const idleOverlay = document.getElementById('idleOverlay');

// Initialize
function init() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    renderMapStores();
    renderDirectory();
    setupEventListeners();
    setupIdleTimer();
}

function updateDateTime() {
    const now = new Date();
    document.getElementById('datetime').textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Icons mapping
const categoryIcons = {
    'fashion': 'fa-tshirt',
    'food': 'fa-utensils',
    'electronics': 'fa-laptop',
    'services': 'fa-concierge-bell'
};

function renderDirectory() {
    directoryList.innerHTML = '';

    const filteredStores = stores.filter(store => {
        const matchesCategory = currentCategory === 'all' || store.category === currentCategory;
        const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (filteredStores.length === 0) {
        directoryList.innerHTML = '<p style="text-align:center; padding: 2rem; color: var(--gray-600);">No locations found.</p>';
        return;
    }

    filteredStores.sort((a, b) => a.name.localeCompare(b.name)).forEach(store => {
        const el = document.createElement('div');
        el.className = `store-item ${selectedStoreId === store.id ? 'selected' : ''}`;
        el.dataset.id = store.id;

        const iconClass = categoryIcons[store.category] || 'fa-store';

        el.innerHTML = `
            <div class="store-icon-bg">
                <i class="fas ${iconClass}"></i>
            </div>
            <div class="store-info">
                <h3>${store.name}</h3>
                <p>Level 1 • Unit ${store.unit}</p>
            </div>
        `;

        el.addEventListener('click', () => selectStore(store.id));
        directoryList.appendChild(el);
    });
}

function renderMapStores() {
    storesGroup.innerHTML = '';

    stores.forEach(store => {
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");

        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", store.x);
        rect.setAttribute("y", store.y);
        rect.setAttribute("width", store.w);
        rect.setAttribute("height", store.h);
        rect.setAttribute("fill", store.color);
        rect.setAttribute("stroke", "#ffffff");
        rect.setAttribute("stroke-width", "2");
        rect.setAttribute("rx", "4");
        rect.setAttribute("class", "store-rect");
        rect.setAttribute("id", `map-store-${store.id}`);
        rect.addEventListener('click', () => selectStore(store.id));

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", store.x + store.w/2);
        text.setAttribute("y", store.y + store.h/2);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dominant-baseline", "middle");
        text.setAttribute("class", "store-label");
        text.textContent = store.name;

        g.appendChild(rect);
        g.appendChild(text);
        storesGroup.appendChild(g);
    });
}

function selectStore(storeId) {
    selectedStoreId = storeId;
    const store = stores.find(s => s.id === storeId);

    // Update List UI
    document.querySelectorAll('.store-item').forEach(el => {
        el.classList.toggle('selected', el.dataset.id === storeId);
    });

    // Update Map UI
    document.querySelectorAll('.store-rect').forEach(el => {
        el.classList.remove('highlighted');
    });
    const mapStore = document.getElementById(`map-store-${storeId}`);
    if (mapStore) {
        mapStore.classList.add('highlighted');

        // Center map on store if zoomed in
        if (zoomLevel > 1) {
            panX = -store.x * zoomLevel + mapWrapper.clientWidth / 2 - (store.w * zoomLevel)/2;
            panY = -store.y * zoomLevel + mapWrapper.clientHeight / 2 - (store.h * zoomLevel)/2;
            applyTransform();
        }
    }

    // Show Info Panel
    document.getElementById('panelName').textContent = store.name;
    document.getElementById('panelCategory').textContent = store.category.charAt(0).toUpperCase() + store.category.slice(1);
    document.getElementById('panelUnit').textContent = store.unit;

    const iconClass = categoryIcons[store.category] || 'fa-store';
    document.getElementById('panelIcon').innerHTML = `<i class="fas ${iconClass}"></i>`;

    storeInfoPanel.classList.remove('hidden');

    // Clear previous route
    routePath.classList.add('hidden');
    destPin.classList.add('hidden');

    resetIdleTimer();
}

function drawRoute() {
    if (!selectedStoreId) return;

    const target = nodes[selectedStoreId];
    if (!target) return;

    // Very simple straight-line "routing" for demo purposes.
    // In a real app, use A* or Dijkstra on a proper navmesh/graph.
    // Here we'll just draw a line from Kiosk to Target via nearest node.

    const start = nodes['kiosk'];

    // Find a midpoint to make it look like a corridor route
    let midX = start.x;
    let midY = target.y;

    const path = `M ${start.x} ${start.y} L ${start.x} ${target.y} L ${target.x} ${target.y}`;

    routePath.setAttribute('d', path);
    routePath.classList.remove('hidden');

    destPin.setAttribute('transform', `translate(${target.x}, ${target.y})`);
    destPin.classList.remove('hidden');

    storeInfoPanel.classList.add('hidden');
}

function setupEventListeners() {
    // Search
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        clearSearchBtn.classList.toggle('hidden', searchQuery === '');
        renderDirectory();
        resetIdleTimer();
    });

    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        clearSearchBtn.classList.add('hidden');
        renderDirectory();
    });

    // Categories
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            const target = e.currentTarget;
            target.classList.add('active');
            currentCategory = target.dataset.category;
            renderDirectory();
            resetIdleTimer();
        });
    });

    // Panel
    closePanelBtn.addEventListener('click', () => {
        storeInfoPanel.classList.add('hidden');
        selectedStoreId = null;
        document.querySelectorAll('.store-rect').forEach(el => el.classList.remove('highlighted'));
        document.querySelectorAll('.store-item').forEach(el => el.classList.remove('selected'));
        routePath.classList.add('hidden');
        destPin.classList.add('hidden');
    });

    navigateBtn.addEventListener('click', drawRoute);

    // Map Controls
    document.getElementById('zoomIn').addEventListener('click', () => {
        zoomLevel = Math.min(zoomLevel + 0.5, 3);
        applyTransform();
    });

    document.getElementById('zoomOut').addEventListener('click', () => {
        zoomLevel = Math.max(zoomLevel - 0.5, 0.5);
        applyTransform();
    });

    document.getElementById('resetView').addEventListener('click', () => {
        zoomLevel = 1;
        panX = 0;
        panY = 0;
        applyTransform();
    });

    // Map Panning (Mouse/Touch)
    mapWrapper.addEventListener('mousedown', startPan);
    mapWrapper.addEventListener('mousemove', pan);
    window.addEventListener('mouseup', endPan);

    mapWrapper.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) startPan(e.touches[0]);
    }, {passive: false});
    mapWrapper.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1) {
            e.preventDefault();
            pan(e.touches[0]);
        }
    }, {passive: false});
    window.addEventListener('touchend', endPan);

    // Kiosk interaction reset
    document.body.addEventListener('click', resetIdleTimer);
    document.body.addEventListener('touchstart', resetIdleTimer);

    idleOverlay.addEventListener('click', () => {
        idleOverlay.classList.add('hidden');
        resetIdleTimer();
    });
}

// Map Transformation
function applyTransform() {
    mallMap.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomLevel})`;
}

function startPan(e) {
    if (e.target.tagName.toLowerCase() === 'button' || e.target.closest('button') || e.target.closest('.store-info-panel')) return;
    isDragging = true;
    startX = e.clientX - panX;
    startY = e.clientY - panY;
}

function pan(e) {
    if (!isDragging) return;
    panX = e.clientX - startX;
    panY = e.clientY - startY;
    applyTransform();
}

function endPan() {
    isDragging = false;
}

// Idle Timer for Kiosk (reset to default state after inactivity)
let idleTimer;
const IDLE_TIMEOUT = 60000; // 1 minute

function setupIdleTimer() {
    resetIdleTimer();
}

function resetIdleTimer() {
    clearTimeout(idleTimer);
    idleOverlay.classList.add('hidden');
    idleTimer = setTimeout(showIdleScreen, IDLE_TIMEOUT);
}

function showIdleScreen() {
    idleOverlay.classList.remove('hidden');

    // Reset app state
    searchInput.value = '';
    searchQuery = '';
    clearSearchBtn.classList.add('hidden');
    currentCategory = 'all';
    categoryBtns.forEach(b => {
        b.classList.toggle('active', b.dataset.category === 'all');
    });

    storeInfoPanel.classList.add('hidden');
    selectedStoreId = null;
    routePath.classList.add('hidden');
    destPin.classList.add('hidden');

    zoomLevel = 1;
    panX = 0;
    panY = 0;
    applyTransform();

    renderDirectory();
    renderMapStores();
}

// Start
init();