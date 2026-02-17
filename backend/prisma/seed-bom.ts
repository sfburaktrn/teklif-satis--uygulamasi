import { PrismaClient, Product } from '@prisma/client';

declare const process: any;

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding BOM data...');

    // 1. Clean up existing BOM data
    await prisma.bomRule.deleteMany({});
    await prisma.product.deleteMany({});

    // 2. Define Products
    const productsData = [
        // === HİDROLİK DORSE ===
        { name: 'ORTA BACAK', unit: 'Adet', category: 'HİDROLİK' },
        { name: "DÜŞÜRÜCÜ 18'LİK", unit: 'Adet', category: 'HİDROLİK' },
        { name: 'ARKA KAPAK PİSTONU 75*121*46cm', unit: 'Adet', category: 'HİDROLİK' },
        { name: "T ORTA BACAK 18'LİK", unit: 'Adet', category: 'HİDROLİK' },
        { name: '1/2-18 RAKOR', unit: 'Adet', category: 'HİDROLİK' },
        { name: "12'LİK HİDROLİK HORTUM 6000MM", unit: 'Adet', category: 'HİDROLİK' },
        { name: 'M12 YÜZÜK', unit: 'Adet', category: 'HİDROLİK' },
        { name: 'M12 SOMUN', unit: 'Adet', category: 'HİDROLİK' },
        { name: 'ÇEKSİZ HIZ AYAR VALFİ', unit: 'Adet', category: 'HİDROLİK' },
        { name: "ALÜMİNYUM KELEPÇE 12'LİK", unit: 'Adet', category: 'HİDROLİK' },
        { name: 'DÜZ PERDE GEÇİŞ M18 18*18', unit: 'Adet', category: 'HİDROLİK' },
        { name: 'L PERDE GEÇİŞ M18', unit: 'Adet', category: 'HİDROLİK' },
        { name: 'M18 DİRSEK', unit: 'Adet', category: 'HİDROLİK' },
        { name: 'HİDROLİK HORTUM 90° SOMUNLU DÜZ ERKEK 3/8" 1500MM', unit: 'Adet', category: 'HİDROLİK' },
        { name: 'HİDROLİK HORTUM İKİ TARAF SOMUNLU DÜZ 3/8" 15000MM', unit: 'Adet', category: 'HİDROLİK' },
        { name: 'HİDROLİK HORTUM 90° SOMUNLU DÜZ SOMUNLU 3/8" 650MM', unit: 'Adet', category: 'HİDROLİK' },
        { name: 'HİDROLİK HORTUM 90° SOMUNLU DÜZ ERKEK 3/8" 450MM', unit: 'Adet', category: 'HİDROLİK' },

        // === TAMAMLAMA (GLOBAL - Her teklifte) ===
        { name: 'BİSİKLET KORKULUK AYAĞI ŞASİ BAĞ.CİVATASI M12*30', unit: 'Adet', category: 'TAMAMLAMA', supplier: 'ÇELİK RULMAN / KALİTE CİVATA' },
        { name: 'BİSİKLET KORKULUK AYAĞI ŞASİ M12 PUL', unit: 'Adet', category: 'TAMAMLAMA', supplier: 'ÇELİK RULMAN / KALİTE CİVATA' },
        { name: 'BİSİKLET KORKULUK AYAĞI ŞASİ M12 FİBERLİ SOMUN', unit: 'Adet', category: 'TAMAMLAMA', supplier: 'ÇELİK RULMAN / KALİTE CİVATA' },
        { name: 'BİSİKLET KORKULUĞU AYAĞI CİVATASI M10*30', unit: 'Adet', category: 'TAMAMLAMA', supplier: 'ÇELİK RULMAN / KALİTE CİVATA' },
        { name: 'BİSİKLET KORKULUĞU AYAĞI CİVATASI M10 PUL', unit: 'Adet', category: 'TAMAMLAMA', supplier: 'ÇELİK RULMAN / KALİTE CİVATA' },
        { name: 'BİSİKLET KORKULUĞU AYAĞI CİVATASI M10 FİBERLİ SOMUN', unit: 'Adet', category: 'TAMAMLAMA', supplier: 'ÇELİK RULMAN / KALİTE CİVATA' },
        { name: 'DÜZ ALÜMİNYUM PROFİL 500M', unit: 'Adet', category: 'TAMAMLAMA', supplier: 'NEVPA' },
        { name: 'KÖŞE PROFİL 720M', unit: 'Adet', category: 'TAMAMLAMA', supplier: 'NEVPA' },
        { name: 'DÜZ PROFİL DİKDÖRTGEN PLASTİK TAPA', unit: 'Adet', category: 'TAMAMLAMA', supplier: 'NEVPA' },
        { name: 'OVAL TAPA', unit: 'Adet', category: 'TAMAMLAMA', supplier: 'NEVPA' },
        { name: 'ALÜMİNYUM PROFİL BAĞ.CİVATASI M8*15', unit: 'Adet', category: 'TAMAMLAMA', supplier: 'ÇELİK RULMAN / KALİTE CİVATA' },
        { name: 'ALÜMİNYUM BAĞ.KARE SOMUN M8', unit: 'Adet', category: 'TAMAMLAMA', supplier: 'ÇELİK RULMAN / KALİTE CİVATA' },
        { name: 'ALÜMİNYUM PERÇİN', unit: 'Adet', category: 'TAMAMLAMA', supplier: 'ÇELİK RULMAN / KALİTE CİVATA' },
        { name: 'ÇAMURLUK BORUSU DÜZ 530M', unit: 'Adet', category: 'TAMAMLAMA', supplier: 'NEVPA / AKYÜZLER' },
        { name: 'ÇAMURLUK BORUSU LAMBA AYAKLI', unit: 'Adet', category: 'TAMAMLAMA', supplier: 'NEVPA / AKYÜZLER' },
        { name: 'PLASTİK ÇAMURLUK', unit: 'Adet', category: 'TAMAMLAMA', supplier: 'NEVPA' },
        { name: 'ÇAMURLUK KELEPÇESİ', unit: 'Adet', category: 'TAMAMLAMA', supplier: 'NEVPA' },
        { name: '400*400 PASPAS', unit: 'Adet', category: 'TAMAMLAMA', supplier: 'ÖZARSLAN' },
        { name: 'PASPAS CİVATASI M8*25', unit: 'Adet', category: 'TAMAMLAMA', supplier: 'ÇELİK RULMAN / KALİTE CİVATA' },
        { name: 'PASPAS CİVATASI M8 SOMUN', unit: 'Adet', category: 'TAMAMLAMA', supplier: 'ÇELİK RULMAN / KALİTE CİVATA' },
        { name: 'PASPAS CİVATASI M8 PUL', unit: 'Adet', category: 'TAMAMLAMA', supplier: 'ÇELİK RULMAN / KALİTE CİVATA' },

        // === BOYA (GLOBAL - Her teklifte) ===
        { name: 'ZIMPARA', unit: 'Adet', category: 'BOYA', supplier: 'KANAT BOYA' },
        { name: 'TEMİZLİK TİNERİ', unit: 'Litre', category: 'BOYA', supplier: 'KANAT BOYA' },
        { name: 'SELÜLOZİK TİNER', unit: 'Litre', category: 'BOYA', supplier: 'KANAT BOYA' },
        { name: 'İZOMASTİK', unit: 'Adet', category: 'BOYA', supplier: 'KANAT BOYA' },
        { name: 'MACUN', unit: 'Adet', category: 'BOYA', supplier: 'KANAT BOYA' },
        { name: 'EPOKSİ ASTAR', unit: 'Kilogram', category: 'BOYA', supplier: 'KANAT BOYA' },
        { name: 'ASTAR SERTLEŞTİRİCİ', unit: 'Kilogram', category: 'BOYA', supplier: 'KANAT BOYA' },
        { name: 'BOYA', unit: 'Kilogram', category: 'BOYA', supplier: 'KANAT BOYA' },
        { name: 'BOYA SERTLEŞTİRİCİ', unit: 'Kilogram', category: 'BOYA', supplier: 'KANAT BOYA' },
        { name: 'AKRİLİK TİNER', unit: 'Kilogram', category: 'BOYA', supplier: 'KANAT BOYA' },

        // === TAMAMLAMA - ELEKTRİK (GLOBAL) ===
        { name: 'M14*25 KİLİT KAPAMA CİVATASI 1.5 DİŞ', unit: 'Adet', category: 'TAMAMLAMA', supplier: 'ÇELİK RULMAN / KALİTE CİVATA' },
        { name: 'STOP KAFES CİVATASI M6*25', unit: 'Adet', category: 'TAMAMLAMA', supplier: 'ÇELİK RULMAN / KALİTE CİVATA' },
        { name: 'STOP KAFES CİVATASI M6 ŞAPKALI SOMUN', unit: 'Adet', category: 'TAMAMLAMA', supplier: 'ÇELİK RULMAN / KALİTE CİVATA' },

        // === DORSE ELEKTRİK (GLOBAL) ===
        { name: 'SERTPLAS ELEKTİRİK SETİ', unit: 'Set', category: 'DORSE ELEKTRİK', supplier: 'SERTPLAS' },
        { name: 'İKAZ SWİCH M123 (EMAS)', unit: 'Adet', category: 'DORSE ELEKTRİK', supplier: 'SANLTOP / ÇAĞRI ELEKTİRİK' },
        { name: 'ÖN BOYNUZ LAMBA CİVATASI M4*40', unit: 'Adet', category: 'DORSE ELEKTRİK', supplier: 'ÇELİK RULMAN / KALİTE CİVATA' },
        { name: 'ÖN BOYNUZ LAMBA M4 SOMUN', unit: 'Adet', category: 'DORSE ELEKTRİK', supplier: 'ÇELİK RULMAN / KALİTE CİVATA' },
        { name: 'ÖN BOYNUZ LAMBA M4 PUL', unit: 'Adet', category: 'DORSE ELEKTRİK', supplier: 'ÇELİK RULMAN / KALİTE CİVATA' },
        { name: 'BAYPAS SWİCH M311 (EMAS)', unit: 'Adet', category: 'DORSE ELEKTRİK', supplier: 'SANLTOP / ÇAĞRI ELEKTİRİK' },
        { name: 'PLASTİK REKOR (MUTLUSAN) 13.5', unit: 'Adet', category: 'DORSE ELEKTRİK', supplier: 'EMRE ELEKTRİK / EMH ELEKTRİK' },
        { name: '300*4,5 CIRT KELEPÇE (MUTLUSAN)', unit: 'Adet', category: 'DORSE ELEKTRİK', supplier: 'EMRE ELEKTRİK / EMH ELEKTRİK' },
        { name: 'İZOLE BANT SİYAH', unit: 'Adet', category: 'DORSE ELEKTRİK', supplier: 'EMRE ELEKTRİK / EMH ELEKTRİK' },

        // === TAMAMLAMA - ETİKET (GLOBAL) ===
        { name: 'ETİKET SETİ', unit: 'Set', category: 'TAMAMLAMA', supplier: 'EL-MET' },
        { name: 'ŞASE NUMARA ETİKETİ', unit: 'Adet', category: 'TAMAMLAMA', supplier: 'EL MET' },
        { name: 'İMALAT NO ETİKETİ', unit: 'Adet', category: 'TAMAMLAMA', supplier: 'EL MET' },
        { name: 'HARDOX ETİKET BÜYÜK', unit: 'Adet', category: 'TAMAMLAMA', supplier: 'SSAB' },
        { name: 'HARDOX ETİKET KÜÇÜK', unit: 'Adet', category: 'TAMAMLAMA', supplier: 'SSAB' },
        { name: 'DORSE REFLEKTÖR', unit: 'Adet', category: 'TAMAMLAMA', supplier: 'NEVPA' },

        // === YÜRÜR AKSAM - TRAX Kampana (koşullu) ===
        { name: 'ÖZKOÇ DİNGİL FUL SET', unit: 'Adet', category: 'YÜRÜR AKSAM', supplier: 'ÖZKOÇ' },
        { name: '813 SÜSPANSİYON KÖRÜĞÜ', unit: 'Adet', category: 'YÜRÜR AKSAM', supplier: 'ÖZKOÇ' },
        { name: '1/4 DÜZ ŞİPŞAK 8 LİK DİNGİL KALDIRMA KÖRÜĞÜ İÇİN', unit: 'Adet', category: 'YÜRÜR AKSAM', supplier: 'ATHAN' },
        { name: 'SÜSPANSİYON KÖRÜĞÜ ALT CİVATA M16*70', unit: 'Adet', category: 'YÜRÜR AKSAM', supplier: 'ÇELİK RULMAN / KALİTE CİVATA' },
        { name: 'ÖZKOÇ SÜSPANSİYON KÖRÜĞÜ CİVATASI M12*30', unit: 'Adet', category: 'YÜRÜR AKSAM', supplier: 'ÇELİK RULMAN / KALİTE CİVATA' },
        { name: 'ÖZKOÇ SÜSPANSİYON KÖRÜĞÜ BAĞ. FİBERLİ SOMUN M12', unit: 'Adet', category: 'YÜRÜR AKSAM', supplier: 'ÇELİK RULMAN / KALİTE CİVATA' },
        { name: 'ÖZKOÇ SÜSPANSİYON KÖRÜĞÜ M12 PUL', unit: 'Adet', category: 'YÜRÜR AKSAM', supplier: 'ÇELİK RULMAN / KALİTE CİVATA' },

        // === YÜRÜR AKSAM - BPW Kampana (koşullu) ===
        { name: 'BPW DİNGİL', unit: 'Adet', category: 'YÜRÜR AKSAM', supplier: 'BPW' },
        { name: 'BPW ARFESAN FREN KÖRÜK 24*30', unit: 'Adet', category: 'YÜRÜR AKSAM', supplier: 'FIRAT OTO / ÖZKOÇ' },
        { name: 'BPW ARFESAN FREN KÖRÜK 24LÜK', unit: 'Adet', category: 'YÜRÜR AKSAM', supplier: 'FIRAT OTO / ÖZKOÇ' },
        { name: 'BPW SÜSPANSİYON KÖRÜĞÜ LS 41010 N P03', unit: 'Adet', category: 'YÜRÜR AKSAM', supplier: 'BPW' },
        { name: 'BPW DİNGİL KALDIRMA SETİ', unit: 'Adet', category: 'YÜRÜR AKSAM', supplier: 'ÖZKOÇ' },
        { name: 'BPW DİNGİL KALDIRMA KÖRÜĞÜ', unit: 'Adet', category: 'YÜRÜR AKSAM', supplier: 'ÖZKOÇ' },
        { name: 'M24*230 DİNGİL KALDIRMA SAPLAMASI 10,9 KALİTE', unit: 'Adet', category: 'YÜRÜR AKSAM', supplier: 'ÇELİK RULMAN / KALİTE CİVATA' },
    ];

    const products: Product[] = [];
    for (const p of productsData) {
        const product = await prisma.product.create({
            data: p,
        });
        products.push(product);
    }

    console.log(`Created ${products.length} products.`);

    // 3. Define Rules
    const findId = (name: string) => products.find(p => p.name === name)?.id;

    const rulesData = [
        // === Condition: Arka Kapak Tipi = Hidrolik (18 satır) ===
        { productId: findId('ORTA BACAK'), quantity: 1, fieldName: 'arkaKapakTipi', fieldValue: 'Hidrolik', groupName: 'HİDROLİK DORSE' },
        { productId: findId("DÜŞÜRÜCÜ 18'LİK"), quantity: 1, fieldName: 'arkaKapakTipi', fieldValue: 'Hidrolik', groupName: 'HİDROLİK DORSE' },
        { productId: findId('ARKA KAPAK PİSTONU 75*121*46cm'), quantity: 2, fieldName: 'arkaKapakTipi', fieldValue: 'Hidrolik', groupName: 'HİDROLİK DORSE' },
        { productId: findId("T ORTA BACAK 18'LİK"), quantity: 1, fieldName: 'arkaKapakTipi', fieldValue: 'Hidrolik', groupName: 'HİDROLİK DORSE' },
        { productId: findId('1/2-18 RAKOR'), quantity: 1, fieldName: 'arkaKapakTipi', fieldValue: 'Hidrolik', groupName: 'HİDROLİK DORSE' },
        { productId: findId("12'LİK HİDROLİK HORTUM 6000MM"), quantity: 1, fieldName: 'arkaKapakTipi', fieldValue: 'Hidrolik', groupName: 'HİDROLİK DORSE' },
        { productId: findId('M12 YÜZÜK'), quantity: 4, fieldName: 'arkaKapakTipi', fieldValue: 'Hidrolik', groupName: 'HİDROLİK DORSE' },
        { productId: findId('M12 SOMUN'), quantity: 4, fieldName: 'arkaKapakTipi', fieldValue: 'Hidrolik', groupName: 'HİDROLİK DORSE' },
        { productId: findId('ÇEKSİZ HIZ AYAR VALFİ'), quantity: 1, fieldName: 'arkaKapakTipi', fieldValue: 'Hidrolik', groupName: 'HİDROLİK DORSE' },
        { productId: findId('1/2-18 RAKOR'), quantity: 1, fieldName: 'arkaKapakTipi', fieldValue: 'Hidrolik', groupName: 'HİDROLİK DORSE' },
        { productId: findId("ALÜMİNYUM KELEPÇE 12'LİK"), quantity: 4, fieldName: 'arkaKapakTipi', fieldValue: 'Hidrolik', groupName: 'HİDROLİK DORSE' },
        { productId: findId('DÜZ PERDE GEÇİŞ M18 18*18'), quantity: 1, fieldName: 'arkaKapakTipi', fieldValue: 'Hidrolik', groupName: 'HİDROLİK DORSE' },
        { productId: findId('L PERDE GEÇİŞ M18'), quantity: 2, fieldName: 'arkaKapakTipi', fieldValue: 'Hidrolik', groupName: 'HİDROLİK DORSE' },
        { productId: findId('M18 DİRSEK'), quantity: 1, fieldName: 'arkaKapakTipi', fieldValue: 'Hidrolik', groupName: 'HİDROLİK DORSE' },
        { productId: findId('HİDROLİK HORTUM 90° SOMUNLU DÜZ ERKEK 3/8" 1500MM'), quantity: 1, fieldName: 'arkaKapakTipi', fieldValue: 'Hidrolik', groupName: 'HİDROLİK DORSE' },
        { productId: findId('HİDROLİK HORTUM İKİ TARAF SOMUNLU DÜZ 3/8" 15000MM'), quantity: 2, fieldName: 'arkaKapakTipi', fieldValue: 'Hidrolik', groupName: 'HİDROLİK DORSE' },
        { productId: findId('HİDROLİK HORTUM 90° SOMUNLU DÜZ SOMUNLU 3/8" 650MM'), quantity: 2, fieldName: 'arkaKapakTipi', fieldValue: 'Hidrolik', groupName: 'HİDROLİK DORSE' },
        { productId: findId('HİDROLİK HORTUM 90° SOMUNLU DÜZ ERKEK 3/8" 450MM'), quantity: 1, fieldName: 'arkaKapakTipi', fieldValue: 'Hidrolik', groupName: 'HİDROLİK DORSE' },

        // === GLOBAL - TAMAMLAMA (Her teklifte, koşulsuz, 21 satır) ===
        { productId: findId('BİSİKLET KORKULUK AYAĞI ŞASİ BAĞ.CİVATASI M12*30'), quantity: 8, fieldName: 'GLOBAL', fieldValue: null, groupName: 'TAMAMLAMA' },
        { productId: findId('BİSİKLET KORKULUK AYAĞI ŞASİ M12 PUL'), quantity: 8, fieldName: 'GLOBAL', fieldValue: null, groupName: 'TAMAMLAMA' },
        { productId: findId('BİSİKLET KORKULUK AYAĞI ŞASİ M12 FİBERLİ SOMUN'), quantity: 8, fieldName: 'GLOBAL', fieldValue: null, groupName: 'TAMAMLAMA' },
        { productId: findId('BİSİKLET KORKULUĞU AYAĞI CİVATASI M10*30'), quantity: 8, fieldName: 'GLOBAL', fieldValue: null, groupName: 'TAMAMLAMA' },
        { productId: findId('BİSİKLET KORKULUĞU AYAĞI CİVATASI M10 PUL'), quantity: 16, fieldName: 'GLOBAL', fieldValue: null, groupName: 'TAMAMLAMA' },
        { productId: findId('BİSİKLET KORKULUĞU AYAĞI CİVATASI M10 FİBERLİ SOMUN'), quantity: 8, fieldName: 'GLOBAL', fieldValue: null, groupName: 'TAMAMLAMA' },
        { productId: findId('DÜZ ALÜMİNYUM PROFİL 500M'), quantity: 6, fieldName: 'GLOBAL', fieldValue: null, groupName: 'TAMAMLAMA' },
        { productId: findId('KÖŞE PROFİL 720M'), quantity: 2, fieldName: 'GLOBAL', fieldValue: null, groupName: 'TAMAMLAMA' },
        { productId: findId('DÜZ PROFİL DİKDÖRTGEN PLASTİK TAPA'), quantity: 12, fieldName: 'GLOBAL', fieldValue: null, groupName: 'TAMAMLAMA' },
        { productId: findId('OVAL TAPA'), quantity: 2, fieldName: 'GLOBAL', fieldValue: null, groupName: 'TAMAMLAMA' },
        { productId: findId('ALÜMİNYUM PROFİL BAĞ.CİVATASI M8*15'), quantity: 12, fieldName: 'GLOBAL', fieldValue: null, groupName: 'TAMAMLAMA' },
        { productId: findId('ALÜMİNYUM BAĞ.KARE SOMUN M8'), quantity: 12, fieldName: 'GLOBAL', fieldValue: null, groupName: 'TAMAMLAMA' },
        { productId: findId('ALÜMİNYUM PERÇİN'), quantity: 14, fieldName: 'GLOBAL', fieldValue: null, groupName: 'TAMAMLAMA' },
        { productId: findId('ÇAMURLUK BORUSU DÜZ 530M'), quantity: 10, fieldName: 'GLOBAL', fieldValue: null, groupName: 'TAMAMLAMA' },
        { productId: findId('ÇAMURLUK BORUSU LAMBA AYAKLI'), quantity: 2, fieldName: 'GLOBAL', fieldValue: null, groupName: 'TAMAMLAMA' },
        { productId: findId('PLASTİK ÇAMURLUK'), quantity: 6, fieldName: 'GLOBAL', fieldValue: null, groupName: 'TAMAMLAMA' },
        { productId: findId('ÇAMURLUK KELEPÇESİ'), quantity: 12, fieldName: 'GLOBAL', fieldValue: null, groupName: 'TAMAMLAMA' },
        { productId: findId('400*400 PASPAS'), quantity: 2, fieldName: 'GLOBAL', fieldValue: null, groupName: 'TAMAMLAMA' },
        { productId: findId('PASPAS CİVATASI M8*25'), quantity: 6, fieldName: 'GLOBAL', fieldValue: null, groupName: 'TAMAMLAMA' },
        { productId: findId('PASPAS CİVATASI M8 SOMUN'), quantity: 6, fieldName: 'GLOBAL', fieldValue: null, groupName: 'TAMAMLAMA' },
        { productId: findId('PASPAS CİVATASI M8 PUL'), quantity: 6, fieldName: 'GLOBAL', fieldValue: null, groupName: 'TAMAMLAMA' },

        // === GLOBAL - BOYA (Her teklifte, koşulsuz, 10 satır) ===
        { productId: findId('ZIMPARA'), quantity: 30, fieldName: 'GLOBAL', fieldValue: null, groupName: 'BOYA' },
        { productId: findId('TEMİZLİK TİNERİ'), quantity: 4, fieldName: 'GLOBAL', fieldValue: null, groupName: 'BOYA' },
        { productId: findId('SELÜLOZİK TİNER'), quantity: 5, fieldName: 'GLOBAL', fieldValue: null, groupName: 'BOYA' },
        { productId: findId('İZOMASTİK'), quantity: 1, fieldName: 'GLOBAL', fieldValue: null, groupName: 'BOYA' },
        { productId: findId('MACUN'), quantity: 1, fieldName: 'GLOBAL', fieldValue: null, groupName: 'BOYA' },
        { productId: findId('EPOKSİ ASTAR'), quantity: 12, fieldName: 'GLOBAL', fieldValue: null, groupName: 'BOYA' },
        { productId: findId('ASTAR SERTLEŞTİRİCİ'), quantity: 3, fieldName: 'GLOBAL', fieldValue: null, groupName: 'BOYA' },
        { productId: findId('BOYA'), quantity: 10, fieldName: 'GLOBAL', fieldValue: null, groupName: 'BOYA' },
        { productId: findId('BOYA SERTLEŞTİRİCİ'), quantity: 5, fieldName: 'GLOBAL', fieldValue: null, groupName: 'BOYA' },
        { productId: findId('AKRİLİK TİNER'), quantity: 1, fieldName: 'GLOBAL', fieldValue: null, groupName: 'BOYA' },

        // === GLOBAL - TAMAMLAMA ELEKTRİK (3 satır) ===
        { productId: findId('M14*25 KİLİT KAPAMA CİVATASI 1.5 DİŞ'), quantity: 8, fieldName: 'GLOBAL', fieldValue: null, groupName: 'TAMAMLAMA' },
        { productId: findId('STOP KAFES CİVATASI M6*25'), quantity: 4, fieldName: 'GLOBAL', fieldValue: null, groupName: 'TAMAMLAMA' },
        { productId: findId('STOP KAFES CİVATASI M6 ŞAPKALI SOMUN'), quantity: 4, fieldName: 'GLOBAL', fieldValue: null, groupName: 'TAMAMLAMA' },

        // === GLOBAL - DORSE ELEKTRİK (12 satır) ===
        { productId: findId('SERTPLAS ELEKTİRİK SETİ'), quantity: 1, fieldName: 'GLOBAL', fieldValue: null, groupName: 'DORSE ELEKTRİK' },
        { productId: findId('İKAZ SWİCH M123 (EMAS)'), quantity: 1, fieldName: 'GLOBAL', fieldValue: null, groupName: 'DORSE ELEKTRİK' },
        { productId: findId('ÖN BOYNUZ LAMBA CİVATASI M4*40'), quantity: 4, fieldName: 'GLOBAL', fieldValue: null, groupName: 'DORSE ELEKTRİK' },
        { productId: findId('ÖN BOYNUZ LAMBA M4 SOMUN'), quantity: 4, fieldName: 'GLOBAL', fieldValue: null, groupName: 'DORSE ELEKTRİK' },
        { productId: findId('ÖN BOYNUZ LAMBA M4 PUL'), quantity: 4, fieldName: 'GLOBAL', fieldValue: null, groupName: 'DORSE ELEKTRİK' },
        { productId: findId('BAYPAS SWİCH M311 (EMAS)'), quantity: 1, fieldName: 'GLOBAL', fieldValue: null, groupName: 'DORSE ELEKTRİK' },
        { productId: findId('ÖN BOYNUZ LAMBA CİVATASI M4*40'), quantity: 4, fieldName: 'GLOBAL', fieldValue: null, groupName: 'DORSE ELEKTRİK' },
        { productId: findId('ÖN BOYNUZ LAMBA M4 SOMUN'), quantity: 4, fieldName: 'GLOBAL', fieldValue: null, groupName: 'DORSE ELEKTRİK' },
        { productId: findId('ÖN BOYNUZ LAMBA M4 PUL'), quantity: 4, fieldName: 'GLOBAL', fieldValue: null, groupName: 'DORSE ELEKTRİK' },
        { productId: findId('PLASTİK REKOR (MUTLUSAN) 13.5'), quantity: 2, fieldName: 'GLOBAL', fieldValue: null, groupName: 'DORSE ELEKTRİK' },
        { productId: findId('300*4,5 CIRT KELEPÇE (MUTLUSAN)'), quantity: 100, fieldName: 'GLOBAL', fieldValue: null, groupName: 'DORSE ELEKTRİK' },
        { productId: findId('İZOLE BANT SİYAH'), quantity: 8, fieldName: 'GLOBAL', fieldValue: null, groupName: 'DORSE ELEKTRİK' },

        // === GLOBAL - TAMAMLAMA ETİKET (6 satır) ===
        { productId: findId('ETİKET SETİ'), quantity: 1, fieldName: 'GLOBAL', fieldValue: null, groupName: 'TAMAMLAMA' },
        { productId: findId('ŞASE NUMARA ETİKETİ'), quantity: 1, fieldName: 'GLOBAL', fieldValue: null, groupName: 'TAMAMLAMA' },
        { productId: findId('İMALAT NO ETİKETİ'), quantity: 1, fieldName: 'GLOBAL', fieldValue: null, groupName: 'TAMAMLAMA' },
        { productId: findId('HARDOX ETİKET BÜYÜK'), quantity: 1, fieldName: 'GLOBAL', fieldValue: null, groupName: 'TAMAMLAMA' },
        { productId: findId('HARDOX ETİKET KÜÇÜK'), quantity: 1, fieldName: 'GLOBAL', fieldValue: null, groupName: 'TAMAMLAMA' },
        { productId: findId('DORSE REFLEKTÖR'), quantity: 2, fieldName: 'GLOBAL', fieldValue: null, groupName: 'TAMAMLAMA' },

        // === KOŞULLU - YÜRÜR AKSAM: TRAX Kampana (7 satır) ===
        { productId: findId('ÖZKOÇ DİNGİL FUL SET'), quantity: 3, fieldName: 'dingilTipiVeAdeti', fieldValue: 'TRAX Kampana - 3 ADT - 1 ve 2. Dingil Kaldırma', groupName: 'YÜRÜR AKSAM' },
        { productId: findId('813 SÜSPANSİYON KÖRÜĞÜ'), quantity: 6, fieldName: 'dingilTipiVeAdeti', fieldValue: 'TRAX Kampana - 3 ADT - 1 ve 2. Dingil Kaldırma', groupName: 'YÜRÜR AKSAM' },
        { productId: findId('1/4 DÜZ ŞİPŞAK 8 LİK DİNGİL KALDIRMA KÖRÜĞÜ İÇİN'), quantity: 4, fieldName: 'dingilTipiVeAdeti', fieldValue: 'TRAX Kampana - 3 ADT - 1 ve 2. Dingil Kaldırma', groupName: 'YÜRÜR AKSAM' },
        { productId: findId('SÜSPANSİYON KÖRÜĞÜ ALT CİVATA M16*70'), quantity: 12, fieldName: 'dingilTipiVeAdeti', fieldValue: 'TRAX Kampana - 3 ADT - 1 ve 2. Dingil Kaldırma', groupName: 'YÜRÜR AKSAM' },
        { productId: findId('ÖZKOÇ SÜSPANSİYON KÖRÜĞÜ CİVATASI M12*30'), quantity: 24, fieldName: 'dingilTipiVeAdeti', fieldValue: 'TRAX Kampana - 3 ADT - 1 ve 2. Dingil Kaldırma', groupName: 'YÜRÜR AKSAM' },
        { productId: findId('ÖZKOÇ SÜSPANSİYON KÖRÜĞÜ BAĞ. FİBERLİ SOMUN M12'), quantity: 24, fieldName: 'dingilTipiVeAdeti', fieldValue: 'TRAX Kampana - 3 ADT - 1 ve 2. Dingil Kaldırma', groupName: 'YÜRÜR AKSAM' },
        { productId: findId('ÖZKOÇ SÜSPANSİYON KÖRÜĞÜ M12 PUL'), quantity: 48, fieldName: 'dingilTipiVeAdeti', fieldValue: 'TRAX Kampana - 3 ADT - 1 ve 2. Dingil Kaldırma', groupName: 'YÜRÜR AKSAM' },

        // === KOŞULLU - YÜRÜR AKSAM: BPW Kampana (8 satır) ===
        { productId: findId('BPW DİNGİL'), quantity: 3, fieldName: 'dingilTipiVeAdeti', fieldValue: 'BPW Kampana - 3 ADT - 1 ve 2. Dingil Kaldırma', groupName: 'YÜRÜR AKSAM' },
        { productId: findId('BPW ARFESAN FREN KÖRÜK 24*30'), quantity: 4, fieldName: 'dingilTipiVeAdeti', fieldValue: 'BPW Kampana - 3 ADT - 1 ve 2. Dingil Kaldırma', groupName: 'YÜRÜR AKSAM' },
        { productId: findId('BPW ARFESAN FREN KÖRÜK 24LÜK'), quantity: 2, fieldName: 'dingilTipiVeAdeti', fieldValue: 'BPW Kampana - 3 ADT - 1 ve 2. Dingil Kaldırma', groupName: 'YÜRÜR AKSAM' },
        { productId: findId('BPW SÜSPANSİYON KÖRÜĞÜ LS 41010 N P03'), quantity: 6, fieldName: 'dingilTipiVeAdeti', fieldValue: 'BPW Kampana - 3 ADT - 1 ve 2. Dingil Kaldırma', groupName: 'YÜRÜR AKSAM' },
        { productId: findId('BPW DİNGİL KALDIRMA SETİ'), quantity: 4, fieldName: 'dingilTipiVeAdeti', fieldValue: 'BPW Kampana - 3 ADT - 1 ve 2. Dingil Kaldırma', groupName: 'YÜRÜR AKSAM' },
        { productId: findId('BPW DİNGİL KALDIRMA KÖRÜĞÜ'), quantity: 4, fieldName: 'dingilTipiVeAdeti', fieldValue: 'BPW Kampana - 3 ADT - 1 ve 2. Dingil Kaldırma', groupName: 'YÜRÜR AKSAM' },
        { productId: findId('1/4 DÜZ ŞİPŞAK 8 LİK DİNGİL KALDIRMA KÖRÜĞÜ İÇİN'), quantity: 4, fieldName: 'dingilTipiVeAdeti', fieldValue: 'BPW Kampana - 3 ADT - 1 ve 2. Dingil Kaldırma', groupName: 'YÜRÜR AKSAM' },
        { productId: findId('M24*230 DİNGİL KALDIRMA SAPLAMASI 10,9 KALİTE'), quantity: 4, fieldName: 'dingilTipiVeAdeti', fieldValue: 'BPW Kampana - 3 ADT - 1 ve 2. Dingil Kaldırma', groupName: 'YÜRÜR AKSAM' },
    ];

    let ruleCount = 0;
    for (const r of rulesData) {
        if (r.productId) {
            await prisma.bomRule.create({
                data: {
                    fieldName: r.fieldName,
                    fieldValue: r.fieldValue,
                    groupName: r.groupName,
                    quantity: r.quantity,
                    productId: r.productId,
                }
            });
            ruleCount++;
        }
    }

    console.log(`Created ${ruleCount} BOM rules.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
