import { query } from '../../../../../../lib/db';
import Link from 'next/link';

export default async function VentasMensuales({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  
  await searchParams;
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

  const data = res.rows;

  return (
    <main>
      <div>
        <Link href="/">
          ← Volver al Dashboard
        </Link>
      </div>

      <h1>Reporte de Ventas Mensuales</h1>
      
      <section>
        <p>
          Este reporte permite comparar el crecimiento mes a mes.
        </p>
      </section>

      <table>
        <thead>
          <tr>
            <th>Año</th>
            <th>Mes</th>
            <th>Total Órdenes</th>
            <th>Ventas Totales</th>
            <th>Ticket Promedio</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row: any, index: number) => (
                <tr key={index}>
                    <td>{row.anio}</td>
                    <td>{row.mes}</td>
                    <td>{row.total_ordenes}</td>
                    <td>${row.ventas_totales}</td>
                    <td>${row.ticket_promedio}</td>
                </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && (
        <p>No se encontraron registros de ventas.</p>
      )}
    </main>
  );
}