# Plataforma Universitaria — Universidad Tecnológica La Mejor

Plataforma universitaria moderna para la gestión académica, administrativa y financiera. Desarrollada con React, TypeScript y Tailwind CSS.

## Requisitos

- Node.js 18+
- npm 9+

## Instalación

```bash
npm install
```

## Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en el navegador.

## Build de producción

```bash
npm run build
npm run preview
```

## Credenciales de prueba

Todas las contraseñas son `123456`.

| Rol | Correo |
|---|---|
| Estudiante | estudiante@mail.com |
| Docente | docente@mail.com |
| Administrativo | admin@mail.com |
| Directivo | directivo@mail.com |

En la pantalla de login, selecciona un rol para autocompletar las credenciales.

## Estructura del proyecto

```
src/
├── components/Layout/     # Sidebar + header (navegación principal)
├── contexts/              # AuthContext (autenticación simulada)
├── data/                  # Datos mock (mockData.ts)
├── pages/
│   ├── Login/             # Inicio de sesión
│   ├── Dashboard/         # Dashboard por rol
│   ├── Matricula/         # Matrícula de cursos
│   ├── Cursos/            # Cursos del estudiante
│   ├── Horarios/          # Horario semanal
│   ├── Calificaciones/    # Calificaciones por período
│   ├── Financiero/        # Estado de cuenta y pagos
│   ├── Administrativo/    # Gestión de estudiantes, docentes, cursos
│   ├── Ejecutivo/         # Dashboard con gráficos (Recharts)
│   └── Docente/           # Cursos, asistencia y calificaciones
├── types/                 # Definiciones de TypeScript
├── App.tsx                # Router principal
└── main.tsx               # Punto de entrada
```

## Datos simulados

- **10 estudiantes**, **5 docentes**, 1 admin, 1 directivo
- **10 cursos** distribuidos en 4 carreras
- **5 períodos académicos** (2025-1 al 2027-1)
- **Calificaciones**, **pagos** y **asistencia** predefinidos

## Roles y acceso

| Rol | Módulos |
|---|---|
| Estudiante | Dashboard, Matrícula, Cursos, Horarios, Calificaciones, Financiero |
| Docente | Dashboard, Mis Cursos, Asistencia, Calificaciones |
| Administrativo | Dashboard, Gestión Académica |
| Directivo | Dashboard, Dashboard Ejecutivo |

## Decisiones técnicas

- **Vite** como bundler por velocidad en desarrollo
- **Tailwind CSS** para estilos utilitarios consistentes
- **React Router DOM** para navegación client-side
- **Recharts** para gráficos en el dashboard ejecutivo
- **Lucide React** para iconografía
- **Google Fonts** (Fraunces, Inter, JetBrains Mono) para el sistema tipográfico
- Autenticación simulada con `AuthContext` + `setTimeout`
- Datos mock importados directamente desde `src/data/mockData.ts`
- Sin back-end real, sin API externa

## Diseño

Paleta existente (`primary: #111844`, `secondary: #7288AE`). Sidebar oscuro, tipografía Fraunces para identidad de marca, Inter para cuerpo. Fondo cálido `#F4F3EE`. Animaciones mínimas y funcionales con soporte para `prefers-reduced-motion`.
