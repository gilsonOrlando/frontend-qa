import React, { useEffect, useState } from 'react';
import api from '../api';
import { useParams, useNavigate } from 'react-router-dom';

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

const ITEMS_PER_PAGE = 10; // Número de pautas por página

const MetricaResponse: React.FC = () => {
  const [metrica, setMetrica] = useState<Metrica | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [respuestas, setRespuestas] = useState<{ [key: string]: number | null }>({});
  const [comentarios, setComentarios] = useState<{ [key: string]: string }>({});
  const [nombreRespuesta, setNombreRespuesta] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const navigate = useNavigate();
  const { id: metricaId, id2: proyectoId } = useParams<{ id: string, id2: string }>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get<Metrica>(`/metricas/one/${metricaId}`);
        console.log('Datos recibidos:', response.data);
        setMetrica(response.data);
      } catch (err) {
        console.error('Error al obtener los datos:', err);
        setError('Error al obtener los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [metricaId]);

  const handleSelectChange = (pautaId: string, listaVerificacionId: string, valor: number) => {
    setRespuestas(prevRespuestas => ({
      ...prevRespuestas,
      [`${pautaId}-${listaVerificacionId}`]: prevRespuestas[`${pautaId}-${listaVerificacionId}`] === valor ? null : valor,
    }));
  };

  const handleCommentChange = (pautaId: string, listaVerificacionId: string, comentario: string) => {
    setComentarios(prevComentarios => ({
      ...prevComentarios,
      [`${pautaId}-${listaVerificacionId}`]: comentario,
    }));
  };

  const handleSubmit = async () => {
    const formattedRespuestas = Object.keys(respuestas).map(key => {
      const [pautaId, listaVerificacionId] = key.split('-');
      return {
        pautaId,
        listaVerificacion: listaVerificacionId,
        valor: respuestas[key],
        comentario: comentarios[key] || '',  // Agregar comentario aquí
      };
    });

    const data = {
      proyectoId,
      tipo: 'singleMetrica',
      metricaId,
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

  // Aplanar las pautas para la paginación
  const allPautas = metrica ? metrica.listaVerificacion.pautas : [];
  
  // Paginación de pautas
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedPautas = allPautas.slice(startIndex, endIndex);
  
  const totalPages = Math.ceil(allPautas.length / ITEMS_PER_PAGE);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  if (!metrica) return <p className="text-center text-gray-500">No se encontró la métrica.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Cuestionario</h1>
      <div className="mb-4">
        <label className="block text-blue-950 font-semibold mb-2">Nombre de la Respuesta</label>
        <input
          type="text"
          value={nombreRespuesta}
          onChange={(e) => setNombreRespuesta(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded bg-white text-black"
        />
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">{metrica.nombre}</h2>
        <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
          <h3 className="text-md font-medium mb-2 text-gray-500">{metrica.listaVerificacion.nombre}</h3>
          {paginatedPautas.length > 0 ? (
            paginatedPautas.map((pauta) => (
              <div key={pauta._id} className="mb-4">
                <h4 className="text-md font-normal mb-1 text-gray-600">{pauta.pregunta}</h4>
                <ul className="list-disc pl-5">
                  {pauta.nivelesCumplimiento.length > 0 ? (
                    pauta.nivelesCumplimiento.map((nivel) => (
                      <li key={nivel.descripcion} className="mb-1">
                        <label className="flex items-center text-gray-700">
                          <input
                            type="checkbox"
                            name={`${pauta._id}-${metrica.listaVerificacion._id}`}
                            value={nivel.valor}
                            checked={respuestas[`${pauta._id}-${metrica.listaVerificacion._id}`] === nivel.valor}
                            onChange={() => handleSelectChange(pauta._id, metrica.listaVerificacion._id, nivel.valor)}
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
                {/* Campo de texto para comentarios */}
                <div className="mt-2">
                  <label className="block text-gray-700 font-medium">Comentarios:</label>
                  <textarea
                    value={comentarios[`${pauta._id}-${metrica.listaVerificacion._id}`] || ''}
                    onChange={(e) => handleCommentChange(pauta._id, metrica.listaVerificacion._id, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded bg-white text-black"
                    rows={3}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No hay pautas</p>
          )}
        </div>
      </div>
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
      <button
        onClick={handleSubmit}
        disabled={!nombreRespuesta}
        className={`px-4 py-2 ${!nombreRespuesta ? 'bg-gray-300 text-gray-700' : 'bg-blue-500 text-white'} rounded-lg shadow-md hover:${!nombreRespuesta ? 'bg-gray-400' : 'bg-blue-600'} focus:outline-none focus:ring-2 focus:ring-blue-400 mt-4`}
      >
        Guardar respuestas
      </button>
    </div>
  );
};

export default MetricaResponse;
