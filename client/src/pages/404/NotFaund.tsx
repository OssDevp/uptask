import { Link } from "react-router-dom";

export default function NotFaund() {
  return (
    <>
      <h1 className="font-black text-center text-4xl text-white">
        Página No Encontrada
      </h1>
      <div className="mt-10 flex justify-center items-center">
        <Link
          className="bg-fuchsia-500 hover:bg-fuchsia-600 transition-colors duration-200 text-white font-bold px-4 py-3"
          to={"/"}
        >
          Volver a la pagina principal
        </Link>
      </div>
    </>
  );
}
