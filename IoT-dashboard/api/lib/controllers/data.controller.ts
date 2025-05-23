import Controller from '../interfaces/controller.interface';
import { Request, Response, NextFunction, Router } from 'express';
import { checkIdParam } from "../middlewares/deviceIdParam.middleware";
import DataService from "../modules/services/data.service";
import { config } from "../config";

let testArr = [4,5,6,3,5,3,7,5,13,5,6,4,3,6,3,6];
class DataController implements Controller {
    public path = '/api/data';
    public router = Router();
    private dataService: DataService = new DataService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/latest`, this.getLatestReadingsFromAllDevices);
        this.router.post(`${this.path}/:id`, checkIdParam, this.addData);
        this.router.get(`${this.path}/:id`, checkIdParam, this.getAllDeviceData);
        this.router.get(`${this.path}/:id/latest`, checkIdParam, this.getPeriodData);
        this.router.get(`${this.path}/:id/:num`, checkIdParam, this.getPeriodData)
        this.router.delete(`${this.path}/all`, this.cleanAllDevices);
        this.router.delete(`${this.path}/:id`, checkIdParam, this.cleanDeviceData);
    }

    private getLatestReadingsFromAllDevices = async (request: Request, response: Response) => {
        const allData = await this.dataService.getAll();
        response.status(200).json(allData);
    }

    private addData = async (request: Request, response: Response) => {
        const { air } = request.body;
        const { id } = request.params;

        const data = {
            temperature: air[0].value,
            pressure: air[1].value,
            humidity: air[2].value,
            deviceId: parseInt(id),
            readingDate : new Date()
        }

        try {
            await this.dataService.createData(data);
            response.status(200).json(data);
        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
            response.status(400).json({ error: 'Invalid input data.' });
        }
    }

    private getAllDeviceData = async (request: Request, response: Response) => {
        const { id } = request.params;
        const allData = await this.dataService.query(id);
        response.status(200).json(allData);
    }

    private getPeriodData = async (request: Request, response: Response) => {
        const { id } = request.params;
        const { num } = request.params;

        const data: any[] = [];
        if(num !== undefined) {
            const firstId = parseInt(id);
            const lastId = parseInt(num);

            for(let i = firstId; i <= lastId; i++) {
                const result = await this.dataService.get(i.toString());
                if(result.length) data.push(result[0]);
            }

        }
        response.status(200).json(data);
    }

    private cleanAllDevices = async (request: Request, response: Response) => {
        await Promise.all(
            Array.from({length: config.supportedDevicesNum}, async (_, i) => {
                await this.dataService.deleteMany(i.toString());
            })
        );

    }

    private cleanDeviceData = async (request: Request, response: Response) => {
        const { id } = request.params;
        await this.dataService.deleteMany(id);
    }
}

export default DataController;