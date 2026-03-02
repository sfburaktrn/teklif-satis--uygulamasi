import { Module } from '@nestjs/common';
import { PurchaseRequestsService } from './purchase-requests.service';
import { PurchaseRequestsController } from './purchase-requests.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [PurchaseRequestsController],
  providers: [PurchaseRequestsService, PrismaService],
})
export class PurchaseRequestsModule { }
