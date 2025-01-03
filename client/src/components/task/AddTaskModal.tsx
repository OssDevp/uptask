import { createTask } from '@/api/TaskApi';
import { TaskFormData } from '@/types/index';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import TaskForm from './TaskForm';

export default function AddTaskModal() {

  const navigate = useNavigate();

  // Leer si modal existe
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const modalTask = searchParams.get('newTask');
  const showModal = modalTask ? true : false;

  // Obtener projectId de la url
  const params = useParams();
  const projectId = params.projectId!

  const initialValue: TaskFormData = {
    name: "",
    description: ""
  }
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValue })

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: createTask,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] })
      toast.success(data)
      reset()
      navigate(location.pathname, { replace: true })
    }
  })

  const handleCreatedTask = (formData: TaskFormData) => {
    const data = {
      formData,
      projectId
    }
    mutate(data)
  }

  return (
    <>
      <Transition appear show={showModal} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => { navigate(location.pathname, { replace: true }) }}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                  <DialogTitle
                    as="h3"
                    className="font-black text-4xl  my-5"
                  >
                    Nueva Tarea
                  </DialogTitle>

                  <p className="text-xl font-bold">Llena el formulario y crea  {''}
                    <span className="text-fuchsia-600">una tarea</span>
                  </p>

                  <form
                    className='mt-10 space-y-3'
                    noValidate
                    onSubmit={handleSubmit(handleCreatedTask)}
                  >
                    <TaskForm
                      register={register}
                      errors={errors}
                    />
                    <input
                      type="submit"
                      value="Guardar Tarea"
                      className="bg-fuchsia-500 hover:bg-fuchsia-600 w-full p-3 uppercase font-bold text-white cursor-pointer transition-colors rounded"
                    />
                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}