# Sistema de Reportes de Laboratorio - Tarea 6

Este proyecto implementa PostgreSQL + Views + NextJs + DockerCompose. La arquitectura se basa en un entorno contenedorizado con **Next.js** y **PostgreSQL**, priorizando la optimización de consultas y la seguridad de los datos.

## Indexes
Se implementaron índices estratégicos en el archivo 04_indexes.sql para optimizar el rendimiento del motor de base de datos, se crearon índices en llaves foráneas para acelerar los JOINs entre tablas de gran tamaño, se utilizo IF NOT EXISTS para garantizar que la inicialización del contenedor no se interrumpa si el índice ya fue creado por el esquema base.

## Views
Las vistas se encuentran en 05_reports_vw.sql. Next.js consume datos de vistas limpias, evitando que el código de la aplicación deba manejar lógica SQL compleja directamente, las vistas permiten mostrar solo los datos necesarios para los reportes sin exponer la estructura interna completa de las tablas base.

## Roles
En el archivo 06_roles.sql se aplicó el estándar de seguridad de Mínimo Privilegio, Se creó el rol view_user específicamente para la capa web y se revocaron explícitamente los permisos de INSERT, UPDATE y DELETE.

## Flujo de Inicialización
La base de datos se construye siguiendo una jerarquía de dependencias lógica:
1) 01_schema.sql: Esquema de la base de datos (Tablas y estructura)
2) 02_seed.sql: Insercción de datos semillas (datos de prueba)
3) 03_migrate.sql: Ajustes de última hora para la integridad referencial
4) 04_indexes.sql: Optimización de velocidad sobre las tablas ya pobladas
5) 05_reports_vw.sql: Capa de inteligencia de negocio (BI) sobre los datos
6) 06_roles.sql: Creación del usuario web

## Estructura del Trabajo
- Front: Aplicación Next.js configurada para conectar con la base de datos mediante variables de entorno seguras (solo tiene acceso a views)
- db: Todo lo relacionado a SQL, con los archivos mencionados anteriormente
- docker-compose.yml: Configuración de red interna y persistencia de datos mediante volúmenes
- .env: Gestión de credenciales y configuración de acceso al host de base de datos

## Despliegue Rápido

```bash
# Levantar el entorno y construir imágenes
docker compose up --build

# En caso de requerir un reinicio total (limpieza de volúmenes)
docker compose down -v
''' 

Una vez finalizado el proceso, puedes acceder a:
Frontend: http://localhost:3000
Base de Datos: Puerto 5432