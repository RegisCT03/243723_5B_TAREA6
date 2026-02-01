import { query } from '../../../../lib/db';
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
    <main className="min-h-screen bg-[#f4f1f1] p-8">
      <div className="max-w-5xl mx-auto">
        
        <div className="mb-6">
          <Link href="/" className="text-sm font-bold text-[#632a3d] hover:text-[#4a1f2e] flex items-center gap-2 transition-colors">
            ← Volver al Dashboard
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-4 text-[#333333]">
          Crecimiento de <span className="text-[#632a3d]">Ingresos Acumulados</span>
        </h1>
        
        <section className="mb-8 p-6 bg-[#632a3d] text-white rounded-lg shadow-lg border-l-8 border-[#4a1f2e]">
          <p className="opacity-90 leading-relaxed">
            Este reporte muestra los ingresos diarios comparado con el total acumulado, utilizando Common Table Expressions (CTE) para el cálculo de ingresos.
          </p>
        </section>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#632a3d] text-[#f4f1f1]">
              <tr>
                <th className="p-5 font-semibold uppercase text-xs tracking-wider">Fecha</th>
                <th className="p-5 text-center font-semibold uppercase text-xs tracking-wider">Ingresos del Día</th>
                <th className="p-5 text-center font-semibold uppercase text-xs tracking-wider">Total Acumulado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((row: IngresoAcumulado, index: number) => (
                <tr key={index} className="hover:bg-[#fcfafa] transition-colors">
                  <td className="p-5 font-medium text-gray-700">
                    {new Date(row.fecha).toLocaleDateString('es-MX', { 
                      day: '2-digit', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </td>
                  <td className="p-5 text-center text-[#333333] font-medium">
                    ${Number(row.ingresos_dia).toLocaleString()}
                  </td>
                  <td className="p-5 text-center bg-[#f4f1f1]/40 border-l border-gray-100">
                    <span className="text-lg font-bold text-[#632a3d]">
                      ${Number(row.ingresos_acumulados).toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {data.length === 0 && (
            <div className="p-10 text-center text-gray-500 italic">
              No hay registros de ingresos disponibles.
            </div>
          )}
        </div>

        <footer className="mt-12 text-center text-gray-400 text-xs">
          PostgreSQL Views
        </footer>
      </div>
    </main>
  );
}