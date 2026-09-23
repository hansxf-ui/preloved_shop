const PRODUCTS = [
    { id: 1, name: "Tas Vintage Pink Pastel", price: 125000, originalPrice: 350000, category: "tas", condition: "Mulus 9.5/10", emoji: "👜", color: "#FFB6D9", desc: "Tas vintage lucu dengan warna pink pastel. Kondisi masih sangat bagus, kulit tebal, zip aman. Cocok untuk jalan santai atau ke kampus.", seller: "Kak Ayu", stock: 1, rating: 5, sold: 12, tags: ["vintage", "pink", "tas"] },
    { id: 2, name: "Dress Floral Korea Style", price: 89000, originalPrice: 250000, category: "fashion", condition: "Mulus 9/10", emoji: "👗", color: "#C5B3FF", desc: "Dress bunga ala Korea, bahan adem, ukuran M. Cocok untuk hangout atau date.", seller: "Kak Rina", stock: 1, rating: 5, sold: 8, tags: ["dress", "floral", "korea"] },
    { id: 3, name: "Sneakers White Clean", price: 175000, originalPrice: 500000, category: "sepatu", condition: "Mulus 9/10", emoji: "👟", color: "#B3E5FC", desc: "Sneakers putih kekinian, baru dicuci bersih. Size 39. Nyaman untuk daily.", seller: "Kak Dita", stock: 1, rating: 4, sold: 15, tags: ["sneakers", "white", "sepatu"] },
    { id: 4, name: "Kalung Choker Bunga", price: 35000, originalPrice: 75000, category: "aksesoris", condition: "Baru 10/10", emoji: "💍", color: "#FFD9E8", desc: "Choker bunga manis, baru, belum pernah dipakai. Cocok buat menambah cuteness.", seller: "Kak Lily", stock: 3, rating: 5, sold: 25, tags: ["choker", "bunga", "kalung"] },
    { id: 5, name: "Novel Romantis Preloved", price: 45000, originalPrice: 120000, category: "buku", condition: "Baik 8.5/10", emoji: "📚", color: "#FFE4B3", desc: "Novel romantis best seller. Kondisi bagus, tidak ada halaman hilang. Covernya cantik.", seller: "Kak Sarah", stock: 1, rating: 4, sold: 6, tags: ["novel", "romantis", "buku"] },
    { id: 6, name: "Headphone Cute Edition", price: 210000, originalPrice: 550000, category: "elektronik", condition: "Mulus 9/10", emoji: "🎧", color: "#B3FFD9", desc: "Headphone warna pastel lucu, suara jernih, masih bergaransi.", seller: "Kak Mia", stock: 1, rating: 5, sold: 20, tags: ["headphone", "audio", "elektronik"] },
    { id: 7, name: "Rok Plisket Peach", price: 65000, originalPrice: 180000, category: "fashion", condition: "Mulus 9/10", emoji: "🩱", color: "#FFC9A8", desc: "Rok plisket warna peach cantik, bahan flowy, ukuran all size.", seller: "Kak Nana", stock: 2, rating: 5, sold: 18, tags: ["rok", "plisket"] },
    { id: 8, name: "Tote Bag Kanvas Lucu", price: 55000, originalPrice: 150000, category: "tas", condition: "Mulus 9/10", emoji: "🛍️", color: "#FFD9F2", desc: "Tote bag kanvas dengan desain lucu. Muat banyak barang.", seller: "Kak Vira", stock: 1, rating: 4, sold: 10, tags: ["tote", "kanvas"] },
    { id: 9, name: "Gelang Manik Warna-warni", price: 25000, originalPrice: 60000, category: "aksesoris", condition: "Baru 10/10", emoji: "📿", color: "#E8B3FF", desc: "Gelang manik warna-warni, handmade. Bisa custom warna.", seller: "Kak Ayu", stock: 5, rating: 5, sold: 30, tags: ["gelang", "manik"] },
    { id: 10, name: "Kemeja Oversize Cream", price: 95000, originalPrice: 280000, category: "fashion", condition: "Mulus 9/10", emoji: "👚", color: "#FFE9B3", desc: "Kemeja oversize warna cream, bahan katun premium. Ukuran L.", seller: "Kak Sinta", stock: 1, rating: 5, sold: 14, tags: ["kemeja", "oversize"] },
    { id: 11, name: "Sepatu Flat Mary Jane", price: 145000, originalPrice: 400000, category: "sepatu", condition: "Mulus 9/10", emoji: "🥿", color: "#FFB3BA", desc: "Flat shoes mary jane yang manis. Size 38. Nyaman untuk acara formal.", seller: "Kak Dewi", stock: 1, rating: 5, sold: 7, tags: ["flat", "mary jane"] },
    { id: 12, name: "Buku Puisi Cinta", price: 38000, originalPrice: 90000, category: "buku", condition: "Mulus 9/10", emoji: "📖", color: "#FFCCE5", desc: "Kumpulan puisi cinta yang manis. Cocok untuk hadiah atau koleksi.", seller: "Kak Rara", stock: 1, rating: 5, sold: 5, tags: ["puisi", "cinta"] }
];

const SHOP_INFO = {
    name: "Sugarcloset",
    phone: "6281234567890",
    instagram: "@sugarcloset",
    tiktok: "@sugarcloset"
};
