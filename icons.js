/* ═══════════════════════════════════════════
   SUGARCLOSET — SVG Icon Library
   Semua ikon SVG dengan style konsisten
   ═══════════════════════════════════════════ */

const ICONS = {
    // ═══ Logo & Brand ═══
    ribbon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C10 2 8 4 8 6.5C8 8 9 9 10 9.5C8 10 6 12 6 14.5C6 17 8 18 10 18C10.5 18 11 17.5 11 17C11 16.5 10.5 16 10 16C9 16 8 15.5 8 14.5C8 13 10 11.5 12 11.5C14 11.5 16 13 16 14.5C16 15.5 15 16 14 16C13.5 16 13 16.5 13 17C13 17.5 13.5 18 14 18C16 18 18 17 18 14.5C18 12 16 10 14 9.5C15 9 16 8 16 6.5C16 4 14 2 12 2Z" fill="currentColor"/>
        <path d="M12 22L10 14L12 15L14 14L12 22Z" fill="currentColor" opacity="0.6"/>
    </svg>`,

    // ═══ Navigation ═══
    heart: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.09C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 14 21 12 21Z" fill="currentColor"/>
    </svg>`,
    
    heartOutline: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.09C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 14 21 12 21Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    </svg>`,
    
    cart: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.707 15.293C4.077 15.923 4.523 17 5.414 17H17M17 17C15.895 17 15 17.895 15 19C15 20.105 15.895 21 17 21C18.105 21 19 20.105 19 19C19 17.895 18.105 17 17 17ZM9 19C9 20.105 8.105 21 7 21C5.895 21 5 20.105 5 19C5 17.895 5.895 17 7 17C8.105 17 9 17.895 9 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    
    menu: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    
    search: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/>
        <path d="M20 20L16 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    
    close: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,
    
    trash: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 6H21M8 6V4C8 3.4 8.4 3 9 3H15C15.6 3 16 3.4 16 4V6M5 6L6 20C6 20.6 6.4 21 7 21H17C17.6 21 18 20.6 18 20L19 6M10 11V17M14 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,

    // ═══ Categories ═══
    dress: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 3L12 6L15 3L14 8L20 19C20 20.1 19.1 21 18 21H6C4.9 21 4 20.1 4 19L10 8L9 3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"/>
        <path d="M12 11V17M9 13L12 11L15 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    
    bag: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 8H18L19 20C19 20.6 18.6 21 18 21H6C5.4 21 5 20.6 5 20L6 8Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        <path d="M9 8V6C9 4.3 10.3 3 12 3C13.7 3 15 4.3 15 6V8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <circle cx="9" cy="14" r="1" fill="currentColor"/>
        <circle cx="15" cy="14" r="1" fill="currentColor"/>
    </svg>`,
    
    shoes: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 16V13L8 10L11 12H14L17 8L21 13V16C21 16.6 20.6 17 20 17H4C3.4 17 3 16.6 3 16Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        <path d="M3 19H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    
    ring: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="14" r="6" stroke="currentColor" stroke-width="2"/>
        <path d="M9 8L10.5 4H13.5L15 8L12 10L9 8Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        <circle cx="12" cy="14" r="2" fill="currentColor"/>
    </svg>`,
    
    book: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 4C4 3.4 4.4 3 5 3H11V21H5C4.4 21 4 20.6 4 20V4Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        <path d="M13 3H19C19.6 3 20 3.4 20 4V20C20 20.6 19.6 21 19 21H13V3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        <path d="M6 7H9M6 11H9M15 7H18M15 11H18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
    
    headphones: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 15V13C4 8.6 7.6 5 12 5C16.4 5 20 8.6 20 13V15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <rect x="3" y="14" width="4" height="6" rx="2" stroke="currentColor" stroke-width="2"/>
        <rect x="17" y="14" width="4" height="6" rx="2" stroke="currentColor" stroke-width="2"/>
    </svg>`,

    // ═══ Decorative ═══
    sparkle: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill="currentColor"/>
        <path d="M19 16L19.75 18.25L22 19L19.75 19.75L19 22L18.25 19.75L16 19L18.25 18.25L19 16Z" fill="currentColor" opacity="0.7"/>
    </svg>`,
    
    flower: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="2.5" fill="currentColor"/>
        <path d="M12 9.5C12 7 10 5 7.5 5C7.5 7.5 9.5 9.5 12 9.5Z" fill="currentColor" opacity="0.7"/>
        <path d="M12 9.5C12 7 14 5 16.5 5C16.5 7.5 14.5 9.5 12 9.5Z" fill="currentColor" opacity="0.7"/>
        <path d="M14.5 12C17 12 19 10 19 7.5C16.5 7.5 14.5 9.5 14.5 12Z" fill="currentColor" opacity="0.7"/>
        <path d="M14.5 12C17 12 19 14 19 16.5C16.5 16.5 14.5 14.5 14.5 12Z" fill="currentColor" opacity="0.7"/>
        <path d="M12 14.5C12 17 14 19 16.5 19C16.5 16.5 14.5 14.5 12 14.5Z" fill="currentColor" opacity="0.7"/>
        <path d="M9.5 12C7 12 5 14 5 16.5C7.5 16.5 9.5 14.5 9.5 12Z" fill="currentColor" opacity="0.7"/>
        <path d="M9.5 12C7 12 5 10 5 7.5C7.5 7.5 9.5 9.5 9.5 12Z" fill="currentColor" opacity="0.7"/>
        <path d="M12 14.5C12 17 10 19 7.5 19C7.5 16.5 9.5 14.5 12 14.5Z" fill="currentColor" opacity="0.7"/>
    </svg>`,
    
    star: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L14.6 8.5L21.5 9L16.2 13.6L18 20.5L12 17L6 20.5L7.8 13.6L2.5 9L9.4 8.5L12 2Z" fill="currentColor"/>
    </svg>`,
    
    rainbow: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 18C3 13.03 7.03 9 12 9C16.97 9 21 13.03 21 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M6 18C6 14.69 8.69 12 12 12C15.31 12 18 14.69 18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
        <path d="M9 18C9 16.34 10.34 15 12 15C13.66 15 15 16.34 15 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.4"/>
    </svg>`,

    // ═══ Socials ═══
    whatsapp: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.5 14.4C17.2 14.2 15.7 13.5 15.4 13.4C15.1 13.3 14.9 13.2 14.7 13.5C14.5 13.8 14 14.4 13.8 14.6C13.6 14.8 13.5 14.8 13.2 14.7C12.9 14.5 11.9 14.2 10.7 13.1C9.8 12.3 9.2 11.3 9 11C8.9 10.7 9 10.6 9.2 10.4C9.3 10.3 9.5 10 9.6 9.9C9.7 9.7 9.8 9.6 9.9 9.4C10 9.2 10 9 9.9 8.8C9.8 8.7 9.2 7.2 8.9 6.6C8.7 6 8.4 6.1 8.2 6.1C8 6.1 7.8 6.1 7.5 6.1C7.3 6.1 6.9 6.2 6.6 6.5C6.3 6.8 5.5 7.6 5.5 9.1C5.5 10.6 6.6 12.1 6.7 12.3C6.9 12.4 8.7 15.3 11.5 16.5C13.8 17.5 14.3 17.4 14.7 17.3C15.1 17.3 16.4 16.7 16.7 16.1C17 15.5 17 15 16.9 14.9C16.8 14.8 16.7 14.7 16.4 14.6C16.1 14.5 15.4 14.2 15.1 14.1"/>
        <path d="M12 2C6.5 2 2 6.5 2 12C2 13.8 2.5 15.4 3.3 16.8L2 22L7.4 20.7C8.8 21.5 10.3 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM12 20C10.5 20 9.1 19.6 7.8 18.8L7.5 18.7L4.2 19.5L5 16.3L4.9 16C4.3 14.8 4 13.5 4 12C4 7.6 7.6 4 12 4C16.4 4 20 7.6 20 12C20 16.4 16.4 20 12 20Z"/>
    </svg>`,
    
    instagram: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="2"/>
        <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/>
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/>
    </svg>`,
    
    tiktok: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.5 6.5C18.4 6.5 17.4 6 16.7 5.2C16 4.4 15.6 3.4 15.6 2.3V2H12.4V15.2C12.4 16.5 11.4 17.5 10.1 17.5C8.8 17.5 7.8 16.5 7.8 15.2C7.8 14.2 8.4 13.3 9.3 12.9V9.6C6.6 10.1 4.5 12.4 4.5 15.2C4.5 18.4 7.1 21 10.3 21C13.5 21 16.1 18.4 16.1 15.2V9C17.2 9.7 18.5 10.1 19.9 10.1H20.5V6.5H19.5Z"/>
    </svg>`,
    
    shopee: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C9.8 2 8 3.5 8 5.5V6H5C4.4 6 4 6.4 4 7L3 19C3 19.6 3.4 20 4 20H20C20.6 20 21 19.6 21 19L20 7C20 6.4 19.6 6 19 6H16V5.5C16 3.5 14.2 2 12 2ZM10 5.5C10 4.6 10.9 4 12 4C13.1 4 14 4.6 14 5.5V6H10V5.5Z"/>
    </svg>`,
    
    // ═══ Actions ═══
    plus: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,
    
    check: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 12L10 17L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    
    // ═══ Product Placeholders ═══
    productDress: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 15L50 25L60 15L56 30L80 75C82 79 79 85 75 85H25C21 85 18 79 20 75L44 30L40 15Z" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
        <path d="M50 40V70M40 50L50 45L60 50" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    
    productBag: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25 35H75L80 85H20L25 35Z" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
        <path d="M38 35V28C38 21 43 15 50 15C57 15 62 21 62 28V35" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
        <circle cx="38" cy="60" r="3" fill="currentColor"/>
        <circle cx="62" cy="60" r="3" fill="currentColor"/>
    </svg>`,
    
    productShoes: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 65V55L35 42L48 52H60L72 35L90 55V65C90 67 88 69 86 69H14C12 69 10 67 10 65Z" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
        <path d="M10 78H90" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
    
    productRing: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="58" r="25" stroke="currentColor" stroke-width="3"/>
        <path d="M38 33L44 18H56L62 33L50 42L38 33Z" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
        <circle cx="50" cy="58" r="8" fill="currentColor"/>
    </svg>`,
    
    productBook: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 20C20 17 22 15 25 15H48V85H25C22 85 20 83 20 80V20Z" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
        <path d="M52 15H75C78 15 80 17 80 20V80C80 83 78 85 75 85H52V15Z" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
        <path d="M28 30H42M28 45H42M28 60H42M58 30H72M58 45H72M58 60H72" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    
    productHeadphone: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 60V52C15 32 30 17 50 17C70 17 85 32 85 52V60" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
        <rect x="10" y="58" width="18" height="28" rx="9" stroke="currentColor" stroke-width="3"/>
        <rect x="72" y="58" width="18" height="28" rx="9" stroke="currentColor" stroke-width="3"/>
    </svg>`,
    
    productGeneric: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="20" width="60" height="60" rx="10" stroke="currentColor" stroke-width="3"/>
        <path d="M35 50L45 40L60 60L70 50" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="38" cy="38" r="4" fill="currentColor"/>
    </svg>`
};

// Helper — ambil ikon dengan class
const icon = (name, cls = '') => {
    const svg = ICONS[name] || '';
    return cls ? svg.replace('<svg ', `<svg class="${cls}" `) : svg;
};

// Mapping kategori ke icon
const CATEGORY_ICONS = {
    'fashion': 'dress',
    'tas': 'bag',
    'sepatu': 'shoes',
    'aksesoris': 'ring',
    'buku': 'book',
    'elektronik': 'headphones'
};

// Mapping product image key ke icon
const PRODUCT_ICONS = {
    'dress': 'productDress',
    'bag': 'productBag',
    'shoes': 'productShoes',
    'ring': 'productRing',
    'book': 'productBook',
    'headphone': 'productHeadphone'
};
