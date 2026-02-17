import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OffersModule } from './offers/offers.module';

import { BomModule } from './bom/bom.module';

@Module({
    imports: [OffersModule, BomModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
