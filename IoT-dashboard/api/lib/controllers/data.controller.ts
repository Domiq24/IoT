import Controller from '../interfaces/controller.interface';
import { Request, Response, NextFunction, Router } from 'express';
import { checkIdParam } from "../middlewares/deviceIdParam.middleware";
import DataService from "../modules/services/data.service";
import { IData } from "../modules/models/data.model";
import { config } from "../config";
import { auth } from "../middlewares/auth.middleware";
import { admin } from "../middlewares/admin.middleware";
import Joi from "joi";
import cors from "cors";

const options = {
    origin: ['http://localhost:3100', 'http://localhost:5173']
}

class DataController implements Controller {
    public path = '/api/data';
    public router = Router();

    constructor(private dataService: DataService) {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(cors<Request>(options));
        this.router.get(`${this.path}/all`, auth, this.getReadingsFromAllDevices);
        this.router.get(`${this.path}/latest`, auth, this.getLatestReadingsFromAllDevices);
        this.router.post(`${this.path}/:id`, checkIdParam, this.addData);
        this.router.get(`${this.path}/:id`, auth, checkIdParam, this.getAllDeviceData);
        this.router.get(`${this.path}/:id/latest`, auth, checkIdParam, this.getPeriodData);
        this.router.get(`${this.path}/:id/:num`, auth, checkIdParam, this.getPeriodData)
        this.router.delete(`${this.path}/all`, admin, this.cleanAllDevices);
        this.router.delete(`${this.path}/:id`, admin, checkIdParam, this.cleanDeviceData);
        this.router.delete(`${this.path}/:id/:from/:to`, admin, this.deleteFromDeviceInTimeSpan)
    }

    private getReadingsFromAllDevices = async (request: Request, response: Response) => {
        const allData = await this.dataService.getAll();
        function compareId (a: IData, b: IData) {return a.deviceId - b.deviceId;}
        allData.sort(compareId);
        response.status(200).json(allData);
    }

    private getLatestReadingsFromAllDevices = async (request: Request, response: Response) => {
        const allData = await this.dataService.getAllLatest();
        function compareId (a: IData, b: IData) {return a.deviceId - b.deviceId;}
        allData.sort(compareId);
        response.status(200).json(allData);
    }

    private addData = async (request: Request, response: Response) => {
        const { air } = request.body;
        const { id } = request.params;

        const schema = Joi.object({
            air: Joi.array()
                .items(
                    Joi.object({
                        id: Joi.number().integer().positive().required(),
                        value: Joi.number().positive().required()
                    })
                )
                .unique((a, b) => a.id === b.id),
            deviceId: Joi.number().integer().positive().valid(parseInt(id, 10)).required()
        });

        try {
            const validatedData = await schema.validateAsync({air, deviceId: parseInt(id, 10)});
            const data: IData = {
                temperature: validatedData.air[0].value,
                pressure: validatedData.air[1].value,
                humidity: validatedData.air[2].value,
                deviceId: validatedData.deviceId
            }

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
        const { id, num } = request.params;

        if(num !== undefined) {
            const data = await this.dataService.getMany(id, parseInt(num));
            response.status(200).json(data);
        } else {
            const data = await this.dataService.get(id);
            response.status(200).json(data);
        }
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

    private deleteFromDeviceInTimeSpan = async (request: Request, response: Response) => {
        const { id, from, to } = request.params;
        await this.dataService.deleteInSpan(id, new Date(from), new Date(to));
    }
}

export default DataController;