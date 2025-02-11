import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

// Define las interfaces para los datos
interface Pauta {
  _id: string;
  descripcion: string;
  pregunta: string;
  nivelesCumplimiento: {
    descripcion: string;
    valor: number;
  }[];
}

interface ListaVerificacion {
  _id: string;
  nombre: string;
  pautas: Pauta[];
}

interface Metrica {
  _id: string;
  nombre: string;
  listaVerificacion: ListaVerificacion;
}

const ITEMS_PER_PAGE = 10; // Número de pautas o preguntas por página

const MetricsResponse: React.FC = () => {
  const [metricas, setMetricas] = useState<Metrica[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [respuestas, setRespuestas] = useState<{ [key: string]: { valor: number | null; comentario: string } }>({});
  const [nombreRespuesta, setNombreRespuesta] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [alerta, setAlerta] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id: proyectoId } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get<Metrica[]>('/metricas/all');
        setMetricas(response.data);
      } catch (err) {
        console.error('Error al obtener los datos:', err);
        setError('Error al obtener los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectChange = (pautaId: string, listaVerificacionId: string, valor: number) => {
    setRespuestas(prevRespuestas => ({
      ...prevRespuestas,
      [`${pautaId}-${listaVerificacionId}`]: {
        ...prevRespuestas[`${pautaId}-${listaVerificacionId}`],
        valor: prevRespuestas[`${pautaId}-${listaVerificacionId}`]?.valor === valor ? null : valor,
      },
    }));
  };

  const handleCommentChange = (pautaId: string, listaVerificacionId: string, comentario: string) => {
    setRespuestas(prevRespuestas => ({
      ...prevRespuestas,
      [`${pautaId}-${listaVerificacionId}`]: {
        ...prevRespuestas[`${pautaId}-${listaVerificacionId}`],
        comentario,
      },
    }));
  };

  const handleSubmit = async () => {
    const pautasSinResponder = allPautas.some((pauta) => {
      const metrica = metricas.find((m) =>
        m.listaVerificacion.pautas.some((p) => p._id === pauta._id)
      );
      const listaVerificacionId = metrica?.listaVerificacion._id;
      const respuesta = respuestas[`${pauta._id}-${listaVerificacionId}`];
      return !respuesta || respuesta.valor === null; // Sin respuesta
    });
  
    if (pautasSinResponder) {
      alert('Aun existen pautas sin responder');
      return;
    }
  
    // Verificar si el nombre de la respuesta está vacío
    if (!nombreRespuesta.trim()) {
      alert('El título de la prueba está vacío');
      return;
    }
    const formattedRespuestas = Object.keys(respuestas).map(key => {
      const [pautaId, listaVerificacionId] = key.split('-');
      return {
        pautaId,
        listaVerificacion: listaVerificacionId,
        valor: respuestas[key].valor,
        comentario: respuestas[key].comentario || '', // Asegura que se envíe un string vacío si no hay comentario
      };
    });

    const data = {
      proyectoId,
      tipo: 'allMetricas',
      respuestas: formattedRespuestas,
      nombre: nombreRespuesta
    };

    try {
      await api.post('/respuestas/guardar-respuestas', data);
      alert('Respuestas guardadas exitosamente');
      navigate(`/pruebas/${proyectoId}`);
    } catch (error) {
      console.error('Error al guardar las respuestas:', error);
      alert('Hubo un error al guardar las respuestas');
    }
  };

  const handleCancel = () => {
    const confirmCancel = window.confirm("¿Desea cancelar la ejecución de la lista de verificación?");
    if (confirmCancel) {
      navigate(`/pruebas/${proyectoId}`);
    }
  };
  const isSubmitDisabled = () => !nombreRespuesta.trim();

  // Aplanar las pautas de todas las métricas para la paginación
  const allPautas: Pauta[] = metricas.flatMap(metrica => metrica.listaVerificacion.pautas);

  // Paginación de pautas
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedPautas = allPautas.slice(startIndex, endIndex);

  const totalPages = Math.ceil(allPautas.length / ITEMS_PER_PAGE);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Lista de verificación</h1>
      <div className="mb-4">
        <label className="block text-blue-950 font-semibold mb-2">Nombre de la prueba</label>
        <input
          type="text"
          value={nombreRespuesta}
          onChange={(e) => {
            setNombreRespuesta(e.target.value);
            if (e.target.value) setAlerta(null); // Si se llena el campo, quitar la alerta
          }}
          className="w-full p-2 border border-gray-300 rounded bg-white text-black"
        />
      </div>
      {paginatedPautas.length > 0 ? (
        paginatedPautas.map((pauta) => {
          const metrica = metricas.find(m => m.listaVerificacion.pautas.some(p => p._id === pauta._id))!;
          const listaVerificacionId = metrica.listaVerificacion._id;

          return (
            <div key={pauta._id} className="mb-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-700">{metrica.nombre}</h2>
              <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
                <h3 className="text-md font-medium mb-2 text-gray-500">{metrica.listaVerificacion.nombre}</h3>
                <div className="mb-4">
                  <h4 className="text-md font-normal mb-1 text-gray-600">{pauta.pregunta}</h4>
                  <ul className="list-disc pl-5">
                    {pauta.nivelesCumplimiento.length > 0 ? (
                      pauta.nivelesCumplimiento.map((nivel) => (
                        <li key={nivel.descripcion} className="mb-1">
                          <label className="flex items-center text-gray-700">
                            <input
                              type="checkbox"
                              name={`${pauta._id}-${listaVerificacionId}`}
                              value={nivel.valor}
                              checked={respuestas[`${pauta._id}-${listaVerificacionId}`]?.valor === nivel.valor}
                              onChange={() => handleSelectChange(pauta._id, listaVerificacionId, nivel.valor)}
                              className="mr-2"
                            />
                            {nivel.descripcion} - Valor: {nivel.valor}
                          </label>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500">No hay niveles de cumplimiento</li>
                    )}
                  </ul>
                  <textarea
                    placeholder="Anotaciones"
                    value={respuestas[`${pauta._id}-${listaVerificacionId}`]?.comentario || ''}
                    onChange={(e) => handleCommentChange(pauta._id, listaVerificacionId, e.target.value)}
                    className="w-full p-2 border bg-white text-black border-gray-300 rounded mt-2"
                  />
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-500">No se encontraron pautas.</p>
      )}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={!hasPrevPage}
          className={`px-4 py-2 ${!hasPrevPage ? 'bg-gray-300 text-gray-700' : 'bg-gray-500 text-white'} rounded-lg shadow-md hover:${!hasPrevPage ? 'bg-gray-400' : 'bg-gray-600'} focus:outline-none focus:ring-2 focus:ring-gray-300`}
        >
          Anterior
        </button>
        <span className="text-gray-700">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={!hasNextPage}
          className={`px-4 py-2 ${!hasNextPage ? 'bg-gray-300 text-gray-700' : 'bg-gray-500 text-white'} rounded-lg shadow-md hover:${!hasNextPage ? 'bg-gray-400' : 'bg-gray-600'} focus:outline-none focus:ring-2 focus:ring-gray-300`}
        >
          Siguiente
        </button>
      </div>
      <div className="flex flex-col items-start gap-2 mt-2 w-auto">
      <button
        onClick={handleSubmit}
        disabled={isSubmitDisabled()}
        className={`px-4 py-2 ${isSubmitDisabled() ? 'bg-gray-300 text-gray-700' : 'bg-blue-500 text-white'} rounded-lg shadow-md hover:${isSubmitDisabled() ? 'bg-gray-400' : 'bg-blue-600'} focus:outline-none focus:ring-2 focus:ring-blue-400 mt-4`}
      >
        Guardar respuestas
      </button>
      <button
          onClick={handleCancel}
          className="w-[172px] px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 
       focus:outline-none focus:ring-2 focus:ring-red-400 mt-2 text-left"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default MetricsResponse;
