import { query } from '../db';

export interface ClienteValor {
  cliente_id: number;
  cliente_nombre: string;
  ordenes_count: number;
  gasto_total: number;
  gasto_promedio: number;
}

export async function getClientesFieles(): Promise<ClienteValor[]> {
  const res = await query(`
    SELECT 
      cliente_id, 
      cliente_nombre, 
      ordenes_count, 
      gasto_total, 
      gasto_promedio 
    FROM vw_clientes_valor 
    ORDER BY cliente_id ASC
  `);
  
  return res.rows;
}