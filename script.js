const productsData = [
    { id: 1, brand: "VELLOSTA", name: "Men Checkered Casual Shirt", size: "M", price: 303, mrp: 1499, discount: "79% off", rating: 4.0, reviews: "7,342", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200", delivery: "Feb 25, Wed" },
    { id: 2, brand: "SC PROJECT", name: "Universal Stainless Steel Exhaust", size: "Standard", price: 1449, mrp: 3999, discount: "63% off", rating: 4.2, reviews: "712", image: "https://images.unsplash.com/photo-1552086938-1a5c60205d8f?w=200", delivery: "Feb 25, Wed", tag: "Hot Deal" },
    { id: 3, brand: "PUMA", name: "Running Shoes for Men", size: "9", price: 1299, mrp: 2999, discount: "56% off", rating: 4.5, reviews: "12,450", image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=200", delivery: "Feb 26, Thu" }
];

let cart = [...productsData]; // Auto-fill cart for demo

document.addEventListener('DOMContentLoaded', () => {
    renderAddress();
    renderCart();
    
    // Simulate Network Request with Skeleton Loader
    renderSkeletons();
    setTimeout(() => {
        renderHomeProducts();
    }, 1500); // 1.5 seconds loading time
});

// --- TOAST NOTIFICATION SYSTEM ---
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    const bgColor = type === 'error' ? 'bg-red-600' : 'bg-green-600';
    const icon = type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle';
    
    toast.className = `${bgColor} text-white px-4 py-3 rounded shadow-lg flex items-center gap-3 text-sm font-medium toast-enter`;
    toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.replace('toast-enter', 'toast-exit');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --- TAB SWITCHING ---
function switchTab(tabId, element) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
    document.getElementById(tabId).classList.remove('hidden');

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('text-blue-600'); btn.classList.add('text-gray-500');
    });
    element.classList.remove('text-gray-500'); element.classList.add('text-blue-600');
    window.scrollTo(0, 0);
}

// --- ADDRESS LOGIC ---
function openAddressForm() { document.getElementById('addressFormView').classList.remove('hidden'); }
function closeAddressForm() { document.getElementById('addressFormView').classList.add('hidden'); }

function saveAddress(e) {
    e.preventDefault();
    const phone = document.getElementById('addPhone').value;
    const pin = document.getElementById('addPin').value;

    // Pro-level validation
    if(phone.length !== 10 || pin.length !== 6) {
        document.getElementById('formError').classList.remove('hidden');
        showToast("Enter a valid 10-digit phone and 6-digit Pincode", "error");
        return;
    }

    const address = {
        name: document.getElementById('addName').value,
        phone: phone, pin: pin,
        city: document.getElementById('addCity').value,
        full: document.getElementById('addFullAddress').value
    };
    
    localStorage.setItem('flipstore_address', JSON.stringify(address));
    document.getElementById('formError').classList.add('hidden');
    closeAddressForm();
    renderAddress();
    showToast("Address Saved Successfully!");
}

function renderAddress() {
    const saved = localStorage.getItem('flipstore_address');
    const cartBox = document.getElementById('cartAddressBox');
    const homeTop = document.getElementById('homeTopAddress');

    if(saved) {
        const ad = JSON.parse(saved);
        if(homeTop) homeTop.innerHTML = `<i class="fas fa-map-marker-alt text-blue-600"></i> ${ad.city}, ${ad.pin} <i class="fas fa-chevron-down text-[10px] ml-1"></i>`;
        
        if(cartBox) cartBox.innerHTML = `
            <div>
                <span class="font-medium text-gray-500">Deliver to:</span> <span class="font-bold">${ad.name}, ${ad.pin}</span>
                <p class="text-xs text-gray-400 mt-0.5 line-clamp-1">${ad.full}</p>
            </div>
            <button onclick="openAddressForm()" class="text-blue-600 font-bold border border-gray-200 px-3 py-1.5 rounded shadow-sm text-xs bg-white">Change</button>
        `;
    } else {
        if(homeTop) homeTop.innerHTML = `<i class="fas fa-map-marker-alt text-blue-600"></i> Add Delivery Address <i class="fas fa-chevron-down text-[10px]"></i>`;
        if(cartBox) cartBox.innerHTML = `
            <div class="flex-1 flex justify-between items-center py-1">
                <p class="text-sm font-bold text-red-500"><i class="fas fa-exclamation-triangle"></i> No Delivery Address</p>
                <button onclick="openAddressForm()" class="bg-blue-600 text-white font-bold px-4 py-2 rounded text-xs shadow">Add Address</button>
            </div>
        `;
    }
}

// --- PRODUCT & CART LOGIC ---
function renderSkeletons() {
    const container = document.getElementById('homeProductSlider');
    container.innerHTML = Array(4).fill().map(() => `
        <div class="min-w-[130px] border rounded-md p-2 bg-white shrink-0">
            <div class="h-28 w-full shimmer rounded mb-2"></div>
            <div class="h-3 w-3/4 shimmer rounded mb-1"></div>
            <div class="h-4 w-1/2 shimmer rounded mt-2"></div>
        </div>
    `).join('');
}

function renderHomeProducts() {
    const container = document.getElementById('homeProductSlider');
    container.innerHTML = productsData.map(p => `
        <div class="min-w-[130px] max-w-[130px] border border-gray-100 rounded-md p-2 shadow-sm bg-white shrink-0 relative group">
            <div class="h-28 w-full bg-gray-50 rounded flex items-center justify-center mb-2 overflow-hidden relative">
                <img src="${p.image}" class="h-full object-cover">
                <button onclick="addToCart(${p.id})" class="absolute bottom-1 right-1 bg-white shadow rounded-full w-7 h-7 text-blue-600 flex items-center justify-center opacity-90 active:scale-90 transition-transform"><i class="fas fa-plus text-xs"></i></button>
            </div>
            <h3 class="text-xs text-gray-700 truncate">${p.name}</h3>
            <div class="flex items-center gap-1 mt-1"><span class="font-bold text-sm">₹${p.price}</span><span class="text-[9px] text-green-600 font-bold">${p.discount}</span></div>
        </div>
    `).join('');
}

function addToCart(id) {
    const product = productsData.find(p => p.id === id);
    cart.push(product);
    renderCart();
    showToast("Added to your Cart!");
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
    showToast("Item Removed", "error");
}

function renderCart() {
    const container = document.getElementById('cartItemsContainer');
    const badge = document.getElementById('navCartBadge');
    
    // Update Badges
    document.getElementById('cartCount').textContent = cart.length;
    if(cart.length > 0) { badge.textContent = cart.length; badge.classList.remove('hidden'); } 
    else { badge.classList.add('hidden'); }

    let totalSellingPrice = 0;
    let totalMRP = 0;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center py-20 bg-white mt-1">
                <img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png" class="w-40 mb-4 opacity-50">
                <h3 class="font-medium text-gray-800">Your cart is empty!</h3>
                <p class="text-xs text-gray-500 mt-1">Add items to it now.</p>
                <button onclick="switchTab('homeView', document.querySelector('.nav-btn'))" class="mt-4 bg-blue-600 text-white px-8 py-2 rounded shadow text-sm font-medium">Shop Now</button>
            </div>`;
        document.getElementById('cartTotalText').textContent = `₹0`;
        document.getElementById('cartBottomMrp').textContent = ``;
        return;
    }

    container.innerHTML = cart.map((p, index) => {
        totalSellingPrice += p.price;
        totalMRP += p.mrp;
        return `
        <div class="bg-white border-b mt-2 animate-fade-in">
            ${p.tag ? `<div class="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-1 inline-block mt-2 ml-3 rounded">${p.tag}</div>` : ''}
            <div class="p-3 flex gap-3">
                <div class="w-20 shrink-0">
                    <img src="${p.image}" class="w-full object-contain border rounded p-1">
                </div>
                <div class="flex-1">
                    <h3 class="text-sm text-gray-800 line-clamp-2">${p.brand} ${p.name}</h3>
                    <p class="text-xs text-gray-500 mt-1">Size: ${p.size}</p>
                    <div class="flex items-end gap-2 mt-2">
                        <span class="text-green-600 font-bold text-sm">↓${p.discount}</span>
                        <span class="text-gray-400 line-through text-sm">₹${p.mrp}</span>
                        <span class="font-bold text-lg">₹${p.price}</span>
                    </div>
                </div>
            </div>
            <div class="flex border-t divide-x text-center text-sm font-medium text-gray-600">
                <button onclick="removeFromCart(${index})" class="flex-1 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors"><i class="far fa-trash-alt mr-1"></i> Remove</button>
                <button class="flex-1 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors"><i class="fas fa-bolt text-yellow-500 mr-1"></i> Buy This Now</button>
            </div>
        </div>
    `}).join('');

    // Append Price Details Breakdown
    const totalDiscount = totalMRP - totalSellingPrice;
    container.innerHTML += `
        <div class="bg-white p-4 mt-2 border-y mb-6">
            <h3 class="font-bold text-gray-500 border-b pb-2 mb-3 text-sm uppercase">Price Details</h3>
            <div class="flex justify-between text-sm mb-3 text-gray-700"><span>Price (${cart.length} items)</span><span>₹${totalMRP}</span></div>
            <div class="flex justify-between text-sm mb-3 text-gray-700"><span>Discount</span><span class="text-green-600">- ₹${totalDiscount}</span></div>
            <div class="flex justify-between text-sm mb-3 text-gray-700"><span>Delivery Charges</span><span class="text-green-600">FREE Delivery</span></div>
            <div class="flex justify-between text-base font-bold border-t border-dashed pt-3 mt-1"><span>Total Amount</span><span>₹${totalSellingPrice}</span></div>
            <p class="text-green-600 font-medium text-xs bg-green-50 p-2 rounded mt-4 text-center">You will save ₹${totalDiscount} on this order</p>
        </div>
    `;

    document.getElementById('cartTotalText').textContent = `₹${totalSellingPrice}`;
    document.getElementById('cartBottomMrp').textContent = `₹${totalMRP}`;
}

function openCheckout() {
    if(cart.length === 0) {
        showToast("Your cart is empty!", "error");
        return;
    }
    const saved = localStorage.getItem('flipstore_address');
    if(!saved) {
        showToast("Please add an address to continue", "error");
        openAddressForm();
        return;
    }
    showToast("Redirecting to Payment Gateway...");
}
