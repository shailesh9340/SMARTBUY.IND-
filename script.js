// Config - Apne bot ki details daalein
const TELEGRAM_TOKEN = "YOUR_BOT_TOKEN_HERE";
const TELEGRAM_CHAT_ID = "YOUR_CHAT_ID_HERE";

// Fake Product Data
const products = [
    { id: 1, name: "AirPods Pro Gen-2", price: 1299, oldPrice: 2999, category: "Tech", sizes: [], image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400" },
    { id: 2, name: "Smart Watch Ultra", price: 1499, oldPrice: 3499, category: "Tech", sizes: [], image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400" },
    { id: 3, name: "Luxury Men's Shirt", price: 599, oldPrice: 1299, category: "Fashion", sizes: ['M', 'L', 'XL'], image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400" },
    { id: 4, name: "Summer Dress", price: 899, oldPrice: 1999, category: "Fashion", sizes: ['S', 'M', 'L'], image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400" }
];

let cart = [];
let activeCategory = 'All';
let currentUser = null;

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('splash').style.display = 'none';
        checkLogin();
    }, 1500);
});

function checkLogin() {
    const userStr = localStorage.getItem('flipstore_user');
    if (userStr) {
        currentUser = JSON.parse(userStr);
        document.getElementById('profileName').textContent = currentUser.name;
        document.getElementById('profilePhone').textContent = currentUser.mobile;
        
        // Refer & Earn Setup
        document.getElementById('myReferralCode').textContent = currentUser.referralCode;
        document.getElementById('totalRef').textContent = currentUser.totalReferrals || 0;
        document.getElementById('walletBal').textContent = `₹${currentUser.wallet || 0}`;
        document.getElementById('headerWallet').textContent = `₹${currentUser.wallet || 0}`;

        document.getElementById('mainApp').classList.remove('hidden');
        renderCategories();
        renderProducts(products);
        updateCartBadge();
        renderCartUI();
    } else {
        document.getElementById('loginOverlay').classList.remove('hidden');
    }
}

// Login & Generate Referral Code
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('userName').value;
    const mobile = document.getElementById('userMobile').value;
    const enteredReferral = document.getElementById('referralCodeInput').value;

    // Generate unique code for new user (e.g., AMIT8942)
    const refCode = name.substring(0, 4).toUpperCase() + Math.floor(1000 + Math.random() * 9000);
    
    // Starting bonus if they used a code
    let startingWallet = enteredReferral ? 50 : 0;

    const user = { 
        name: name, 
        mobile: mobile, 
        referralCode: refCode,
        totalReferrals: 0,
        wallet: startingWallet
    };

    localStorage.setItem('flipstore_user', JSON.stringify(user));
    location.reload();
});

function logout() {
    localStorage.removeItem('flipstore_user');
    location.reload();
}

// Refer & Earn Actions
function copyCode() {
    navigator.clipboard.writeText(currentUser.referralCode);
    showToast("Referral Code Copied!");
}

function shareReferral() {
    const text = `Hey! Download Flipstore app and use my referral code *${currentUser.referralCode}* to get ₹50 signup bonus! \n\nDownload Link: https://yourwebsite.com`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
}

// Product & Category Rendering
function renderCategories() {
    const cats = ['All', ...new Set(products.map(p => p.category))];
    document.getElementById('categories').innerHTML = cats.map(cat => `
        <button onclick="filterCategory('${cat}')" class="whitespace-nowrap px-6 py-2 rounded-full text-xs font-bold transition-all ${activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 border'}">${cat}</button>
    `).join('');
}

function filterCategory(cat) {
    activeCategory = cat; renderCategories();
    renderProducts(cat === 'All' ? products : products.filter(p => p.category === cat));
}

function renderProducts(list) {
    document.getElementById('productsGrid').innerHTML = list.map(p => {
        const sizeHtml = p.sizes.length ? `<select id="size-${p.id}" class="text-[10px] border rounded px-1 ml-2"><option disabled selected>Size</option>${p.sizes.map(s=>`<option value="${s}">${s}</option>`).join('')}</select>` : '';
        return `
        <div class="bg-white rounded-2xl p-2 shadow-sm border">
            <img src="${p.image}" class="w-full aspect-square object-cover rounded-xl mb-2">
            <h3 class="text-xs font-bold text-gray-800 line-clamp-1">${p.name}</h3>
            <div class="flex items-center gap-1 mt-1">
                <span class="text-sm font-black text-blue-600">₹${p.price}</span>
                <span class="text-[9px] text-gray-400 line-through">₹${p.oldPrice}</span>
            </div>
            ${sizeHtml}
            <button onclick="addToCart(${p.id})" class="w-full mt-2 bg-gray-900 text-white py-2 rounded-xl text-xs font-bold">Add to Cart</button>
        </div>
    `}).join('');
}

// Cart Management
function addToCart(id) {
    const prod = products.find(p => p.id === id);
    let size = "N/A";
    
    if(prod.sizes.length > 0) {
        const sizeDropdown = document.getElementById(`size-${id}`);
        if(sizeDropdown.value === "Size") { showToast("Please select a size!"); return; }
        size = sizeDropdown.value;
    }

    cart.push({ ...prod, selectedSize: size });
    showToast("Item added to cart!");
    updateCartBadge();
}

function removeCartItem(index) {
    cart.splice(index, 1);
    updateCartBadge();
    renderCartUI();
}

function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if(cart.length > 0) { badge.textContent = cart.length; badge.classList.remove('hidden'); } 
    else { badge.classList.add('hidden'); }
}

function renderCartUI() {
    const cartDiv = document.getElementById('cartItems');
    const totalSec = document.getElementById('cartTotalSection');
    const empty = document.getElementById('emptyCart');

    if(cart.length === 0) { 
        cartDiv.innerHTML = ''; totalSec.classList.add('hidden'); empty.classList.remove('hidden'); 
        return; 
    }
    
    empty.classList.add('hidden');
    totalSec.classList.remove('hidden');

    let total = 0;

    cartDiv.innerHTML = cart.map((item, index) => {
        total += item.price;
        return `
        <div class="flex gap-4 bg-white p-3 rounded-2xl border items-center">
            <img src="${item.image}" class="w-16 h-16 rounded-xl object-cover">
            <div class="flex-1">
                <h4 class="text-sm font-bold text-gray-800">${item.name}</h4>
                <p class="text-xs text-gray-500">Size: ${item.selectedSize}</p>
                <p class="text-sm font-black text-blue-600">₹${item.price}</p>
            </div>
            <button onclick="removeCartItem(${index})" class="text-red-500 text-lg p-2"><i class="fas fa-trash"></i></button>
        </div>
    `}).join('');

    document.getElementById('cartSubtotal').textContent = `₹${total}`;
    document.getElementById('cartFinalPrice').textContent = `₹${total}`;
}

// Navigation
function switchTab(tabId, btn) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(tabId).classList.remove('hidden');
    
    document.querySelectorAll('.nav-btn').forEach(el => { el.classList.remove('text-blue-600'); el.classList.add('text-gray-400'); });
    if(btn) { btn.classList.remove('text-gray-400'); btn.classList.add('text-blue-600'); }
    
    if(tabId === 'cartView') renderCartUI();
}

// Checkout Form Submission
function openCheckout() { document.getElementById('orderSheet').classList.remove('hidden'); }
function closeCheckout() { document.getElementById('orderSheet').classList.add('hidden'); }

document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('confirmOrderBtn');
    btn.textContent = "Processing..."; btn.disabled = true;

    let itemsText = cart.map(i => `▫️ ${i.name} (${i.selectedSize}) - ₹${i.price}`).join('\n');
    let totalAmt = document.getElementById('cartFinalPrice').textContent;

    const orderDetails = `
📦 *NEW ORDER RECEIVED*
────────────────────
*Customer:* ${currentUser.name} (${currentUser.mobile})
*Items:*
${itemsText}

💰 *Total Amount:* ${totalAmt}
📍 *Address:* ${document.getElementById('custAddress').value}, ${document.getElementById('custCity').value} - ${document.getElementById('custPin').value}
`;
    
    try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: orderDetails, parse_mode: 'Markdown' })
        });
        showToast("Order Placed Successfully!");
        cart = []; updateCartBadge(); closeCheckout(); switchTab('homeView', document.querySelector('.nav-btn'));
        document.getElementById('checkoutForm').reset();
    } catch (err) { showToast("Error processing order!"); }
    
    btn.textContent = "Confirm Order"; btn.disabled = false;
});

function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg; toast.className = "show";
    setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
}

// Search
document.getElementById('searchInput').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    renderProducts(products.filter(p => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term)));
});

