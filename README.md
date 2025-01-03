# Sitio UpTask

La aplicación UpTask es un gestor de tareas y proyectos que permite a los usuarios organizar su trabajo de manera eficiente. Los usuarios pueden crear proyectos, añadir tareas a los proyectos, añadir miembros al equipo y añadir notas a las tareas. **El sitio web se construyo en el curso de React Avanzado de Juan Pablo de la Torre Valdez**.

## Tecnologías Utilizadas

### Cliente (Frontend)

- React
- TypeScript
- Vite
- Tailwind CSS
- React Query
- React Hook Form
- Axios

### Servidor (Backend)

- Node.js
- Express
- TypeScript
- Mongoose
- JWT (Json Web Token)
- Nodemailer

## Funcionalidades

### Cliente

- **Autenticación**: Registro, inicio de sesión, recuperación de contraseña.
- **Gestión de Proyectos**: Crear, editar, eliminar proyectos.
- **Gestión de Tareas**: Crear, editar, eliminar tareas dentro de un proyecto.
- **Gestión de Equipos**: Añadir y eliminar miembros del equipo en un proyecto.
- **Notas**: Añadir y eliminar notas en las tareas.

### Servidor

- **Autenticación**: Manejo de usuarios, generación de tokens JWT, envío de correos electrónicos para confirmación y recuperación de contraseña.
- **Gestión de Proyectos**: Endpoints para crear, editar, eliminar y obtener proyectos.
- **Gestión de Tareas**: Endpoints para crear, editar, eliminar y obtener tareas.
- **Gestión de Equipos**: Endpoints para añadir y eliminar miembros del equipo en un proyecto.
- **Notas**: Endpoints para añadir y eliminar notas en las tareas.

## Configuración del Entorno

### Cliente

1. Clona el repositorio.

2. ```bash
   cd client
   ```

3. ```bash
   npm install  # o pnpm install
   ```

4. Crea un archivo `.env.local` en el directorio `client` con el siguiente contenido:

```bash
VITE_API_URL=http://localhost:3000/api
```

5. ```bash
   npm run dev  # o pnpm run dev
   ```

### Servidor

1. ```bash
   cd server
   ```

2. ```bash
   npm install  # o pnpm install
   ```

3. Crea un archivo `.env` en el directorio `server` con el siguiente contenido:

   ```bash
   DATABASE_URL=<URL de tu base de datos>
   FRONTEND_URL=http://localhost:5173
   JWT_SECRET=<Tu clave secreta>
   ```

4. ```bash
   npm run dev:api  # o pnpm run dev:api
   ```

## Screenshot

### Gestión de Proyectos
![Inicio](/image/inicio.png)

### Gestión de Tareas
![Proyectos](/image/uptask.png)


### Gestión de Colaboradores.
![Colaboradores](/image/colaboradores.png)