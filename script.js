/* ═══════════════════════════════════════════
   SUGARCLOSET — Script Final (Paket D)
   ═══════════════════════════════════════════ */

let currentCategory = 'all';
let currentSearch = '';
let currentSort = 'newest';
let cart = JSON.parse(localStorage.getItem('sugarcloset_cart') || '[]');
let favorites = JSON.parse(localStorage.getItem('sugarcloset_favs') || '[]');
let reviews = JSON.parse(localStorage.getItem('sugarcloset_reviews') || '{}');
let searchHistory = JSON.parse(localStorage.getItem('sugarcloset_search_history') || '[]');

// ─── Helpers ───
const formatRupiah = (num) => 'Rp ' + num.toLocaleString('id-ID');

// Escape HTML untuk mencegah XSS dari data produk/ulasan/pencarian
const escapeHTML = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));

const showToast = (msg) => {
    const toast = document.getElementById('toast');
    toast.innerHTML = msg;
    toast.classList.add('show');
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
};

const getProductReviews = (id) => reviews[id] || [];
const getProductRating = (id) => {
    const list = getProductReviews(id);
    if (list.length === 0) return null;
    const avg = list.reduce((s, r) => s + r.rating, 0) / list.length;
    return { avg: avg.toFixed(1), count: list.length };
};

// ─── Floating ───
const initFloatingHearts = () => {
    const container = document.getElementById('floatingHearts');
    const icons = ['heart', 'ribbon', 'sparkle', 'flower', 'rainbow', 'star'];
    const colors = ['#FF8FB3', '#FFB6D9', '#FFD1E3', '#F9A8D4', '#FF9EBB'];
    for (let i = 0; i < 15; i++) {
        const s = document.createElement('span');
        s.innerHTML = icon(icons[Math.floor(Math.random() * icons.length)], 'svg-ic');
        s.style.left = Math.random() * 100 + '%';
        s.style.animationDuration = (12 + Math.random() * 15) + 's';
        s.style.animationDelay = (Math.random() * 10) + 's';
        const sz = Math.round(14 + Math.random() * 18);
        s.style.width = sz + 'px';
        s.style.height = sz + 'px';
        s.style.color = colors[Math.floor(Math.random() * colors.length)];
        container.appendChild(s);
    }
};

// ─── Search History ───
const saveSearchHistory = (query) => {
    if (!query || query.length < 2) return;
    searchHistory = searchHistory.filter(q => q.toLowerCase() !== query.toLowerCase());
    searchHistory.unshift(query);
    searchHistory = searchHistory.slice(0, 8);
    localStorage.setItem('sugarcloset_search_history', JSON.stringify(searchHistory));
};

const renderSearchHistory = () => {
    const el = document.getElementById('searchHistory');
    if (!el) return;
    if (searchHistory.length === 0) {
        el.classList.remove('show');
        return;
    }
    el.innerHTML = `
        <div class="history-head">
            <span>${icon('clock', 'svg-ic')} Pencarian Terakhir</span>
            <button class="history-clear" id="historyClear">Hapus</button>
        </div>
        ${searchHistory.map(q => `
            <div class="history-item" data-q="${escapeHTML(q)}">
                <span class="history-icon">${icon('search', 'svg-ic')}</span>
                <span>${escapeHTML(q)}</span>
            </div>
        `).join('')}
    `;
    el.classList.add('show');
    el.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', () => applySearchHistory(item.dataset.q));
    });
    const clear = document.getElementById('historyClear');
    if (clear) clear.addEventListener('click', (e) => {
        e.stopPropagation();
        searchHistory = [];
        localStorage.removeItem('sugarcloset_search_history');
        el.classList.remove('show');
        showToast(icon('trash', 'svg-ic') + ' Riwayat pencarian dibersihkan');
    });
};

const applySearchHistory = (q) => {
    document.getElementById('searchInput').value = q;
    currentSearch = q;
    renderProducts();
    document.getElementById('searchHistory').classList.remove('show');
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
        const soldOut = (p.stock || 0) < 1;
        const ratingData = getProductRating(p.id);
        const ratingDisplay = ratingData
            ? `${ratingData.avg} (${ratingData.count})`
            : `${p.rating}`;
        const imageHTML = p.image
            ? `<img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}" class="product-photo" loading="lazy">`
            : productPlaceholder(p.category);
        return `
            <div class="product-card ${soldOut ? 'is-soldout' : ''}" style="animation-delay: ${i * 0.04}s" onclick="openProduct(${p.id})">
                <div class="product-image" style="background: linear-gradient(135deg, ${p.color}40, ${p.color}80);">
                    ${imageHTML}
                    ${soldOut
                        ? `<div class="product-badge soldout">Stok Habis</div>`
                        : `<div class="product-badge">-${discount}%</div>`}
                    <button class="fav-toggle ${isFav ? 'active' : ''}"
                            onclick="event.stopPropagation(); toggleFav(${p.id}, this)">
                        ${icon(isFav ? 'heart' : 'heartOutline', 'svg-ic')}
                    </button>
                </div>
                <div class="product-info">
                    <div class="product-name">${escapeHTML(p.name)}</div>
                    <div class="product-price-row">
                        <span class="product-price">${formatRupiah(p.price)}</span>
                        <span class="product-original">${formatRupiah(p.originalPrice)}</span>
                    </div>
                    <div class="product-meta">
                        <span>${icon('user', 'svg-ic')} ${escapeHTML(p.seller)}</span>
                        <span>${icon('star', 'svg-ic star-gold')} ${ratingDisplay}</span>
                    </div>
                    <button class="product-add" ${soldOut ? 'disabled' : ''} onclick="event.stopPropagation(); addToCart(${p.id})">
                        ${soldOut ? 'Stok Habis' : icon('cart', 'svg-ic') + ' + Keranjang'}
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
    const soldOut = (p.stock || 0) < 1;
    const modalImage = p.image
        ? `<img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}" class="modal-photo">`
        : productPlaceholder(p.category);

    // Related products — sama kategori, exclude yg ini
    const related = PRODUCTS
        .filter(x => x.category === p.category && x.id !== p.id)
        .slice(0, 3);

    // Reviews
    const productReviews = getProductReviews(p.id);
    const ratingData = getProductRating(p.id);
    const avgRating = ratingData ? ratingData.avg : p.rating;
    const reviewCount = ratingData ? ratingData.count : 0;

    const reviewsHTML = productReviews.length > 0
        ? productReviews.map(r => `
            <div class="review-item">
                <div class="review-head">
                    <span class="review-name">${escapeHTML(r.name)}</span>
                    <span class="review-stars">${icon('star', 'svg-ic star-gold').repeat(Math.min(5, Math.max(1, r.rating | 0)))}</span>
                    <span class="review-date">${escapeHTML(r.date)}</span>
                </div>
                <p class="review-text">${escapeHTML(r.text)}</p>
            </div>
        `).join('')
        : `<p class="review-empty">Belum ada ulasan. Jadilah yang pertama! ${icon('star', 'svg-ic star-gold')}</p>`;

    const relatedHTML = related.length > 0
        ? related.map(rp => `
            <div class="related-card" onclick="openProduct(${rp.id})">
                <div class="related-img" style="background: ${rp.color}60;">
                    ${rp.image ? `<img src="${escapeHTML(rp.image)}" alt="${escapeHTML(rp.name)}" loading="lazy" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">` : productPlaceholder(rp.category)}
                </div>
                <div class="related-name">${escapeHTML(rp.name)}</div>
                <div class="related-price">${formatRupiah(rp.price)}</div>
            </div>
        `).join('')
        : '';

    document.getElementById('modalBody').innerHTML = `
        <div class="modal-hero" style="background: linear-gradient(135deg, ${p.color}60, ${p.color}90);">
            ${modalImage}
        </div>
        <div class="modal-info">
            <span class="modal-cat">${escapeHTML(p.category).toUpperCase()}</span>
            <h2 class="modal-name">${escapeHTML(p.name)}</h2>

            <div class="modal-rating-row">
                <span class="modal-stars">${icon('star', 'svg-ic star-gold').repeat(Math.round(avgRating))}</span>
                <span class="modal-rating-text">${avgRating} · ${reviewCount > 0 ? reviewCount + ' ulasan' : 'belum ada ulasan'}</span>
            </div>

            <div class="modal-price-row">
                <span class="modal-price">${formatRupiah(p.price)}</span>
                <span class="modal-original">${formatRupiah(p.originalPrice)}</span>
                <span class="modal-discount">-${discount}%</span>
            </div>
            <p class="modal-desc">${escapeHTML(p.desc)}</p>
            <div class="modal-meta">
                <div class="modal-meta-item"><strong>Kondisi</strong>${escapeHTML(p.condition)}</div>
                <div class="modal-meta-item"><strong>Stok</strong>${soldOut ? 'Habis' : p.stock + ' tersedia'}</div>
                <div class="modal-meta-item"><strong>Penjual</strong>${escapeHTML(p.seller)}</div>
                <div class="modal-meta-item"><strong>Terjual</strong>${p.sold} kali</div>
            </div>
            <div class="modal-actions">
                <button class="btn btn-secondary" onclick="toggleFavFromModal(${p.id})">
                    ${icon(isFav ? 'heart' : 'heartOutline', 'svg-ic') + (isFav ? ' Favorit' : ' Simpan')}
                </button>
                <button class="btn btn-secondary" onclick="shareProduct(${p.id})">
                    ${icon('linkIcon', 'svg-ic')} Bagikan
                </button>
                <button class="btn btn-wa" onclick="shareToWhatsApp(${p.id})">
                    ${icon('whatsapp', 'svg-ic')} WhatsApp
                </button>
            </div>
            <div class="modal-actions" style="margin-top: 8px;">
                <button class="btn btn-primary" style="flex: 1;" ${soldOut ? 'disabled' : ''} onclick="addToCart(${p.id}); ${soldOut ? '' : "closeModal('productModal');"}">
                    ${soldOut ? 'Stok Habis' : icon('cart', 'svg-ic') + ' + Keranjang'}
                </button>
            </div>
            <div style="margin-top: 10px;">
                <a href="https://wa.me/${SHOP_INFO.phone}?text=${encodeURIComponent('Halo kak, saya mau tanya: ' + p.name)}"
                   target="_blank" class="btn btn-wa btn-full">
                    ${icon('whatsapp', 'svg-ic')} Tanya Penjual
                </a>
            </div>

            ${relatedHTML ? `
            <div class="related-section">
                <h3 class="related-title">${icon('sparkle', 'svg-ic')} Produk Serupa</h3>
                <div class="related-grid">${relatedHTML}</div>
            </div>
            ` : ''}

            <div class="reviews-section">
                <h3 class="reviews-title">${icon('chat', 'svg-ic')} Ulasan Pembeli (${reviewCount})</h3>
                <div class="reviews-list">${reviewsHTML}</div>
                <button class="btn btn-secondary btn-full" style="margin-top: 12px;" onclick="openReviewForm(${p.id})">
                    ${icon('pencil', 'svg-ic')} Tulis Ulasan
                </button>
            </div>
        </div>
    `;
    document.getElementById('productModal').classList.add('open');
};

const closeModal = (id) => {
    document.getElementById(id).classList.remove('open');
    if (id === 'productModal') clearDeepLink();
};

// ─── Open Review Form ───
const openReviewForm = (productId) => {
    const p = PRODUCTS.find(x => x.id === productId);
    if (!p) return;

    document.getElementById('modalBody').innerHTML = `
        <div class="modal-info" style="padding-top: 40px;">
            <button class="btn btn-secondary" style="margin-bottom: 16px;" onclick="openProduct(${productId})">
                ← Kembali ke ${p.name}
            </button>
            <h2 class="modal-name" style="margin-bottom: 8px;">${icon('pencil', 'svg-ic')} Tulis Ulasan</h2>
            <p class="modal-desc" style="margin-bottom: 20px;">Bagikan pengalamanmu tentang produk ini.</p>

            <form id="reviewForm" class="checkout-form">
                <div class="form-row">
                    <label>Nama Kamu *</label>
                    <input type="text" id="rName" required placeholder="Contoh: Rina A.">
                </div>
                <div class="form-row">
                    <label>Rating *</label>
                    <div class="star-picker" id="starPicker">
                        <span class="star" data-value="1">${icon('star', 'svg-ic')}</span>
                        <span class="star" data-value="2">${icon('star', 'svg-ic')}</span>
                        <span class="star" data-value="3">${icon('star', 'svg-ic')}</span>
                        <span class="star" data-value="4">${icon('star', 'svg-ic')}</span>
                        <span class="star" data-value="5">${icon('star', 'svg-ic')}</span>
                    </div>
                </div>
                <div class="form-row">
                    <label>Ulasan *</label>
                    <textarea id="rText" required rows="4" placeholder="Ceritakan pengalamanmu..."></textarea>
                </div>
                <div class="checkout-actions">
                    <button type="button" class="btn btn-secondary" onclick="openProduct(${productId})">Batal</button>
                    <button type="submit" class="btn btn-primary">${icon('check', 'svg-ic')} Kirim Ulasan</button>
                </div>
            </form>
        </div>
    `;

    let selectedRating = 5;
    const stars = document.querySelectorAll('#starPicker .star');
    const updateStars = (rating) => {
        stars.forEach((s, i) => {
            s.classList.toggle('active', i < rating);
            s.classList.toggle('dim', i >= rating);
        });
    };
    updateStars(selectedRating);

    stars.forEach((s, i) => {
        s.addEventListener('click', () => {
            selectedRating = i + 1;
            updateStars(selectedRating);
        });
    });

    document.getElementById('reviewForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('rName').value.trim();
        const text = document.getElementById('rText').value.trim();
        if (!name || !text) return;

        if (!reviews[productId]) reviews[productId] = [];
        reviews[productId].unshift({
            name,
            rating: selectedRating,
            text,
            date: 'Baru saja'
        });
        localStorage.setItem('sugarcloset_reviews', JSON.stringify(reviews));

        showToast(icon('star', 'svg-ic star-gold') + ' Ulasan terkirim! Terima kasih');
        renderProducts();
        openProduct(productId);
    });
};

// ─── Share ───
const shareProduct = async (id) => {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;
    const url = window.location.origin + window.location.pathname + '#product-' + id;
    const text = `${p.name} - ${formatRupiah(p.price)}

Lihat di Sugarcloset:
${url}`;
    if (navigator.share) {
        try { await navigator.share({ title: p.name, text, url }); return; } catch (e) {}
    }
    try {
        await navigator.clipboard.writeText(text);
        showToast(icon('linkIcon', 'svg-ic') + ' Link disalin!');
    } catch (e) {
        prompt('Copy link ini:', text);
    }
};

// ─── Share to WhatsApp ───
const buildWhatsAppShareUrl = (p, baseUrl) => {
    const url = baseUrl + '#product-' + p.id;
    const text = `${p.name} - ${formatRupiah(p.price)}\n\nLihat di Sugarcloset:\n${url}`;
    return 'https://wa.me/?text=' + encodeURIComponent(text);
};
const shareToWhatsApp = (id) => {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;
    window.open(buildWhatsAppShareUrl(p, window.location.origin + window.location.pathname), '_blank');
};

// ─── Favorites ───
const toggleFav = (id, btn) => {
    const idx = favorites.indexOf(id);
    if (idx > -1) {
        favorites.splice(idx, 1);
        if (btn) { btn.innerHTML = icon('heartOutline', 'svg-ic'); btn.classList.remove('active'); }
        showToast(icon('heartOutline', 'svg-ic') + ' Dihapus dari favorit');
    } else {
        favorites.push(id);
        if (btn) { btn.innerHTML = icon('heart', 'svg-ic'); btn.classList.add('active'); }
        showToast(icon('heart', 'svg-ic') + ' Ditambahkan ke favorit');
    }
    saveFavs();
    updateBadges();
};

const toggleFavFromModal = (id) => {
    const idx = favorites.indexOf(id);
    if (idx > -1) { favorites.splice(idx, 1); showToast(icon('heartOutline', 'svg-ic') + ' Dihapus'); }
    else { favorites.push(id); showToast(icon('heart', 'svg-ic') + ' Ditambahkan'); }
    saveFavs();
    updateBadges();
    renderProducts();
    openProduct(id);
};

const saveFavs = () => localStorage.setItem('sugarcloset_favs', JSON.stringify(favorites));

// ─── Cart ───
// Buang item keranjang yang produknya sudah tidak ada (mis. dihapus admin)
const cleanCart = () => {
    const before = cart.length;
    cart = cart.filter(x => PRODUCTS.some(p => p.id === x.id));
    if (cart.length !== before) saveCart();
};

const addToCart = (id) => {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;
    if ((p.stock || 0) < 1) { showToast(icon('box', 'svg-ic') + ' Yah, stoknya habis!'); return; }
    const ex = cart.find(x => x.id === id);
    const cur = ex ? (ex.qty || 1) : 0;
    if (cur + 1 > p.stock) { showToast(icon('box', 'svg-ic') + ` Stok cuma ${p.stock}, tidak bisa tambah lagi`); return; }
    if (ex) ex.qty = cur + 1;
    else cart.push({ id, qty: 1 });
    saveCart();
    updateBadges();
    showToast(icon('cart', 'svg-ic') + ' Ditambahkan ke keranjang!');
};

const removeFromCart = (id) => {
    cart = cart.filter(x => x.id !== id);
    saveCart();
    updateBadges();
    renderCart();
    showToast(icon('trash', 'svg-ic') + ' Dihapus dari keranjang');
};

const changeQty = (id, delta) => {
    const item = cart.find(x => x.id === id);
    if (!item) return;
    const p = PRODUCTS.find(x => x.id === id);
    const next = (item.qty || 1) + delta;
    if (delta > 0 && p && next > (p.stock || 0)) {
        showToast(icon('box', 'svg-ic') + ` Stok cuma ${p.stock}, tidak bisa tambah lagi`);
        return;
    }
    item.qty = next;
    if (item.qty < 1) { removeFromCart(id); return; }
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
                <div class="cart-empty-icon">${icon('cart', 'svg-ic')}</div>
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
                <div class="cart-item-img" style="background: ${p.color}60;">
                    ${p.image ? `<img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">` : productPlaceholder(p.category)}
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${escapeHTML(p.name)}</div>
                    <div class="cart-item-price">${formatRupiah(p.price)} × ${qty}</div>
                </div>
                <div class="qty-selector">
                    <button class="qty-btn" onclick="changeQty(${p.id}, -1)">−</button>
                    <span class="qty-value">${qty}</span>
                    <button class="qty-btn" onclick="changeQty(${p.id}, 1)">+</button>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${p.id})">${icon('trash', 'svg-ic')}</button>
            </div>`;
    }).join('');
    t.textContent = formatRupiah(total);
};

// ─── Checkout ───
const openCheckoutForm = () => {
    if (cart.length === 0) { showToast(icon('cart', 'svg-ic') + ' Keranjang masih kosong!'); return; }
    closeModal('cartModal');
    let total = 0, itemCount = 0;
    cart.forEach(item => {
        const p = PRODUCTS.find(x => x.id === item.id);
        if (p) {
            const qty = item.qty || 1;
            total += p.price * qty;
            itemCount += qty;
        }
    });
    document.getElementById('coItems').textContent = itemCount;
    document.getElementById('coTotal').textContent = formatRupiah(total);
    const saved = JSON.parse(localStorage.getItem('sugarcloset_buyer') || '{}');
    if (saved.name) document.getElementById('cName').value = saved.name;
    if (saved.phone) document.getElementById('cPhone').value = saved.phone;
    if (saved.address) document.getElementById('cAddress').value = saved.address;
    document.getElementById('checkoutModal').classList.add('open');
};

const submitCheckout = (e) => {
    e.preventDefault();
    const name = document.getElementById('cName').value.trim();
    const phone = document.getElementById('cPhone').value.trim();
    const address = document.getElementById('cAddress').value.trim();
    const notes = document.getElementById('cNotes').value.trim();
    if (!name || !phone || !address) { showToast(icon('warning', 'svg-ic') + ' Lengkapi data!'); return; }
    localStorage.setItem('sugarcloset_buyer', JSON.stringify({ name, phone, address }));
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
    msg += `*Total: ${formatRupiah(total)}*\n\n`;
    msg += '*DATA PENGIRIMAN*\n';
    msg += `Nama: ${name}\nNo. WA: ${phone}\nAlamat: ${address}\n`;
    if (notes) msg += `\nCatatan: ${notes}`;
    msg += '\n\nMohon konfirmasi ketersediaan ya, terima kasih!';
    window.open(`https://wa.me/${SHOP_INFO.phone}?text=${encodeURIComponent(msg)}`, '_blank');
    closeModal('checkoutModal');
    // Kosongkan keranjang setelah pesanan dikirim — cegah double order
    cart = [];
    saveCart();
    updateBadges();
    renderCart();
    showToast(icon('mail', 'svg-ic') + ' Pesanan dikirim ke WhatsApp!');
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
                <div class="cart-empty-icon">${icon('heartOutline', 'svg-ic')}</div>
                <p>Belum ada favorit</p>
                <p style="font-size:12px; margin-top:6px;">Tap ${icon('heartOutline', 'svg-ic')} di produk untuk simpan~</p>
            </div>`;
        return;
    }
    c.innerHTML = favorites.map(id => {
        const p = PRODUCTS.find(x => x.id === id);
        if (!p) return '';
        return `
            <div class="cart-item">
                <div class="cart-item-img" style="background: ${p.color}60;">
                    ${p.image ? `<img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">` : productPlaceholder(p.category)}
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${escapeHTML(p.name)}</div>
                    <div class="cart-item-price">${formatRupiah(p.price)}</div>
                </div>
                <button class="cart-item-remove" onclick="toggleFav(${p.id}); renderFavModal(); renderProducts();">${icon('trash', 'svg-ic')}</button>
            </div>`;
    }).join('');
};

// ─── Promo Banner ───
const initPromoBanner = () => {
    const banner = document.getElementById('promoBanner');
    const close = document.getElementById('promoClose');
    const header = document.getElementById('mainHeader');
    const dismissed = localStorage.getItem('sugarcloset_promo_dismissed');

    const updateHeaderOffset = () => {
        if (!banner || banner.style.display === 'none') {
            header.style.top = '0px';
        } else {
            header.style.top = banner.offsetHeight + 'px';
        }
    };

    if (dismissed === 'true') {
        banner.style.display = 'none';
    } else {
        banner.classList.add('show');
    }

    setTimeout(updateHeaderOffset, 50);
    window.addEventListener('resize', updateHeaderOffset);

    if (close) {
        close.addEventListener('click', () => {
            banner.classList.remove('show');
            setTimeout(() => {
                banner.style.display = 'none';
                updateHeaderOffset();
            }, 300);
            localStorage.setItem('sugarcloset_promo_dismissed', 'true');
            showToast(icon('check', 'svg-ic') + ' Promo disembunyikan');
        });
    }
};

// ─── Back to Top ───
const initBackToTop = () => {
    const btn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        btn.classList.toggle('show', window.scrollY > 500);
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
};

// ─── Testimoni ───
const renderTestimonials = () => {
    const grid = document.getElementById('testimonialGrid');
    if (!grid || typeof TESTIMONIALS === 'undefined') return;
    grid.innerHTML = TESTIMONIALS.map((t, i) => {
        const stars = icon('star', 'svg-ic star-gold').repeat(t.rating) + icon('starOutline', 'svg-ic star-dim').repeat(5 - t.rating);
        return `
            <div class="testimonial-card" style="animation-delay: ${i * 0.06}s">
                <div class="testimonial-header">
                    <div class="testimonial-avatar" style="background: ${t.color}60;">${icon(t.avatar, 'svg-ic')}</div>
                    <div class="testimonial-info">
                        <div class="testimonial-name">${t.name}</div>
                        <div class="testimonial-date">${t.date}</div>
                    </div>
                </div>
                <div class="testimonial-stars">${stars}</div>
                <p class="testimonial-text">"${t.text}"</p>
                <div class="testimonial-product">${icon('box', 'svg-ic')} ${t.product}</div>
            </div>
        `;
    }).join('');
};

// ─── FAQ ───
const renderFAQ = () => {
    const list = document.getElementById('faqList');
    if (!list || typeof FAQS === 'undefined') return;
    list.innerHTML = FAQS.map((f, i) => `
        <details class="faq-item" ${i === 0 ? 'open' : ''}>
            <summary class="faq-question">
                <span>${f.q}</span>
                <span class="faq-icon">+</span>
            </summary>
            <div class="faq-answer"><p>${f.a}</p></div>
        </details>
    `).join('');
};

// ─── Events ───
const initEvents = () => {
    const searchInput = document.getElementById('searchInput');
    const searchBox = document.getElementById('searchBoxWrapper');

    searchInput.addEventListener('input', e => {
        currentSearch = e.target.value;
        renderProducts();
    });

    searchInput.addEventListener('focus', () => {
        renderSearchHistory();
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            saveSearchHistory(searchInput.value.trim());
            searchBox.querySelector('.search-history').classList.remove('show');
            searchInput.blur();
        }
    });

    searchInput.addEventListener('blur', () => {
        setTimeout(() => {
            const el = document.getElementById('searchHistory');
            if (el) el.classList.remove('show');
        }, 200);
    });

    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.cat;
            renderProducts();
        });
    });

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
    document.getElementById('checkoutClose').addEventListener('click', () => closeModal('checkoutModal'));
    document.getElementById('checkoutCancel').addEventListener('click', () => closeModal('checkoutModal'));
    document.querySelectorAll('.modal').forEach(m => {
        m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') document.querySelectorAll('.modal').forEach(m => m.classList.remove('open'));
    });
    document.getElementById('checkoutBtn').addEventListener('click', openCheckoutForm);
    document.getElementById('checkoutForm').addEventListener('submit', submitCheckout);
    document.getElementById('menuBtn').addEventListener('click', () => {
        document.querySelector('.nav').classList.toggle('open');
    });
    document.querySelectorAll('.nav-link').forEach(l => {
        l.addEventListener('click', () => document.querySelector('.nav').classList.remove('open'));
    });
};

// ─── Icon Hydration ───
// Ubah <span data-icon="nama"> di HTML statis menjadi SVG dari icons.js
const hydrateIcons = (root = document) => {
    root.querySelectorAll('[data-icon]').forEach(el => {
        if (!el.dataset.done) {
            el.innerHTML = icon(el.dataset.icon, 'svg-ic');
            el.dataset.done = '1';
        }
    });
};

// ─── Deep Link ───
// Buka modal produk langsung dari URL seperti .../index.html#product-3
// (dipakai oleh tombol "Bagikan")
const handleDeepLink = () => {
    const m = window.location.hash.match(/^#product-(\d+)$/);
    if (!m) return;
    const id = parseInt(m[1], 10);
    if (PRODUCTS.some(p => p.id === id)) openProduct(id);
};

const clearDeepLink = () => {
    if (/^#product-\d+$/.test(window.location.hash)) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
    }
};

// ─── Global ───
window.changeQty = changeQty;
window.removeFromCart = removeFromCart;
window.addToCart = addToCart;
window.toggleFav = toggleFav;
window.toggleFavFromModal = toggleFavFromModal;
window.openProduct = openProduct;
window.closeModal = closeModal;
window.shareProduct = shareProduct;
window.shareToWhatsApp = shareToWhatsApp;
window.openReviewForm = openReviewForm;
window.applySearchHistory = applySearchHistory;

// ─── Dark Mode ───
const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('sugarcloset_theme', theme); } catch (e) {}
    const btn = document.getElementById('themeToggle');
    if (btn) btn.innerHTML = icon(theme === 'dark' ? 'sun' : 'moon', 'svg-ic');
};
const initTheme = () => {
    let theme = 'light';
    try {
        theme = localStorage.getItem('sugarcloset_theme')
            || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    } catch (e) {}
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.getElementById('themeToggle');
    if (btn) {
        btn.innerHTML = icon(theme === 'dark' ? 'sun' : 'moon', 'svg-ic');
        btn.addEventListener('click', () => {
            const cur = document.documentElement.getAttribute('data-theme');
            applyTheme(cur === 'dark' ? 'light' : 'dark');
        });
    }
};

// ─── Init ───
document.addEventListener('DOMContentLoaded', () => {
    hydrateIcons();
    initTheme();
    initPromoBanner();
    initFloatingHearts();
    initEvents();
    initBackToTop();
    cleanCart();
    updateBadges();
    renderProducts();
    renderTestimonials();
    renderFAQ();
    handleDeepLink();
    window.addEventListener('hashchange', handleDeepLink);
    console.log('Sugarcloset loaded (Paket D — Full Features)');
});
