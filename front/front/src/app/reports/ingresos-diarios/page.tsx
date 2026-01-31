import { query } from '../../../../../../lib/db';
import Link from 'next/link';

interface IngresoAcumulado {
  fecha: string;
  ingresos_dia: number;
  ingresos_acumulados: number;
}

export default async function IngresosDiarios({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  await searchParams;
  const res = await query(`
    SELECT 
      fecha, 
      ingresos_dia, 
      ingresos_acumulados 
    FROM vw_ingresos_acumulados 
    ORDER BY fecha DESC
  `);

  const data: IngresoAcumulado[] = res.rows;

  return (
    <main>
      <div>
        <Link href="/">
          ← Volver al Dashboard
        </Link>
      </div>

      <h1>Reporte de Ingresos Diarios Acumulados</h1>
      
      <section>
        <p>
          Este reporte permite visualizar la comparación del ingreso diario con el acumulado.
        </p>
      </section>

      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Ingresos del Día</th>
            <th>Total Acumulado</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row: IngresoAcumulado, index: number) => (
            <tr key={index}>
              <td>{new Date(row.fecha).toLocaleDateString()}</td>
              <td>${row.ingresos_dia}</td>
              <td><strong>${row.ingresos_acumulados}</strong></td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && (
        <p>No hay registros de ingresos disponibles.</p>
      )}
    </main>
  );
}