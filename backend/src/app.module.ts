import { Module } from '@nestjs/common';
import { TopicsModule } from './topics/topics.module';

@Module({
  imports: [TopicsModule],
})
export class AppModule {}
