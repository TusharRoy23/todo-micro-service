import { Injectable } from "@nestjs/common";
import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";

@Injectable()
export class AdminService {
    private client: ClientProxy;
    constructor() { 
        this.client = ClientProxyFactory.create({
            transport: Transport.REDIS,
            options: {
                url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
            }
        });
    }

    public async createUserLog(data: any) {
        return await this.client.send({ cmd: 'createuserlog' }, data).toPromise();
    }
}