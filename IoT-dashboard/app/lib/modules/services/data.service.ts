import DataModel from '../schemas/data.schema';


export default class DataService {
    public async getAll() {
        try {
            const data = await DataModel.find();
            return data;
        } catch (error) {
            throw new Error(`Query failed: ${error}`);
        }
    }

    public async postOne(id: Number) {
        try {
            await DataModel.insertMany([{
                temperature: Math.round(Math.random() * 70 - 30),
                pressure: Math.round(Math.random() * 200 + 900),
                humidity: Math.round(Math.random() * 90 + 10),
                deviceId: id
            }]);
            return true;
        } catch (error) {
            throw new Error(`Query failed: ${error}`);
        }
    }

    public async deleteOne(id: Number) {
        try {
            await DataModel.deleteOne({deviceId: id})
            return true;
        } catch (error) {
            throw new Error(`Query failed: ${error}`);
        }
    }
}
