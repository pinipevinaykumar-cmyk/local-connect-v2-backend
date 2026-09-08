import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { LocationsModule } from './locations/locations.module';
import { BusinessesModule } from './businesses/businesses.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    LocationsModule,
    BusinessesModule,
    UsersModule,
    CategoriesModule,
  ],
})
export class AppModule {}
