import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { TopicsService } from './topics.service';
import { Entry } from './markdown.service';

@Controller()
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get('topics')
  getAll() {
    return this.topicsService.getAllTopics();
  }

  @Get('topics/:id')
  getTopic(@Param('id') id: string) {
    return this.topicsService.getTopicEntries(id);
  }

  @Get('topics/:id/search')
  searchInTopic(@Param('id') id: string, @Query('q') q: string) {
    return this.topicsService.searchInTopic(id, q ?? '');
  }

  @Get('search')
  searchAll(@Query('q') q: string) {
    return this.topicsService.searchAll(q ?? '');
  }

  @Post('topics/:id/entries')
  addEntry(@Param('id') id: string, @Body() body: Partial<Entry>) {
    return this.topicsService.addEntry(id, body);
  }

  @Put('topics/:id/entries/:rowIndex')
  updateEntry(
    @Param('id') id: string,
    @Param('rowIndex') rowIndex: string,
    @Body() body: Partial<Entry>,
  ) {
    return this.topicsService.updateEntry(id, parseInt(rowIndex, 10), body);
  }

  @Delete('topics/:id/entries/:rowIndex')
  deleteEntry(@Param('id') id: string, @Param('rowIndex') rowIndex: string) {
    return this.topicsService.deleteEntry(id, parseInt(rowIndex, 10));
  }
}
