import { query } from '../../../../../../lib/db';
import Link from 'next/link';
import { z } from 'zod';

interface RankingCliente {
  ranking: number;
  cliente_id: number;
  cliente_nombre: string;
  gasto_total: number;
}

const FilterSchema = z.object({
  minGasto: z.coerce.number().min(0).default(0),
});

export default async function RankingClientes({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  
  const resolvedParams = await searchParams;
  const { minGasto } = FilterSchema.parse(resolvedParams);

  const res = await query(
    'SELECT ranking, cliente_id, cliente_nombre, gasto_total FROM vw_ranking_clientes WHERE gasto_total >= $1 ORDER BY ranking ASC',
    [minGasto]
  );

  const data: RankingCliente[] = res.rows;

  return (
    <main>
      <div>
        <Link href="/">
          ← Volver al Dashboard
        </Link>
      </div>

      <h1>Ranking VIP de Clientes</h1>
      
      <section>
        <h2>Insight de Negocio:</h2>
        <p>
          Este reporte utiliza funciones de ventana (RANK) para posicionar a los clientes según sus gastos totales. 
          Permite identificar al top de consumidores.
        </p>
      </section>

      <section>
        <form method="GET">
          <label htmlFor="minGasto">Gasto Mínimo: </label>
          <input 
            type="number" 
            id="minGasto" 
            name="minGasto" 
            defaultValue={minGasto} 
          />
          <button type="submit">Filtrar</button>
        </form>
      </section>

      <br />

      <table>
        <thead>
          <tr>
            <th>Posición</th>
            <th>ID Cliente</th>
            <th>Nombre del Cliente</th>
            <th>Gasto Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row: RankingCliente, index: number) => (
            <tr key={row.cliente_id || index}>
              <td><strong>#{row.ranking}</strong></td>
              <td>{row.cliente_id}</td>
              <td>{row.cliente_nombre}</td>
              <td>${row.gasto_total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && (
        <p>No hay clientes que cumplan con el criterio de gasto mínimo de ${minGasto}.</p>
      )}
    </main>
  );
}