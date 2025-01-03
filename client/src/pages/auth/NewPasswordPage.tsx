import NewPasswordToken from "@/components/auth/NewPassworddToken";
import NewPasswordForm from "@/components/auth/NewPasswordForm";
import { useState } from "react";

export default function NewPasswordPage() {
  const [token, setToken] = useState('');
  const [isValidate, setIsValidate] = useState(false);
  return (
    <>
      <h1 className="text-5xl font-black text-white">Restablecer Contraseña</h1>
      <p className="text-2xl font-light text-white mt-5">
        Ingrese el código que recibiste {''}
        <span className=" text-fuchsia-500 font-bold"> por email</span>
      </p>

      {!isValidate
        ?
        <NewPasswordToken
          token={token}
          setToken={setToken}
          setIsValidate={setIsValidate} />
        :
        <NewPasswordForm />}
    </>
  )
}
