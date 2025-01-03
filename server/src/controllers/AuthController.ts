import type { Request, Response } from "express";
import User, { IUser } from "../models/Users";
import { comparePassword, hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

export class AuthController {
  static async createAccount(req: Request, res: Response) {
    try {
      const { password, email, password_validation } = req.body;

      //verificar si ya existe el usuario
      const isExist = await User.findOne({ email });
      if (isExist) {
        const error = new Error("El usuario ya esta registrado");
        return res.status(409).json({ error: error.message });
      }

      if (password !== password_validation) {
        const error = new Error("Las contraseñas no coinciden");
        return res.status(400).json({ error: error.message });
      }

      //crear el usuario
      const user = new User(req.body);

      //hashear password
      user.password = await hashPassword(password);

      //generar token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      //mandar email
      AuthEmail.sendConfirmation({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      //guarda en la base de datos
      await Promise.allSettled([user.save(), token.save()]);

      res.send("Cuenta creada, verifica tu correo para confirmar la cuenta");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  }

  static async confirmAccount(req: Request, res: Response) {
    try {
      const { token } = req.body;
      const tokenExist = await Token.findOne({ token });

      if (!tokenExist) {
        const error = new Error("El token no es valido");
        return res.status(404).json({ error: error.message });
      }

      const user = await User.findById(tokenExist.user);
      user.confirmed = true;

      await Promise.allSettled([user.save(), tokenExist.deleteOne()]);
      res.send("Cuenta confirmada correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        const error = new Error("El usuario no existe");
        return res.status(404).json({ error: error.message });
      }

      if (!user.confirmed) {
        const token = new Token();
        token.token = generateToken();
        token.user = user.id;

        AuthEmail.sendConfirmation({
          email: user.email,
          name: user.name,
          token: token.token,
        });

        await token.save();

        const error = new Error("La cuenta no esta confirmada");
        return res.status(403).json({ error: error.message });
      }

      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        const error = new Error("La contraseña no es valida");
        return res.status(403).json({ error: error.message });
      }

      const token = generateJWT({ id: user.id });
      res.send(token);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  }

  static async requestConfirmationCode(req: Request, res: Response) {
    try {
      const { email } = req.body;

      //verificar si ya existe el usuario
      const user = await User.findOne({ email });

      if (!user) {
        const error = new Error("El usuario no esta registrado");
        return res.status(409).json({ error: error.message });
      }

      if (user.confirmed) {
        const error = new Error("La cuenta ya esta confirmada");
        return res.status(409).json({ error: error.message });
      }

      //generar token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      //mandar email
      AuthEmail.sendConfirmation({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      //guarda en la base de datos
      await Promise.allSettled([user.save(), token.save()]);

      res.send("Codigo de confirmacion enviado");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  }

  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      //verificar si ya existe el usuario
      const user = await User.findOne({ email });

      if (!user) {
        const error = new Error("El usuario no esta registrado");
        return res.status(409).json({ error: error.message });
      }

      //generar token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;
      await token.save();

      //mandar email
      AuthEmail.sendPasswordResetToken({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      //guarda en la base de datos

      res.send("Revisa tu email para instrucciones.");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  }

  static async updatePasswordWithToken(req: Request, res: Response) {
    try {
      const { token } = req.params;
      const { email, password, password_validation } = req.body;

      const tokenExist = await Token.findOne({ token });
      if (!tokenExist) {
        const error = new Error("El token no es valido");
        return res.status(404).json({ error: error.message });
      }

      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error("El usuario no existe");
        return res.status(404).json({ error: error.message });
      }

      if (password !== password_validation) {
        const error = new Error("Las contraseñas no coinciden");
        return res.status(400).json({ error: error.message });
      }

      user.password = await hashPassword(password);
      await Promise.allSettled([user.save(), tokenExist.deleteOne()]);
      res.send("Contraseña actualizada correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  }

  static async validateTokenPassword(req: Request, res: Response) {
    try {
      const { token } = req.body;
      const tokenExist = await Token.findOne({ token });

      if (!tokenExist) {
        const error = new Error("El token no es valido");
        return res.status(404).json({ error: error.message });
      }

      const user = await User.findById(tokenExist.user);
      user.confirmed = true;

      await Promise.allSettled([user.save(), tokenExist.deleteOne()]);
      res.send("Token valido, restablece tu contraseña");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  }

  static async getUser(req: Request, res: Response) {
    return res.json(req.user);
  }

  static async updateProfile(
    req: Request<{}, {}, Pick<IUser, "name" | "email">>,
    res: Response
  ) {
    const { name, email } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist && req.user.id.toString() !== userExist.id.toString()) {
      const error = new Error("Usuario no disponible");
      return res.status(409).json({ error: error.message });
    }

    req.user.name = name;
    req.user.email = email;

    try {
      await req.user.save();
      res.send("Perfil actualizado correctamente");
    } catch (error) {
      return res.status(500).json({ error: "Hubo un error" });
    }
  }

  static async changePassword(req: Request, res: Response) {
    const { password, current_password } = req.body;

    const user = await User.findById(req.user.id);

    const isPasswordCorrect = await comparePassword(
      current_password,
      user.password
    );

    if (!isPasswordCorrect) {
      const error = new Error("La contraseña actual no es correcta");
      return res.status(401).json({ error: error.message });
    }

    try {
      user.password = await hashPassword(password);
      await user.save();
      res.send("Contraseña actualizada correctamente");
    } catch (error) {
      return res.status(500).json({ error: "Hubo un error" });
    }
  }

  static async checkPassword(req: Request, res: Response) {
    const { password } = req.body;

    try {
      const user = await User.findById(req.user.id);

      const isPasswordCorrect = await comparePassword(password, user.password);

      if (!isPasswordCorrect) {
        const error = new Error("Acción no autorizada");
        return res.status(401).json({ error: error.message });
      }
      res.send("Contraseña correcta");
    } catch (error) {
      return res.status(500).json({ error: "Hubo un error" });
    }
  }
}
