CREATE ROLE view_user WITH 
    LOGIN 
    PASSWORD 'Password123'
    NOSUPERUSER
    NOCREATEDB
    NOCREATEROLE
    NOINHERIT;
GRANT CONNECT ON DATABASE db_LabReportes TO view_user;
GRANT USAGE ON SCHEMA public TO view_user;
--Permisos 
GRANT SELECT ON 
    vw_top_productos,
    vw_ventas_mensuales,
    vw_clientes_valor,
    vw_ranking_clientes,
    vw_ingresos_acumulados
TO view_user;
--- Revocar permisos innecesarios
REVOKE CREATE ON SCHEMA public FROM public;
REVOKE ALL ON DATABASE db_LabReportes FROM public;