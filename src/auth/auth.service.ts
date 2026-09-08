import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Check if phone already exists
    const existingPhone = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });
    if (existingPhone) {
      throw new ConflictException('Phone number is already registered');
    }

    // Check if username already exists
    const existingUsername = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });
    if (existingUsername) {
      throw new ConflictException('Username is already taken');
    }

    // Validate location references if provided
    if (dto.districtId) {
      const district = await this.prisma.district.findUnique({
        where: { id: dto.districtId },
      });
      if (!district) {
        throw new BadRequestException('Invalid districtId');
      }
    }

    if (dto.mandalId) {
      const mandal = await this.prisma.mandal.findUnique({
        where: { id: dto.mandalId },
      });
      if (!mandal) {
        throw new BadRequestException('Invalid mandalId');
      }
    }

    if (dto.villageId) {
      const village = await this.prisma.village.findUnique({
        where: { id: dto.villageId },
      });
      if (!village) {
        throw new BadRequestException('Invalid villageId');
      }
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        phone: dto.phone,
        passwordHash,
        userType: dto.userType || 'CUSTOMER',
        stateId: dto.districtId ? 1 : undefined, // AP state id = 1
        districtId: dto.districtId,
        mandalId: dto.mandalId,
        villageId: dto.villageId,
      },
      select: {
        id: true,
        username: true,
        phone: true,
        userType: true,
        districtId: true,
        mandalId: true,
        villageId: true,
        createdAt: true,
      },
    });

    const token = this.generateToken(user);

    return { token, user };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid phone number or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid phone number or password');
    }

    const safeUser = {
      id: user.id,
      username: user.username,
      phone: user.phone,
      userType: user.userType,
      districtId: user.districtId,
      mandalId: user.mandalId,
      villageId: user.villageId,
      createdAt: user.createdAt,
    };

    const token = this.generateToken(safeUser);

    return { token, user: safeUser };
  }

  private generateToken(user: { id: number; phone: string; userType: string }) {
    const payload = {
      sub: user.id,
      phone: user.phone,
      userType: user.userType,
    };
    return this.jwtService.sign(payload);
  }
}
