import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { Profile } from 'src/profile/profile.entity';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}

  //Get all Users
  async getAllUsers() {
    return this.userRepository.find();
  }

  //Create new user
  public async createUser(userDto: CreateUserDto) {
    // Create profile & save
    userDto.profile = userDto.profile ?? {};
    let profile = this.profileRepository.create(userDto.profile);
    await this.profileRepository.save(profile);

    //Create user object
    let user = this.userRepository.create(userDto);

    // Set the profile
    user.profile = profile;

    //save the user object
    return await this.userRepository.save(user);
  }

  //Find user by email
  findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  //Update users refreshtoken
  async update(email: string, updateUserDto: UpdateUserDto): Promise<any> {
    const user = await this.findOneByEmail(email);
    //check for user and add refresh token
    if (user) {
      user.refreshToken = updateUserDto.refreshToken;
      return await this.userRepository.save(user);
    }
  }
}
