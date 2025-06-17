import App from './app';
import IndexController from "./controllers/index.controller";
import DataController from "./controllers/data.controller";
import UserController from "./controllers/user.controller";
import DataService from "./modules/services/data.service";
import UserService from "./modules/services/user.service";
import PasswordService from "./modules/services/password.service";
import TokenService from "./modules/services/token.service";
import Controller from "./interfaces/controller.interface";

const app: App = new App([]);

function createControllers(): Controller[] {
   const dataService = new DataService();
   const userService = new UserService();
   const passwordService = new PasswordService();
   const tokenService = new TokenService();

   return [
       new UserController(userService, passwordService, tokenService),
       new DataController(dataService),
       new IndexController()
   ];
}

const controllers = createControllers();

controllers.forEach((controller) => {
   app.app.use("/", controller.router);
});

app.app.use((req, res, next) => {
     res.setHeader('Access-Control-Allow-Origin', '*');
     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-auth-token');
     next();
});

app.listen();