/* ═══════════════════════════════════════════
   ADMIN PANEL — Sugarcloset + Foto Upload
   ═══════════════════════════════════════════ */

let products = JSON.parse(localStorage.getItem('sugarcloset_products') || 'null') || [...DEFAULT_PRODUCTS];
let pendingImageData = null;

const formatRupiah = (num) => 'Rp ' + num.toLocaleString('id-ID');

const showToast = (msg) => {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(window._t);
    window._t = setTimeout(() => t.classList.remove('show'), 2200);
};

const saveProducts = () => {
    try {
        localStorage.setItem('sugarcloset_products', JSON.stringify(products));
    } catch (e) {
        showToast('⚠️ Storage penuh! Kurangi atau kompres foto.');
    }
};

const nextId = () => products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;

// ═══ FOTO COMPRESSION ═══
const compressImage = (file, maxWidth = 800, quality = 0.75) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                const compressed = canvas.toDataURL('image/jpeg', quality);
                resolve(compressed);
            };
            img.onerror = () => reject(new Error('Gagal load gambar'));
            img.src = e.target.result;
        };
        reader.onerror = () => reject(new Error('Gagal baca file'));
        reader.readAsDataURL(file);
    });
};

const setImagePreview = (dataUrl) => {
    const preview = document.getElementById('imagePreview');
    const removeBtn = document.getElementById('imageRemoveBtn');

    if (dataUrl) {
        preview.innerHTML = `<img src="${dataUrl}" alt="preview">`;
        removeBtn.style.display = 'flex';
    } else {
        preview.innerHTML = `<span class="image-preview-placeholder">📷 Ketuk untuk pilih foto</span>`;
        removeBtn.style.display = 'none';
    }
};

// ═══ RENDER STATS ═══
const renderStats = () => {
    document.getElementById('statTotal').textContent = products.length;
    const total = products.reduce((s, p) => s + (p.price || 0), 0);
    document.getElementById('statValue').textContent = formatRupiah(total);
    const cats = new Set(products.map(p => p.category));
    document.getElementById('statCat').textContent = cats.size;
};

// ═══ RENDER GRID ═══
const renderGrid = (filter = '') => {
    const grid = document.getElementById('adminGrid');
    const empty = document.getElementById('adminEmpty');

    let list = [...products];
    if (filter) {
        const q = filter.toLowerCase();
        list = list.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            (p.seller || '').toLowerCase().includes(q)
        );
    }

    if (list.length === 0) {
        grid.innerHTML = '';
        empty.style.display = 'block';
        return;
    }
    empty.style.display = 'none';

    grid.innerHTML = list.map(p => {
        const thumb = p.image
            ? `<img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`
            : p.emoji;
        return `
            <div class="admin-card">
                <div class="admin-card-img" style="background: ${p.color}60;">${thumb}</div>
                <div class="admin-card-info">
                    <div class="admin-card-name">${p.name}</div>
                    <div class="admin-card-price">${formatRupiah(p.price)}</div>
                    <div class="admin-card-meta">${p.category} · Stok: ${p.stock || 1}</div>
                </div>
                <div class="admin-card-actions">
                    <button class="admin-icon-btn edit" onclick="editProduct(${p.id})" title="Edit">✏️</button>
                    <button class="admin-icon-btn delete" onclick="confirmDelete(${p.id})" title="Hapus">🗑️</button>
                </div>
            </div>
        `;
    }).join('');
};

// ═══ OPEN FORM ═══
const openForm = (product = null) => {
    const modal = document.getElementById('productFormModal');
    const title = document.getElementById('formTitle');

    const f = {
        id: document.getElementById('fId'),
        name: document.getElementById('fName'),
        price: document.getElementById('fPrice'),
        originalPrice: document.getElementById('fOriginalPrice'),
        category: document.getElementById('fCategory'),
        condition: document.getElementById('fCondition'),
        emoji: document.getElementById('fEmoji'),
        color: document.getElementById('fColor'),
        desc: document.getElementById('fDesc'),
        seller: document.getElementById('fSeller'),
        stock: document.getElementById('fStock'),
        rating: document.getElementById('fRating'),
        sold: document.getElementById('fSold'),
        tags: document.getElementById('fTags')
    };

    if (product) {
        title.textContent = '✏️ Edit Produk';
        f.id.value = product.id;
        f.name.value = product.name;
        f.price.value = product.price;
        f.originalPrice.value = product.originalPrice;
        f.category.value = product.category;
        f.condition.value = product.condition || '';
        f.emoji.value = product.emoji || '📦';
        f.color.value = product.color || '#FFB6D9';
        f.desc.value = product.desc || '';
        f.seller.value = product.seller || '';
        f.stock.value = product.stock || 1;
        f.rating.value = product.rating || 5;
        f.sold.value = product.sold || 0;
        f.tags.value = (product.tags || []).join(', ');

        pendingImageData = product.image || null;
        setImagePreview(pendingImageData);
    } else {
        title.textContent = '➕ Tambah Produk';
        document.getElementById('productForm').reset();
        f.id.value = '';
        f.stock.value = 1;
        f.rating.value = 5;
        f.sold.value = 0;
        f.color.value = '#FFB6D9';
        f.category.value = 'fashion';
        f.emoji.value = '📦';
        pendingImageData = null;
        setImagePreview(null);
    }

    modal.classList.add('open');
};

const closeForm = () => {
    document.getElementById('productFormModal').classList.remove('open');
    pendingImageData = null;
};

// ═══ INIT ═══
document.addEventListener('DOMContentLoaded', () => {
    renderStats();
    renderGrid();

    // ─── Image Upload ───
    const uploadBox = document.getElementById('imageUploadBox');
    const fileInput = document.getElementById('fImageFile');
    const removeBtn = document.getElementById('imageRemoveBtn');

    uploadBox.addEventListener('click', (e) => {
        if (e.target === removeBtn) return;
        fileInput.click();
    });

    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            showToast('⚠️ Foto terlalu besar (max 5MB)');
            e.target.value = '';
            return;
        }

        showToast('⏳ Mengkompres foto...');

        try {
            const compressed = await compressImage(file);
            pendingImageData = compressed;
            setImagePreview(compressed);
            showToast('✅ Foto siap!');
        } catch (err) {
            showToast('❌ Gagal kompres foto');
        }

        e.target.value = '';
    });

    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        pendingImageData = null;
        setImagePreview(null);
        showToast('🗑️ Foto dihapus');
    });

    // ─── Form Submit ───
    document.getElementById('productForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const tagsRaw = document.getElementById('fTags').value.trim();
        const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : [];

        const data = {
            name: document.getElementById('fName').value.trim(),
            price: parseInt(document.getElementById('fPrice').value) || 0,
            originalPrice: parseInt(document.getElementById('fOriginalPrice').value) || 0,
            category: document.getElementById('fCategory').value,
            condition: document.getElementById('fCondition').value.trim() || 'Bagus',
            emoji: document.getElementById('fEmoji').value.trim() || '📦',
            color: document.getElementById('fColor').value,
            desc: document.getElementById('fDesc').value.trim(),
            seller: document.getElementById('fSeller').value.trim() || 'Admin',
            stock: parseInt(document.getElementById('fStock').value) || 1,
            rating: parseInt(document.getElementById('fRating').value) || 5,
            sold: parseInt(document.getElementById('fSold').value) || 0,
            tags: tags,
            image: pendingImageData
        };

        const idVal = document.getElementById('fId').value;

        if (idVal) {
            const idx = products.findIndex(p => p.id === parseInt(idVal));
            if (idx > -1) {
                products[idx] = { ...products[idx], ...data };
                showToast('✏️ Produk diperbarui!');
            }
        } else {
            products.push({ id: nextId(), ...data });
            showToast('➕ Produk ditambahkan!');
        }

        saveProducts();
        renderStats();
        renderGrid(document.getElementById('adminSearch').value);
        closeForm();
    });

    // ─── Buttons ───
    document.getElementById('addProductBtn').addEventListener('click', () => openForm());
    document.getElementById('formClose').addEventListener('click', closeForm);
    document.getElementById('cancelBtn').addEventListener('click', closeForm);

    document.getElementById('productFormModal').addEventListener('click', (e) => {
        if (e.target.id === 'productFormModal') closeForm();
    });

    document.getElementById('adminSearch').addEventListener('input', (e) => {
        renderGrid(e.target.value);
    });

    // ─── Export ───
    document.getElementById('exportBtn').addEventListener('click', () => {
        const data = JSON.stringify(products, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sugarcloset_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('📥 Produk di-export!');
    });

    // ─── Import ───
    document.getElementById('importBtn').addEventListener('click', () => {
        document.getElementById('importFile').click();
    });

    document.getElementById('importFile').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const imported = JSON.parse(ev.target.result);
                if (!Array.isArray(imported)) throw new Error('Format tidak valid');
                products = imported;
                saveProducts();
                renderStats();
                renderGrid();
                showToast(`📤 ${imported.length} produk di-import!`);
            } catch (err) {
                showToast('❌ File tidak valid');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    });

    // ─── Reset ───
    document.getElementById('resetBtn').addEventListener('click', () => {
        showConfirm('🔄 Reset ke Default?', 'Semua perubahan akan hilang.', () => {
            localStorage.removeItem('sugarcloset_products');
            products = [...DEFAULT_PRODUCTS];
            renderStats();
            renderGrid();
            showToast('🔄 Produk direset!');
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeForm();
    });
});

// ═══ Edit & Delete ═══
window.editProduct = (id) => {
    const p = products.find(x => x.id === id);
    if (p) openForm(p);
};

window.confirmDelete = (id) => {
    const p = products.find(x => x.id === id);
    if (!p) return;
    showConfirm('🗑️ Hapus Produk?', `"${p.name}" akan dihapus permanen.`, () => {
        products = products.filter(x => x.id !== id);
        saveProducts();
        renderStats();
        renderGrid(document.getElementById('adminSearch').value);
        showToast('🗑️ Produk dihapus');
    });
};

// ═══ Confirm Dialog ═══
const showConfirm = (title, message, onYes) => {
    const box = document.createElement('div');
    box.className = 'admin-confirm';
    box.innerHTML = `
        <div class="admin-confirm-box">
            <h3>${title}</h3>
            <p>${message}</p>
            <div class="admin-confirm-actions">
                <button class="btn btn-secondary" id="cfNo">Batal</button>
                <button class="btn btn-primary" id="cfYes">Ya, Lanjut</button>
            </div>
        </div>
    `;
    document.body.appendChild(box);
    box.querySelector('#cfNo').addEventListener('click', () => box.remove());
    box.querySelector('#cfYes').addEventListener('click', () => { onYes(); box.remove(); });
    box.addEventListener('click', (e) => { if (e.target === box) box.remove(); });
};
