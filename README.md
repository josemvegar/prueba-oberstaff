# Project Management System - Prueba Técnica

## Iniciar Sesión
- User: admin
- Pass: 12345678

## Descripción
Sistema completo de gestión de proyectos desarrollado como prueba técnica. Plataforma fullstack con backend en Django REST Framework y frontend en React con Material-UI.

## Características Principales
- ✅ Autenticación JWT
- ✅ Sistema de roles (Admin, Collaborator, Member)
- ✅ CRUD completo de Proyectos, Tareas y Comentarios
- ✅ Asignación de usuarios a proyectos y tareas
- ✅ Interfaz responsive con Material-UI
- ✅ API RESTful documentada

## Arquitectura Técnica

### Backend
- **Framework:** Django + Django REST Framework
- **Autenticación:** JWT (Simple JWT)
- **Base de datos:** SQLite
- **Despliegue:** Render.com

### Frontend  
- **Framework:** React 18 + Vite
- **UI Library:** Material-UI (MUI)
- **Estado:** React Context + useReducer
- **HTTP Client:** Axios
- **Despliegue:** Vercel

## Instalación y Desarrollo Local

### Prerrequisitos
- Python 3.9+
- Node.js 16+
- pip y npm

### Backend (Django)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# .venv\Scripts\activate   # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

### Frontend (Vite + React)
cd frontend
npm install
npm run dev

## Variables de entorno
### Backend
SECRET_KEY=clave_super_larga_y_compleja_de_produccion_123
DEBUG=1 / 0
ALLOWED_HOSTS=localhost 127.0.0.1 midominio.com api.midominio.com
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:8000

### Frontend
VITE_API_URL=http://localhost:8000

## Documentación de API
La colección de Postman incluida contiene toda la documentación de endpoints con ejemplos para:
- Autenticación JWT
- Gestión de proyectos
- Gestión de tareas
- Sistema de comentarios
- Administración de usuarios

### Variables de Postman
{{URL}}: https://prueba-oberstaff-y292.onrender.com (producción)
{{URL}}: http://localhost:8000 (desarrollo local)
{{JWT}}: JWT Generado por el login

## Notas Técnicas
- CORS configurado para desarrollo y producción
- Health checks implementados
- Validaciones tanto en frontend como backend
- Manejo de errores completo
- SI EN EL MOMENTO DE PROBAR LA URL PUBLICA NO FUNCIONA EL BACKEND ES PROBABLE QUE SE HAYA CAIDO EL SERVIDOR GRATUITO, POR FAVOR CONTACTARME PARA REACTIVARLO:

+584263883752
josevega1999.16@gmail.com