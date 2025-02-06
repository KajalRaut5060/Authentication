import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { TweetService } from './tweet.service';

@Controller('tweet')
export class TweetController {
  constructor(private tweetService: TweetService) {}

  // @Get(':userid?')
  // getTweets(@Param('userid', ParseIntPipe) userid: number) {
  //   return this.tweetService.getTweet(userid);
  // }
}
