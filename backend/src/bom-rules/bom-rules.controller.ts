import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { BomRulesService } from './bom-rules.service';

@Controller('bom-rules')
export class BomRulesController {
    constructor(private readonly bomRulesService: BomRulesService) { }

    @Post()
    create(@Body() createBomRuleDto: any) {
        return this.bomRulesService.create(createBomRuleDto);
    }

    @Get()
    findAll() {
        return this.bomRulesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.bomRulesService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateBomRuleDto: any) {
        return this.bomRulesService.update(id, updateBomRuleDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.bomRulesService.remove(id);
    }
}
