
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

export interface BomItem {
    siraNo: number;
    groupName: string;
    productName: string;
    unit: string;
    quantity: number;   // Birim Miktar
    quantity2: number;  // Miktar 2
    orderCount: number; // Sipariş Adeti
    total: number;      // Toplam (quantity * orderCount)
    category?: string;
    supplier?: string;
}

@Injectable()
export class BomService {
    constructor(private prisma: PrismaService) { }

    async calculateBom(offerId: string): Promise<BomItem[]> {
        // 1. Get the Offer
        const offer = await this.prisma.offer.findUnique({
            where: { id: offerId },
        });

        if (!offer) {
            throw new NotFoundException('Teklif bulunamadı.');
        }

        const orderCount = offer.siparisAdeti || 1;

        // 2. Identify all relevant answers
        // We scan the Offer object for any fields that might have rules.
        // For now, valid fields are those in our Schema that store answers (String type).
        // Plus "GLOBAL" rules.

        const conditions = [{ fieldName: 'GLOBAL', fieldValue: null }];

        // Iterate over offer entries to build conditions
        // exclude system fields
        const excludedFields = ['id', 'createdAt', 'updatedAt', 'teklifNo', 'siparisAdeti', 'onayTarihi', 'talepTarihi'];

        for (const [key, value] of Object.entries(offer)) {
            if (!excludedFields.includes(key) && typeof value === 'string') {
                conditions.push({ fieldName: key, fieldValue: value });
            }
        }

        // 3. Fetch matching rules
        // We cannot use a single OR query easily because fieldValue can be different for different fieldNames.
        // Efficient way: Fetch all rules where fieldName is in our keys, then filter in memory? 
        // Or simpler: Iterate and query (N+1 issue but okay for limited form fields).
        // Better: Query where (fieldName = X AND fieldValue = Y) OR ...

        const rules = await this.prisma.bomRule.findMany({
            where: {
                OR: conditions.map(c => ({
                    fieldName: c.fieldName,
                    fieldValue: c.fieldValue === null ? { equals: null } : c.fieldValue
                }))
            },
            include: {
                product: true
            }
        });

        // 4. Build BOM Lines (each rule = one line, no aggregation)
        const result: BomItem[] = rules.map((rule, index) => ({
            siraNo: index + 1,
            groupName: rule.groupName || 'GENEL',
            productName: rule.product.name,
            unit: rule.product.unit,
            quantity: rule.quantity,
            quantity2: rule.quantity2 || 0,
            orderCount: orderCount,
            total: rule.quantity * orderCount,
            category: rule.product.category,
            supplier: rule.product.supplier
        }));

        // Re-assign Sira No (already sequential from map)

        return result;
    }
}
