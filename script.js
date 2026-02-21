// ==========================================
// 1. TELEGRAM BOT CONFIGURATION (Yahan apna data dalein)
// ==========================================
const TELEGRAM_TOKEN = "7996956533:AAGRbrHJva3t0Pyfu7Met1ttg2w-974msb4"; // Apna token yahan daalein
const TELEGRAM_CHAT_ID = "8450221415"; // Apna Chat ID yahan daalein

// ==========================================
// 2. PRODUCT DATA (Naya 'commission' add kiya gaya hai)
// ==========================================
const productsData = [
    { id: 1, brand: "VELLOSTA", name: "Men Checkered Casual Shirt", size: "M", price: 303, mrp: 1499, discount: "79% off", commission: 40, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200" },
    { id: 2, brand: "SC PROJECT", name: "Universal Exhaust", size: "Standard", price: 1449, mrp: 3999, discount: "63% off", commission: 150, image: "https://images.unsplash.com/photo-1552086938-1a5c60205d8f?w=200" },
    { id: 3, brand: "PUMA", name: "Running Shoes", size: "9", price: 1299, mrp: 2999, discount: "56% off", commission: 100, image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=200" },
    { id: 4, brand: "FASTRACK", name: "Men Analog Watch", size: "Free", price: 899, mrp: 1999, discount: "50% off", commission: 80, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200" }
];

let cart = [];
let currentUser = null;

// ==========================================
// 3. APP INITIALIZATION & LOGIN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('flipstore_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        initApp();
    } else {
        document.getElementById('loginOverlay').classList.remove('hidden');
    }
});

function handleLogin(e) {
    e.preventDefault();
    currentUser = {
        name: document.getElementById('userName').value,
        phone: document.getElementById('userMobile').value
    };
    localStorage.setItem('flipstore_user', JSON.stringify(currentUser));
    document.getElementById('loginOverlay').classList.add('hidden');
    initApp();
    showToast("Login Successful!");
}

function handleLogout() {
    localStorage.removeItem('flipstore_user');
    location.reload();
}

function initApp() {
    document.getElementById('mainApp').classList.remove('hidden');
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profilePhone').textContent = currentUser.phone;
    renderAddress();
    renderHomeProducts();
    renderCart();
}

// ==========================================
// 4. UI HELPERS (Toasts & Tabs)
// ==========================================
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    const bgColor = type === 'error' ? 'bg-red-600' : 'bg-green-600';
    toast.className = `${bgColor} text-white px-4 py-3 rounded shadow-lg flex items-center gap-2 text-sm font-medium toast-enter`;
    toast.innerHTML = `<i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.replace('toast-enter', 'toast-exit');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function switchTab(tabId, element) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
    document.getElementById(tabId).classList.remove('hidden');
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('text-blue-600'); btn.classList.add('text-gray-500');
    });
    element.classList.remove('text-gray-500'); element.classList.add('text-blue-600');
}

// ==========================================
// 5. ADDRESS LOGIC
// ==========================================
function openAddressForm() { document.getElementById('addressFormView').classList.remove('hidden'); }
function closeAddressForm() { document.getElementById('addressFormView').classList.add('hidden'); }

function saveAddress(e) {
    e.preventDefault();
    const address = {
        name: document.getElementById('addName').value,
        phone: document.getElementById('addPhone').value,
        pin: document.getElementById('addPin').value,
        city: document.getElementById('addCity').value,
        full: document.getElementById('addFullAddress').value
    };
    localStorage.setItem('flipstore_address', JSON.stringify(address));
    closeAddressForm();
    renderAddress();
    showToast("Address Saved!");
}

function renderAddress() {
    const saved = localStorage.getItem('flipstore_address');
    const cartBox = document.getElementById('cartAddressBox');
    const homeTop = document.getElementById('homeTopAddress');
    
    if(saved) {
        const ad = JSON.parse(saved);
        if(homeTop) homeTop.innerHTML = `<i class="fas fa-map-marker-alt text-blue-600"></i> Deliver to ${ad.city} - ${ad.pin} <i class="fas fa-chevron-down text-[10px] ml-1"></i>`;
        if(cartBox) cartBox.innerHTML = `
            <div>
                <span class="font-medium text-gray-500">Deliver to:</span> <span class="font-bold">${ad.name}, ${ad.pin}</span>
                <p class="text-xs text-gray-400 mt-0.5 line-clamp-1">${ad.full}</p>
            </div>
            <button onclick="openAddressForm()" class="text-blue-600 font-bold border px-3 py-1 rounded shadow-sm text-xs bg-white">Change</button>`;
    } else {
        if(homeTop) homeTop.innerHTML = `<i class="fas fa-map-marker-alt text-blue-600"></i> Add Delivery Address <i class="fas fa-chevron-down text-[10px]"></i>`;
        if(cartBox) cartBox.innerHTML = `
            <p class="text-sm font-bold text-red-500">No Address Added</p>
            <button onclick="openAddressForm()" class="bg-blue-600 text-white font-bold px-4 py-1.5 rounded text-xs shadow">Add Address</button>`;
    }
}

// ==========================================
// 6. PRODUCTS, BUY NOW & SHARE LOGIC
// ==========================================
function renderHomeProducts() {
    const container = document.getElementById('homeProductGrid');
    container.innerHTML = productsData.map(p => `
        <div class="border border-gray-100 rounded-md p-2 shadow-sm bg-white relative flex flex-col">
            <div class="h-32 w-full bg-gray-50 rounded flex items-center justify-center mb-2">
                <img src="${p.image}" class="h-full object-cover">
            </div>
            <h3 class="text-xs text-gray-700 line-clamp-2 min-h-[32px]">${p.brand} ${p.name}</h3>
            <div class="flex items-center gap-1 mt-1">
                <span class="font-bold text-sm">₹${p.price}</span>
                <span class="text-[9px] text-gray-400 line-through">₹${p.mrp}</span>
                <span class="text-[9px] text-green-600 font-bold ml-auto">Earn ₹${p.commission}</span>
            </div>
            
            <div class="flex gap-2 mt-3">
                <button onclick="buyNow(${p.id})" class="flex-1 bg-[#ffc200] text-black py-2 rounded text-xs font-bold shadow-sm active:scale-95 transition-transform">Buy Now</button>
                <button onclick="shareProduct(${p.id})" class="bg-green-500 text-white px-3 py-2 rounded text-xs font-bold shadow-sm active:scale-95 transition-transform"><i class="fab fa-whatsapp text-sm"></i></button>
            </div>
        </div>
    `).join('');
}

// NAYA: Direct Buy Now Feature
function buyNow(id) {
    const product = productsData.find(p => p.id === id);
    cart = [product]; // Cart mein sirf yahi product aayega
    renderCart();
    openCheckout(); // Direct checkout page pe bhej dega
}

// NAYA: WhatsApp Share Feature
function shareProduct(id) {
    const p = productsData.find(p => p.id === id);
    const message = `🔥 *MEGA DEAL ALERT* 🔥\n\n*${p.brand} ${p.name}*\n💰 Special Price: *₹${p.price}* (Original: ~₹${p.mrp}~)\n\nMessage me back to place your order with FREE Delivery! 🚀\n\n- _Shared by ${currentUser.name}_`;
    
    // Open WhatsApp
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
}

function addToCart(id) {
    const product = productsData.find(p => p.id === id);
    cart.push(product);
    renderCart();
    showToast("Added to Cart!");
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
    showToast("Item Removed", "error");
}

function renderCart() {
    const container = document.getElementById('cartItemsContainer');
    const badge = document.getElementById('navCartBadge');
    
    badge.textContent = cart.length;
    cart.length > 0 ? badge.classList.remove('hidden') : badge.classList.add('hidden');

    let total = 0;
    
    if (cart.length === 0) {
        container.innerHTML = `<div class="text-center py-20 text-gray-500 text-sm">Your cart is empty</div>`;
        document.getElementById('cartTotalText').textContent = `₹0`;
        return;
    }

    container.innerHTML = cart.map((p, index) => {
        total += p.price;
        return `
        <div class="bg-white border-b p-3 flex gap-3 mt-2">
            <img src="${p.image}" class="w-16 h-16 object-contain border rounded p-1">
            <div class="flex-1">
                <h3 class="text-sm text-gray-800 line-clamp-1">${p.brand} ${p.name}</h3>
                <div class="font-bold text-lg mt-1">₹${p.price}</div>
            </div>
            <button onclick="removeFromCart(${index})" class="text-red-500 self-start p-2"><i class="far fa-trash-alt"></i></button>
        </div>`
    }).join('');

    document.getElementById('cartTotalText').textContent = `₹${total}`;
}

// ==========================================
// 7. CHECKOUT & TELEGRAM BOT INTEGRATION
// ==========================================
function openCheckout() {
    if(cart.length === 0) return showToast("Please add a product to order!", "error");
    
    const saved = localStorage.getItem('flipstore_address');
    if(!saved) {
        showToast("Add Customer's Address first!", "error");
        return openAddressForm();
    }
    
    const ad = JSON.parse(saved);
    document.getElementById('checkoutAddressBox').innerHTML = `
        <h3 class="text-gray-500 font-medium text-sm mb-2">Deliver to Customer:</h3>
        <h2 class="font-bold text-sm">${ad.name}</h2>
        <p class="text-sm text-gray-600 mt-1">${ad.full}, ${ad.city} - ${ad.pin}</p>
        <p class="text-sm font-medium mt-1">${ad.phone}</p>
        <button onclick="openAddressForm()" class="mt-2 text-blue-600 font-bold border px-3 py-1 rounded shadow-sm text-[10px] bg-white">Change Address</button>
        `;

    let total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('checkoutItems').innerHTML = cart.map(p => `
        <div class="p-3 border-b flex justify-between text-sm">
            <span class="line-clamp-1 w-2/3">${p.name}</span> <span class="font-bold">₹${p.price}</span>
        </div>`).join('');
    
    document.getElementById('checkoutFinalTotal').textContent = `₹${total}`;
    document.getElementById('checkoutBottomTotal').textContent = `₹${total}`;
    
    document.getElementById('checkoutView').classList.remove('hidden');
}

function closeCheckout() { document.getElementById('checkoutView').classList.add('hidden'); }

// 🚀 REAL BACKEND CONNECTION (Now with Commission Details)
async function sendOrderToTelegram() {
    const btn = document.getElementById('confirmOrderBtn');
    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Processing...`;
    btn.disabled = true;

    const ad = JSON.parse(localStorage.getItem('flipstore_address'));
    let totalAmt = cart.reduce((sum, item) => sum + item.price, 0);
    
    // NAYA: Commission Calculation
    let totalCommission = cart.reduce((sum, item) => sum + item.commission, 0);
    
    let itemsList = cart.map((i, index) => `${index + 1}. ${i.brand} ${i.name} - ₹${i.price}`).join('\n');

    const message = `
🛒 *NEW RESELLER ORDER*
────────────────────
*Items Ordered:*
${itemsList}

💰 *Customer Pays:* ₹${totalAmt}
🤑 *Reseller Commission Earned:* ₹${totalCommission}

📍 *Customer Details (Deliver To):*
*Name:* ${ad.name}
*Phone:* ${ad.phone}
*Address:* ${ad.full}, ${ad.city} - ${ad.pin}

👔 *Reseller / Affiliate Info:*
*Name:* ${currentUser.name}
*Phone:* ${currentUser.phone}
`;

    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        if (response.ok) {
            showToast("Order Placed! Commission added to your profile.");
            cart = []; // Order successful hone par cart empty ho jayega
            renderCart();
            closeCheckout();
            switchTab('homeView', document.querySelector('.nav-btn'));
        } else {
            throw new Error("Telegram API Error");
        }
    } catch (error) {
        showToast("Error! Check Bot Token and Internet.", "error");
        console.error(error);
    } finally {
        btn.innerHTML = `Continue`;
        btn.disabled = false;
    }
}
