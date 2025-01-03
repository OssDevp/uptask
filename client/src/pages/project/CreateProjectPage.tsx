import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ProjectForm from "@/components/project/ProjectForm";
import { ProjectFormData } from "@/types/index";
import { createProject } from "@/api/ProjectApi"
import { useMutation } from "@tanstack/react-query";

export default function CreateProjectPage() {

  const navigate = useNavigate();
  const initialValue: ProjectFormData = {
    projectName: "",
    clientName: "",
    description: ""
  }

  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValue });

  const { mutate } = useMutation({
    mutationFn: createProject,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => {
      toast.success(data)
      navigate('/')
    }
  })

  const handleForm = async (formData: ProjectFormData) => mutate(formData)

  return (
    <>
      <div className=" ">
        <h1 className="text-5xl font-black">Crear Proyecto</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">Crea y Administra tus Proyectos</p>

        <nav className="mt-5">
          <Link
            to={"/"}
            className="bg-purple-500 hover:bg-purple-600 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors rounded"
          >
            Volver a Proyectos
          </Link>
        </nav>

        <form
          className="mt-10 bg-white shadow-lg rounded-lg p-10 max-w-3xl mx-auto"
          onSubmit={handleSubmit(handleForm)}
          noValidate
        >
          <ProjectForm
            register={register}
            errors={errors}
          />
          <input
            type="submit"
            value="Crear Proyecto"
            className="bg-fuchsia-500 hover:bg-fuchsia-600 w-full p-3 uppercase font-bold text-white cursor-pointer transition-colors rounded"
          />
        </form>
      </div>
    </>
  )
}