import Link from 'next/link';

export default function Home() {
  const reports = [
    { id: 'top-productos', name: 'Productos Estrella', desc: 'Ranking de ventas' },
    { id: 'ventas-mensuales', name: 'Ventas Mensuales', desc: 'Tendencias por mes' },
    { id: 'clientes-valor', name: 'Clientes Fieles', desc: 'Gasto histórico' },
    { id: 'ranking-clientes', name: 'Ranking VIP', desc: 'Posiciones de clientes' },
    { id: 'ingresos-acumulados', name: 'Crecimiento Diario', desc: 'Ingresos acumulados' },
  ];

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-8">Dashboard de Reportes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <Link key={report.id} href={`/reports/${report.id}`} 
                className="p-6 border rounded-lg hover:shadow-lg transition">
            <h2 className="text-xl font-semibold">{report.name}</h2>
            <p className="text-gray-600">{report.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}