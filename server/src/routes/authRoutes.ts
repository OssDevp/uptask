import { Router } from "express";
import { body, param } from "express-validator";
import { AuthController } from "../controllers/AuthController";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";

const router: Router = Router();

router.post(
  "/create-account",
  body("name").notEmpty().withMessage("el nombre no debe estar vacio"),
  body("password")
    .notEmpty()
    .withMessage("la contraseña no debe estar vacio")
    .isLength({ min: 8 })
    .withMessage("La contraseña es corta, minimo 8 caracter"),
  body("password_validation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Las Contraseñas no son iguales");
    }
    return true;
  }),
  body("email").isEmail().withMessage("El Email no es valido"),
  handleInputErrors,
  AuthController.createAccount
);

router.post(
  "/confirm-account",
  body("token").notEmpty().withMessage("El token no debe estar vacio"),
  handleInputErrors,
  AuthController.confirmAccount
);

router.post(
  "/login",
  body("email").isEmail().withMessage("El Email no es valido"),
  body("password").notEmpty().withMessage("la contraseña no debe estar vacio"),
  handleInputErrors,
  AuthController.login
);

router.post(
  "/request-code",
  body("email").isEmail().withMessage("El Email no es valido"),
  handleInputErrors,
  AuthController.requestConfirmationCode
);

router.post(
  "/forgot-password",
  body("email").isEmail().withMessage("El Email no es valido"),
  handleInputErrors,
  AuthController.forgotPassword
);

router.post(
  "/validate-token",
  body("token").notEmpty().withMessage("El token no debe estar vacio"),
  handleInputErrors,
  AuthController.validateTokenPassword
);

router.post(
  "/update-password/:idToken",
  param("idToken").isNumeric().withMessage("El token no debe estar vacio"),
  body("password")
    .notEmpty()
    .withMessage("la contraseña no debe estar vacio")
    .isLength({ min: 8 })
    .withMessage("La contraseña es corta, minimo 8 caracter"),
  body("password_validation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Las Contraseñas no son iguales");
    }
    return true;
  }),
  handleInputErrors,
  AuthController.updatePasswordWithToken
);

router.get("/user", authenticate, AuthController.getUser);

router.put(
  "/profile",
  authenticate,
  body("name").notEmpty().withMessage("el nombre no debe estar vacio"),
  body("email").isEmail().withMessage("El Email no es valido"),
  handleInputErrors,
  AuthController.updateProfile
);

router.post(
  "/profile/update-password",
  authenticate,
  body("password").notEmpty().withMessage("la contraseña no debe estar vacio"),
  body("password_validation").custom((value, { req }) => {
    if (value !== req.body.current_password) {
      throw new Error("Las Contraseñas no son iguales");
    }
    return true;
  }),
  body("current_password")
    .notEmpty()
    .withMessage("la contraseña no debe estar vacio"),
  handleInputErrors,
  AuthController.changePassword
);

router.post(
  "/check-password",
  authenticate,
  body("password").notEmpty().withMessage("la contraseña no debe estar vacio"),
  handleInputErrors,
  AuthController.checkPassword
);

export default router;
