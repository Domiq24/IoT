import Controller from '../interfaces/controller.interface';
import {Request, Response, NextFunction, Router} from 'express';
import path from 'path';
import { Server } from 'socket.io';

class MeasurementController implements Controller {
    public path = '/measurement';
    public router = Router();
    public io: Server;

    constructor(io: Server) {
        this.io = io;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(this.path, this.emitMeasurement);
    }

    private serveIndex = async (request: Request, response: Response) => {
        response.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
    }

    private emitMeasurement = async (request: Request, response: Response, next: NextFunction) => {
        try {
            this.io.emit("sensor-data", /*{
                temperature: request.body.temperature,
                humidity: request.body.humidity,
                pressure: request.body.pressure
            }*/request.body);
            response.status(200).json({ res: "ok" });
        } catch (error) {
            console.error("Błąd podczas emisji danych:", error);
            response.status(500).json({ error: "Błąd serwera" });
        }
    };
}

export default MeasurementController;