import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AdminUser } from "../entity/admin-user.entity";

export const GetUser = createParamDecorator((data, ctx: ExecutionContext): AdminUser => {
    const req = ctx.switchToHttp().getRequest()
    return req.user
})