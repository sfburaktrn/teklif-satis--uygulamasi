"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OffersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let OffersService = class OffersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createOfferDto) {
        if (!createOfferDto.teklifNo) {
            createOfferDto.teklifNo = await this.getNextOfferNumber();
        }
        return this.prisma.offer.create({
            data: Object.assign(Object.assign({}, createOfferDto), { teklifNo: createOfferDto.teklifNo }),
        });
    }
    async getNextOfferNumber() {
        var _a, _b;
        const date = new Date();
        const formatter = new Intl.DateTimeFormat('tr-TR', {
            timeZone: 'Europe/Istanbul',
            year: 'numeric',
            month: '2-digit',
        });
        const parts = formatter.formatToParts(date);
        const month = ((_a = parts.find(p => p.type === 'month')) === null || _a === void 0 ? void 0 : _a.value) || '';
        const year = ((_b = parts.find(p => p.type === 'year')) === null || _b === void 0 ? void 0 : _b.value) || '';
        const monthStr = month.padStart(2, '0');
        const prefix = `OZNL${year}${monthStr}`;
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
            const lastSequenceStr = lastOffer.teklifNo.replace(prefix, '');
            const lastSequence = parseInt(lastSequenceStr, 10);
            if (!isNaN(lastSequence)) {
                sequence = lastSequence + 1;
            }
        }
        const sequenceStr = String(sequence).padStart(2, '0');
        return `${prefix}${sequenceStr}`;
    }
    async findAll() {
        return this.prisma.offer.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    async findOne(id) {
        return this.prisma.offer.findUnique({
            where: { id },
        });
    }
    async update(id, updateOfferDto) {
        return this.prisma.offer.update({
            where: { id },
            data: updateOfferDto,
        });
    }
    async remove(id) {
        return this.prisma.offer.delete({
            where: { id },
        });
    }
};
exports.OffersService = OffersService;
exports.OffersService = OffersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OffersService);
//# sourceMappingURL=offers.service.js.map