import { query } from '../db';

export interface TopProducto {
  producto_id: number;
  producto_nombre: string;
  unidades_vendidas: number;
  ventas_totales: number;
  categoria_exito: string;
}

export interface PaginatedProducts {
  data: TopProducto[];
  totalCount: number;
}

export async function getTopProductos(limit: number, offset: number): Promise<PaginatedProducts> {
  const res = await query(
    'SELECT * FROM vw_top_productos LIMIT $1 OFFSET $2',
    [limit, offset]
  );

  const countRes = await query('SELECT COUNT(*) FROM vw_top_productos');
  const totalCount = parseInt(countRes.rows[0].count);

  return {
    data: res.rows,
    totalCount
  };
}