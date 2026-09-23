/* ═══════════════════════════════════════════
   SUGARCLOSET — Script Final + Qty Selector
   ═══════════════════════════════════════════ */

let currentCategory = 'all';
let currentSearch = '';
let currentSort = 'newest';
let cart = JSON.parse(localStorage.getItem('sugarcloset_cart') || '[]');
let favorites = JSON.parse(localStorage.getItem('sugarcloset_favs') || '[]');

// ─── Helpers ───
const formatRupiah = (num) => 'Rp ' + num.toLocaleString('id-ID');

const showToast = (msg) => {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
};

// ─── Floating ───
const initFloatingHearts = () => {
    const container = document.getElementById('floatingHearts');
    const emojis = ['💖', '🎀', '✨', '🌸', '💕', '🌈', '🦋', '💝'];
    for (let i = 0; i < 15; i++) {
        const s = document.createElement('span');
        s.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        s.style.left = Math.random() * 100 + '%';
        s.style.animationDuration = (12 + Math.random() * 15) + 's';
        s.style.animationDelay = (Math.random() * 10) + 's';
        s.style.fontSize = (14 + Math.random() * 18) + 'px';
        container.appendChild(s);
    }
};

// ─── Filter ───
const getFilteredProducts = () => {
    let f = [...PRODUCTS];
    if (currentCategory !== 'all') f = f.filter(p => p.category === currentCategory);
    if (currentSearch) {
        const q = currentSearch.toLowerCase();
        f = f.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.desc.toLowerCase().includes(q) ||
            p.tags.some(t => t.includes(q))
        );
    }
    switch (currentSort) {
        case 'cheap': f.sort((a, b) => a.price - b.price); break;
        case 'expensive': f.sort((a, b) => b.price - a.price); break;
        case 'popular': f.sort((a, b) => b.sold - a.sold); break;
        default: f.sort((a, b) => b.id - a.id);
    }
    return f;
};

// ─── Render Products ───
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
        const imageHTML = p.image
            ? `<img src="${p.image}" alt="${p.name}" class="product-photo">`
            : `<span class="product-emoji">${p.emoji}</span>`;
        return `
            <div class="product-card" style="animation-delay: ${i * 0.04}s" onclick="openProduct(${p.id})">
                <div class="product-image" style="background: linear-gradient(135deg, ${p.color}40, ${p.color}80);">
                    ${imageHTML}
                    <div class="product-badge">-${discount}%</div>
                    <button class="fav-toggle ${isFav ? 'active' : ''}"
                            onclick="event.stopPropagation(); toggleFav(${p.id}, this)">
                        ${isFav ? '💖' : '🤍'}
                    </button>
                </div>
                <div class="product-info">
                    <div class="product-name">${p.name}</div>
                    <div class="product-price-row">
                        <span class="product-price">${formatRupiah(p.price)}</span>
                        <span class="product-original">${formatRupiah(p.originalPrice)}</span>
                    </div>
                    <div class="product-meta">
                        <span>👤 ${p.seller}</span>
                        <span>⭐ ${p.rating}</span>
                    </div>
                    <button class="product-add" onclick="event.stopPropagation(); addToCart(${p.id})">
                        🛒 + Keranjang
                    </button>
                </div>
            </div>
        `;
    }).join('');
};

// ─── Product Modal ───
const openProduct = (id) => {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;
    const discount = Math.round((1 - p.price / p.originalPrice) * 100);
    const isFav = favorites.includes(p.id);

    document.getElementById('modalBody').innerHTML = `
        <div class="modal-hero" style="background: linear-gradient(135deg, ${p.color}60, ${p.color}90);">
            ${p.emoji}
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
                    ${isFav ? '💖 Favorit' : '🤍 Simpan'}
                </button>
                <button class="btn btn-primary" onclick="addToCart(${p.id}); closeModal('productModal');">
                    🛒 Keranjang
                </button>
            </div>
            <div style="margin-top: 10px;">
                <a href="https://wa.me/${SHOP_INFO.phone}?text=${encodeURIComponent('Halo kak, saya mau tanya: ' + p.name)}"
                   target="_blank" class="btn btn-wa btn-full">
                    💬 Tanya Penjual
                </a>
            </div>
        </div>
    `;
    document.getElementById('productModal').classList.add('open');
};

const closeModal = (id) => document.getElementById(id).classList.remove('open');

// ─── Favorites ───
const toggleFav = (id, btn) => {
    const idx = favorites.indexOf(id);
    if (idx > -1) {
        favorites.splice(idx, 1);
        if (btn) { btn.textContent = '🤍'; btn.classList.remove('active'); }
        showToast('💔 Dihapus dari favorit');
    } else {
        favorites.push(id);
        if (btn) { btn.textContent = '💖'; btn.classList.add('active'); }
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

// ─── Cart ───
const addToCart = (id) => {
    const ex = cart.find(x => x.id === id);
    if (ex) ex.qty = (ex.qty || 1) + 1;
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

const changeQty = (id, delta) => {
    const item = cart.find(x => x.id === id);
    if (!item) return;
    item.qty = (item.qty || 1) + delta;
    if (item.qty < 1) {
        removeFromCart(id);
        return;
    }
    saveCart();
    updateBadges();
    renderCart();
};

const saveCart = () => localStorage.setItem('sugarcloset_cart', JSON.stringify(cart));

const renderCart = () => {
    const c = document.getElementById('cartItems');
    const t = document.getElementById('cartTotal');

    if (cart.length === 0) {
        c.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon">🛒</div>
                <p>Keranjangmu masih kosong</p>
                <p style="font-size:12px; margin-top:6px;">Yuk pilih barang cantik dulu~</p>
            </div>`;
        t.textContent = 'Rp 0';
        return;
    }

    let total = 0;
    c.innerHTML = cart.map(item => {
        const p = PRODUCTS.find(x => x.id === item.id);
        if (!p) return '';
        const qty = item.qty || 1;
        total += p.price * qty;
        return `
            <div class="cart-item">
                <div class="cart-item-img" style="background: ${p.color}60;">${p.emoji}</div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${p.name}</div>
                    <div class="cart-item-price">${formatRupiah(p.price)} × ${qty}</div>
                </div>
                <div class="qty-selector">
                    <button class="qty-btn" onclick="changeQty(${p.id}, -1)">−</button>
                    <span class="qty-value">${qty}</span>
                    <button class="qty-btn" onclick="changeQty(${p.id}, 1)">+</button>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${p.id})">🗑️</button>
            </div>`;
    }).join('');
    t.textContent = formatRupiah(total);
};

// ─── Checkout ───
const checkout = () => {
    if (cart.length === 0) { showToast('🛒 Keranjang masih kosong!'); return; }
    let msg = 'Halo kak! Saya mau pesan:\n\n';
    let total = 0;
    cart.forEach(item => {
        const p = PRODUCTS.find(x => x.id === item.id);
        if (p) {
            const qty = item.qty || 1;
            msg += `• ${p.name}\n  ${formatRupiah(p.price)} × ${qty} = ${formatRupiah(p.price * qty)}\n\n`;
            total += p.price * qty;
        }
    });
    msg += `💰 *Total: ${formatRupiah(total)}*\n\nMohon konfirmasi ketersediaan ya, terima kasih!`;
    window.open(`https://wa.me/${SHOP_INFO.phone}?text=${encodeURIComponent(msg)}`, '_blank');
};

// ─── Badges ───
const updateBadges = () => {
    document.getElementById('favCount').textContent = favorites.length;
    const total = cart.reduce((s, x) => s + (x.qty || 1), 0);
    document.getElementById('cartCount').textContent = total;
};

// ─── Fav Modal ───
const renderFavModal = () => {
    const c = document.getElementById('favItems');
    if (favorites.length === 0) {
        c.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon">💔</div>
                <p>Belum ada favorit</p>
                <p style="font-size:12px; margin-top:6px;">Tap 🤍 di produk untuk simpan~</p>
            </div>`;
        return;
    }
    c.innerHTML = favorites.map(id => {
        const p = PRODUCTS.find(x => x.id === id);
        if (!p) return '';
        return `
            <div class="cart-item">
                <div class="cart-item-img" style="background: ${p.color}60;">${p.emoji}</div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${p.name}</div>
                    <div class="cart-item-price">${formatRupiah(p.price)}</div>
                </div>
                <button class="cart-item-remove" onclick="toggleFav(${p.id}); renderFavModal(); renderProducts();">💔</button>
            </div>`;
    }).join('');
};

// ─── Events ───
const initEvents = () => {
    document.getElementById('searchInput').addEventListener('input', e => {
        currentSearch = e.target.value;
        renderProducts();
    });

    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.cat;
            renderProducts();
        });
    });

    // Custom dropdown sort
    const sortWrapper = document.getElementById('sortWrapper');
    const sortBtn = document.getElementById('sortBtn');
    const sortLabel = document.getElementById('sortLabel');

    if (sortBtn) {
        sortBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sortWrapper.classList.toggle('open');
        });

        document.querySelectorAll('.custom-select-option').forEach(opt => {
            opt.addEventListener('click', () => {
                document.querySelectorAll('.custom-select-option').forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                currentSort = opt.dataset.value;
                sortLabel.textContent = opt.textContent;
                sortWrapper.classList.remove('open');
                renderProducts();
            });
        });

        document.addEventListener('click', (e) => {
            if (!sortWrapper.contains(e.target)) sortWrapper.classList.remove('open');
        });
    }

    document.getElementById('cartBtn').addEventListener('click', () => {
        renderCart();
        document.getElementById('cartModal').classList.add('open');
    });

    document.getElementById('favBtn').addEventListener('click', () => {
        renderFavModal();
        document.getElementById('favModal').classList.add('open');
    });

    document.getElementById('modalClose').addEventListener('click', () => closeModal('productModal'));
    document.getElementById('cartClose').addEventListener('click', () => closeModal('cartModal'));
    document.getElementById('favClose').addEventListener('click', () => closeModal('favModal'));

    document.querySelectorAll('.modal').forEach(m => {
        m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') document.querySelectorAll('.modal').forEach(m => m.classList.remove('open'));
    });

    document.getElementById('checkoutBtn').addEventListener('click', checkout);

    document.getElementById('menuBtn').addEventListener('click', () => {
        document.querySelector('.nav').classList.toggle('open');
    });

    document.querySelectorAll('.nav-link').forEach(l => {
        l.addEventListener('click', () => document.querySelector('.nav').classList.remove('open'));
    });
};

// ─── Bikin fungsi bisa dipanggil dari HTML ───
window.changeQty = changeQty;
window.removeFromCart = removeFromCart;
window.addToCart = addToCart;
window.toggleFav = toggleFav;
window.toggleFavFromModal = toggleFavFromModal;
window.openProduct = openProduct;
window.closeModal = closeModal;

// ─── Init ───
document.addEventListener('DOMContentLoaded', () => {
    initFloatingHearts();
    initEvents();
    updateBadges();
    renderProducts();
    console.log('🎀 Sugarcloset loaded');
});
