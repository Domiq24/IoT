import { RequestHandler, Request, Response, NextFunction } from 'express';

export const logQueries: RequestHandler = (request: Request, response: Response, next: NextFunction) => {
    console.log(`[${request.method} ${request.url} ${new Date().toISOString()}]`)
}