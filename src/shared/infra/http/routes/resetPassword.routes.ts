import { Router } from "express";
import { SendForgotPasswordMailController } from "@modules/accounts/useCases/sendForgotPasswordMail/SendForgotPasswordMailController";
import { ResetPasswordUserController } from "@modules/accounts/useCases/resetPasswordUser/ResetPasswordUserController";

const resetPasswordRoutes = Router();

const sendForgotPasswordMailController = new SendForgotPasswordMailController();
const resetPasswordController = new ResetPasswordUserController();

resetPasswordRoutes.post("/forgot", sendForgotPasswordMailController.handle);

resetPasswordRoutes.post("/reset", resetPasswordController.handle);

export { resetPasswordRoutes };
