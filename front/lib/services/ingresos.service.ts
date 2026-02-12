import { query } from '../db';

export interface IngresoAcumulado {
  fecha: string;
  ingresos_dia: number;
  ingresos_acumulados: number;
}

export async function getIngresosAcumulados(): Promise<IngresoAcumulado[]> {
  const res = await query(`
    SELECT 
      fecha, 
      ingresos_dia, 
      ingresos_acumulados 
    FROM vw_ingresos_acumulados 
    ORDER BY fecha DESC
  `);
  
  return res.rows;
}