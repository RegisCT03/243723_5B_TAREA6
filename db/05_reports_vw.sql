-- View: Reporte de ventas y ganancias por producto
-- Qué devuelve: Los productos que más dinero y unidades han vendido
-- Métricas: 
-- -Cantidad vendida: SUM(cantidad)
-- -Ingresos totales: SUM(subtotal)
-- -Precio promedio: SUM(subtotal)/SUM(cantidad)
-- Grain (que representa una fila): Un producto único
-- Por qué GROUP BY/HAVING: GROUP BY se usa para agrupar todos los registros de orden_detalles por producto y HAVING para filtrar productos con al menos 1 venta
CREATE OR REPLACE VIEW vw_top_productos AS
SELECT
    p.id AS producto_id,
    p.nombre AS producto_nombre,
    SUM(od.cantidad) AS unidades_vendidas,
    SUM(od.subtotal) AS ventas_totales,
    CASE 
        WHEN SUM(od.subtotal) > 1000 OR (RANK() OVER (ORDER BY SUM(od.cantidad) DESC) <= 3 AND SUM(od.cantidad) >= 5) THEN 'Producto Estrella'
        ELSE 'Venta Regular'
    END AS categoria_exito,
    SUM(od.subtotal) / NULLIF(SUM(od.cantidad), 0) AS precio_promedio
FROM productos p
JOIN orden_detalles od ON od.producto_id = p.id
GROUP BY p.id, p.nombre
HAVING SUM(od.cantidad) > 0;

-- VERIFY 1: Ver que la suma total coincida con lo vendido
-- SELECT SUM(ventas_totales) FROM vw_top_productos;
-- SELECT SUM(subtotal) FROM orden_detalles;
-- VERIFY 2: Ver los 5 productos más vendidos (valida el orden).
-- SELECT * FROM vw_top_productos ORDER BY ventas_totales DESC LIMIT 5;

------------------------------------------------------------
-- View: Ventas mensuales
-- Qué devuelve: Resumen mensual de ventas
-- Métricas:
--  -Unidades vendidas: COUNT
--  -Ventas totales: SUM(total)
--  -Promedio: Ventas totales/Unidades vendidas
-- Grain (que representa una fila): Un mes específico
-- Por qué GROUP BY/HAVING: GROUP BY se usa para agrupar todas las fechas de las órdenes por su respectivo mes y año y HAVING para filtrar solo meses con ventas
CREATE OR REPLACE VIEW vw_ventas_mensuales AS
SELECT
    EXTRACT(YEAR FROM o.created_at)::int AS anio,
    EXTRACT(MONTH FROM o.created_at)::int AS mes,
    COUNT(DISTINCT o.id) AS total_ordenes,
    SUM(o.total) AS ventas_totales,
    SUM(o.total) / NULLIF(COUNT(DISTINCT o.id), 0) AS ticket_promedio
FROM ordenes o
GROUP BY
    EXTRACT(YEAR FROM o.created_at),
    EXTRACT(MONTH FROM o.created_at)
HAVING COUNT(DISTINCT o.id) > 0;

-- VERIFY 1: Ver que la suma mensual coincida con el total histórico
-- SELECT SUM(ventas_totales) FROM vw_ventas_mensuales;
-- SELECT SUM(total) FROM ordenes;
-- VERIFY 2: Ver últimos meses
-- SELECT * FROM vw_ventas_mensuales ORDER BY anio DESC, mes DESC LIMIT 5;

------------------------------------------------------------
-- View: Clientes recurrentes
-- Qué devuelve: Los clientes que más dinero han dejado en la tienda
-- Métricas: 
--  -Conteo de ordenes: COUNT
--  -Total gastado: SUM(subtotal)
--  -Promedio: Total gastado/Conteo de ordenes
-- Grain (que representa una fila): Un cliente único
-- Por qué GROUP BY/HAVING: GROUP BY se usa para agrupar todas las ordenes con sus respectivos clientes y HAVING para filtrar clientes con al menos 1 orden
CREATE OR REPLACE VIEW vw_clientes_valor AS
SELECT
    u.id AS cliente_id,
    u.nombre AS cliente_nombre,
    COUNT(DISTINCT o.id) AS ordenes_count,
    COALESCE(SUM(o.total), 0) AS gasto_total, -- Requisito de COALESCE cumplido
    ROUND(SUM(o.total) / NULLIF(COUNT(DISTINCT o.id), 0), 2) AS gasto_promedio
FROM usuarios u
JOIN ordenes o ON o.usuario_id = u.id
GROUP BY u.id, u.nombre
HAVING COUNT(DISTINCT o.id) > 0;

-- VERIFY 1: Revisar clientes con más gastos
-- SELECT * FROM vw_clientes_valor ORDER BY gasto_total DESC LIMIT 5;
-- VERIFY 2: Comparar suma de gasto_total con tabla ordenes
-- SELECT SUM(gasto_total) FROM vw_clientes_valor;
-- SELECT SUM(total) FROM ordenes;
------------------------------------------------------------

-- View: Ranking de clientes por gasto
-- Qué devuelve: Ranking de clientes ordenados por gasto total
-- Métricas: 
--  -Numero de órdenes: COUNT
--  -Gasto total: SUM(total)
--  -Ranking: RANK() OVER (ORDER BY SUM(total) DESC)
-- Grain (que representa una fila): Un cliente único
-- Por qué GROUP BY/HAVING: GROUP BY se usa para agrupar todas las ordenes con sus respectivos clientes y HAVING para filtrar clientes con al menos 1 orden
-- Window Function: RANK() sirve para ponerle el número de puesto automáticamente sin perder los datos originales.
CREATE OR REPLACE VIEW vw_ranking_clientes AS
SELECT
    u.id AS cliente_id,
    u.nombre AS cliente_nombre,
    COUNT(o.id) AS ordenes_count,
    SUM(o.total) AS gasto_total,
    RANK() OVER (ORDER BY SUM(o.total) DESC) AS ranking 
FROM usuarios u 
JOIN ordenes o ON o.usuario_id = u.id 
GROUP BY u.id, u.nombre
HAVING SUM(o.total) > 0;
------------------------------------------------------------

-- View: Ingresos diarios acumulados
-- Qué devuelve: El dinero ganado por día y cómo se va acumulando con el tiempo
-- Métricas: 
--  -Ingresos del día: SUM(total)
--  -Ingresos acumulados: SUM(ingresos_dia) OVER (ORDER BY fecha)
-- Grain (que representa una fila): Un dia específico
-- Uso de CTE (WITH): Primero calculamos el total de cada día por separado para luego poder sumarlos uno tras otro de forma ordenada.
-- Por qué GROUP BY/HAVING: GROUP BY se usa para agrupar todas las órdenes por su respectiva fecha
CREATE OR REPLACE VIEW vw_ingresos_acumulados AS
WITH ingresos_por_dia AS (
    SELECT
        DATE(created_at) AS fecha,
        SUM(total) AS ingresos_dia
    FROM ordenes
    GROUP BY DATE(created_at)
    ) 
SELECT
    fecha,
    ingresos_dia,
    SUM(ingresos_dia) OVER (ORDER BY fecha) AS ingresos_acumulados 
    FROM ingresos_por_dia;