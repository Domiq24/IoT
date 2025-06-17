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

    public async getMany(deviceID: string, num: number) {
        try {
            const data = await DataModel.find({deviceId: deviceID}, {__v: 0, _id: 0}).limit(num).sort({$natural: -1});
            return data;
        } catch (error) {
            console.error('Wystąpił błąd podczas pobierania danych:', error);
            throw new Error('Wystąpił błąd podczas pobierania danych');
        }
    }

    public async getAll() {
        try {
            const allData = await DataModel.find({}, {__v: 0, _id: 0});
            return allData;
        } catch(error) {
            console.error("Wystąpił błąd podczas pobierania danych", error);
            throw new Error("Wystąpił błąd podczas pobierania danych");
        }
    }

    public async getAllLatest() {
        const latestData: any[] = [];
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
            return latestData;
        } catch (error) {
            console.error(`Wystąpił błąd podczas pobierania danych z urządzenia:`, error);
            latestData.push({});
        }
    }

    public async deleteMany(deviceID: string) {
        try {
            await DataModel.deleteMany({deviceId: deviceID}, {__v: 0, _id: 0});
        } catch (error) {
            console.error(`Wystąpił błąd podczas usuwania danych z urządzenia ${deviceID + 1}:`, error);
            throw new Error(`Wystąpił błąd podczas usuwania danych z urządzenia ${deviceID + 1}`);
        }
    }

    public async deleteInSpan(deviceID: string, from: Date, to: Date) {
        try {
            await DataModel.deleteMany({deviceId: deviceID, readingDate: {$in: [from, to]}}, {__v: 0, _id: 0});
        } catch(error) {
            console.error(`Wystąpił błąd przy usówaniu wpisów z urządzenia ${deviceID + 1}:` )
            throw new Error(`Wystąpił błąd podczas usuwania danych z urządzenia ${deviceID + 1}`);
        }
    }
}
