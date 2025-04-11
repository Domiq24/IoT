import Controller from '../interfaces/controller.interface';
import {Request, Response, NextFunction, Router} from 'express';
import path from 'path';
import { Server } from 'socket.io';

class IndexController implements Controller {
    public path = '/*';
    public router = Router();
    public io: Server;

    constructor(io: Server) {
        this.io = io;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.serveIndex);
        this.router.get(this.path + 'emit', this.emitReading);
        this.router.post(this.path + 'emit', )
    }

    private serveIndex = async (request: Request, response: Response) => {
        response.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
    }

    private emitReading = async (request: Request, response: Response, next: NextFunction) => {
        try {
            this.io.emit("message", 'nowy pomiar');
            response.status(200).json({ res: "ok" });

        } catch (error) {
            console.error("Błąd podczas emisji danych:", error);
            response.status(500).json({ error: "Błąd serwera" });
        }
    };

    private emitPosting = async (request: Request, response: Response, next: NextFunction) => {
        try {
            setInterval(() => this.io.emit("sensor-data", {
                temperature: 22.5,
                humidity: 55,
                pressure: 1005
            }), 5000);
        } catch (error) {
            console.error("Błąd podczas emisji danych:", error);
            response.status(500).json({ error: "Błąd serwera" });
        }
    }
}

export default IndexController;