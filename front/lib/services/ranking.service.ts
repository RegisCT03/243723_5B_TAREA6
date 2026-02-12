import { query } from '../db';

export interface RankingCliente {
  ranking: number;
  cliente_id: number;
  cliente_nombre: string;
  gasto_total: number;
}

export async function getRankingVIP(minGasto: number = 0): Promise<RankingCliente[]> {
  const res = await query(
    `SELECT ranking, cliente_id, cliente_nombre, gasto_total 
     FROM vw_ranking_clientes 
     WHERE gasto_total >= $1 
     ORDER BY ranking ASC`,
    [minGasto]
  );
  
  return res.rows;
}