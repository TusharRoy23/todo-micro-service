import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthenticationGuard } from "src/guards/jwt-authentication.guard";
import { TodoService } from "./service/todo.service";

@ApiTags('Todo')
@ApiBearerAuth()
@Controller('todo')
@UseGuards(JwtAuthenticationGuard)
export class TodoController {
    constructor(
        private todoService: TodoService
    ) {}

    @Get()
    async getAllTodo(): Promise<any[]> {
        return await this.todoService.getAllTodo();
    }
}