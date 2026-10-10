export const defaultSiteConfig = {
  heroEmblem: "/images/cat-head.png",
  heroBadge: "KOMUNIKASI & DIALEKTIKA",
  heroTitle: "Perjuangan, Kata & Suara Marjinal.",
  heroDescription: "Ruang dialektika, tulisan kritis, dan dokumentasi pemikiran intelektual kader Ikatan Mahasiswa Muhammadiyah (IMM) Komisariat FEB. Membela yang tertindas, menyuarakan yang terbungkam.",
  siteName: "ALBUM PERJUANGAN COMMUNE",
  tagline: "IMM FEB - Religiusitas, Intelektualitas, Humanitas",
  joinButtonText: "Join Commune",
  subscribePlaceholder: "Ketik email kader / pembaca...",
  announcementText: "Edisi Khusus: Risalah Ekonomi Kerakyatan & Gerakan Mahasiswa 2026",
  articlesSectionTitle: "Artikel Perjuangan",
  joinCommuneUrl: "https://www.instagram.com/album.perjuangan?cplk=MTJtOGdsbWF0N2FuOQ==",
  zineSectionBadge: "ZINE COMMUNE",
  zineSectionTitle: "KOLEKSI ZINE SIAP UNDUH",
  zineSectionSubtitle: "Arsip digital majalah dinding dan zine fisik dalam format gambar resolusi tinggi untuk dicetak mandiri.",
};

export const categories = [
  "Semua",
  "Opini & Dialektika",
  "Sosio-Ekonomi",
  "Kaderisasi & Gerakan",
  "Teologi & Humanitas",
  "Manifesto",
];

export const initialArticles = [
  {
    id: "art-1",
    title: "Menggugat Neoliberalisme Kampus: Mengapa Uang Kuliah Kian Mencekik?",
    subtitle: "Catatan kritis atas komersialisasi pendidikan tinggi dan hilangnya mandat konstitusi pasal 31.",
    excerpt: "Ketika kampus bertransformasi menjadi korporasi pencetak ijazah, hak atas pendidikan yang berkeadilan tereduksi menjadi komoditas pasar bebas. Mahasiswa dituntut berdaya saing global, namun hak dasarnya dikebiri.",
    content: `## Komersialisasi Pendidikan dan Ilusi Meritokrasi

Pendidikan tinggi hari ini tengah bergeser dari kawah candradimuka intelektual menjadi ruang transaksi kapitalistik. Berlakunya skema otonomi perguruan tinggi (PTN-BH) justru memperlebar jurang pemisah bagi mahasiswa kelas pekerja dan marjinal.

> "Pendidikan bukan alat untuk mencetak sekrup-sekrup industri belaka, melainkan jalan pembebasan akal budi dari ketertindasan struktural."

### Paradoks Kebijakan Anggaran Pendidikan
Meskipun konstitusi mengamanatkan 20% APBN untuk pos pendidikan, alokasi riil untuk subsidi langsung operasional kuliah mahasiswa masih sangat minim. Skema Uang Kuliah Tunggal (UKT) yang dijanjikan berkeadilan faktualnya seringkali bias golongan ekonomi atas.

1. **Komparasi Beban Hidup:** Inflasi biaya kos dan konsumsi mahasiswa tidak pernah dihitung secara komprehensif oleh birokrasi kampus.
2. **Ketiadaan Transparansi:** Audit pos anggaran fasilitas laboratorium dan perpustakaan jarang dipublikasikan secara terbuka kepada ormawa.
3. **Prekaritas Dosen:** Krisis ini bukan hanya menimpa mahasiswa, namun juga menekan dosen honorer dengan upah di bawah garis kelayakan.

### Sikap dan Aksi Intelektual Kader IMM FEB
Sebagai insan ekonom dan pejuang ikatan, kader IMM FEB dituntut tidak sekadar mengeluh di ruang diskusi, melainkan menghadirkan telaah advokasi berbasis data empiris, mengawal formulasi subsidi silang yang nyata, dan senantiasa berdiri bersama kawan-kawan yang terancam putus kuliah demi keadilan sosial bagi seluruh rakyat Indonesia.`,
    category: "Sosio-Ekonomi",
    author: {
      name: "Andi Kurniawan",
      role: "Bidang Riset & Pengembangan Keilmuan IMM FEB",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    },
    date: "8 Oktober 2026",
    readTime: "6 min read",
    thumbnail: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&auto=format&fit=crop&q=80",
    featured: true,
    likes: 142,
    commentsCount: 18,
    comments: [
      {
        id: "c-1",
        author: "Fahri Rahmad",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        date: "8 Okt 2026",
        content: "Analisis yang sangat presisi kanda. Kampus sekarang lebih mirip korporasi dibanding institusi pencerahan."
      },
      {
        id: "c-2",
        author: "Siti Rahmawati",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        date: "9 Okt 2026",
        content: "Sepakat! Advokasi UKT di tingkat fakultas harus segera digulirkan bersama seluruh himpunan."
      }
    ]
  },
  {
    id: "art-2",
    title: "Tri Kompetensi Dasar di Tengah Disrupsi Kecerdasan Buatan (AI)",
    subtitle: "Menakar relevansi Religiusitas, Intelektualitas, dan Humanitas di era algoritma generatif.",
    excerpt: "Ketika mesin dapat menyusun argumen dan merumuskan tesis dalam hitungan detik, apa yang tersisa dari martabat intelektual kader? IMM menjawabnya dengan sintesis moral dan etika profetik.",
    content: `## Meneguhkan Kembali Spiritualitas Progresif

Ledakan teknologi Large Language Models (LLM) dan otomatisasi algoritma telah mendisrupsi cara kita memproduksi pengetahuan. Di ruang kuliah FEB, mahasiswa kini dengan mudah memproduksi paper dan analisis pasar dengan AI. Namun, teknologi tidak memiliki nurani atau empati kemanusiaan.

### 1. Religiusitas sebagai Kompas Moral
Agama bukan candu yang meninabobokan, melainkan api etis yang mengingatkan bahwa teknologi diciptakan untuk memuliakan martabat manusia, bukan memperkaya segelintir konglomerat Silicon Valley.

### 2. Intelektualitas Kritis yang Melampaui Prompt
Kader IMM tidak boleh sekadar menjadi operator *prompt*. Intelektualitas sejati terletak pada keberanian mempertanyakan: untuk kepentingan siapa model ekonomi ini dirancang? Siapa yang dirugikan oleh efisiensi algoritmik?

### 3. Humanitas: Sentuhan Kemanusiaan yang Tak Tergantikan
Solidaritas kepada kaum mustadh'afin tidak bisa diwakilkan oleh kode biner. Tangisan buruh pabrik, derita petani gagal panen, dan kecemasan pedagang pasar tradisional membutuhkan kehadiran fisik kader di lapangan.`,
    category: "Opini & Dialektika",
    author: {
      name: "Zulfikar Hidayat",
      role: "Ketua Umum Komisariat IMM FEB",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    },
    date: "6 Oktober 2026",
    readTime: "5 min read",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
    featured: true,
    likes: 98,
    commentsCount: 9,
    comments: [
      {
        id: "c-3",
        author: "Bayu Pratama",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        date: "7 Okt 2026",
        content: "Tulisan yang sangat kontekstual. Relevansi Tri Kompetensi makin diuji di zaman serba otomatis ini."
      }
    ]
  },
  {
    id: "art-3",
    title: "Manifesto Merah Hitam: Episteme Perlawanan dari Sudut Kampus",
    subtitle: "Mengapa warna merah dan hitam bukan sekadar estetika seragam, melainkan simbol bara keberanian.",
    excerpt: "Merah menyala melambangkan darah perjuangan dan gelora martir perubahan; hitam melambangkan keteguhan prinsip yang tak goyah oleh hembusan angin kekuasaan dan godaan kooptasi.",
    content: `## Simbolisme dalam Gerakan Mahasiswa

Sejarah mencatat bahwa simbol tidak pernah lahir dari ruang hampa. Lambang IMM yang sarat makna merah, hitam, dan putih mencerminkan dialektika historis panjang perjuangan Muhammadiyah di kancah nasional.

> "Merah adalah gairah yang membakar kepalsuan status quo. Hitam adalah kesunyian nurani yang istiqamah dalam kebenaran."

### Melawan Budaya Apatisme Mahasiswa
Kelesuan gerakan mahasiswa kontemporer sering kali dipicu oleh rasa takut tidak lulus tepat waktu atau ketakutan kehilangan jenjang karier korporat. Padahal, masa muda tanpa keberpihakan moral adalah masa muda yang kehilangan jiwanya.

Album Perjuangan Commune hadir sebagai wadah alternatif untuk merevitalisasi keberanian bersuara. Kami tidak menyodorkan dogma, melainkan menyalakan ruang diskursus yang jujur dan berakar pada penderitaan rakyat.`,
    category: "Manifesto",
    author: {
      name: "Redaksi Commune",
      role: "Kolektif Media IMM FEB",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
    },
    date: "4 Oktober 2026",
    readTime: "4 min read",
    thumbnail: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80",
    featured: false,
    likes: 185,
    commentsCount: 24,
    comments: []
  },
  {
    id: "art-4",
    title: "Koperasi Mahasiswa vs Monopoli Retail: Merebut Kedaulatan Konsumsi",
    subtitle: "Refleksi atas minimnya ekosistem ekonomi kolektif di lingkungan fakultas ekonomi dan bisnis.",
    excerpt: "Kita mempelajari teori efisiensi pasar dan elastisitas harga setiap hari, namun kantin dan gerai retail kampus dikuasai jejaring oligopoli waralaba tanpa menyisakan ruang bagi kemandirian mahasiswa.",
    content: `## Paradoks Mahasiswa Ekonomi yang Konsumtif

Fakultas Ekonomi dan Bisnis meluluskan ribuan sarjana manajemen dan akuntansi setiap tahunnya. Namun ironisnya, lembaga ekonomi mahasiswa seperti Kopma seringkali termarginalkan menjadi sekadar toko fotokopi kecil.

### Urgensi Rekonstruksi Ekosistem Bisnis Kolektif
1. **Model Usaha Bersama:** Membangun unit bisnis mikro yang kepemilikannya dipegang secara patungan oleh kader dan mahasiswa.
2. **Kedaulatan Rantai Pasok:** Mengutamakan bahan pangan dari petani lokal binaan Muhammadiyah daripada distributor konglomerasi.
3. **Praktek Nyata Teologi Al-Ma'un:** Keuntungan ekonomi dikembalikan untuk beasiswa kader yang kesulitan membayar sewa asrama atau SPP.`,
    category: "Sosio-Ekonomi",
    author: {
      name: "Nadia Safitri",
      role: "Bidang Ekonomi & Kewirausahaan IMM FEB",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
    },
    date: "1 Oktober 2026",
    readTime: "7 min read",
    thumbnail: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800&auto=format&fit=crop&q=80",
    featured: false,
    likes: 76,
    commentsCount: 5,
    comments: []
  },
  {
    id: "art-5",
    title: "Buku, Ruang Sunyi, dan Bahaya Intelektual Karbitan",
    subtitle: "Mengapa kebiasaan membaca mendalam (deep reading) adalah benteng pertahanan terbaik seorang aktivis.",
    excerpt: "Di era konten video pendek 15 detik, kemampuan menenggelamkan diri dalam buku tebal berdebu adalah tindakan subversif yang radikal. Jangan sampai kita fasih berorasi namun miskin literatur rujukan.",
    content: `## Menghidupkan Kembali Budaya Literasi Kritis

Ada pepatah tua di kalangan pejuang pergerakan: 'Tanpa teori revolusioner, tidak ada gerakan revolusioner.' Namun hari ini, seringkali kita menemukan argumen aktivis hanya sebatas kutipan Instagram tanpa pernah menyentuh karya aslinya secara utuh.

### Lingkaran Belajar Melawan Kebisingan Medsos
Kaderisasi di IMM FEB tidak boleh membiarkan anggotanya puas dengan kesimpulan instan. Kita membutuhkan ruang-ruang tadarus pemikiran yang mengupas karya Tan Malaka, Mohammad Hatta, Buya Syafii Maarif, hingga Amartya Sen secara tuntas.`,
    category: "Kaderisasi & Gerakan",
    author: {
      name: "Haikal Firdaus",
      role: "Bidang Kader IMM FEB",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80"
    },
    date: "28 September 2026",
    readTime: "5 min read",
    thumbnail: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&auto=format&fit=crop&q=80",
    featured: false,
    likes: 112,
    commentsCount: 14,
    comments: []
  },
  {
    id: "art-6",
    title: "Teologi Al-Ma'un Abad 21: Mendefinisikan Ulang Kaum Mustadh'afin",
    subtitle: "Bagaimana ajaran KH. Ahmad Dahlan menjawab luka struktural masyarakat perkotaan kontemporer.",
    excerpt: "Kaum dhuafa dan mustadh'afin hari ini bukan hanya fakir miskin konvensional, melainkan pengemudi ojol yang terjebak algoritma, buruh kontrak tanpa jaminan pensiun, serta generasi sandwich yang kelelahan.",
    content: `## Dari Panti Asuhan ke Advokasi Sistemik

Ketika KH Ahmad Dahlan mengajarkan Surat Al-Ma'un berbulan-bulan kepada santrinya hingga mendirikan rumah sakit dan panti asuhan, beliau tidak sedang melakukan aksi filantropi karitatif semata. Beliau sedang mendobrak struktur ketidakadilan sosial zaman kolonial.

### Menghadapi Prekaritas Abad 21
Hari ini, kemiskinan sering kali berwujud prekaritas baru:
- Pekerja gig economy yang tidak diakui status buruhnya.
- Generasi muda yang dihantui pinjaman online ilegal dan judi daring karena keputusasaan ekonomi.
- Krisis kesehatan mental yang berakar dari tekanan kerja tanpa henti.

Misi profetik IMM adalah menerjemahkan kembali Al-Ma'un dalam konteks kontemporer: melahirkan riset kebijakan ekonomi alternatif yang berpihak pada kesejahteraan manusia, bukan semata grafik pertumbuhan PDB.`,
    category: "Teologi & Humanitas",
    author: {
      name: "Aisyah Nabila",
      role: "Bidang Tabligh & Kajian Keislaman IMM FEB",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    },
    date: "24 September 2026",
    readTime: "8 min read",
    thumbnail: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&auto=format&fit=crop&q=80",
    featured: false,
    likes: 167,
    commentsCount: 22,
    comments: []
  }
];

export const initialZines = [
  {
    id: "zine-1",
    edition: "EDISI #01",
    title: "Zine Perlawanan #1",
    description: "Arsip digital majalah dinding dan zine fisik dalam format gambar resolusi tinggi untuk dicetak mandiri.",
    cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
    fileUrl: "",
    fileName: "Zine_Perlawanan_Edisi_01.pdf",
    fileSize: "14.2 MB",
    downloads: 128,
    date: "Oktober 2026"
  },
  {
    id: "zine-2",
    edition: "EDISI #02",
    title: "Zine Otonomi #2",
    description: "Arsip digital edisi otonomi pemikiran mahasiswa, teologi emansipatoris, dan kemandirian ekonomi.",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80",
    fileUrl: "",
    fileName: "Zine_Otonomi_Edisi_02.pdf",
    fileSize: "18.5 MB",
    downloads: 95,
    date: "Oktober 2026"
  }
];
