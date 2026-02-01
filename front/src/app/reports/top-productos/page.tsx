import { query } from '../../../../lib/db';
import { z } from 'zod';
import Link from 'next/link';

const PageSchema = z.object({
  page: z.coerce.number().min(1).default(1),
});

export default async function TopProductos({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  
  const resolvedSearchParams = await searchParams;
  const { page } = PageSchema.parse(resolvedSearchParams);
  
  const limit = 5;
  const offset = (page - 1) * limit;

  const res = await query(
    'SELECT * FROM vw_top_productos LIMIT $1 OFFSET $2',
    [limit, offset]
  );

  const countRes = await query('SELECT COUNT(*) FROM vw_top_productos');
  const totalCount = parseInt(countRes.rows[0].count);
  const hasMore = offset + res.rows.length < totalCount;

  return (
    <main className="min-h-screen bg-[#f4f1f1] p-8">
      <div className="p-8 max-w-5xl mx-auto min-h-screen bg-[#f4f1f1]">
        
        <div className="mb-6">
          <Link href="/" className="text-sm font-bold text-[#632a3d] hover:text-[#4a1f2e] flex items-center gap-2 transition-colors">
            ← Volver al Dashboard
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-4 text-[#333333]">Reporte: <span className="text-[#632a3d]">Top Productos (Productos Estrella)</span></h1>
        
        <div className="mb-8 p-6 bg-[#632a3d] text-white rounded-lg shadow-lg border-l-8 border-[#4a1f2e]">
          <p className="opacity-90">
            Identificación de productos con sus respectivas ventas, si un producto genera ventas mayores a 1000 o si está en el top 3 más vendidas y tiene al menos 5 unidades vendidas se considera "Producto Estrella".
          </p>
          <p className="mt-2 text-sm">
            Paginación: Cada page muestra {res.rows.length} de {totalCount} productos totales.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
          <table className="w-full text-left">
            <thead className="bg-[#632a3d] text-[#f4f1f1]">
              <tr>
                <th className="p-5 font-semibold uppercase text-xs tracking-wider">Producto</th>
                <th className="p-5 text-center font-semibold uppercase text-xs tracking-wider">Unidades</th>
                <th className="p-5 text-center font-semibold uppercase text-xs tracking-wider">Total Ventas</th>
                <th className="p-5 text-center font-semibold uppercase text-xs tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {res.rows.map((row: any) => (
                <tr key={row.producto_id} className="hover:bg-[#fcfafa] transition-colors">
                  <td className="p-5 font-medium text-gray-800">{row.producto_nombre}</td>
                  <td className="p-5 text-center text-gray-600">{row.unidades_vendidas}</td>
                  <td className="p-5 text-center font-bold text-[#333333]">${row.ventas_totales}</td>
                  <td className="p-5 text-center">
                    <span className="bg-[#f4f1f1] text-[#632a3d] border border-[#632a3d]/20 px-3 py-1 rounded-md text-xs font-bold uppercase">
                      {row.categoria_exito}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex items-center justify-between bg-white p-5 rounded-xl shadow-md border border-gray-100">
          <p className="text-sm text-gray-500 font-medium italic">
            Página <span className="text-[#632a3d] font-bold">{page}</span> de {Math.ceil(totalCount / limit)}
          </p>
          
          <div className="flex gap-4">
            {page > 1 ? (
              <Link href={`?page=${page - 1}`} className="px-8 py-2.5 bg-[#632a3d] text-white font-bold rounded-lg hover:bg-[#4a1f2e] shadow-lg transition-all active:scale-95">
                Anterior
              </Link>
            ) : (
              <span className="px-8 py-2.5 bg-gray-200 text-gray-400 font-bold rounded-lg cursor-not-allowed">Anterior</span>
            )}

            {hasMore ? (
              <Link href={`?page=${page + 1}`} className="px-8 py-2.5 bg-[#632a3d] text-white font-bold rounded-lg hover:bg-[#4a1f2e] shadow-lg transition-all active:scale-95">
                Siguiente
              </Link>
            ) : (
              <span className="px-8 py-2.5 bg-gray-200 text-gray-400 font-bold rounded-lg cursor-not-allowed">Siguiente</span>
            )}
          </div>
        </div>
        <footer className="mt-12 text-center text-gray-400 text-xs">
            PostgreSQL Views
          </footer>
      </div>
    </main>
  );
}