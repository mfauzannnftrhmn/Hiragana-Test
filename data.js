/**
 * Data Kosakata Hiragana berdasarkan Lembar Ajar Materi Pertemuan 1-2
 * Dosen Pengampu: Aulia Mudrika, S. Hum & Ray Andriana, S.Pd
 */

const HIRAGANA_RULES = [
  {
    title: "Gojuon (ごじゅうおん)",
    desc: "Tabel 50 bunyi dasar Hiragana yang dipakai untuk menuliskan semua suku kata dasar dalam bahasa Jepang (deret vokal a, i, u, e, o dan konsonan k, s, t, n, h, m, y, r, w).",
    examples: ["あ、い、う、え、お", "か、き、く、け、こ"]
  },
  {
    title: "Dakuon (だくおん)",
    desc: "Penambahan tanda titik dua / petik yang disebut ten-ten (゛) di kanan atas huruf Kana.",
    examples: [
      "か → が (ka → ga)",
      "さ → ざ (sa → za)",
      "た → だ (ta → da)",
      "は → ば (ha → ba)"
    ]
  },
  {
    title: "Handakuon (はんだくおん)",
    desc: "Khusus huruf baris (ha), penambahan lingkaran kecil disebut maru (゜) sehingga berbunyi 'p'.",
    examples: [
      "は → ぱ (ha → pa)",
      "ひ → ぴ (hi → pi)",
      "ふ → ぷ (fu → pu)",
      "へ → ぺ (he → pe)",
      "ほ → ぽ (ho → po)"
    ]
  },
  {
    title: "Yōon (ようおん)",
    desc: "Gabungan huruf Kana berakhiran (-i) + huruf kecil 「ゃ、ゅ、ょ」 (ya, yu, yo) yang ditulis kecil di sebelah kanan bawah.",
    examples: [
      "き + ゃ → きゃ (kya)",
      "き + ゅ → きゅ (kyu)",
      "き + ょ → きょ (kyo)",
      "し + ゃ → しゃ (sha)"
    ]
  },
  {
    title: "Sokuon (そくおん)",
    desc: "Penambahan huruf 「っ」 (tsu kecil) di tengah kata sebagai tanda rangkap konsonan (konsonan ganda).",
    examples: [
      "がっこう (gakkou) = sekolah",
      "いってきます (ittekimasu) = saya pergi dulu"
    ]
  },
  {
    title: "Chōon (ちょうおん)",
    desc: "Bunyi panjang. Di Hiragana ditulis dengan menambahkan vokal yang sama (atau huruf u untuk akhiran o/u).",
    examples: [
      "おばあさん (obaasan) = nenek",
      "おとうさん (otousan) = ayah"
    ]
  }
];

const VOCAB_LIST = [
  // --- Akhiran Panggilan & Gelar ---
  {
    id: 1,
    hiragana: "～せんせい",
    romaji: "~sensei",
    arti: "Pengajar / Guru / Dokter",
    kategori: "gelar",
    kategoriLabel: "Panggilan & Gelar",
    catatan: "Gelar kehormatan untuk pengajar atau profesi terhormat."
  },
  {
    id: 2,
    hiragana: "～さん",
    romaji: "~san",
    arti: "Akhiran panggilan (Netral & Sopan)",
    kategori: "gelar",
    kategoriLabel: "Panggilan & Gelar",
    catatan: "Setara 'Bapak/Ibu/Sdr.', paling umum dipakai."
  },
  {
    id: 3,
    hiragana: "～ちゃん",
    romaji: "~chan",
    arti: "Akhiran panggilan akrab (Anak-anak / Teman dekat wanita)",
    kategori: "gelar",
    kategoriLabel: "Panggilan & Gelar",
    catatan: "Menunjukkan rasa sayang/keakraban."
  },
  {
    id: 4,
    hiragana: "～くん",
    romaji: "~kun",
    arti: "Akhiran panggilan (Laki-laki / Sebaya / Bawahan)",
    kategori: "gelar",
    kategoriLabel: "Panggilan & Gelar",
    catatan: "Biasa untuk teman sebaya pria atau junior."
  },

  // --- Salam & Ungkapan (Aisatsu) ---
  {
    id: 5,
    hiragana: "おはようございます",
    romaji: "ohayou gozaimasu",
    arti: "Selamat pagi",
    kategori: "salam",
    kategoriLabel: "Salam & Ungkapan",
    catatan: "Bentuk sopan (formal)."
  },
  {
    id: 6,
    hiragana: "こんにちは",
    romaji: "konnichiwa",
    arti: "Selamat siang / Halo",
    kategori: "salam",
    kategoriLabel: "Salam & Ungkapan",
    catatan: "Diucapkan dari siang hingga sore hari."
  },
  {
    id: 7,
    hiragana: "こんばんは",
    romaji: "konbanwa",
    arti: "Selamat malam (salam datang)",
    kategori: "salam",
    kategoriLabel: "Salam & Ungkapan",
    catatan: "Salam saat bertemu di malam hari."
  },
  {
    id: 8,
    hiragana: "おやすみなさい",
    romaji: "oyasuminasai",
    arti: "Selamat tidur / Selamat beristirahat",
    kategori: "salam",
    kategoriLabel: "Salam & Ungkapan",
    catatan: "Diucapkan sebelum tidur atau berpisah malam hari."
  },
  {
    id: 9,
    hiragana: "さようなら",
    romaji: "sayounara",
    arti: "Selamat tinggal",
    kategori: "salam",
    kategoriLabel: "Salam & Ungkapan",
    catatan: "Untuk perpisahan waktu yang lama."
  },
  {
    id: 10,
    hiragana: "じゃあね",
    romaji: "jaa ne",
    arti: "Sampai jumpa (santai)",
    kategori: "salam",
    kategoriLabel: "Salam & Ungkapan",
    catatan: "Diucapkan ke teman akrab."
  },
  {
    id: 11,
    hiragana: "またね",
    romaji: "mata ne",
    arti: "Sampai nanti",
    kategori: "salam",
    kategoriLabel: "Salam & Ungkapan",
    catatan: "Santai antar sahabat."
  },
  {
    id: 12,
    hiragana: "はじめまして",
    romaji: "hajimemashite",
    arti: "Salam kenal (Senang bertemu dengan Anda)",
    kategori: "salam",
    kategoriLabel: "Salam & Ungkapan",
    catatan: "Diucapkan pertama kali saat perkenalan."
  },
  {
    id: 13,
    hiragana: "ではまた",
    romaji: "dewa mata",
    arti: "Sampai ketemu lagi",
    kategori: "salam",
    kategoriLabel: "Salam & Ungkapan",
    catatan: "Sedikit lebih formal daripada 'jaa ne'."
  },
  {
    id: 14,
    hiragana: "またあした",
    romaji: "mata ashita",
    arti: "Sampai besok",
    kategori: "salam",
    kategoriLabel: "Salam & Ungkapan",
    catatan: "Ashita berarti besok."
  },
  {
    id: 15,
    hiragana: "またらいしゅう",
    romaji: "mata raishuu",
    arti: "Sampai minggu depan",
    kategori: "salam",
    kategoriLabel: "Salam & Ungkapan",
    catatan: "Raishuu berarti minggu depan."
  },
  {
    id: 16,
    hiragana: "いってきます",
    romaji: "ittekimasu",
    arti: "Saya pergi dulu (berangkat)",
    kategori: "salam",
    kategoriLabel: "Salam & Ungkapan",
    catatan: "Diucapkan saat hendak keluar rumah/kantor."
  },
  {
    id: 17,
    hiragana: "いってらっしゃい",
    romaji: "itterasshai",
    arti: "Hati-hati di jalan (jawaban untuk ittekimasu)",
    kategori: "salam",
    kategoriLabel: "Salam & Ungkapan",
    catatan: "Jawaban orang yang tinggal di rumah."
  },
  {
    id: 18,
    hiragana: "ただいま",
    romaji: "tadaima",
    arti: "Saya pulang",
    kategori: "salam",
    kategoriLabel: "Salam & Ungkapan",
    catatan: "Diucapkan saat kembali ke rumah."
  },
  {
    id: 19,
    hiragana: "おかえりなさい",
    romaji: "okaerinasai",
    arti: "Selamat datang kembali",
    kategori: "salam",
    kategoriLabel: "Salam & Ungkapan",
    catatan: "Jawaban menyambut kepulangan seseorang."
  },
  {
    id: 20,
    hiragana: "よろしくおねがいします",
    romaji: "yoroshiku onegaishimasu",
    arti: "Mohon kerjasamanya / Mohon bantuannya",
    kategori: "salam",
    kategoriLabel: "Salam & Ungkapan",
    catatan: "Sangat penting dalam budaya Jepang."
  },
  {
    id: 21,
    hiragana: "ごめんなさい",
    romaji: "gomen nasai",
    arti: "Maaf (lebih sopan/personal)",
    kategori: "salam",
    kategoriLabel: "Salam & Ungkapan",
    catatan: "Meminta maaf atas kesalahan."
  },
  {
    id: 22,
    hiragana: "すみません",
    romaji: "sumimasen",
    arti: "Permisi / Maaf",
    kategori: "salam",
    kategoriLabel: "Salam & Ungkapan",
    catatan: "Bisa untuk permisi, minta tolong, atau minta maaf ringan."
  },
  {
    id: 23,
    hiragana: "しつれいします",
    romaji: "shitsurei shimasu",
    arti: "Permisi / Maaf mengganggu / Pamit (formal)",
    kategori: "salam",
    kategoriLabel: "Salam & Ungkapan",
    catatan: "Dipakai saat masuk/keluar ruangan atau pamit dari rapat."
  },
  {
    id: 24,
    hiragana: "おつかれさまでした",
    romaji: "otsukaresama deshita",
    arti: "Terima kasih atas kerja kerasmu",
    kategori: "salam",
    kategoriLabel: "Salam & Ungkapan",
    catatan: "Diucapkan seusai bekerja atau menyelesaikan tugas bersama."
  },
  {
    id: 25,
    hiragana: "どうもありがとうございます",
    romaji: "doumo arigatou gozaimasu",
    arti: "Terima kasih banyak (sangat sopan)",
    kategori: "salam",
    kategoriLabel: "Salam & Ungkapan",
    catatan: "Bentuk ucapan terima kasih tingkat tinggi."
  },
  {
    id: 26,
    hiragana: "いいえ、どういたしまして",
    romaji: "iie, doitashimashite",
    arti: "Sama-sama (dalam bentuk sopan)",
    kategori: "salam",
    kategoriLabel: "Salam & Ungkapan",
    catatan: "Jawaban membalas terima kasih."
  },
  {
    id: 27,
    hiragana: "おじぎ",
    romaji: "ojiigi",
    arti: "Budaya membungkukkan badan",
    kategori: "salam",
    kategoriLabel: "Salam & Budaya",
    catatan: "Gestur penting penghormatan khas Jepang."
  },

  // --- Orang & Kata Ganti ---
  {
    id: 28,
    hiragana: "わたし",
    romaji: "watashi",
    arti: "Saya",
    kategori: "orang",
    kategoriLabel: "Orang & Kata Ganti",
    catatan: "Kata ganti orang pertama standar/netral."
  },
  {
    id: 29,
    hiragana: "わたしたち",
    romaji: "watashitachi",
    arti: "Kita / Kami",
    kategori: "orang",
    kategoriLabel: "Orang & Kata Ganti",
    catatan: "Bentuk jamak dari 'watashi'."
  },
  {
    id: 30,
    hiragana: "あなた",
    romaji: "anata",
    arti: "Anda / Kamu",
    kategori: "orang",
    kategoriLabel: "Orang & Kata Ganti",
    catatan: "Gunakan hati-hati, lebih baik sebut nama lawan bicara."
  },
  {
    id: 31,
    hiragana: "あなたたち",
    romaji: "anatatachi",
    arti: "Anda sekalian / Kalian",
    kategori: "orang",
    kategoriLabel: "Orang & Kata Ganti",
    catatan: "Bentuk jamak dari 'anata'."
  },
  {
    id: 32,
    hiragana: "かれ",
    romaji: "kare",
    arti: "Dia (laki-laki)",
    kategori: "orang",
    kategoriLabel: "Orang & Kata Ganti",
    catatan: "Bisa juga berarti pacar pria."
  },
  {
    id: 33,
    hiragana: "かのじょ",
    romaji: "kanojo",
    arti: "Dia (perempuan)",
    kategori: "orang",
    kategoriLabel: "Orang & Kata Ganti",
    catatan: "Bisa juga berarti pacar wanita."
  },
  {
    id: 34,
    hiragana: "みなさん",
    romaji: "minasan",
    arti: "Semuanya / Hadirin sekalian",
    kategori: "orang",
    kategoriLabel: "Orang & Kata Ganti",
    catatan: "Menyapa sekelompok orang secara sopan."
  },
  {
    id: 35,
    hiragana: "ひと",
    romaji: "hito",
    arti: "Orang",
    kategori: "orang",
    kategoriLabel: "Orang & Kata Ganti",
    catatan: "Kata benda umum untuk manusia/orang."
  },
  {
    id: 36,
    hiragana: "おとな",
    romaji: "otona",
    arti: "Dewasa / Orang dewasa",
    kategori: "orang",
    kategoriLabel: "Orang & Kata Ganti",
    catatan: "Lawan kata dari kodomo."
  },
  {
    id: 37,
    hiragana: "こども",
    romaji: "kodomo",
    arti: "Anak / Anak-anak",
    kategori: "orang",
    kategoriLabel: "Orang & Kata Ganti",
    catatan: "Anak kecil atau anak kandung."
  },
  {
    id: 38,
    hiragana: "おとこ",
    romaji: "otoko",
    arti: "Laki-laki (gender/kasar)",
    kategori: "orang",
    kategoriLabel: "Orang & Kata Ganti",
    catatan: "Sebutan jenis kelamin, terkesan agak kasar jika langsung ke orang."
  },
  {
    id: 39,
    hiragana: "おとこのひと",
    romaji: "otokonohito",
    arti: "Pria / Laki-laki dewasa",
    kategori: "orang",
    kategoriLabel: "Orang & Kata Ganti",
    catatan: "Bentuk sopan untuk menyebut pria."
  },
  {
    id: 40,
    hiragana: "おとこのこ",
    romaji: "otokonoko",
    arti: "Anak laki-laki",
    kategori: "orang",
    kategoriLabel: "Orang & Kata Ganti",
    catatan: "Bocah laki-laki."
  },
  {
    id: 41,
    hiragana: "おんな",
    romaji: "onna",
    arti: "Perempuan (gender/kasar)",
    kategori: "orang",
    kategoriLabel: "Orang & Kata Ganti",
    catatan: "Sebutan jenis kelamin wanita."
  },
  {
    id: 42,
    hiragana: "おんなのひと",
    romaji: "onnanohito",
    arti: "Wanita / Perempuan dewasa",
    kategori: "orang",
    kategoriLabel: "Orang & Kata Ganti",
    catatan: "Bentuk sopan untuk wanita."
  },
  {
    id: 43,
    hiragana: "おんなのこ",
    romaji: "onnanoko",
    arti: "Anak perempuan",
    kategori: "orang",
    kategoriLabel: "Orang & Kata Ganti",
    catatan: "Bocah perempuan."
  },
  {
    id: 44,
    hiragana: "ともだち",
    romaji: "tomodachi",
    arti: "Teman / Sahabat",
    kategori: "orang",
    kategoriLabel: "Orang & Kata Ganti",
    catatan: "Kawan akrab."
  },
  {
    id: 45,
    hiragana: "きみ",
    romaji: "kimi",
    arti: "Kamu",
    kategori: "orang",
    kategoriLabel: "Orang & Kata Ganti",
    catatan: "Dipakai laki-laki kepada teman akrab atau orang lebih muda."
  },
  {
    id: 46,
    hiragana: "ぼく",
    romaji: "boku",
    arti: "Aku (laki-laki)",
    kategori: "orang",
    kategoriLabel: "Orang & Kata Ganti",
    catatan: "Biasa digunakan oleh pria muda/santai."
  },
  {
    id: 47,
    hiragana: "じぶん",
    romaji: "jibun",
    arti: "Diri sendiri",
    kategori: "orang",
    kategoriLabel: "Orang & Kata Ganti",
    catatan: "Merujuk kepada diri sendiri."
  },
  {
    id: 48,
    hiragana: "がいこくじん",
    romaji: "gaikokujin",
    arti: "Orang asing / Warga negara asing",
    kategori: "orang",
    kategoriLabel: "Orang & Kata Ganti",
    catatan: "Gaikoku (luar negeri) + jin (orang)."
  },
  {
    id: 49,
    hiragana: "なまえ",
    romaji: "namae",
    arti: "Nama",
    kategori: "orang",
    kategoriLabel: "Orang & Kata Ganti",
    catatan: "Nama seseorang."
  },

  // --- Keluarga (Kazoku) ---
  {
    id: 50,
    hiragana: "かぞく",
    romaji: "kazoku",
    arti: "Keluarga",
    kategori: "keluarga",
    kategoriLabel: "Keluarga & Kerabat",
    catatan: "Keluarga sendiri atau keluarga umum."
  },
  {
    id: 51,
    hiragana: "かてい",
    romaji: "katei",
    arti: "Rumah tangga",
    kategori: "keluarga",
    kategoriLabel: "Keluarga & Kerabat",
    catatan: "Unit rumah tangga / lingkungan keluarga."
  },
  {
    id: 52,
    hiragana: "りょうしん",
    romaji: "ryoushin",
    arti: "Kedua orang tua",
    kategori: "keluarga",
    kategoriLabel: "Keluarga & Kerabat",
    catatan: "Ayah dan ibu (orang tua sendiri)."
  },
  {
    id: 53,
    hiragana: "きょうだい",
    romaji: "kyoudai",
    arti: "Saudara kandung laki-laki / Saudara kandung",
    kategori: "keluarga",
    kategoriLabel: "Keluarga & Kerabat",
    catatan: "Bisa berarti saudara kandung secara umum."
  },
  {
    id: 54,
    hiragana: "しまい",
    romaji: "shimai",
    arti: "Saudara kandung perempuan",
    kategori: "keluarga",
    kategoriLabel: "Keluarga & Kerabat",
    catatan: "Kakak dan adik perempuan."
  },
  {
    id: 55,
    hiragana: "ちち",
    romaji: "chichi",
    arti: "Ayah (sendiri)",
    kategori: "keluarga",
    kategoriLabel: "Keluarga & Kerabat",
    catatan: "Dipakai saat menceritakan ayah sendiri kepada orang lain."
  },
  {
    id: 56,
    hiragana: "はは",
    romaji: "haha",
    arti: "Ibu (sendiri)",
    kategori: "keluarga",
    kategoriLabel: "Keluarga & Kerabat",
    catatan: "Dipakai saat menceritakan ibu sendiri kepada orang lain."
  },
  {
    id: 57,
    hiragana: "あに",
    romaji: "ani",
    arti: "Kakak laki-laki (sendiri)",
    kategori: "keluarga",
    kategoriLabel: "Keluarga & Kerabat",
    catatan: "Menyebut kakak laki-laki sendiri ke pihak luar."
  },
  {
    id: 58,
    hiragana: "あね",
    romaji: "ane",
    arti: "Kakak perempuan (sendiri)",
    kategori: "keluarga",
    kategoriLabel: "Keluarga & Kerabat",
    catatan: "Menyebut kakak perempuan sendiri ke pihak luar."
  },
  {
    id: 59,
    hiragana: "おとうと",
    romaji: "otooto",
    arti: "Adik laki-laki",
    kategori: "keluarga",
    kategoriLabel: "Keluarga & Kerabat",
    catatan: "Adik laki-laki sendiri."
  },
  {
    id: 60,
    hiragana: "いもうと",
    romaji: "imooto",
    arti: "Adik perempuan",
    kategori: "keluarga",
    kategoriLabel: "Keluarga & Kerabat",
    catatan: "Adik perempuan sendiri."
  },
  {
    id: 61,
    hiragana: "おじさん",
    romaji: "ojisan",
    arti: "Paman",
    kategori: "keluarga",
    kategoriLabel: "Keluarga & Kerabat",
    catatan: "Saudara orang tua / pria paruh baya."
  },
  {
    id: 62,
    hiragana: "おばさん",
    romaji: "obasan",
    arti: "Bibi",
    kategori: "keluarga",
    kategoriLabel: "Keluarga & Kerabat",
    catatan: "Saudari orang tua / wanita paruh baya."
  },
  {
    id: 63,
    hiragana: "おとうさん",
    romaji: "otousan",
    arti: "Panggilan kepada ayah / Ayah orang lain",
    kategori: "keluarga",
    kategoriLabel: "Keluarga & Kerabat",
    catatan: "Panggilan hormat / sopan."
  },
  {
    id: 64,
    hiragana: "おかあさん",
    romaji: "okaasan",
    arti: "Panggilan kepada ibu / Ibu orang lain",
    kategori: "keluarga",
    kategoriLabel: "Keluarga & Kerabat",
    catatan: "Panggilan hormat / sopan."
  },
  {
    id: 65,
    hiragana: "おにいさん",
    romaji: "oniisan",
    arti: "Panggilan kepada kakak laki-laki / Kakak pria orang lain",
    kategori: "keluarga",
    kategoriLabel: "Keluarga & Kerabat",
    catatan: "Panggilan hormat / sopan."
  },
  {
    id: 66,
    hiragana: "おねえさん",
    romaji: "oneesan",
    arti: "Panggilan kepada kakak perempuan / Kakak wanita orang lain",
    kategori: "keluarga",
    kategoriLabel: "Keluarga & Kerabat",
    catatan: "Panggilan hormat / sopan."
  },
  {
    id: 67,
    hiragana: "おじいさん",
    romaji: "ojiisan",
    arti: "Kakek (panggilan/kakek orang lain)",
    kategori: "keluarga",
    kategoriLabel: "Keluarga & Kerabat",
    catatan: "Chōon bunyi panjang (ii)."
  },
  {
    id: 68,
    hiragana: "おばあさん",
    romaji: "obaasan",
    arti: "Nenek (panggilan/nenek orang lain)",
    kategori: "keluarga",
    kategoriLabel: "Keluarga & Kerabat",
    catatan: "Chōon bunyi panjang (aa)."
  }
];
