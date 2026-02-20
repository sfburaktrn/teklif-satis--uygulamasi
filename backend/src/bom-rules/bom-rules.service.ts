import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BomRulesService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: any) {
        return this.prisma.bomRule.create({
            data: {
                groupName: data.groupName,
                fieldName: data.fieldName,
                fieldValue: data.fieldValue,
                fieldName2: data.fieldName2,
                fieldValue2: data.fieldValue2,
                productId: data.productId,
                quantity: data.quantity,
                quantity2: data.quantity2,
            },
            include: {
                product: true,
            },
        });
    }

    async findAll() {
        return this.prisma.bomRule.findMany({
            include: {
                product: true,
            },
        });
    }

    async findOne(id: string) {
        const rule = await this.prisma.bomRule.findUnique({
            where: { id },
            include: {
                product: true,
            },
        });
        if (!rule) throw new NotFoundException('Kural bulunamadı');
        return rule;
    }

    async update(id: string, data: any) {
        await this.findOne(id);
        return this.prisma.bomRule.update({
            where: { id },
            data: {
                groupName: data.groupName,
                fieldName: data.fieldName,
                fieldValue: data.fieldValue,
                fieldName2: data.fieldName2,
                fieldValue2: data.fieldValue2,
                productId: data.productId,
                quantity: data.quantity,
                quantity2: data.quantity2,
            },
            include: {
                product: true,
            },
        });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.bomRule.delete({
            where: { id },
        });
    }
}
