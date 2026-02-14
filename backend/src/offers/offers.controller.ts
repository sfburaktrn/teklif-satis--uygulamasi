import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';

@Controller('offers')
export class OffersController {
    constructor(private readonly offersService: OffersService) { }

    @Post()
    create(@Body() createOfferDto: CreateOfferDto) {
        return this.offersService.create(createOfferDto);
    }

    @Get('next-number')
    getNextNumber() {
        return this.offersService.getNextOfferNumber();
    }

    @Get()
    findAll() {
        return this.offersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.offersService.findOne(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.offersService.remove(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateOfferDto: UpdateOfferDto) {
        return this.offersService.update(id, updateOfferDto);
    }
}
