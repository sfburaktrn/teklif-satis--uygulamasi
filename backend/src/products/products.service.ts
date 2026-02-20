import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: any) {
        return this.prisma.product.create({
            data: {
                name: data.name,
                code: data.code,
                unit: data.unit,
                category: data.category,
                supplier: data.supplier,
                currentStock: data.currentStock,
                minStockLevel: data.minStockLevel,
                price: data.price,
                currency: data.currency,
            },
        });
    }

    async findAll() {
        return this.prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });
        if (!product) throw new NotFoundException('Ürün bulunamadı');
        return product;
    }

    async update(id: string, data: any) {
        // Verifying existence
        await this.findOne(id);
        return this.prisma.product.update({
            where: { id },
            data: {
                name: data.name,
                code: data.code,
                unit: data.unit,
                category: data.category,
                supplier: data.supplier,
                currentStock: data.currentStock,
                minStockLevel: data.minStockLevel,
                price: data.price,
                currency: data.currency,
            },
        });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.product.delete({
            where: { id },
        });
    }
}
