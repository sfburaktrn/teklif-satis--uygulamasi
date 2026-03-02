import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OffersModule } from './offers/offers.module';
import { BomModule } from './bom/bom.module';
import { ProductsModule } from './products/products.module';
import { BomRulesModule } from './bom-rules/bom-rules.module';
import { PurchaseRequestsModule } from './purchase-requests/purchase-requests.module';

@Module({
    imports: [OffersModule, BomModule, ProductsModule, BomRulesModule, PurchaseRequestsModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
