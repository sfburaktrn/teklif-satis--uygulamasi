import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PurchaseRequestsService } from './purchase-requests.service';

@Controller('purchase')
export class PurchaseRequestsController {
  constructor(private readonly purchaseRequestsService: PurchaseRequestsService) { }

  @Post()
  create(@Body() createPurchaseRequestDto: any) {
    return this.purchaseRequestsService.create(createPurchaseRequestDto);
  }

  @Get()
  findAll() {
    return this.purchaseRequestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseRequestsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePurchaseRequestDto: any) {
    return this.purchaseRequestsService.update(id, updatePurchaseRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchaseRequestsService.remove(id);
  }

  // Quote Endpoints
  @Post('items/:itemId/quotes')
  addQuote(@Param('itemId') itemId: string, @Body() quoteData: any) {
    return this.purchaseRequestsService.addQuote(itemId, quoteData);
  }

  @Patch('quotes/:quoteId')
  updateQuote(@Param('quoteId') quoteId: string, @Body() quoteData: any) {
    return this.purchaseRequestsService.updateQuote(quoteId, quoteData);
  }

  @Delete('quotes/:quoteId')
  deleteQuote(@Param('quoteId') quoteId: string) {
    return this.purchaseRequestsService.deleteQuote(quoteId);
  }

  @Post('items/:itemId/quotes/:quoteId/approve')
  approveQuote(
    @Param('itemId') itemId: string,
    @Param('quoteId') quoteId: string,
    @Body('approvedQuantity') approvedQuantity: number
  ) {
    return this.purchaseRequestsService.approveQuote(itemId, quoteId, approvedQuantity);
  }
}
