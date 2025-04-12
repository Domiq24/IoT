import App from './app';
import IndexController from "./controllers/index.controller";
import ItemController from "./controllers/item.controller";
import DataController from "./controllers/data.controller";
import MeasurementController from "./controllers/measurement.controller";

const app: App = new App([]);
const io = app.getIo();

const controllers = [
    new DataController(),
    new ItemController(),
    new MeasurementController(io),
    new IndexController(io)
]

controllers.forEach((controller) => {
    app.app.use("/", controller.router);
});

app.listen();