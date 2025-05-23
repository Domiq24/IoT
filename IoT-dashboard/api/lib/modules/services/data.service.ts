import DataModel from '../schemas/data.schema';
import {IData, Query} from "../models/data.model";
import { Document, Types } from 'mongoose';
import { config } from "../../config";

export default class DataService {

    public async createData(dataParams: IData) {
        try {
            const dataModel = new DataModel(dataParams);
            await dataModel.save();
        } catch (error) {
            console.error('Wystąpił błąd podczas tworzenia danych:', error);
            throw new Error('Wystąpił błąd podczas tworzenia danych');
        }
    }

    public async query(deviceID: string) {
        try {
            const data = await DataModel.find({deviceId: deviceID}, {__v: 0, _id: 0});
            return data;
        } catch (error) {
            throw new Error(`Query failed: ${error}`);
        }
    }

    public async get(deviceID: string) {
        try {
            const data = await DataModel.find({deviceId: deviceID}, {__v: 0, _id: 0}).limit(1).sort({$natural: -1});
            return data;
        } catch (error) {
            console.error('Wystąpił błąd podczas pobierania danych:', error);
            throw new Error('Wystąpił błąd podczas pobierania danych');
        }
    }

    public async getAll() {
        const latestData = [];
        try {
            await Promise.all(
                Array.from({length: config.supportedDevicesNum}, async (_, i) => {
                    const latestEntry = await DataModel.find({deviceId: i}, {__v: 0, _id: 0}).limit(1).sort({$natural: -1});
                    if (latestEntry.length) {
                        latestData.push(latestEntry[0]);
                    } else {
                        latestData.push({deviceId: i});
                    }
                })
            );
        } catch (error) {
            console.error('Wystąpił błąd podczas pobierania danych z urządzenia ${i + 1}:', error);
            latestData.push({});
        }
        return latestData;
    }

    public async deleteMany(deviceID: string) {
        try {
            await DataModel.deleteMany({deviceId: deviceID}, {__v: 0, _id: 0});
        } catch (error) {
            
        }
    }
}
