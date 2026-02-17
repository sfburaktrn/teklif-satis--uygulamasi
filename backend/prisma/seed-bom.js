"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding BOM data...');
    const productsData = [
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
        { name: 'STANDART KULLANIM KILAVUZU', unit: 'Adet', category: 'GENEL' },
        { name: 'GÜVENLİK ETİKET SETİ', unit: 'Takım', category: 'GENEL' },
    ];
    const products = [];
    for (const p of productsData) {
        const product = await prisma.product.create({
            data: p,
        });
        products.push(product);
    }
    console.log(`Created ${products.length} products.`);
    const findId = (name) => { var _a; return (_a = products.find(p => p.name === name)) === null || _a === void 0 ? void 0 : _a.id; };
    const rulesData = [
        { productId: findId('ORTA BACAK'), quantity: 1, fieldName: 'arkaKapakTipi', fieldValue: 'Hidrolik', groupName: 'HİDROLİK DORSE' },
        { productId: findId("DÜŞÜRÜCÜ 18'LİK"), quantity: 1, fieldName: 'arkaKapakTipi', fieldValue: 'Hidrolik', groupName: 'HİDROLİK DORSE' },
        { productId: findId('ARKA KAPAK PİSTONU 75*121*46cm'), quantity: 2, fieldName: 'arkaKapakTipi', fieldValue: 'Hidrolik', groupName: 'HİDROLİK DORSE' },
        { productId: findId("T ORTA BACAK 18'LİK"), quantity: 1, fieldName: 'arkaKapakTipi', fieldValue: 'Hidrolik', groupName: 'HİDROLİK DORSE' },
        { productId: findId('1/2-18 RAKOR'), quantity: 2, fieldName: 'arkaKapakTipi', fieldValue: 'Hidrolik', groupName: 'HİDROLİK DORSE' },
        { productId: findId("12'LİK HİDROLİK HORTUM 6000MM"), quantity: 1, fieldName: 'arkaKapakTipi', fieldValue: 'Hidrolik', groupName: 'HİDROLİK DORSE' },
        { productId: findId('M12 YÜZÜK'), quantity: 4, fieldName: 'arkaKapakTipi', fieldValue: 'Hidrolik', groupName: 'HİDROLİK DORSE' },
        { productId: findId('M12 SOMUN'), quantity: 4, fieldName: 'arkaKapakTipi', fieldValue: 'Hidrolik', groupName: 'HİDROLİK DORSE' },
        { productId: findId('ÇEKSİZ HIZ AYAR VALFİ'), quantity: 1, fieldName: 'arkaKapakTipi', fieldValue: 'Hidrolik', groupName: 'HİDROLİK DORSE' },
        { productId: findId("ALÜMİNYUM KELEPÇE 12'LİK"), quantity: 4, fieldName: 'arkaKapakTipi', fieldValue: 'Hidrolik', groupName: 'HİDROLİK DORSE' },
        { productId: findId('DÜZ PERDE GEÇİŞ M18 18*18'), quantity: 1, fieldName: 'arkaKapakTipi', fieldValue: 'Hidrolik', groupName: 'HİDROLİK DORSE' },
        { productId: findId('L PERDE GEÇİŞ M18'), quantity: 2, fieldName: 'arkaKapakTipi', fieldValue: 'Hidrolik', groupName: 'HİDROLİK DORSE' },
        { productId: findId('M18 DİRSEK'), quantity: 1, fieldName: 'arkaKapakTipi', fieldValue: 'Hidrolik', groupName: 'HİDROLİK DORSE' },
        { productId: findId('HİDROLİK HORTUM 90° SOMUNLU DÜZ ERKEK 3/8" 1500MM'), quantity: 1, fieldName: 'arkaKapakTipi', fieldValue: 'Hidrolik', groupName: 'HİDROLİK DORSE' },
        { productId: findId('HİDROLİK HORTUM İKİ TARAF SOMUNLU DÜZ 3/8" 15000MM'), quantity: 2, fieldName: 'arkaKapakTipi', fieldValue: 'Hidrolik', groupName: 'HİDROLİK DORSE' },
        { productId: findId('HİDROLİK HORTUM 90° SOMUNLU DÜZ SOMUNLU 3/8" 650MM'), quantity: 2, fieldName: 'arkaKapakTipi', fieldValue: 'Hidrolik', groupName: 'HİDROLİK DORSE' },
        { productId: findId('HİDROLİK HORTUM 90° SOMUNLU DÜZ ERKEK 3/8" 450MM'), quantity: 1, fieldName: 'arkaKapakTipi', fieldValue: 'Hidrolik', groupName: 'HİDROLİK DORSE' },
        { productId: findId('STANDART KULLANIM KILAVUZU'), quantity: 1, fieldName: 'GLOBAL', fieldValue: null, groupName: 'GENEL' },
        { productId: findId('GÜVENLİK ETİKET SETİ'), quantity: 1, fieldName: 'GLOBAL', fieldValue: null, groupName: 'GENEL' },
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
//# sourceMappingURL=seed-bom.js.map