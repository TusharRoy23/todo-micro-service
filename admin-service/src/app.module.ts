import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TodoModule } from './todo/todo.module';
import * as typeOrmConfig from "./typeorm.config";
import { UserLogModule } from './user_log/user-log.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    UserLogModule,
    AuthModule,
    TodoModule
  ],
})
export class AppModule {}
