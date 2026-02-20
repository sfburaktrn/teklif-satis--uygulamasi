import { Module } from '@nestjs/common';
import { BomRulesService } from './bom-rules.service';
import { BomRulesController } from './bom-rules.controller';
import { PrismaService } from '../prisma.service';

@Module({
    controllers: [BomRulesController],
    providers: [BomRulesService, PrismaService],
})
export class BomRulesModule { }
