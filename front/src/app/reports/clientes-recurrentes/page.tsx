export const dynamic = 'force-dynamic';
import { getClientesFieles, ClienteValor } from '../../../../lib/services/clientes.service';
import Link from 'next/link';

export default async function ClientesRecurrentes() {
  const data = await getClientesFieles();

  return (
    <main className="min-h-screen bg-[#f4f1f1] p-8">
      <div className="max-w-5xl mx-auto">
        
        <div className="mb-6">
          <Link href="/" className="text-sm font-bold text-[#632a3d] hover:text-[#4a1f2e] flex items-center gap-2 transition-colors">
            ← Volver al Dashboard
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-4 text-[#333333]">
          Reporte de <span className="text-[#632a3d]">Clientes Fieles</span>
        </h1>
        
        <section className="mb-8 p-6 bg-[#632a3d] text-white rounded-lg shadow-lg border-l-8 border-[#4a1f2e]">
          <p className="opacity-90 leading-relaxed">
            Este reporte identifica a los clientes recurrentes y su gastos totales.
          </p>
        </section>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#632a3d] text-[#f4f1f1]">
              <tr>
                <th className="p-5 font-semibold uppercase text-xs tracking-wider">ID Cliente</th>
                <th className="p-5 font-semibold uppercase text-xs tracking-wider">Nombre</th>
                <th className="p-5 text-center font-semibold uppercase text-xs tracking-wider">Total de Órdenes</th>
                <th className="p-5 text-center font-semibold uppercase text-xs tracking-wider">Gasto Total</th>
                <th className="p-5 text-center font-semibold uppercase text-xs tracking-wider">Promedio de Compra</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((row: ClienteValor, index: number) => (
                <tr key={row.cliente_id || index} className="hover:bg-[#fcfafa] transition-colors">
                  <td className="p-5 font-mono text-sm text-gray-500">#{row.cliente_id}</td>
                  <td className="p-5 font-medium text-[#333333]">{row.cliente_nombre}</td>
                  <td className="p-5 text-center text-gray-600">{row.ordenes_count}</td>
                  <td className="p-5 text-center font-bold text-[#333333]">
                    ${Number(row.gasto_total).toLocaleString()}
                  </td>
                  <td className="p-5 text-center">
                    <span className="bg-[#f4f1f1] text-[#632a3d] px-3 py-1 rounded-md font-bold text-sm">
                      ${Number(row.gasto_promedio).toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {data.length === 0 && (
            <div className="p-10 text-center text-gray-500 italic">
              No se encontraron datos de clientes recurrentes.
            </div>
          )}
        </div>

        <footer className="mt-12 text-center text-gray-400 text-xs">
          PostgreSQL Views | Data Layer Separated
        </footer>
      </div>
    </main>
  );
}