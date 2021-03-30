import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { ApiTags } from "@nestjs/swagger";
import { TodoPayload } from "../interface/todo-payload.interface";
import { TodoService } from "../service/todo.service";

@ApiTags('todo-microservice')
@Controller('todo-microservice')
export class TodoMicroserviceController {

    constructor(
        private todoService: TodoService
    ) {}

    @MessagePattern({ cmd: 'todo-list' })
    async getTodoList(): Promise<TodoPayload[]> {
        return await this.todoService.fetchAllTodo();
    }
}