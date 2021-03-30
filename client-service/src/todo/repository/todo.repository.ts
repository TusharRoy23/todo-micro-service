import { User } from "../../auth/entity/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { TodoDto } from "../dto/todo.dto";
import { Todo } from "../entity/todo.entity";
import { TodoPayload } from "../interface/todo-payload.interface";

@EntityRepository(Todo)
export class TodoRepository extends Repository<Todo> {
    async createTodo(
        todoDto: TodoDto,
        user: User
    ): Promise<Todo> {
        const { title, description } = todoDto

        const todo = new Todo()

        todo.title = title
        todo.description = description
        todo.user = user

        await todo.save()

        delete todo.user
        return todo
    }

    async getAllTodo(user: User): Promise<TodoPayload[]> {
        const query = this.createQueryBuilder('todo');

        query.where('todo.userId = :userId', { userId: user.id });

        const todos = await query.getMany();
        return todos;
    }

    async fetchAllTodo(): Promise<TodoPayload[]> { // fetch by admin (microservice)
        const query = this.createQueryBuilder('todo');
        query.addSelect('todo.id', 'todo_id');
        query.addSelect('todo.title', 'title');
        query.addSelect('todo.description', 'description');
        query.addSelect('todo.createdDate', 'createdDate');
        query.addSelect('todo.updatedDate', 'updatedDate');
        query.addSelect('t2.username', 'username');
        query.addSelect('t3.pet_name', 'petName');
        query.addSelect('t3.address', 'address');
        query.addSelect('t3.modified_photo', 'image');
        query.innerJoin('user', 't2', 'todo.userId = t2.id');
        query.innerJoin('user_info', 't3', 't2.userInfoId = t3.id');
        const list = await query.getRawMany();
        return list;
    }
}