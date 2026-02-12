export const dynamic = 'force-dynamic';
import { getVentasMensuales, VentaMensual } from '../../../../lib/services/ventasM.service';
import Link from 'next/link';

export default async function VentasMensuales() {
  const data = await getVentasMensuales();

  return (
    <main className="min-h-screen bg-[#f4f1f1] p-8">
      <div className="max-w-5xl mx-auto">
        
        <div className="mb-6">
          <Link href="/" className="text-sm font-bold text-[#632a3d] hover:text-[#4a1f2e] flex items-center gap-2 transition-colors">
            ← Volver al Dashboard
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-4 text-[#333333]">
          Reporte de <span className="text-[#632a3d]">Ventas Mensuales</span>
        </h1>
        
        <section className="mb-8 p-6 bg-[#632a3d] text-white rounded-lg shadow-lg border-l-8 border-[#4a1f2e]">
          <p className="opacity-90 leading-relaxed">
            Este reporte permite comparar el crecimiento mes con mes.
          </p>
        </section>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#632a3d] text-[#f4f1f1]">
              <tr>
                <th className="p-5 font-semibold uppercase text-xs tracking-wider">Año</th>
                <th className="p-5 font-semibold uppercase text-xs tracking-wider">Mes</th>
                <th className="p-5 text-center font-semibold uppercase text-xs tracking-wider">Total Órdenes</th>
                <th className="p-5 text-center font-semibold uppercase text-xs tracking-wider">Ventas Totales</th>
                <th className="p-5 text-center font-semibold uppercase text-xs tracking-wider border-l border-white/10">Ticket Promedio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((row: VentaMensual, index: number) => (
                <tr key={index} className="hover:bg-[#fcfafa] transition-colors">
                  <td className="p-5 font-medium text-[#333333]">{row.anio}</td>
                  <td className="p-5 text-gray-700 capitalize">{row.mes}</td>
                  <td className="p-5 text-center text-gray-600">{row.total_ordenes}</td>
                  <td className="p-5 text-center font-bold text-[#333333]">
                    ${Number(row.ventas_totales).toLocaleString()}
                  </td>
                  <td className="p-5 text-center font-semibold text-[#632a3d] bg-[#f4f1f1]/30">
                    ${Number(row.ticket_promedio).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {data.length === 0 && (
            <div className="p-10 text-center">
              <p className="text-gray-500 italic font-medium">No se encontraron registros de ventas en la base de datos.</p>
            </div>
          )}
        </div>

        <footer className="mt-12 text-center text-gray-400 text-xs">
          PostgreSQL Views | Temporal Analytics Layer
        </footer>
      </div>
    </main>
  );
}