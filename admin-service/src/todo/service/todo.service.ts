import { Injectable } from "@nestjs/common";
import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";

@Injectable()
export class TodoService {
    private client: ClientProxy;

    constructor() {
        this.client = ClientProxyFactory.create({
            transport: Transport.REDIS,
            options: {
                url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
            }
        });
    }

    async getAllTodo() {
        return await this.client.send({ cmd: 'todo-list' }, '').toPromise();
    }
}