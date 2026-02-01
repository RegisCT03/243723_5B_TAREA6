# Sistema de Reportes de Laboratorio - Tarea 6

Este proyecto implementa PostgreSQL + Views + NextJs + DockerCompose. La arquitectura se basa en un entorno de contenedores en **Docker** con **Next.js** y **PostgreSQL**, priorizando la optimización de consultas y la seguridad de los datos.

## Indexes
Se implementaron índices estratégicos en el archivo 04_indexes.sql para optimizar el rendimiento del motor de base de datos, se crearon índices en llaves foráneas para acelerar los JOINs entre tablas de gran tamaño, se utilizo IF NOT EXISTS para garantizar que la inicialización del contenedor no se interrumpa si el índice ya fue creado por el esquema base.

### Justificación de Indexes

#### idx_orden_detalles_producto_id
**Justificación:** Hace un JOIN constante entre las tablas productos y orden_detalles. Sin este índice, PostgreSQL tendría que realizar un "Sequential Scan" (leer cada fila de la tabla de detalles) para encontrar las ventas de un producto, gracias a esta implementación, la búsqueda se transforma a un "Index Scan"

#### idx_ordenes_created_at
**Justificación:** Vistas como vw_ventas_mensuales e vw_ingresos_acumulados, dependen de funciones de tiempo como EXTRACT(MONTH...) y DATE(created_at). Además, la vista de ingresos acumulados requiere un ordenamiento cronológico estricto (ORDER BY fecha), este índice permite reducir el costo computacional del GROUP BY por fechas y agiliza las funciones de ventana (Window Functions) que calculan totales acumulados.

#### idx_ordenes_usuario_id
**Justificación:** vw_clientes_valor y vw_ranking_clientes se centran en el comportamiento del cliente, uniendo la tabla usuarios con ordenes, al implementar este índice, la llave foránea usuario_id, puede agrupar rápidamente todas las compras pertenecientes a un solo cliente. Esto es vital para que la función RANK() pueda procesar el gasto total y asignar posiciones en el ranking

## Views
Las vistas se encuentran en 05_reports_vw.sql. Next.js consume datos de vistas limpias, evitando que el código de la aplicación deba manejar lógica SQL compleja directamente, las vistas permiten mostrar solo los datos necesarios para los reportes sin exponer la estructura interna completa de las tablas base.

### Justificación de Vistas

#### 1. vw_top_productos
**Justificación:** Esta vista centraliza el rendimiento de cada producto. Es fundamental para el equipo de compras y marketing. Se utilizó `CASE` condicional combinado con `RANK()` para dividir los productos automáticamente entre "Producto Estrella" o "Regular". El uso de `NULLIF` previene errores de división por cero en el cálculo del precio promedio. El uso de `HAVING` garantiza que el reporte muestre únicamente artículos que han generado ventas.

#### 2. vw_ventas_mensuales
**Justificación:** Permite identificar la estacionalidad de las ventas. Es la base para proyecciones financieras y comparativas mes a mes.Se usa `EXTRACT` para normalizar fechas y `COUNT(DISTINCT o.id)` para asegurar un conteo preciso de transacciones, evitando duplicidades causadas por los múltiples detalles que puede tener una sola orden. Su uso facilitaría la creación de gráficas de líneas en el Frontend al entregar los datos ya agrupados por periodos cronológicos.

#### 3. vw_clientes_valor
**Justificación:** Identifica a los clientes que generan el mayor flujo de caja. Se usa `COALESCE` para manejar valores nulos en el gasto total y `ROUND` para estandarizar la salida a dos decimales, realiza un `JOIN` entre las tablas de identidad (`usuarios`) y transacciones (`ordenes`).

#### 4. vw_ranking_clientes
**Justificación:** Establece un ranking de clientes basada en sus compras. Implementa una **Window Function** (`RANK() OVER`). A diferencia de un simple `ORDER BY`, el ranking permite asignar una posición numérica que persiste incluso si se aplican filtros adicionales en la consulta, manteniendo la integridad de la posición del cliente en la tabla global.

#### 5. vw_ingresos_acumulados
**Justificación:** Muestra el crecimiento del capital día a día y el acumulado con en el tiempo. Common Table Expression: El uso de `WITH` permite separar la consulta, calculando primero los ingresos diarios para luego procesarlos, utiliza un `SUM(...) OVER (ORDER BY fecha)` para crear una suma acumulativa.

## Roles
En el archivo 06_roles.sql se aplicó el estándar de seguridad de Mínimo Privilegio, se creó el rol view_user específicamente para la capa web y se revocaron explícitamente los permisos de INSERT, UPDATE y DELETE.

## Flujo de Inicialización
La base de datos se construye siguiendo una jerarquía de dependencias lógica:
1) 01_schema.sql: Esquema de la base de datos (Tablas y estructura general)
2) 02_seed.sql: Insercción de datos semillas (datos de prueba)
3) 03_migrate.sql: Ajustes de última hora para la integridad referencial
4) 04_indexes.sql: Optimización de velocidad sobre las tablas ya pobladas
5) 05_reports_vw.sql: Transforman datos crudos en información estratégica
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
# o 
docker compose up -d

# En caso de requerir un reinicio total (limpieza de volúmenes)
docker compose down -v
```
Una vez finalizado el proceso, puedes acceder a:
Frontend: http://localhost:3000
Base de Datos: Puerto 5432