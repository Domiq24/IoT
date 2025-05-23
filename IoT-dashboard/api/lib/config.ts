export const config = {
    port: process.env.PORT || 3100,
    supportedDevicesNum: 17,
    databaseUrl: process.env.MONGODB_URI || "mongodb+srv://test_user:test123@cluster0.lybvqum.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
};