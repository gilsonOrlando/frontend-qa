import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import api from '../api';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Calculo {
    nombre: string;
    promedio: number;
}

const Calculos: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [calculos, setCalculos] = useState<Calculo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const chartRef = useRef<ChartJS<'bar', number[], string> | null>(null);

    useEffect(() => {
        const fetchCalculos = async () => {
            try {
                const response = await api.get(`/calculos/promedios/${id}`);
                setCalculos(response.data);
            } catch (error) {
                console.error('Error al obtener cálculos:', error);
                setError('Error al obtener cálculos');
            } finally {
                setLoading(false);
            }
        };

        fetchCalculos();
    }, [id]);

    const generarPDF = useCallback(() => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const marginLeft = 15;

        doc.setFontSize(18);
        doc.text('Reporte de Cálculos del Proyecto', pageWidth / 2, 20, { align: 'center' });

        if (chartRef.current) {
            const chartCanvas = chartRef.current.canvas as HTMLCanvasElement;
            const chartImage = chartCanvas.toDataURL('image/png');
            doc.addImage(chartImage, 'PNG', 15, 30, pageWidth - 30, 60);
        }

        doc.setFontSize(14);
        doc.text('Resumen de Cálculos', marginLeft, 100);

        const tableColumn = ['Nombre', 'Promedio (%)'];
        const tableRows: (string | number)[][] = [];

        calculos.forEach(calculo => {
            const calculoData = [calculo.nombre, `${(calculo.promedio * 100).toFixed(2)}%`];
            tableRows.push(calculoData);
        });

        (doc as any).autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 110,
            margin: { left: marginLeft, right: marginLeft },
            styles: { overflow: 'linebreak', fontSize: 12 },
        });

        const finalY = (doc as any).lastAutoTable.finalY + 10;

        doc.setFontSize(12);
        doc.text('Detalles de los cálculos:', marginLeft, finalY);
        const text = `Este reporte muestra los cálculos realizados para el proyecto, detallando los promedios obtenidos para cada categoría evaluada. El gráfico al inicio del documento proporciona una representación visual clara de los resultados. 
Cada promedio se muestra como un porcentaje para facilitar la comprensión de los datos.`;
        doc.text(text, marginLeft, finalY + 10, { maxWidth: pageWidth - 2 * marginLeft });

        doc.save('calculos.pdf');
    }, [calculos]);

    if (loading) return <p className="text-center text-gray-500">Cargando...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    const data: ChartData<'bar', number[], string> = {
        labels: calculos.map(calculo => calculo.nombre),
        datasets: [
            {
                label: 'Promedio (%)',
                data: calculos.map(calculo => calculo.promedio * 100),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 text-center">Cálculos del Proyecto</h1>
            <div className="mb-6" style={{ height: '400px' }}>
                <Bar data={data} options={options} ref={chartRef} />
            </div>
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden mb-6">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="py-3 px-4 text-left text-gray-600">Nombre</th>
                        <th className="py-3 px-4 text-left text-gray-600">Promedio</th>
                    </tr>
                </thead>
                <tbody>
                    {calculos.length > 0 ? (
                        calculos.map((calculo, index) => (
                            <tr key={index} className="border-b">
                                <td className="py-3 px-4 text-gray-800">{calculo.nombre}</td>
                                <td className="py-3 px-4 text-gray-800">{(calculo.promedio * 100).toFixed(2)}%</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={2} className="py-3 px-4 text-gray-500 text-center">No hay cálculos disponibles</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <button
                onClick={generarPDF}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
            >
                Descargar PDF
            </button>
        </div>
    );
};

export default Calculos;
