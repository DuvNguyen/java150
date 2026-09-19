import { Module } from '@nestjs/common';
import { TopicsController } from './topics.controller';
import { TopicsService } from './topics.service';
import { MarkdownService } from './markdown.service';

@Module({
  controllers: [TopicsController],
  providers: [TopicsService, MarkdownService],
})
export class TopicsModule {}
