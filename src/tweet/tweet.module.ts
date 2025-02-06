import { Module } from '@nestjs/common';
import { TweetController } from './tweet.controller';
import { TweetService } from './tweet.service';
import { UserModule } from 'src/users/users.module';

@Module({
  controllers: [TweetController],
  providers: [TweetService],
  imports: [UserModule],
})
export class TweetModule {}
