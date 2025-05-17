import { Request, Response, NextFunction } from "express"

type AsyncHandler = (req: Request, res: Response, next?: NextFunction) => Promise<any>;

const asyncHandler = (requestedHandler: AsyncHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(requestedHandler(req, res, next)).catch((err) => next(err))
    }
}

export { asyncHandler }