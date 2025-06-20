import Controller from '../interfaces/controller.interface';
import {Request, Response, NextFunction, Router} from 'express';
import {auth} from '../middlewares/auth.middleware';
import {admin} from '../middlewares/admin.middleware';
import UserService from "../modules/services/user.service";
import PasswordService from "../modules/services/password.service";
import TokenService from "../modules/services/token.service";
import NodeMailer from "nodemailer";
import cors from "cors";

const options = {
    origin: ['http://localhost:3100', 'http://localhost:5173']
}

class UserController implements Controller {
   public path = '/api/user';
   public router = Router();

   constructor(private userService: UserService, private passwordService: PasswordService, private tokenService: TokenService) {
       this.initializeRoutes();
   }

   private initializeRoutes() {
       this.router.use(cors<Request>(options));
       this.router.post(`${this.path}/create`, this.createNewOrUpdate);
       this.router.post(`${this.path}/auth`, this.authenticate);
       this.router.post(`${this.path}/reset_password`, this.resetPassword);
       this.router.delete(`${this.path}/logout/:userId`, auth, this.removeHashSession);
   }

    private authenticate = async (request: Request, response: Response, next: NextFunction) => {
       const {login, password} = request.body;

       try {
           const user = await this.userService.getByEmailOrName(login);
           if (!user) return response.status(401).json({error: 'Unauthorized'});

           const result = await this.passwordService.authorize(user.id, password);
           if(!result) return response.status(401).json({error: 'Unauthorized'});

           const token = await this.tokenService.create(user);
           response.status(200).json(this.tokenService.getToken(token));
       } catch (error) {
           console.error(`Validation Error: ${error.message}`);
           response.status(401).json({error: 'Unauthorized'});
       }
    };

    private createNewOrUpdate = async (request: Request, response: Response, next: NextFunction) => {
       const userData = request.body;
       try {
           const user = await this.userService.createNewOrUpdate(userData);
           if (userData.password) {
               const hashedPassword = await this.passwordService.hashPassword(userData.password)
               await this.passwordService.createOrUpdate({
                   userId: user._id,
                   password: hashedPassword
               });
           }
           response.status(200).json(user);
       } catch (error) {
           console.error(`Validation Error: ${error.message}`);
           response.status(400).json({error: 'Bad request', value: error.message});
       }

    };

    private removeHashSession = async (request: Request, response: Response, next: NextFunction) => {
       const {userId} = request.params;

       try {
           const result = await this.tokenService.remove(userId);
           response.status(200).send(result);
       } catch (error) {
           console.error(`Validation Error: ${error.message}`);
           response.status(401).json({error: 'Unauthorized'});
       }
    };

    private resetPassword = async (request: Request, response: Response, next: NextFunction) => {
        const { login } = request.body;

        try {
            const user = await this.userService.getByEmailOrName(login);
            if(!user) return response.status(401).json({error: 'User not found'});

            const transporter = NodeMailer.createTransport({
                service: "Gmail",
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: "your_email@gmail.com",
                    pass: "your_app_password",
                },
            });

            let rand_str = "";
            const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (let i = 0; i < 12; i++) {
                rand_str += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            const password = rand_str;
            const mailOptions = {
                from: "your_email@gmail.com",
                to: user.email,
                subject: "Password Reset",
                text: `Your new password: ${password}`,
            }

            const hashedPassword = await this.passwordService.hashPassword(password)
            await this.passwordService.createOrUpdate({
                   userId: user._id,
                   password: hashedPassword
            });

            const result = await transporter.sendMail(mailOptions);
            if(!result) return response.status(401).json({error: 'Email error'});
            response.status(200).json(true);
        } catch(error) {
            console.error(`Validation Error: ${error.message}`);
            response.status(401).json({error: 'Unauthorized'});
        }
    }
}

export default UserController;