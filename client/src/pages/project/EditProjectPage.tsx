import { Navigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getProjectById } from "@/api/ProjectApi"
import EditProjectForm from "@/components/project/EditProjectForm"

export default function EditProjectPage() {
  const params = useParams()
  const projectId = params.projectId!

  const { data, isLoading, isError } = useQuery({
    queryKey: ['projectEdit', projectId],
    queryFn: () => getProjectById(projectId),
    retry: false
  });

  if (isLoading) return "cargando.."
  if (isError) return <Navigate to={'/404'} />
  if (data) return <EditProjectForm data={data} projectId={projectId} />

}
