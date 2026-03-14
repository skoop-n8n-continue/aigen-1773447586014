/**
 * Grand Plaza Wayfinder Logic
 * High-fidelity interactive mapping and routing.
 */

// 1. Complex Data Models: Stores
const stores = [
    // Anchors (Large polygons)
    { id: 'a1', name: 'Macy\'s', category: 'anchor', type: 'poly', points: '400,150 600,150 600,350 400,350', unit: '1000', color: 'var(--anchor-color)', desc: 'Premier department store featuring fashion, beauty, and home goods.', phone: '(555) 101-0000', hours: '10 AM - 10 PM' },
    { id: 'a2', name: 'Nordstrom', category: 'anchor', type: 'poly', points: '800,150 1000,150 1000,350 800,350', unit: '2000', color: 'var(--anchor-color)', desc: 'Upscale apparel, shoes, and accessories for the whole family.', phone: '(555) 202-0000', hours: '10 AM - 9 PM' },
    { id: 'a3', name: 'Cinemark', category: 'anchor', type: 'poly', points: '800,550 1000,550 1000,750 800,750', unit: '3000', color: 'var(--anchor-color)', desc: 'Luxury stadium seating cinema with IMAX capabilities.', phone: '(555) 303-0000', hours: '11 AM - 12 AM' },
    { id: 'a4', name: 'Whole Foods', category: 'anchor', type: 'poly', points: '200,350 400,350 400,550 200,550', unit: '4000', color: 'var(--anchor-color)', desc: 'Eco-minded chain with natural & organic grocery items.', phone: '(555) 404-0000', hours: '8 AM - 10 PM' },

    // Fashion (North Wing Corridor)
    { id: 'f1', name: 'Zara', category: 'fashion', type: 'poly', points: '600,150 700,150 700,250 600,250', unit: 'N101', color: 'var(--fashion-color)', desc: 'Fast-fashion brand for men, women, and kids.', phone: '(555) 123-4567', hours: '10 AM - 9 PM' },
    { id: 'f2', name: 'H&M', category: 'fashion', type: 'poly', points: '700,150 800,150 800,250 700,250', unit: 'N102', color: 'var(--fashion-color)', desc: 'Trendy clothing at affordable prices.', phone: '(555) 123-4568', hours: '10 AM - 9 PM' },
    { id: 'f3', name: 'Sephora', category: 'fashion', type: 'poly', points: '600,250 700,250 700,350 600,350', unit: 'N103', color: 'var(--fashion-color)', desc: 'Top beauty and cosmetic products.', phone: '(555) 123-4569', hours: '10 AM - 9 PM' },
    { id: 'f4', name: 'Victoria\'s Secret', category: 'fashion', type: 'poly', points: '700,250 800,250 800,350 700,350', unit: 'N104', color: 'var(--fashion-color)', desc: 'Lingerie, sleepwear, and beauty products.', phone: '(555) 123-4570', hours: '10 AM - 9 PM' },

    // Tech & Electronics (East Wing)
    { id: 't1', name: 'Apple Store', category: 'electronics', type: 'poly', points: '800,350 900,350 900,450 800,450', unit: 'E101', color: 'var(--tech-color)', desc: 'iPhones, Macs, iPads and Genius Bar support.', phone: '(555) 999-1111', hours: '10 AM - 9 PM' },
    { id: 't2', name: 'Samsung Experience', category: 'electronics', type: 'poly', points: '900,350 1000,350 1000,450 900,450', unit: 'E102', color: 'var(--tech-color)', desc: 'Latest Galaxy devices and smart home tech.', phone: '(555) 999-2222', hours: '10 AM - 9 PM' },
    { id: 't3', name: 'Tesla Showroom', category: 'electronics', type: 'poly', points: '800,450 900,450 900,550 800,550', unit: 'E103', color: 'var(--tech-color)', desc: 'Electric vehicles and energy products.', phone: '(555) 999-3333', hours: '10 AM - 9 PM' },

    // Dining (South Wing)
    { id: 'd1', name: 'Cheesecake Factory', category: 'food', type: 'poly', points: '600,550 800,550 800,650 600,650', unit: 'S101', color: 'var(--food-color)', desc: 'Extensive menu and signature cheesecakes.', phone: '(555) 888-1111', hours: '11 AM - 11 PM' },
    { id: 'd2', name: 'Shake Shack', category: 'food', type: 'poly', points: '600,650 700,650 700,750 600,750', unit: 'S102', color: 'var(--food-color)', desc: 'Gourmet burgers, fries, and shakes.', phone: '(555) 888-2222', hours: '11 AM - 10 PM' },
    { id: 'd3', name: 'Starbucks Reserve', category: 'food', type: 'poly', points: '700,650 800,650 800,750 700,750', unit: 'S103', color: 'var(--food-color)', desc: 'Premium coffee experience and roastery.', phone: '(555) 888-3333', hours: '7 AM - 9 PM' },

    // Services & Misc (West Wing)
    { id: 's1', name: 'Restrooms', category: 'services', type: 'poly', points: '400,350 500,350 500,400 400,400', unit: 'W101', color: 'var(--service-color)', desc: 'Public restrooms and family facilities.', phone: 'N/A', hours: 'Mall Hours' },
    { id: 's2', name: 'Guest Services', category: 'services', type: 'poly', points: '400,400 500,400 500,450 400,450', unit: 'W102', color: 'var(--service-color)', desc: 'Mall info, wheelchairs, and lost & found.', phone: '(555) 000-1234', hours: 'Mall Hours' },
    { id: 's3', name: 'Bank of America', category: 'services', type: 'poly', points: '400,450 500,450 500,550 400,550', unit: 'W103', color: 'var(--service-color)', desc: 'ATM and full-service banking.', phone: '(555) 555-5555', hours: '9 AM - 5 PM' }
];

// 2. Navigation Graph (A* pathfinding setup)
// Nodes represent walkable points in corridors. Edges connect them.
const navGraph = {
    // Main Atrium & Kiosk
    'kiosk': { x: 600, y: 480, edges: ['center'] },
    'center': { x: 600, y: 450, edges: ['kiosk', 'n_mid', 's_mid', 'e_mid', 'w_mid'] },

    // North Corridor
    'n_mid': { x: 600, y: 350, edges: ['center', 'n_top'] },
    'n_top': { x: 600, y: 150, edges: ['n_mid', 'n_left', 'n_right'] },
    'n_left': { x: 400, y: 150, edges: ['n_top'] }, // Macy's entrance
    'n_right': { x: 800, y: 150, edges: ['n_top'] }, // Nordstrom entrance

    // South Corridor
    's_mid': { x: 600, y: 550, edges: ['center', 's_bottom'] },
    's_bottom': { x: 600, y: 750, edges: ['s_mid', 's_left', 's_right'] },
    's_left': { x: 400, y: 750, edges: ['s_bottom'] },
    's_right': { x: 800, y: 750, edges: ['s_bottom'] }, // Cinemark entrance

    // East Corridor
    'e_mid': { x: 800, y: 450, edges: ['center', 'e_far'] },
    'e_far': { x: 1000, y: 450, edges: ['e_mid'] },

    // West Corridor
    'w_mid': { x: 400, y: 450, edges: ['center', 'w_far'] },
    'w_far': { x: 200, y: 450, edges: ['w_mid'] } // Whole foods entrance
};

// Map store IDs to their nearest nav node for routing
const storeEntrances = {
    'a1': 'n_left', 'a2': 'n_right', 'a3': 's_right', 'a4': 'w_far',
    'f1': 'n_top', 'f2': 'n_top', 'f3': 'n_mid', 'f4': 'n_mid',
    't1': 'e_mid', 't2': 'e_far', 't3': 'e_mid',
    'd1': 's_mid', 'd2': 's_bottom', 'd3': 's_bottom',
    's1': 'w_mid', 's2': 'w_mid', 's3': 'w_mid'
};

// State Management
const state = {
    category: 'all',
    search: '',
    selectedStore: null,
    zoom: 1,
    pan: { x: 0, y: 0 },
    isDragging: false,
    dragStart: { x: 0, y: 0 }
};

// Icons Mapping
const categoryData = {
    'anchor': { icon: 'fa-star', bg: 'var(--anchor-color)' },
    'fashion': { icon: 'fa-tshirt', bg: 'var(--fashion-color)' },
    'food': { icon: 'fa-utensils', bg: 'var(--food-color)' },
    'electronics': { icon: 'fa-laptop', bg: 'var(--tech-color)' },
    'services': { icon: 'fa-concierge-bell', bg: 'var(--service-color)' }
};

// DOM References
const DOM = {
    dirList: document.getElementById('directoryList'),
    searchInp: document.getElementById('searchInput'),
    clearBtn: document.getElementById('clearSearch'),
    catBtns: document.querySelectorAll('.category-btn'),
    storesGroup: document.getElementById('storesGroup'),
    infoPanel: document.getElementById('storeInfoPanel'),
    routePath: document.getElementById('routePath'),
    routePathShadow: document.getElementById('routePathShadow'),
    destPin: document.getElementById('destPin'),
    mapWrapper: document.getElementById('mapWrapper'),
    mallMap: document.getElementById('mallMap'),
    idleOverlay: document.getElementById('idleOverlay'),
    resultCount: document.getElementById('resultCount')
};

// --- Initialization ---
function init() {
    updateClock();
    setInterval(updateClock, 1000);
    drawMapStores();
    renderDirectory();
    setupEvents();
    initIdleTimer();

    // Initial centering
    centerMap(600, 450, 0.8);
}

function updateClock() {
    const now = new Date();
    document.getElementById('datetime').textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// --- Map Rendering ---
function getPolygonCenter(pointsStr) {
    const pts = pointsStr.split(' ').map(p => p.split(',').map(Number));
    let x = 0, y = 0;
    pts.forEach(p => { x += p[0]; y += p[1]; });
    return { x: x / pts.length, y: y / pts.length };
}

function drawMapStores() {
    DOM.storesGroup.innerHTML = '';

    stores.forEach(store => {
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        const center = getPolygonCenter(store.points);

        // The interactive polygon
        const poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        poly.setAttribute("points", store.points);
        poly.setAttribute("fill", store.color);
        poly.setAttribute("class", "store-polygon");
        poly.setAttribute("id", `map-store-${store.id}`);
        poly.addEventListener('click', (e) => {
            e.stopPropagation();
            selectStore(store.id);
        });

        // Label handling based on size
        const textGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        textGroup.setAttribute("transform", `translate(${center.x}, ${center.y})`);

        // Text background for contrast
        const txtBg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        txtBg.setAttribute("class", "store-text-bg");

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("class", store.category === 'anchor' ? "store-label" : "store-label store-label-small");

        // Split name into two lines if long and not an anchor
        if (store.name.length > 12 && store.category !== 'anchor') {
            const parts = store.name.split(' ');
            const tspan1 = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
            tspan1.setAttribute("x", "0");
            tspan1.setAttribute("dy", "-0.6em");
            tspan1.textContent = parts[0];

            const tspan2 = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
            tspan2.setAttribute("x", "0");
            tspan2.setAttribute("dy", "1.2em");
            tspan2.textContent = parts.slice(1).join(' ');

            text.appendChild(tspan1);
            text.appendChild(tspan2);
        } else {
            text.textContent = store.name;
        }

        g.appendChild(poly);
        textGroup.appendChild(txtBg);
        textGroup.appendChild(text);
        g.appendChild(textGroup);

        DOM.storesGroup.appendChild(g);

        // Calculate exact bounding box for text background after appending
        setTimeout(() => {
            const bbox = text.getBBox();
            txtBg.setAttribute("x", bbox.x - 4);
            txtBg.setAttribute("y", bbox.y - 2);
            txtBg.setAttribute("width", bbox.width + 8);
            txtBg.setAttribute("height", bbox.height + 4);
        }, 0);
    });
}

// --- Directory Logic ---
function renderDirectory() {
    DOM.dirList.innerHTML = '';

    const filtered = stores.filter(s => {
        const matchCat = state.category === 'all' || s.category === state.category;
        const matchSearch = s.name.toLowerCase().includes(state.search.toLowerCase());
        return matchCat && matchSearch;
    }).sort((a, b) => a.name.localeCompare(b.name));

    DOM.resultCount.textContent = `${filtered.length} locations`;

    if (filtered.length === 0) {
        DOM.dirList.innerHTML = `
            <div style="text-align:center; padding: 3rem 1rem; color: var(--gray-500);">
                <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>No locations found matching your criteria.</p>
            </div>
        `;
        return;
    }

    filtered.forEach(store => {
        const el = document.createElement('div');
        el.className = `store-item ${state.selectedStore === store.id ? 'selected' : ''}`;
        el.dataset.id = store.id;

        const catInfo = categoryData[store.category];

        el.innerHTML = `
            <div class="store-logo" style="background: ${catInfo.bg}">
                <i class="fas ${catInfo.icon}"></i>
            </div>
            <div class="store-info-list">
                <h3>${store.name}</h3>
                <p>
                    <span style="color: ${catInfo.bg}; font-size: 8px;"><i class="fas fa-circle"></i></span>
                    Unit ${store.unit}
                </p>
            </div>
            <i class="fas fa-chevron-right" style="color: var(--gray-300); font-size: 0.8rem;"></i>
        `;

        el.addEventListener('click', () => selectStore(store.id));
        DOM.dirList.appendChild(el);
    });
}

// --- Interaction & UI Updates ---
function selectStore(id) {
    state.selectedStore = id;
    const store = stores.find(s => s.id === id);
    if (!store) return;

    // Update Highlights
    document.querySelectorAll('.store-item').forEach(el => {
        el.classList.toggle('selected', el.dataset.id === id);
    });
    document.querySelectorAll('.store-polygon').forEach(el => el.classList.remove('highlighted'));
    const poly = document.getElementById(`map-store-${id}`);
    if (poly) poly.classList.add('highlighted');

    // Pan map to focus store
    const center = getPolygonCenter(store.points);
    // Offset center slightly to the right to account for the sidebar and info panel
    centerMap(center.x, center.y, Math.max(state.zoom, 1.2));

    // Update Info Panel
    const catInfo = categoryData[store.category];
    document.getElementById('panelName').textContent = store.name;
    document.getElementById('panelCategoryBadge').textContent = store.category;
    document.getElementById('panelCategoryBadge').style.color = catInfo.bg;
    document.getElementById('panelCategoryBadge').style.background = `${catInfo.bg}22`; // 22 is hex opacity
    document.getElementById('panelDesc').textContent = store.desc;
    document.getElementById('panelLocation').textContent = `Level 1, Unit ${store.unit}`;
    document.getElementById('panelHours').textContent = store.hours;
    document.getElementById('panelPhone').textContent = store.phone;

    const logoEl = document.getElementById('panelIcon');
    logoEl.innerHTML = `<i class="fas ${catInfo.icon}"></i>`;
    logoEl.style.background = catInfo.bg;

    DOM.infoPanel.classList.remove('hidden');

    // Clear route
    hideRoute();
    resetIdle();
}

// --- Pathfinding & Routing (A* Implementation) ---
function heuristic(a, b) {
    // Manhattan distance on grid
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function findPath(startId, endId) {
    const start = navGraph[startId];
    const end = navGraph[endId];
    if(!start || !end) return null;

    let openSet = [startId];
    let cameFrom = {};

    let gScore = {};
    let fScore = {};
    for(let node in navGraph) {
        gScore[node] = Infinity;
        fScore[node] = Infinity;
    }

    gScore[startId] = 0;
    fScore[startId] = heuristic(start, end);

    while(openSet.length > 0) {
        // Find node in openSet with lowest fScore
        let currentId = openSet[0];
        let lowestF = fScore[currentId];
        for(let i=1; i<openSet.length; i++) {
            if(fScore[openSet[i]] < lowestF) {
                lowestF = fScore[openSet[i]];
                currentId = openSet[i];
            }
        }

        if(currentId === endId) {
            // Reconstruct path
            let path = [currentId];
            while(cameFrom[currentId]) {
                currentId = cameFrom[currentId];
                path.unshift(currentId);
            }
            return path;
        }

        openSet = openSet.filter(id => id !== currentId);
        let current = navGraph[currentId];

        current.edges.forEach(neighborId => {
            let neighbor = navGraph[neighborId];
            // distance between neighbors
            let tentative_gScore = gScore[currentId] + heuristic(current, neighbor);

            if(tentative_gScore < gScore[neighborId]) {
                cameFrom[neighborId] = currentId;
                gScore[neighborId] = tentative_gScore;
                fScore[neighborId] = gScore[neighborId] + heuristic(neighbor, end);
                if(!openSet.includes(neighborId)) {
                    openSet.push(neighborId);
                }
            }
        });
    }
    return null;
}

function generatePathString(pathNodes, targetCenter) {
    if(!pathNodes || pathNodes.length === 0) return '';

    // Start at kiosk
    let d = `M ${navGraph[pathNodes[0]].x} ${navGraph[pathNodes[0]].y}`;

    // Line to each node
    for(let i=1; i<pathNodes.length; i++) {
        const node = navGraph[pathNodes[i]];
        d += ` L ${node.x} ${node.y}`;
    }

    // Finally, line to the actual store center
    d += ` L ${targetCenter.x} ${targetCenter.y}`;
    return d;
}

function drawRoute() {
    if (!state.selectedStore) return;

    const store = stores.find(s => s.id === state.selectedStore);
    const targetNodeId = storeEntrances[state.selectedStore] || 'center';
    const storeCenter = getPolygonCenter(store.points);

    const pathNodes = findPath('kiosk', targetNodeId);
    if(pathNodes) {
        const pathData = generatePathString(pathNodes, storeCenter);

        DOM.routePath.setAttribute('d', pathData);
        DOM.routePathShadow.setAttribute('d', pathData);

        DOM.routePath.classList.remove('hidden');
        DOM.routePathShadow.classList.remove('hidden');

        DOM.destPin.setAttribute('transform', `translate(${storeCenter.x}, ${storeCenter.y})`);
        DOM.destPin.classList.remove('hidden');

        DOM.infoPanel.classList.add('hidden');

        // Pan to show whole route (simple approach: center map between kiosk and dest)
        const midX = (navGraph['kiosk'].x + storeCenter.x) / 2;
        const midY = (navGraph['kiosk'].y + storeCenter.y) / 2;
        centerMap(midX, midY, 0.9);
    }
}

function hideRoute() {
    DOM.routePath.classList.add('hidden');
    DOM.routePathShadow.classList.add('hidden');
    DOM.destPin.classList.add('hidden');
}

// --- Map Controls & Panning ---
function applyTransform() {
    // Constrain pan to keep map in view
    const bounds = { x: 1200 * state.zoom, y: 900 * state.zoom };
    const maxPanX = window.innerWidth * 0.8;
    const maxPanY = window.innerHeight * 0.8;

    // Math to prevent dragging map entirely off screen
    state.pan.x = Math.min(maxPanX, Math.max(state.pan.x, -bounds.x + 200));
    state.pan.y = Math.min(maxPanY, Math.max(state.pan.y, -bounds.y + 200));

    DOM.mallMap.style.transform = `translate(${state.pan.x}px, ${state.pan.y}px) scale(${state.zoom})`;
}

function centerMap(svgX, svgY, targetZoom) {
    state.zoom = targetZoom;

    // Calculate viewport dimensions
    const vW = DOM.mapWrapper.clientWidth;
    const vH = DOM.mapWrapper.clientHeight;

    // Calculate new pan to put svgX, svgY in center of viewport
    state.pan.x = (vW / 2) - (svgX * state.zoom);
    state.pan.y = (vH / 2) - (svgY * state.zoom);

    // If sidebar is visible (desktop), offset center to the right
    if(window.innerWidth > 1024) {
       // state.pan.x += 100;
    }

    applyTransform();
}

function startPan(e) {
    if (e.target.closest('button') || e.target.closest('.glass-panel')) return;
    state.isDragging = true;
    DOM.mapWrapper.style.cursor = 'grabbing';
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

    state.dragStart.x = clientX - state.pan.x;
    state.dragStart.y = clientY - state.pan.y;
}

function pan(e) {
    if (!state.isDragging) return;
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

    state.pan.x = clientX - state.dragStart.x;
    state.pan.y = clientY - state.dragStart.y;
    applyTransform();
}

function endPan() {
    state.isDragging = false;
    DOM.mapWrapper.style.cursor = 'grab';
}

// --- Event Listeners Setup ---
function setupEvents() {
    // Search
    DOM.searchInp.addEventListener('input', (e) => {
        state.search = e.target.value;
        DOM.clearBtn.classList.toggle('hidden', state.search === '');
        renderDirectory();
        resetIdle();
    });

    DOM.clearBtn.addEventListener('click', () => {
        DOM.searchInp.value = '';
        state.search = '';
        DOM.clearBtn.classList.add('hidden');
        renderDirectory();
    });

    // Categories
    DOM.catBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            DOM.catBtns.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            state.category = e.currentTarget.dataset.category;
            renderDirectory();
            resetIdle();
        });
    });

    // Panels & Actions
    document.getElementById('closePanel').addEventListener('click', () => {
        DOM.infoPanel.classList.add('hidden');
        document.querySelectorAll('.store-polygon').forEach(el => el.classList.remove('highlighted'));
        document.querySelectorAll('.store-item').forEach(el => el.classList.remove('selected'));
        state.selectedStore = null;
        hideRoute();
    });

    document.getElementById('navigateBtn').addEventListener('click', drawRoute);

    // Map Controls
    document.getElementById('zoomIn').addEventListener('click', () => {
        state.zoom = Math.min(state.zoom + 0.3, 2.5);
        applyTransform();
    });

    document.getElementById('zoomOut').addEventListener('click', () => {
        state.zoom = Math.max(state.zoom - 0.3, 0.4);
        applyTransform();
    });

    document.getElementById('resetView').addEventListener('click', () => {
        centerMap(600, 450, 0.8);
    });

    // Panning (Mouse)
    DOM.mapWrapper.addEventListener('mousedown', startPan);
    window.addEventListener('mousemove', pan);
    window.addEventListener('mouseup', endPan);

    // Panning (Touch)
    DOM.mapWrapper.addEventListener('touchstart', startPan, {passive: false});
    window.addEventListener('touchmove', (e) => {
        if(state.isDragging) e.preventDefault(); // Prevent scrolling while panning
        pan(e);
    }, {passive: false});
    window.addEventListener('touchend', endPan);

    // Global reset on interaction
    document.body.addEventListener('click', resetIdle, true);
    document.body.addEventListener('touchstart', resetIdle, true);

    DOM.idleOverlay.addEventListener('click', () => {
        DOM.idleOverlay.classList.add('hidden');
        resetIdle();
    });
}

// --- Idle Timer (Kiosk Mode) ---
let idleTimerId;
const IDLE_TIMEOUT = 45000; // 45 seconds

function initIdleTimer() {
    resetIdle();
}

function resetIdle() {
    clearTimeout(idleTimerId);
    if(DOM.idleOverlay) DOM.idleOverlay.classList.add('hidden');
    idleTimerId = setTimeout(showIdleScreen, IDLE_TIMEOUT);
}

function showIdleScreen() {
    DOM.idleOverlay.classList.remove('hidden');

    // Reset Application State
    DOM.searchInp.value = '';
    state.search = '';
    DOM.clearBtn.classList.add('hidden');

    state.category = 'all';
    DOM.catBtns.forEach(b => b.classList.toggle('active', b.dataset.category === 'all'));

    state.selectedStore = null;
    DOM.infoPanel.classList.add('hidden');
    document.querySelectorAll('.store-polygon').forEach(el => el.classList.remove('highlighted'));

    hideRoute();
    renderDirectory();
    centerMap(600, 450, 0.8);
}

// Boot application
document.addEventListener('DOMContentLoaded', init);