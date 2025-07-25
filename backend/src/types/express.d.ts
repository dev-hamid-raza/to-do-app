// types/express/index.d.ts
import { IUser } from "./user.types";

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}
