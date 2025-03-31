import Controller from '../interfaces/controller.interface';
import { Request, Response, NextFunction, Router } from 'express';
import DataService from '../modules/services/data.service';
import { IData } from '../modules/models/data.model';


class DataController implements Controller {
    public path = '/api/data';
    public router = Router();
    private dataService = new DataService();


    constructor() {
        this.initializeRoutes();
    }


    private initializeRoutes() {
        this.router.get(this.path+"/get", this.getAll);
        this.router.get(this.path+"/post/:id", this.postOne);
        this.router.get(this.path+"/delete/:id", this.deleteOne);
    }

    private getAll = async (request: Request, response: Response) => {
        response.send(await this.dataService.getAll());
    }

    private postOne = async (request: Request, response: Response) => {
        const id = parseInt(request.params.id);
        if(!Number.isNaN(id)) {
             response.send(await this.dataService.postOne(id));
        }
    }

    private deleteOne = async (request: Request, response: Response) => {
        const id = parseInt(request.params.id);
        if(!Number.isNaN(id)) {
             response.send(await this.dataService.deleteOne(id));
        }
    }
}


export default DataController;