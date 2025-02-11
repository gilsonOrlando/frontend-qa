import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import api from '../api';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Comentario {
    pregunta: string;
    respuesta: string;
    comentario: string;
}

interface Calculo {
    nombre: string;
    promedio: number;
    comentarios: Comentario[];
}
interface CriteriosValoracion {
    _id: string;
    valor1: number;
    valor2: number;
    criterio: string;
}

const Calculos: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [calculos, setCalculos] = useState<Calculo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const chartRef = useRef<ChartJS<'bar', number[], string> | null>(null);
    const [criterios, setCriterios] = useState<CriteriosValoracion[]>([]);

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

    useEffect(() => {
        // Obtener todos los registros al cargar el componente
        const fetchCriterios = async () => {
            try {
                setLoading(true);
                const response = await api.get('/criteriosValoracion');
                setCriterios(response.data);
            } catch (error) {
                console.error('Error al obtener criterios de valoración:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCriterios();
    }, []);

    // Función para obtener el texto según el promedio
    const obtenerTextoSegunRango = (promedio: number) => {
        const porcentaje = promedio * 100;

        // Buscar el criterio adecuado según el porcentaje
        const criterioEncontrado = criterios.find((criterio) => {
            // Asegurarse de que valor1 sea el límite superior y valor2 el límite inferior
            const [limiteInferior, limiteSuperior] = [criterio.valor1, criterio.valor2].sort((a, b) => a - b);

            return porcentaje >= limiteInferior && porcentaje <= limiteSuperior;
        });

        return criterioEncontrado ? criterioEncontrado.criterio : 'Valor fuera de rango';
    };


    const generarPDF = useCallback(() => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const marginLeft = 15;
        const marginRight = 15;
        let finalY = 20; // Variable para controlar la posición vertical

        doc.setFontSize(18);
        doc.text('Reporte de Cálculos del Proyecto', pageWidth / 2, finalY, { align: 'center' });
        finalY += 10;

        // Agregar gráfico si existe
        if (chartRef.current) {
            const chartCanvas = chartRef.current.canvas as HTMLCanvasElement;
            const chartImage = chartCanvas.toDataURL('image/png');
            doc.addImage(chartImage, 'PNG', marginLeft, finalY, pageWidth - marginLeft - marginRight, 60);
            finalY += 70; // Espacio después del gráfico
        }

        doc.setFontSize(14);
        doc.text('Resumen de Cálculos', marginLeft, finalY);
        finalY += 10;

        // Crear la tabla de resumen de cálculos
        const tableColumn = ['Nombre', 'Promedio (%)'];
        const tableRows: (string | number)[][] = [];

        calculos.forEach(calculo => {
            const calculoData = [calculo.nombre, `${(calculo.promedio * 100).toFixed(2)} /100% `];
            tableRows.push(calculoData);
        });

        (doc as any).autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: finalY,
            margin: { left: marginLeft, right: marginLeft },
            styles: { overflow: 'linebreak', fontSize: 12 },
        });

        finalY = (doc as any).lastAutoTable.finalY + 10; // Posición después de la tabla

        doc.setFontSize(14);
        doc.text(`Promedio Total: ${(promedioTotal * 100).toFixed(2)}% - ${textoRango}`, marginLeft, finalY);
        finalY += 10;

        doc.setFontSize(12);
        doc.text('Detalles de los cálculos:', marginLeft, finalY);
        finalY += 10;

        // Tabla para mostrar los comentarios y descripciones de las pautas
        const comentarioRows: any[] = [];

        calculos.forEach(calculo => {
            calculo.comentarios.forEach(comentario => {
                const pregunta = comentario.pregunta;
                const respuesta = comentario.respuesta;
                const comentarioTexto = comentario.comentario ? comentario.comentario : 'Sin comentario';

                // Agregar cada fila con la pauta y el comentario
                comentarioRows.push({
                    nombre: calculo.nombre,
                    pregunta: pregunta,
                    respuesta: respuesta,
                    comentario: comentarioTexto,
                });
            });
        });

        // Definir las columnas y generar la tabla
        (doc as any).autoTable({
            head: [['Nombre', 'Pregunta', 'Respuesta', 'Anotaciones']],
            body: comentarioRows.map(row => [
                row.nombre,
                row.pregunta,
                row.respuesta,
                row.comentario,
            ]),
            startY: finalY,
            margin: { left: marginLeft, right: marginLeft },
            styles: { fontSize: 12, cellWidth: 'wrap' },
            columnStyles: {
                0: { cellWidth: 30 },  // Columna Nombre
                1: { cellWidth: 55 },  // Columna Pauta Descripción
                2: { cellWidth: 55 },  // Columna Comentario
                3: { cellWidth: 40 },
            },
        });

        doc.save('ReporteListaVerificación.pdf');
    }, [calculos]);

    if (loading) return <p className="text-center text-gray-500">Cargando...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    const promedioTotal = calculos.reduce((acc, calc) => acc + calc.promedio, 0) / calculos.length;
    const textoRango = obtenerTextoSegunRango(promedioTotal);

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
            <h1 className="text-3xl font-bold mb-6 text-gray-900 text-center">REPORTE DE LA PRUEBA</h1>
            <button
                onClick={() => navigate(-1)}  // Agregar el botón para regresar
                className="mt-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-300"
            >
                Regresar al repositorio
            </button>
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
                                <td className="py-3 px-4 text-gray-800">{(calculo.promedio * 100).toFixed(2)}% - {textoRango}</td>
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
