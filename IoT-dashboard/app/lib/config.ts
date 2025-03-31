import * as process from "node:process";

export const config = {
    port: process.env.PORT || 3100,
    databaseUrl: process.env.MONGODB_URI || 'mongodb+srv://test_user:test_passwd123@cluster0.lybvqum.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
};