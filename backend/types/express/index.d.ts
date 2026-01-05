import { IUser } from '../../models/User';

declare global {
    namespace Express {
        interface Request {
            user?: IUser | any; // Allow relaxed type for now if conflicts exist
        }
    }
}
