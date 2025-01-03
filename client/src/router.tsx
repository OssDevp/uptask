import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import DashboardPages from "@/pages/DashboardPages";
import CreateProjectPage from "@/pages/project/CreateProjectPage";
import EditProjectPage from "@/pages/project/EditProjectPage";
import DetailsProjectPage from "@/pages/project/DetailsProjectPage";
import AuthLayouts from "@/layouts/AuthLayouts";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ConfirmAccountPage from "@/pages/auth/ConfirmAccountPage";
import RequestCodePage from "@/pages/auth/RequestCodePage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import NewPasswordPage from "@/pages/auth/NewPasswordPage";
import TeamProjectPage from "@/pages/project/TeamProjectPage";
import ProfilePages from "@/pages/profile/ProfilePages";
import ChangePasswordPage from "@/pages/profile/ChangePasswordPage";
import ProfileLayout from "@/layouts/ProfileLayout";
import NotFaund from "./pages/404/NotFaund";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPages />} index />
          <Route path="/project/create" element={<CreateProjectPage />} />
          <Route path="/project/:projectId" element={<DetailsProjectPage />} />
          <Route
            path="/project/:projectId/edit"
            element={<EditProjectPage />}
          />
          <Route
            path="/project/:projectId/team"
            element={<TeamProjectPage />}
          />
          <Route element={<ProfileLayout />}>
            <Route path="/profile" element={<ProfilePages />} />
            <Route path="/profile/password" element={<ChangePasswordPage />} />
          </Route>
        </Route>

        <Route element={<AuthLayouts />}>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route
            path="/auth/confirm-account"
            element={<ConfirmAccountPage />}
          />
          <Route path="/auth/request-code" element={<RequestCodePage />} />
          <Route
            path="/auth/forgot-password"
            element={<ForgotPasswordPage />}
          />
          <Route path="/auth/new-password" element={<NewPasswordPage />} />
        </Route>

        <Route element={<AuthLayouts />}>
          <Route path="*" element={<NotFaund />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
