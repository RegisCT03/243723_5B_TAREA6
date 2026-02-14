import { query } from '../db';

export interface VentaMensual {
  anio: number;
  mes: string;
  total_ordenes: number;
  ventas_totales: number;
  ticket_promedio: number;
}

export async function getVentasMensuales(): Promise<VentaMensual[]> {
  const res = await query(`
    SELECT 
      anio, 
      mes, 
      total_ordenes, 
      ventas_totales, 
      ticket_promedio 
    FROM vw_ventas_mensuales 
    ORDER BY anio DESC, mes DESC
  `);

  return res.rows;
}