import { transporter } from "../config/nodemailer"

interface IEmail {
  email: string
  name: string
  token: string
}

export class AuthEmail {
  static async sendConfirmation(user: IEmail) {
    const info = await transporter.sendMail({
      from: 'Uptask <uptask@gmail.com>',
      to: user.email,
      subject: 'Uptask - Confirma tu cuenta',
      text: 'Uptask - Confirma tu cuenta',
      html: `<p>Hola: ${user.name}, has creado tu cuenta en Uptask. Ahora solo debes confirmar</p>
          <p>Visita el siguiente enlace:</p>
          <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirma tu cuenta</a>
          <p>Ingresa el siguiente codigo: <b>${user.token}</b></p>
          <p>Este token expira en 10 minutos</p>
      `
    })

    console.log('Mensaje enviado', info.messageId)
  }

  static async sendPasswordResetToken(user: IEmail) {
    const info = await transporter.sendMail({
      from: 'Uptask <uptask@gmail.com>',
      to: user.email,
      subject: 'Uptask - Restablece tu contraseña',
      text: 'Uptask - Restablece tu contraseña',
      html: `<p>Hola: ${user.name}, has olvidado la contraseña de tu cuenta en Uptask.</p>
          <p>Puedes reestrablecer tu contraseña, ingresando al link:</p>
          <a href="${process.env.FRONTEND_URL}/auth/new-password">Restablece tu contraseña</a>
          <p>Ingresa el siguiente codigo: <b>${user.token}</b></p>
          <p>Este token expira en 10 minutos</p>
      `
    })

    console.log('Mensaje enviado', info.messageId)
  }
}