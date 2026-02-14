export const dynamic = 'force-dynamic'; 
import { getRankingData } from '../../../../lib/services/ranking.service';
import Link from 'next/link';
import { z } from 'zod';

const FilterSchema = z.object({
  minGasto: z.coerce.number().min(0).default(0),
  page: z.coerce.number().min(1).default(1),
});

export default async function RankingClientes({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  
  const resolvedParams = await searchParams;
  const { minGasto, page } = FilterSchema.parse(resolvedParams);
  const LIMIT = 4;
  const { rows, totalCount } = await getRankingData(minGasto, page, LIMIT);
  
  const totalPages = Math.ceil(totalCount / LIMIT);
  const hasMore = page < totalPages;

  return (
    <main className="min-h-screen bg-[#f4f1f1] p-8">
      <div className="max-w-5xl mx-auto">
        
        <div className="mb-6">
          <Link href="/" className="text-sm font-bold text-[#632a3d] hover:text-[#4a1f2e] flex items-center gap-2 transition-colors">
            ← Volver al Dashboard
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-4 text-[#333333]">
          Ranking <span className="text-[#632a3d]">VIP de Clientes</span>
        </h1>
        
        <section className="mb-8 p-6 bg-[#632a3d] text-white rounded-lg shadow-lg border-l-8 border-[#4a1f2e]">
          <h2 className="text-lg font-bold mb-1 text-[#f4f1f1]">Insight de Negocio:</h2>
          <p className="opacity-90 leading-relaxed">
            Este reporte utiliza la Window Function <b>RANK()</b> para posicionar a los clientes según su rentabilidad acumulada[cite: 35].
          </p>
          <div className="mt-4 p-2 bg-black/10 rounded text-xs font-mono">
            Mostrando {rows.length} de {totalCount} registros totales.
          </div>
        </section>

        <section className="mb-8 bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <form method="GET" className="flex items-center gap-4">
            <div className="flex flex-col">
              <label htmlFor="minGasto" className="text-xs font-bold text-gray-500 uppercase mb-1">Filtro Gasto Mínimo</label>
              <input 
                type="number" 
                id="minGasto" 
                name="minGasto" 
                defaultValue={minGasto}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#632a3d] outline-none"
              />
            </div>
            <input type="hidden" name="page" value="1" />
            <button 
              type="submit"
              className="mt-5 px-6 py-2 bg-[#632a3d] text-white font-bold rounded-lg hover:bg-[#4a1f2e] transition-all"
            >
              Filtrar
            </button>
          </form>
        </section>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
          <table className="w-full text-left">
            <thead className="bg-[#632a3d] text-[#f4f1f1]">
              <tr>
                <th className="p-5 font-semibold uppercase text-xs">Posición</th>
                <th className="p-5 font-semibold uppercase text-xs">ID</th>
                <th className="p-5 font-semibold uppercase text-xs">Cliente</th>
                <th className="p-5 text-center font-semibold uppercase text-xs">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row, index) => (
                <tr key={row.cliente_id || index} className="hover:bg-[#fcfafa] transition-colors">
                  <td className="p-5 text-center">
                    <span className={`inline-block w-8 h-8 rounded-full leading-8 font-bold text-sm ${
                      row.ranking <= 3 ? 'bg-[#632a3d] text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {row.ranking}
                    </span>
                  </td>
                  <td className="p-5 font-mono text-sm text-gray-400">#{row.cliente_id}</td>
                  <td className="p-5 font-medium text-[#333333]">{row.cliente_nombre}</td>
                  <td className="p-5 text-center font-bold text-[#632a3d]">
                    ${Number(row.gasto_total).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && (
            <div className="p-10 text-center text-gray-500 italic">No hay resultados para este filtro.</div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between bg-white p-5 rounded-xl shadow-md">
          <p className="text-sm text-gray-500">
            Página <span className="font-bold">{page}</span> de {totalPages}
          </p>
          <div className="flex gap-2">
            {page > 1 ? (
              <Link 
                href={`?minGasto=${minGasto}&page=${page - 1}`} 
                className="px-6 py-2 bg-[#632a3d] text-white rounded-lg font-bold"
              >
                Anterior
              </Link>
            ) : (
              <span className="px-6 py-2 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed">Anterior</span>
            )}

            {hasMore ? (
              <Link 
                href={`?minGasto=${minGasto}&page=${page + 1}`} 
                className="px-6 py-2 bg-[#632a3d] text-white rounded-lg font-bold"
              >
                Siguiente
              </Link>
            ) : (
              <span className="px-6 py-2 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed">Siguiente</span>
            )}
          </div>
        </div>

        <footer className="mt-12 text-center text-gray-400 text-xs">
          PostgreSQL Views | Seguridad por Roles [cite: 47, 111]
        </footer>
      </div>
    </main>
  );
}