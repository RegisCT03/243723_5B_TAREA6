# Sistema de Reportes de Laboratorio - Tarea 6

Este proyecto implementa PostgreSQL + Views + NextJs + DockerCompose. La arquitectura se basa en un entorno contenedorizado con **Next.js** y **PostgreSQL**, priorizando la optimización de consultas y la seguridad de los datos.

## Despliegue Rápido

```bash
# Levantar el entorno y construir imágenes
docker compose up --build

# En caso de requerir un reinicio total (limpieza de volúmenes)
docker compose down -v

---
## Indexes 