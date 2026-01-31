import { query } from '../../../../../../lib/db';
import Link from 'next/link';

interface ClienteValor {
  cliente_id: number;
  cliente_nombre: string;
  ordenes_count: number;
  gasto_total: number;
  gasto_promedio: number;
}

export default async function ClientesRecurrentes({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  await searchParams;
  const res = await query(`
    SELECT 
      cliente_id, 
      cliente_nombre, 
      ordenes_count, 
      gasto_total, 
      gasto_promedio 
    FROM vw_clientes_valor 
    ORDER BY gasto_total DESC
  `);
  
  const data: ClienteValor[] = res.rows;

  return (
    <main>
      <div>
        <Link href="/">
          ← Volver al Dashboard
        </Link>
      </div>

      <h1>Reporte de Clientes de Alto Valor</h1>
      
      <section>
        <p>
          Este reporte identifica a los clientes recurrentes y su gastos totales.
        </p>
      </section>

      <table>
        <thead>
          <tr>
            <th>ID Cliente</th>
            <th>Nombre</th>
            <th>Total de Órdenes</th>
            <th>Gasto Total</th>
            <th>Promedio de Compra</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row: ClienteValor, index: number) => (
            <tr key={row.cliente_id || index}>
              <td>{row.cliente_id}</td>
              <td>{row.cliente_nombre}</td>
              <td>{row.ordenes_count}</td>
              <td>${row.gasto_total}</td>
              <td>${row.gasto_promedio}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && (
        <p>No se encontraron datos de clientes recurrentes.</p>
      )}
    </main>
  );
}