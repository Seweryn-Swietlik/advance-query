import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserFinderModule } from './user-finder/user-finder.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'user-management',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserFinderModule,
  ],
})
export class AppModule {}
