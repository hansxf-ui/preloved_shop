/* ═══════════════════════════════════════════
   SUGARCLOSET — Interactive Script (SVG Edition)
   ═══════════════════════════════════════════ */

let currentCategory = 'all';
let currentSearch = '';
let currentSort = 'newest';
let cart = JSON.parse(localStorage.getItem('sugarcloset_cart') || '[]');
let favorites = JSON.parse(localStorage.getItem('sugarcloset_favs') || '[]');

// ═══ Helpers ═══
const formatRupiah = (num) => 'Rp ' + num.toLocaleString('id-ID');

const svg = (name, cls = '') => {
    const s = ICONS[name] || '';
    return cls ? s.replace('<svg ', `<svg class="${cls}" `) : s;
};

const showToast = (msg) => {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
};

// ═══ Render semua elemen [data-icon] jadi SVG ═══
const renderDataIcons = () => {
    document.querySelectorAll('[data-icon]').forEach(el => {
        const name = el.dataset.icon;
        if (ICONS[name]) {
            el.innerHTML = ICONS[name];
            el.classList.add('svg-icon');
        }
    });
};

// ═══ Floating Icons ═══
const initFloatingHearts = () => {
    const container = document.getElementById('floatingHearts');
    const iconNames = ['heart', 'sparkle', 'ribbon', 'flower', 'star', 'rainbow'];
    const colors = ['#FFB6D9', '#C5B3FF', '#B3FFD9', '#FFC9A8', '#FFE9B3', '#FFD9F2'];
    
    for (let i = 0; i < 15; i++) {
        const span = document.createElement('span');
        span.className = 'floating-icon';
        span.innerHTML = ICONS[iconNames[Math.floor(Math.random() * iconNames.length)]];
        span.style.left = Math.random() * 100 + '%';
        span.style.animationDuration = (12 + Math.random() * 15) + 's';
        span.style.animationDelay = (Math.random() * 10) + 's';
        span.style.width = (16 + Math.random() * 20) + 'px';
        span.style.height = span.style.width;
        span.style.color = colors[Math.floor(Math.random() * colors.length)];
        container.appendChild(span);
    }
};

// ═══ Render Products ═══
const getFilteredProducts = () => {
    let filtered = [...PRODUCTS];
    if (currentCategory !== 'all') filtered = filtered.filter(p => p.category === currentCategory);
    if (currentSearch) {
        const q = currentSearch.toLowerCase();
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.desc.toLowerCase().includes(q) ||
            p.tags.some(t => t.includes(q))
        );
    }
    switch (currentSort) {
        case 'cheap': filtered.sort((a, b) => a.price - b.price); break;
        case 'expensive': filtered.sort((a, b) => b.price - a.price); break;
        case 'popular': filtered.sort((a, b) => b.sold - a.sold); break;
        default: filtered.sort((a, b) => b.id - a.id);
    }
    return filtered;
};

const renderProducts = () => {
    const grid = document.getElementById('productGrid');
    const empty = document.getElementById('emptyState');
    const products = getFilteredProducts();
    
    if (products.length === 0) {
        grid.innerHTML = '';
        empty.style.display = 'block';
        return;
    }
    empty.style.display = 'none';
    
    grid.innerHTML = products.map((p, i) => {
        const discount = Math.round((1 - p.price / p.originalPrice) * 100);
        const isFav = favorites.includes(p.id);
        const iconName = PRODUCT_ICONS[p.image] || 'productGeneric';
        
        return `
            <div class="product-card" style="animation-delay: ${i * 0.05}s" onclick="openProduct(${p.id})">
                <div class="product-image" style="background: linear-gradient(135deg, ${p.color}40, ${p.color}80); color: ${p.color};">
                    <div class="product-svg">${svg(iconName)}</div>
                    <div class="product-badge">-${discount}%</div>
                    <button class="fav-toggle ${isFav ? 'active' : ''}" 
                            onclick="event.stopPropagation(); toggleFav(${p.id}, this)"
                            style="color: ${isFav ? '#FF8FB8' : '#B8A8BE'};">
                        ${isFav ? svg('heart') : svg('heartOutline')}
                    </button>
                </div>
                <div class="product-info">
                    <div class="product-name">${p.name}</div>
                    <div class="product-price-row">
                        <span class="product-price">${formatRupiah(p.price)}</span>
                        <span class="product-original">${formatRupiah(p.originalPrice)}</span>
                    </div>
                    <div class="product-meta">
                        <span class="product-seller">👤 ${p.seller}</span>
                        <span>${svg('star', 'inline-star')} ${p.rating}</span>
                    </div>
                    <button class="product-add" onclick="event.stopPropagation(); addToCart(${p.id})">
                        ${svg('cart', 'btn-icon')} + Keranjang
                    </button>
                </div>
            </div>
        `;
    }).join('');
};

// ═══ Product Modal ═══
const openProduct = (id) => {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;
    const discount = Math.round((1 - p.price / p.originalPrice) * 100);
    const isFav = favorites.includes(p.id);
    const iconName = PRODUCT_ICONS[p.image] || 'productGeneric';
    
    document.getElementById('modalBody').innerHTML = `
        <div class="modal-hero" style="background: linear-gradient(135deg, ${p.color}60, ${p.color}90); color: ${p.color};">
            <div class="modal-svg">${svg(iconName)}</div>
        </div>
        <div class="modal-info">
            <span class="modal-cat">${p.category.toUpperCase()}</span>
            <h2 class="modal-name">${p.name}</h2>
            <div class="modal-price-row">
                <span class="modal-price">${formatRupiah(p.price)}</span>
                <span class="modal-original">${formatRupiah(p.originalPrice)}</span>
                <span class="modal-discount">-${discount}%</span>
            </div>
            <p class="modal-desc">${p.desc}</p>
            <div class="modal-meta">
                <div class="modal-meta-item"><strong>Kondisi</strong>${p.condition}</div>
                <div class="modal-meta-item"><strong>Stok</strong>${p.stock} tersedia</div>
                <div class="modal-meta-item"><strong>Penjual</strong>${p.seller}</div>
                <div class="modal-meta-item"><strong>Terjual</strong>${p.sold} kali</div>
            </div>
            <div class="modal-actions">
                <button class="btn btn-secondary" onclick="toggleFavFromModal(${p.id})">
                    ${isFav ? svg('heart') : svg('heartOutline')} ${isFav ? 'Favorit' : 'Simpan'}
                </button>
                <button class="btn btn-primary" onclick="addToCart(${p.id}); closeModal('productModal');">
                    ${svg('cart', 'btn-icon')} Keranjang
                </button>
            </div>
            <div style="margin-top: 12px;">
                <a href="https://wa.me/${SHOP_INFO.phone}?text=${encodeURIComponent('Halo kak, saya mau tanya: ' + p.name)}" 
                   target="_blank" class="btn btn-wa btn-full">
                    ${svg('whatsapp', 'btn-icon')} Tanya Penjual
                </a>
            </div>
        </div>
    `;
    document.getElementById('productModal').classList.add('open');
};

const closeModal = (id) => document.getElementById(id).classList.remove('open');

// ═══ Favorites ═══
const toggleFav = (id, btn) => {
    const idx = favorites.indexOf(id);
    if (idx > -1) {
        favorites.splice(idx, 1);
        if (btn) { btn.innerHTML = svg('heartOutline'); btn.classList.remove('active'); btn.style.color = '#B8A8BE'; }
        showToast('💔 Dihapus dari favorit');
    } else {
        favorites.push(id);
        if (btn) { btn.innerHTML = svg('heart'); btn.classList.add('active'); btn.style.color = '#FF8FB8'; }
        showToast('💖 Ditambahkan ke favorit');
    }
    saveFavs();
    updateBadges();
};

const toggleFavFromModal = (id) => {
    const idx = favorites.indexOf(id);
    if (idx > -1) { favorites.splice(idx, 1); showToast('💔 Dihapus dari favorit'); }
    else { favorites.push(id); showToast('💖 Ditambahkan ke favorit'); }
    saveFavs();
    updateBadges();
    renderProducts();
    openProduct(id);
};

const saveFavs = () => localStorage.setItem('sugarcloset_favs', JSON.stringify(favorites));

// ═══ Cart ═══
const addToCart = (id) => {
    const existing = cart.find(x => x.id === id);
    if (existing) existing.qty = (existing.qty || 1) + 1;
    else cart.push({ id, qty: 1 });
    saveCart();
    updateBadges();
    showToast('🛒 Ditambahkan ke keranjang!');
};

const removeFromCart = (id) => {
    cart = cart.filter(x => x.id !== id);
    saveCart();
    updateBadges();
    renderCart();
    showToast('🗑️ Dihapus dari keranjang');
};

const saveCart = () => localStorage.setItem('sugarcloset_cart', JSON.stringify(cart));

const renderCart = () => {
    const container = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon svg-icon-large">${svg('cart')}</div>
                <p>Keranjangmu masih kosong</p>
                <p style="font-size:13px; margin-top:8px;">Yuk pilih barang cantik dulu~</p>
            </div>`;
        totalEl.textContent = 'Rp 0';
        return;
    }
    
    let total = 0;
    container.innerHTML = cart.map(item => {
        const p = PRODUCTS.find(x => x.id === item.id);
        if (!p) return '';
        const qty = item.qty || 1;
        total += p.price * qty;
        const iconName = PRODUCT_ICONS[p.image] || 'productGeneric';
        
        return `
            <div class="cart-item">
                <div class="cart-item-img" style="background: ${p.color}60; color: ${p.color};">${svg(iconName)}</div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${p.name}</div>
                    <div class="cart-item-price">${formatRupiah(p.price)} × ${qty}</div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${p.id})">${svg('trash')}</button>
            </div>`;
    }).join('');
    
    totalEl.textContent = formatRupiah(total);
};

// ═══ Checkout ═══
const checkout = () => {
    if (cart.length === 0) { showToast('🛒 Keranjang masih kosong!'); return; }
    let message = 'Halo kak! Saya mau pesan:\n\n';
    let total = 0;
    cart.forEach(item => {
        const p = PRODUCTS.find(x => x.id === item.id);
        if (p) {
            const qty = item.qty || 1;
            message += `• ${p.name}\n  ${formatRupiah(p.price)} × ${qty} = ${formatRupiah(p.price * qty)}\n\n`;
            total += p.price * qty;
        }
    });
    message += `💰 *Total: ${formatRupiah(total)}*\n\nMohon konfirmasi ketersediaan ya, terima kasih!`;
    window.open(`https://wa.me/${SHOP_INFO.phone}?text=${encodeURIComponent(message)}`, '_blank');
};

// ═══ Badges ═══
const updateBadges = () => {
    document.getElementById('favCount').textContent = favorites.length;
    const totalQty = cart.reduce((sum, x) => sum + (x.qty || 1), 0);
    document.getElementById('cartCount').textContent = totalQty;
};

// ═══ Fav Modal ═══
const renderFavModal = () => {
    const container = document.getElementById('favItems');
    if (favorites.length === 0) {
        container.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon svg-icon-large">${svg('heartOutline')}</div>
                <p>Belum ada favorit</p>
                <p style="font-size:13px; margin-top:8px;">Tap hati di produk untuk simpan~</p>
            </div>`;
        return;
    }
    container.innerHTML = favorites.map(id => {
        const p = PRODUCTS.find(x => x.id === id);
        if (!p) return '';
        const iconName = PRODUCT_ICONS[p.image] || 'productGeneric';
        return `
            <div class="cart-item">
                <div class="cart-item-img" style="background: ${p.color}60; color: ${p.color};">${svg(iconName)}</div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${p.name}</div>
                    <div class="cart-item-price">${formatRupiah(p.price)}</div>
                </div>
                <button class="cart-item-remove" onclick="toggleFav(${p.id}); renderFavModal(); renderProducts();">${svg('trash')}</button>
            </div>`;
    }).join('');
};

// ═══ Events ═══
const initEvents = () => {
    document.getElementById('searchInput').addEventListener('input', (e) => {
        currentSearch = e.target.value; renderProducts();
    });
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.cat;
            renderProducts();
        });
    });
    document.getElementById('sortSelect').addEventListener('change', (e) => {
        currentSort = e.target.value; renderProducts();
    });
    document.getElementById('cartBtn').addEventListener('click', () => {
        renderCart(); document.getElementById('cartModal').classList.add('open');
    });
    document.getElementById('favBtn').addEventListener('click', () => {
        renderFavModal(); document.getElementById('favModal').classList.add('open');
    });
    document.getElementById('modalClose').addEventListener('click', () => closeModal('productModal'));
    document.getElementById('cartClose').addEventListener('click', () => closeModal('cartModal'));
    document.getElementById('favClose').addEventListener('click', () => closeModal('favModal'));
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') document.querySelectorAll('.modal').forEach(m => m.classList.remove('open'));
    });
    document.getElementById('checkoutBtn').addEventListener('click', checkout);
    document.getElementById('menuBtn').addEventListener('click', () => {
        document.querySelector('.nav').classList.toggle('open');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => document.querySelector('.nav').classList.remove('open'));
    });
};

// ═══ Init ═══
document.addEventListener('DOMContentLoaded', () => {
    renderDataIcons();
    initFloatingHearts();
    initEvents();
    updateBadges();
    renderProducts();
    console.log('%c🎀 Sugarcloset loaded (SVG Edition)!', 'color: #FF8FB8; font-size: 18px; font-weight: bold;');
});
