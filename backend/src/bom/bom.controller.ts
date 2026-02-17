
import { Controller, Get, Param } from '@nestjs/common';
import { BomService } from './bom.service';

@Controller('bom')
export class BomController {
    constructor(private readonly bomService: BomService) { }

    @Get(':offerId')
    async getBom(@Param('offerId') offerId: string) {
        return this.bomService.calculateBom(offerId);
    }
}
