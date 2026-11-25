import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { LocationsModule } from './locations/locations.module';
import { BusinessesModule } from './businesses/businesses.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { SystemModulesModule } from './system-modules/system-modules.module';
import { PplModule } from './ppl/ppl.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    LocationsModule,
    BusinessesModule,
    UsersModule,
    CategoriesModule,
    SystemModulesModule,
    PplModule,
    AdminModule,
  ],
})
export class AppModule {}
