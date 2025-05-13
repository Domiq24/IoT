import Controller from '../interfaces/controller.interface';
import { Request, Response, NextFunction, Router } from 'express';

let testArr = [4,5,6,3,5,3,7,5,13,5,6,4,3,6,3,6];
class DataController implements Controller {
    public path = '/api/data';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/latest`, this.getLatestReadingsFromAllDevices);
        this.router.get(`${this.path}/:id`, this.getData);
        this.router.get(`${this.path}/:id/latest`, this.getLatestById);
        this.router.get(`${this.path}/:id/:num`, this.getDataRange)
        this.router.post(`${this.path}/:id`, this.addData);
        this.router.delete(`${this.path}/all`, this.deleteAll);
        this.router.delete(`${this.path}/:id`, this.deleteById);
    }

    private getLatestReadingsFromAllDevices = async (request: Request, response: Response) => {
        response.status(200).json(testArr[testArr.length - 1]);
    }

    private getData = async (request: Request, response: Response) => {
        const { id } = request.params;
        response.status(200).json(testArr[Number.parseInt(id)]);
    }

    private getLatestById = async (request: Request, response: Response) => {
        const { id } = request.params;
        response.status(200).json(Math.max(...testArr));
    }

    private getDataRange = async (request: Request, response: Response) => {
        const { id } = request.params;
        const { num } = request.params;

        response.status(200).json(testArr.slice(Number.parseInt(id), Number.parseInt(id)+Number.parseInt(num)));
    }

    private addData = async (request: Request, response: Response) => {
        const { elem } = request.body;
        const { id } = request.params;

        testArr.push(elem);

        response.status(200).json(testArr);
    }

    private deleteAll = async (request: Request, response: Response) => {
        testArr = [];
        response.status(200).json(testArr);
    }

    private deleteById = async (request: Request, response: Response) => {
        const { id } = request.params;
        testArr.splice(Number.parseInt(id), 1);
        response.status(200).json(testArr);
    }
}

export default DataController;