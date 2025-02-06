import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TweetService {
  constructor(private readonly userService: UsersService) {}

  // tweets: { text: string; date: Date; userId: number }[] = [
  //   { text: 'some text', date: new Date('2025-01-25'), userId: 1 },
  //   { text: 'some other text', date: new Date('2025-01-26'), userId: 1 },
  //   { text: 'some more text', date: new Date('2025-01-27'), userId: 2 },
  // ];

  // getTweet(userId: number) {
  //   const user = this.userService.getUserById(userId);
  //   const tweets = this.tweets.filter((tweet) => tweet.userId === userId);
  //   const response = tweets.map((t) => {
  //     return { text: t.text, date: t.date, name: user.name };
  //   });
  //   return response;
  // }
}
