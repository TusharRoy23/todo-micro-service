import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { TodoRepository } from './repository/todo.repository';
import { TodoService } from './service/todo.service';
import { TodoController } from './controller/todo.controller';
import { TodoMicroserviceController } from './controller/todo-microservice.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([TodoRepository])
    ],
    controllers: [TodoController, TodoMicroserviceController],
    providers: [TodoService]
})
export class TodoModule {}
