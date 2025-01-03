import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { ProjectExists } from "../middleware/project";
import {
  hasAuthorization,
  TaskBelongToProject,
  TaskExists,
} from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamController } from "../controllers/TeamController";
import { NoteController } from "../controllers/NoteController";

const router: Router = Router();

// hace que todas las rutas sean privadas
router.use(authenticate);

/* Ruta Project */
router.param("idProject", ProjectExists);

router.post(
  "/",
  body("projectName")
    .notEmpty()
    .withMessage("El nombre del Proyecto es obligatorio"),
  body("clientName")
    .notEmpty()
    .withMessage("El nombre del Cliente es obligatorio"),
  body("description").notEmpty().withMessage("La descipcion es obligatoria"),
  handleInputErrors,
  ProjectController.createProject
);

router.get("/", ProjectController.getAllProject);

router.get(
  "/:idProject",
  param("idProject").isMongoId().withMessage("ID no Valido"),
  handleInputErrors,
  ProjectController.getProjectByID
);

router.put(
  "/:idProject",
  param("idProject").isMongoId().withMessage("ID no Valido"),
  body("projectName")
    .notEmpty()
    .withMessage("El nombre del Proyecto es obligatorio"),
  body("clientName")
    .notEmpty()
    .withMessage("El nombre del Cliente es obligatorio"),
  body("description").notEmpty().withMessage("La descipcion es obligatoria"),
  handleInputErrors,
  hasAuthorization,
  ProjectController.updateProject
);

router.delete(
  "/:idProject",
  param("idProject").isMongoId().withMessage("ID no Valido"),
  handleInputErrors,
  hasAuthorization,
  ProjectController.deleteProject
);

/** ruta de tareas */
router.param("idTask", TaskExists);
router.param("idTask", TaskBelongToProject);

router.post(
  "/:idProject/task",
  hasAuthorization,
  body("name").notEmpty().withMessage("El nombre de la Tarea es obligatorio"),
  body("description").notEmpty().withMessage("La descipcion es obligatoria"),
  handleInputErrors,
  TaskController.createTask
);

router.get("/:idProject/task", TaskController.getTask);

router.get(
  "/:idProject/task/:idTask",
  param("idTask").isMongoId().withMessage("ID no Valido"),
  handleInputErrors,
  TaskController.getTaskByID
);

router.put(
  "/:idProject/task/:idTask",
  hasAuthorization,
  param("idTask").isMongoId().withMessage("ID no Valido"),
  body("name").notEmpty().withMessage("El nombre de la Tarea es obligatorio"),
  body("description").notEmpty().withMessage("La descipcion es obligatoria"),
  handleInputErrors,
  TaskController.updateTask
);

router.delete(
  "/:idProject/task/:idTask",
  hasAuthorization,
  param("idTask").isMongoId().withMessage("ID no Valido"),
  handleInputErrors,
  TaskController.deleteTask
);

router.post(
  "/:idProject/task/:idTask/status",
  param("idTask").isMongoId().withMessage("ID no Valido"),
  body("status").notEmpty().withMessage("El status es obligatorio"),
  handleInputErrors,
  TaskController.updateStatusTask
);

router.post(
  "/:idProject/team/find",
  body("email").isEmail().toLowerCase().withMessage("Email no valido"),
  handleInputErrors,
  TeamController.findMemberByEmail
);

router.post(
  "/:idProject/team",
  body("id").isMongoId().notEmpty().withMessage("Id no valido"),
  handleInputErrors,
  TeamController.addMemberById
);

router.get("/:idProject/team", TeamController.getMembers);

router.delete(
  "/:idProject/team/:userId",
  param("userId").isMongoId().withMessage("Id no valido"),
  handleInputErrors,
  TeamController.removeMemberById
);

/**Notas */

router.post(
  "/:idProject/task/:idTask/notes",
  body("content")
    .notEmpty()
    .withMessage("El contenido de la nota es obligatorio"),
  handleInputErrors,
  NoteController.createNote
);

router.get("/:idProject/task/:idTask/notes", NoteController.getNotes);

router.delete(
  "/:idProject/task/:idTask/notes/:idNote",
  param("idNote").isMongoId().withMessage("Id no valido"),
  handleInputErrors,
  NoteController.removeNote
);
export default router;
