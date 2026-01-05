import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: any): Promise<import("./schemas/user.schema").User>;
    findAll(): Promise<import("./schemas/user.schema").User[]>;
    findOne(mobile: string): Promise<import("./schemas/user.schema").User | null>;
    updateFcm(id: string, token: string): Promise<import("./schemas/user.schema").User | null>;
}
