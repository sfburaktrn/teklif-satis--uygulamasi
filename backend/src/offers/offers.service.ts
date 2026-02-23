import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class OffersService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createOfferDto: CreateOfferDto) {
        // Auto-generate teklifNo if not provided
        if (!createOfferDto.teklifNo) {
            createOfferDto.teklifNo = await this.getNextOfferNumber();
        }

        const quantity = createOfferDto.siparisAdeti && createOfferDto.siparisAdeti > 0 ? createOfferDto.siparisAdeti : 1;

        const data: Prisma.OfferCreateInput = {
            ...createOfferDto,
            teklifNo: createOfferDto.teklifNo!, // Ensure it's string

            // Nesting creation for OfferItems
            items: {
                create: Array.from({ length: quantity }).map((_, index) => {
                    // Generate a sequence like -01, -02...
                    const sequence = String(index + 1).padStart(2, '0');
                    return {
                        imalatNo: `IML-${createOfferDto.teklifNo}-${sequence}`,
                        status: "Bekliyor",
                    };
                })
            }
        };

        // Create the main offer and its nested items in a single transaction
        return this.prisma.offer.create({
            data,
            include: {
                items: true,
            }
        });
    }

    async getNextOfferNumber(): Promise<string> {
        const date = new Date();
        const formatter = new Intl.DateTimeFormat('tr-TR', {
            timeZone: 'Europe/Istanbul',
            year: 'numeric',
            month: '2-digit',
        });

        const parts = formatter.formatToParts(date);
        const month = parts.find(p => p.type === 'month')?.value || '';
        const year = parts.find(p => p.type === 'year')?.value || '';

        // Ensure month is 2 digits if not already (formatToParts usually handles this but being safe)
        const monthStr = month.padStart(2, '0');
        const prefix = `OZNL${year}${monthStr}`;

        // Find the last offer created in this month
        // We can filter by teklifNo starting with prefix
        const lastOffer = await this.prisma.offer.findFirst({
            where: {
                teklifNo: {
                    startsWith: prefix,
                },
            },
            orderBy: {
                teklifNo: 'desc',
            },
        });

        let sequence = 1;
        if (lastOffer && lastOffer.teklifNo) {
            // Extract the sequence part
            const lastSequenceStr = lastOffer.teklifNo.replace(prefix, '');
            const lastSequence = parseInt(lastSequenceStr, 10);
            if (!isNaN(lastSequence)) {
                sequence = lastSequence + 1;
            }
        }

        // Format sequence to at least 2 digits
        const sequenceStr = String(sequence).padStart(2, '0');
        return `${prefix}${sequenceStr}`;
    }

    async findAll() {
        return this.prisma.offer.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                items: true
            }
        });
    }

    async findOne(id: string) {
        return this.prisma.offer.findUnique({
            where: { id },
            include: {
                items: true
            }
        });
    }

    async update(id: string, updateOfferDto: any) { // Use any or UpdateOfferDto
        return this.prisma.offer.update({
            where: { id },
            data: updateOfferDto,
        });
    }

    async remove(id: string) {
        return this.prisma.offer.delete({
            where: { id },
        });
    }
}
