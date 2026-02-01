-- Para vw_top_productos y vw_ventas_mensuales (unión entre productos y sus detalles de orden)
CREATE INDEX IF NOT EXISTS idx_orden_detalles_producto_id ON orden_detalles(producto_id);

-- Para vw_ventas_mensuales y vw_ingresos_acumulados (filtros por fecha (EXTRACT, DATE) y el ordenamiento)
CREATE INDEX IF NOT EXISTS idx_ordenes_created_at ON ordenes(created_at);

-- Para vw_clientes_valor y vw_ranking_clientes (unión entre clientes y sus órdenes)
CREATE INDEX IF NOT EXISTS idx_ordenes_usuario_id ON ordenes(usuario_id);

-- Copiar y pegar estas líneas en la terminal para demostrar que los índices funcionan

-- Prueba 1: Ver cómo el índice ayuda a encontrar detalles de productos rápido
-- EXPLAIN ANALYZE SELECT * FROM vw_top_productos;

-- Prueba 2: Ver cómo el índice ayuda a agrupar por mes/año sin leer toda la tabla
-- EXPLAIN ANALYZE SELECT * FROM vw_ventas_mensuales;

-- Prueba 3: Ver cómo el índice agiliza el ranking de clientes
-- EXPLAIN ANALYZE SELECT * FROM vw_ranking_clientes;