export const offerFormSchema = [
    {
        id: "general",
        title: "01-SİPARİŞ İLE İLGİLİ GENEL BİLGİLER",
        fields: [
            { name: "teklifNo", label: "Teklif Numarası", type: "text", required: true },
            { name: "satisSorumlusu", label: "Satış Sorumlusu", type: "select", options: ["Metin Ünal", "Sinan Gülen", "Ufuk Özünlü"] },
            { name: "siparisCinsi", label: "Sipariş Giren/Satış Destek", type: "select", options: ["Metin Ünal", "Sinan Gülen"] },
            { name: "musteriAdi", label: "Müşteri Adı", type: "text", required: true, placeholder: "Cari Listeden Seçilebilir" },
            { name: "yurtIciDisi", label: "Yurt İçi/Yurt Dışı", type: "radio", options: ["Yurt İçi (Yi)", "Yurt Dışı (YD)"] },
            { name: "musteriTipi", label: "Müşteri Tipi", type: "select", options: ["Bayi", "Kamu", "Özel", "Stok Sipariş"] },
            { name: "siparisAdeti", label: "Sipariş Adeti", type: "number" },
            { name: "onayTarihi", label: "Müşteri Sipariş Onay Tarihi", type: "date" },
            { name: "talepTarihi", label: "Müşteri Talep Tarihi", type: "date" },
            { name: "tipOnayDurumu", label: "Tip Onay Belge Durumu", type: "select", options: ["Var", "Yok"] },
            { name: "tescilUlkesi", label: "Tescil Ülkesi", type: "select", options: ["Türkiye", "Bulgaristan", "Macaristan", "Polonya", "Portekiz", "Romanya", "Sırbistan", "Ukrayna", "Yunanistan", "KKTC", "Türkmenistan", "Azerbaycan", "Gürcistan", "Gana", "Nijerya", "Cezayir", "Katar", "Rusya", "Özbekistan", "Suudi Arabistan", "Liberya", "Umman", "Libya"] },
            { name: "sasiTipi", label: "Şasi Tipi", type: "select", options: ["Yarı Römork Şase", "Muavin Şase (Kamyon Üstü)"] },
            { name: "ustYapiTipi", label: "Üst Yapı Tipi", type: "select", options: ["Havuz Küvet / Kasa", "Jumbo Küvet / Kasa", "Half Pipe", "Köşeli Küvet / Kasa", "Karla Mücadele", "2 Yana Devirme", "3 Yana Devirme", "Akordeon Kasa", "Sac Lambiri Kasa", "Kapaklı Sabit Kasa", "Ahşap Kasa", "Üst Yapı Yok", "Diğer"] },
            { name: "teslimSekli", label: "Teslim Şekli", type: "select", options: ["Komple Teslim", "Müşteri Çekicisi İle Teslim", "Aracı Cekici İle Teslim"] },
            { name: "kamyonMarkasi", label: "Kamyon Markası", type: "select", options: ["FORD", "ISUZU", "MAN", "RENAULT", "SCANIA", "VOLVO", "MercedesBenz", "IVECO", "ASTRA", "HYUNDAI", "MITSUBISHI", "DAF", "BMC", "MACK", "Belirtilmemiş"] },
            { name: "kamyonModeli", label: "Kamyon Modeli", type: "text" },
            { name: "kamyonTahrikSistemi", label: "Kamyon Tahrik Sistemi", type: "select", options: ["4x2", "6x2", "6x4", "8x2", "8x4"] },
            { name: "kamyonKabinTipi", label: "Kamyon Kabin Tipi", type: "select", options: ["Yataklı", "Yataksız"] },
            { name: "kamyonTeslimTarihi", label: "Kamyon Teslim Tarihi", type: "date" },
            { name: "kamyonTalebi", label: "Kamyon Talebi", type: "select", options: ["Var", "Yok"] },
        ]
    },
    {
        id: "kasa",
        title: "02-KASA/KUVET İLE İLGİLİ BİLGİLER",
        fields: [
            {
                name: "hacimTipi", label: "Hacim Tipi", type: "volumeGroup", options: []
            },
            { name: "hacim", label: "Hacim", type: "text" },
            { name: "kasaUzunlugu", label: "Kasa Uzunluğu", type: "text" },
            { name: "kasaGenisligi", label: "Kasa Genişliği", type: "text" },
            { name: "kasaYuksekligi", label: "Kasa Yüksekliği", type: "text" },
            { name: "kuvetTabanSacKalinligi", label: "Kuvet Taban Sac Kalınlığı", type: "text" },
            { name: "kuvetYanDuvarSacKalinligi", label: "Kuvet Yan Duvar Sac Kalınlığı", type: "text" },
            { name: "kuvetOnDuvarSacKalinligi", label: "Kuvet Ön Duvar Sac Kalınlığı", type: "text" },
            { name: "kuvetArkaKapakSacKalinligi", label: "Kuvet Arka Kapak Sac Kalınlığı", type: "text" },
            { name: "damperSacMalzemesi", label: "Damper Küvet Sacı Malzemesi", type: "text" },
            { name: "siperlik", label: "Siperlik", type: "text" },
            { name: "emniyetKilitlemesi", label: "Emniyet Kilitlemesi", type: "text" },
            { name: "govdeEtekSaci", label: "Gövde Etek Sacı", type: "text" },
            { name: "arkaKapakTipi", label: "Arka Kapak Tipi", type: "select", options: ["Mekanik", "Hidrolik"] },
            { name: "brandaTipi", label: "Branda Tipi", type: "select", options: ["Otomatik", "Yok"] },
            { name: "silindirMarkasi", label: "Silindir Markası", type: "select", options: ["Hidromas", "Hyva"] },
            { name: "silindirTipi", label: "Silindir Tipi", type: "select", options: ["GSH 175-5-5550 C", "FE A169-5-05405"] },
            { name: "kurekTipi", label: "Kürek Tipi", type: "select", options: ["Kısa", "Uzun"] },
            { name: "yagTanki", label: "Yağ Tankı", type: "select", options: ["Çekici Üstü", "Şase Üstü", "Yok"] },
        ]
    },
    {
        id: "sasi",
        title: "03-ŞASİ/YÜRÜYEN İLE İLGİLİ BİLGİLER",
        fields: [
            { name: "saseMalzemesi", label: "Şase Malzemesi", type: "select", options: ["Strenx 700"] },
            {
                name: "dingilTipiVeAdeti", label: "Dingil Tipi/Adeti", type: "select", options: [
                    "TRAX Kampana - 3 ADT - 1 ve 2. Dingil Kaldırma",
                    "BPW Kampana - 3 ADT - 1 ve 2. Dingil Kaldırma",
                    "BPW Disk - 3 ADT - 1 ve 2. Dingil Kaldırma",
                    "TRAX Kampana - 3 ADT - 1. Dingil Kaldırma",
                    "BPW Kampana - 3 ADT - 1. Dingil Kaldırma",
                    "BPW Disk - 3 ADT - 1. Dingil Kaldırma"
                ]
            },
            { name: "dingilMesafesi", label: "Dingil Mesafesi (Wb)", type: "text" },
            { name: "dingillerArasiMesafe", label: "Dingiller Arası Mesafe", type: "text" },
            { name: "besinciTekerYuksekligi", label: "5.Tekerlek Yüksekliği", type: "text", placeholder: "Manuel Girilecek" },
            { name: "dingilYuku", label: "Dingil Yükü", type: "text" },
            { name: "kingpinKapasitesi", label: "Kingpin Kapasitesi", type: "select", options: ["12.000 kg"] },
            { name: "mekanikAyak", label: "Mekanik Ayak", type: "select", options: ["OMS", "SAF", "JOST"] },
            { name: "elektrikSistemi", label: "Elektrik Sistemi", type: "select", options: ["Standart", "Müşteri Talebi"] },
            { name: "frenSistemi", label: "Fren Sistemi", type: "select", options: ["WABCO - EBS 2S/2M", "KNOR - EBS 2S/2M"] },
            { name: "lastikMarkasi", label: "Lastik Markası", type: "select", options: ["Goodyear", "Continantel", "Bridgestone"] },
            { name: "lastikEbadi", label: "Lastik Ebadı", type: "text" },
            { name: "toplamLastikJantAdeti", label: "Toplam Lastik-Jant Adeti", type: "text" },
            { name: "camurlukTipi", label: "Çamurluk Tipi", type: "select", options: ["Plastik Çamurluk"] },
            { name: "bisikletKorkulugu", label: "Bisiklet Korkuluk Tipi", type: "select", options: ["Standart"] },
            { name: "suDeposu", label: "Su Deposu", type: "select", options: ["Var", "Yok"] },
            { name: "tampon", label: "Tampon", type: "select", options: ["Sabit Tampon", "Katlanır Tampon"] },
            { name: "stepneTasiyici", label: "Stepne Taşıyıcı Tipi", type: "select", options: ["Yok", "Damper Üstü - 1 ADT", "Şase Üstü - 1 ADT"] },
        ]
    },
    {
        id: "diger",
        title: "04-DİĞER ÖZELLİKLER",
        fields: [
            { name: "yanginDolabi", label: "Yangın Dolabı", type: "select", options: ["1 Adet Yangın Dolabı (Tüpsüz)", "2 Adet Yangın Dolabı (Tüpsüz)", "Yok"] },
            { name: "dolapTipi", label: "Takım Dolabı", type: "select", options: ["1 AD. Plastik Takım Dolabı 600", "Yok"] },
            { name: "uyariEtiketDili", label: "Uyarı Etiket Dili", type: "select", options: ["İngilizce", "Türkçe"] },
            { name: "merdiven", label: "Merdiven", type: "select", options: ["Var", "Yok"] },
            { name: "orjinalPto", label: "PTO", type: "select", options: ["Evet", "Hayır"] },
            { name: "hidrolikPompa", label: "Hidrolik Pompa", type: "select", options: ["Çift Kademe 82l/dk", "Çift Kademe 61l/dk", "Tek Kademe 61l/dk", "Tek Kademe 82l/dk"] },
            { name: "cekiSeti", label: "Çeki Seti", type: "select", options: ["Var", "Yok"] },
            { name: "sasiRengi", label: "Şasi Rengi", type: "select", options: ["RAL XXXX Füme", "RAL XXXX Siyah"] },
            { name: "damperKuvetRengi", label: "Damper Küvet Rengi", type: "select", options: ["RAL XXXX Beyaz", "RAL XXXX Füme", "RAL XXXX İren Sarısı", "RAL XXXX Kavun Sarısı", "RAL XXXX Lacivert", "RAL XXXX Turuncu"] },
            { name: "brandaRengi", label: "Branda Rengi", type: "select", options: ["RAL XXXX Beyaz", "RAL XXXX Füme", "RAL XXXX İren Sarısı", "RAL XXXX Kavun Sarısı", "RAL XXXX Lacivert", "RAL XXXX Turuncu"] },
            { name: "logo", label: "Logo", type: "select", options: ["Var", "Yok"] },

        ]
    }
];
