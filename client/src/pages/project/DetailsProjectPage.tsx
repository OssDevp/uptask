import { getProjectFull } from "@/api/ProjectApi";
import AddTaskModal from "@/components/task/AddTaskModal";
import EditTaskData from "@/components/task/EditTaskData";
import TaskList from "@/components/task/TaskList";
import TaskModalDetails from "@/components/task/TaskModalDetails";
import useAuth from "@/hooks/useAuth";
import { isManager } from "@/utils/polices";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

export default function DetailsProjectPage() {
  const params = useParams();
  const projectId = params.projectId!;

  const navigate = useNavigate();

  const { data: user, isLoading: userLoading } = useAuth();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectFull(projectId),
    retry: false,
  });

  const canEdit = useMemo(() => data?.manager === user?._id, [data, user]);

  if (isLoading && userLoading) return "cargando..";
  if (isError) return <Navigate to={"/404"} />;
  if (data)
    return (
      <>
        <h1 className="text-5xl font-black">{data.projectName}</h1>
        <p className="text-2xl font-light text-gray-500 my-5">
          {data.description}
        </p>

        {isManager(data.manager, user._id) && (
          <nav className="my-5 flex gap-3">
            <button
              type="button"
              className="bg-purple-400 hover:bg-purple-500 px-10 py-3 font-bold text-white text-lg cursor-pointer transition-colors"
              onClick={() => {
                navigate(`${location.pathname}?newTask=true`);
              }}
            >
              Agregar Tarea
            </button>
            <Link
              to={`/project/${projectId}/team`}
              className="bg-fuchsia-600 hover:bg-fuchsia-700 px-10 py-3 font-bold text-white text-lg cursor-pointer transition-colors"
            >
              Colaboradores
            </Link>
          </nav>
        )}

        <TaskList tasks={data.tasks} canEdit={canEdit} />
        <AddTaskModal />
        <EditTaskData />
        <TaskModalDetails />
      </>
    );
}
