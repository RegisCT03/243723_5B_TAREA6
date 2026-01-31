import Link from 'next/link';

export default function Home() {
  const reports = [
    { id: 'top-productos', name: 'Productos Estrella', desc: 'Análisis de rotación e inventario' },
    { id: 'ventas-mensuales', name: 'Ventas Mensuales', desc: 'Tendencias y estacionalidad' },
    { id: 'clientes-recurrentes', name: 'Clientes Fieles', desc: 'Gasto histórico y valor de vida' },
    { id: 'ranking-clientes', name: 'Ranking VIP', desc: 'Segmentación de clientes élite' },
    { id: 'ingresos-diarios', name: 'Crecimiento Diario', desc: 'Flujo de caja e ingresos acumulados' },
  ];

  return (
    <main className="min-h-screen bg-[#f4f1f1] p-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 border-b-4 border-[#632a3d] pb-6">
          <h1 className="text-4xl font-extrabold text-[#333333]">
            Dashboard de <span className="text-[#632a3d]">Reportes SQL</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Selecciona un reporte.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reports.map((report) => (
            <Link 
              key={report.id} 
              href={`/reports/${report.id}`} 
              className="group relative p-8 bg-white border-2 border-transparent rounded-xl shadow-md hover:shadow-2xl hover:border-[#632a3d] transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="absolute top-0 right-0 w-12 h-12 bg-[#632a3d]/10 rounded-bl-full group-hover:bg-[#632a3d] transition-colors duration-300"></div>
              
              <h2 className="text-2xl font-bold text-[#333333] group-hover:text-[#632a3d] transition-colors mb-3">
                {report.name}
              </h2>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                {report.desc}
              </p>

              <div className="flex items-center text-[#632a3d] font-bold text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Ver Reporte →
              </div>
            </Link>
          ))}
        </div>

        <footer className="mt-20 text-center text-gray-500 text-sm border-t border-gray-300 pt-8">
          Regina CT | 2026 BDA
        </footer>
      </div>
    </main>
  );
}