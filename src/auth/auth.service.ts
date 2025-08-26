import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/entities/user.entity';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import configuration from '../config/configuration';
import { PermissionDto } from '../role/dto/create-role.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(SignupDto: SignupDto) {
    const user = await this.userModel.findOne({ phone: SignupDto.phone });
    if (user) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(SignupDto.password, 10);
    const newUser = new this.userModel({
      ...SignupDto,
      password: hashedPassword,
    });
    await newUser.save();

    const token = this.generateToken(newUser._id?.toString());
    return {
      token: token,
      user: { ...newUser.toObject(), password: undefined },
    };
  }

  async login(LoginDto: LoginDto) {
    const user = await this.userModel.findOne({ phone: LoginDto.phone }).populate('roles');
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isMatch = await bcrypt.compare(LoginDto.password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = this.generateToken(user._id?.toString());
    return {
      token: token,
      user: { ...user.toObject(), password: undefined },
    };
  }

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).populate('roles');
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return { ...user.toObject(), password: undefined };
  }

  async getUserPermissions(userId: string) {
    const user = await this.userModel.findById(userId).populate('roles');
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return user.roles.reduce((acc: PermissionDto[], role: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
      acc.push(...role.permissions); // Now pushing permission objects
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return acc;
    }, []);
  }

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  generateToken(userId: string | unknown) {
    return this.jwtService.sign(
      { userId },
      { expiresIn: configuration().jwt.expiresIn },
    );
  }
}
