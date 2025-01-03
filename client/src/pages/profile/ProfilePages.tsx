import ProfileForm from "@/components/profile/ProfileForm";
import useAuth from "@/hooks/useAuth";

export default function ProfilePages() {
  const { data, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  if (data) return <ProfileForm data={data} />;
}
