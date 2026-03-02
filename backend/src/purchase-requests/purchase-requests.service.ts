import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PurchaseRequestsService {
  constructor(private prisma: PrismaService) { }

  async create(createPurchaseRequestDto: any) {
    const { items, ...requestData } = createPurchaseRequestDto;

    return this.prisma.purchaseRequest.create({
      data: {
        ...requestData,
        items: {
          create: items?.map((item: any) => ({
            ...item,
            quotes: {
              create: item.quotes || []
            }
          })) || []
        }
      },
      include: {
        items: {
          include: {
            quotes: true
          }
        }
      }
    });
  }

  async findAll() {
    return this.prisma.purchaseRequest.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: true
      }
    });
  }

  async findOne(id: string) {
    const pr = await this.prisma.purchaseRequest.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            quotes: true,
            selectedQuote: true
          }
        }
      }
    });
    if (!pr) throw new NotFoundException('Purchase request not found');
    return pr;
  }

  async update(id: string, updatePurchaseRequestDto: any) {
    return this.prisma.purchaseRequest.update({
      where: { id },
      data: updatePurchaseRequestDto
    });
  }

  async remove(id: string) {
    return this.prisma.purchaseRequest.delete({
      where: { id }
    });
  }

  // Quote operations
  async addQuote(itemId: string, quoteData: any) {
    return this.prisma.quote.create({
      data: {
        ...quoteData,
        itemId
      }
    });
  }

  async updateQuote(quoteId: string, quoteData: any) {
    return this.prisma.quote.update({
      where: { id: quoteId },
      data: quoteData
    });
  }

  async deleteQuote(quoteId: string) {
    return this.prisma.quote.delete({
      where: { id: quoteId }
    });
  }

  async approveQuote(itemId: string, quoteId: string, approvedQuantity: number) {
    await this.prisma.quote.updateMany({
      where: { itemId },
      data: { isSelected: false }
    });

    await this.prisma.quote.update({
      where: { id: quoteId },
      data: { isSelected: true }
    });

    return this.prisma.purchaseRequestItem.update({
      where: { id: itemId },
      data: {
        selectedQuoteId: quoteId,
        approvedQuantity
      },
      include: {
        quotes: true,
        selectedQuote: true
      }
    });
  }
}
