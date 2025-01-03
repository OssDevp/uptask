import { getTaskById } from "@/api/TaskApi";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useLocation, useParams } from "react-router-dom"
import EditTaskModal from "./EditTaskModal";

export default function EditTaskData() {

  //extraer el id del porject de la url
  const params = useParams();
  const projectId = params.projectId!;

  //extraer el TaskId de la url
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get('editTask')!;

  const { data, isError } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => getTaskById({ projectId, taskId }),
    enabled: !!taskId,
    retry: false
  })

  if (isError) return <Navigate to={'/404'} />

  if (data) return <EditTaskModal data={data} taskId={taskId} />
}
