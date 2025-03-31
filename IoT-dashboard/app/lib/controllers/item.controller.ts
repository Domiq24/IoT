import Controller from '../interfaces/controller.interface';
import {Request, Response, NextFunction, Router} from 'express';
import path from 'path';
import {number} from "joi";

class ItemController implements Controller {
    public path = '/item';
    public router = Router();

    private items: string[] = [];
    private item_num: number = 0;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(this.path, this.postItem);
        this.router.get(this.path, this.getItems);
        this.router.get(this.path+"/:id", this.getItem);
        this.router.put(this.path+"/:id", this.putItem);
        this.router.delete(this.path+"/:id", this.deleteItem);
    }

    private postItem = async (request: Request, response: Response) => {
        this.items.push("item_"+this.items.length);
    }

    private getItems = async (request: Request, response: Response) => {
        response.send(this.items);
    }

    private getItem = async (request: Request, response: Response) => {
            let id: number = parseInt(request.params.id);
            response.send(this.items[id]);
    }

    private putItem = async (request: Request, response: Response) => {
        let id: number = parseInt(request.params.id);
        this.items[id] += id;
    }

    private deleteItem = async (request: Request, response: Response) => {
        let id: number = parseInt(request.params.id);
        this.items.splice(id, 1);
    }
}

export default ItemController;