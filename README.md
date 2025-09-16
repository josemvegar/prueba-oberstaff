# Project Manager - Prueba Técnica

## Resumen
Aplicación fullstack: Django + DRF (backend) y React + Vite + MUI (frontend).
Funcionalidades: autenticación JWT, roles, CRUD proyectos, tareas, comentarios, asignación de usuarios.

## Estructura
- /backend: Django project
- /frontend: React app (Vite)

## Setup local (backend)
1. cd backend
2. python -m venv .venv
3. source .venv/bin/activate
4. pip install -r requirements.txt
5. python manage.py migrate
6. python manage.py runserver

## Setup local (frontend)
1. cd frontend
2. npm install
3. npm run dev

## API
- POST /api/auth/token/ -> login (username/password)
- GET /api/projects/
- POST /api/projects/
- ...

## Deploy
- Backend: PythonAnywhere / Render (ver instrucciones en la carpeta deploy/)
- Frontend: Vercel (apuntar a /frontend)

