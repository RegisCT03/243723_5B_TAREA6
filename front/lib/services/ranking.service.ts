import { query } from '../db';

export interface RankingCliente {
  ranking: number;
  cliente_id: number;
  cliente_nombre: string;
  gasto_total: number;
}

export interface RankingData {
  rows: RankingCliente[];
  totalCount: number;
}

export async function getRankingData(minGasto: number, page: number, limit: number = 4): Promise<RankingData> {
  const offset = (page - 1) * limit;
  const res = await query(
    `SELECT ranking, cliente_id, cliente_nombre, gasto_total 
     FROM vw_ranking_clientes 
     WHERE gasto_total >= $1 
     ORDER BY ranking ASC 
     LIMIT $2 OFFSET $3`,
    [minGasto, limit, offset]
  );

  const countRes = await query(
    'SELECT COUNT(*) FROM vw_ranking_clientes WHERE gasto_total >= $1',
    [minGasto]
  );

  return {
    rows: res.rows,
    totalCount: parseInt(countRes.rows[0].count)
  };
}