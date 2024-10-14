# Backend
FROM python:3.9-slim AS backend
WORKDIR /app
COPY ./backend /app
RUN pip install --no-cache-dir -r requirements.txt
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]

# Frontend
FROM node:14 AS frontend
WORKDIR /app
COPY ./frontend /app
RUN npm install
RUN npm run build

# Final Stage - serve the React app
FROM nginx:alpine
COPY --from=frontend /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
