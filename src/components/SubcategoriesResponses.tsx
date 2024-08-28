import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

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

interface Subcaracteristica {
  _id: string;
  nombre: string;
  metricas: Metrica[];
}

const ITEMS_PER_PAGE = 10;

const SubcategoriesResponses: React.FC = () => {
  const { id: proyectoId } = useParams<{ id: string }>();
  const [subcaracteristicas, setSubcaracteristicas] = useState<Subcaracteristica[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [respuestas, setRespuestas] = useState<{ [key: string]: number | null }>({});
  const [comentarios, setComentarios] = useState<{ [key: string]: string }>({});
  const [nombreRespuesta, setNombreRespuesta] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get<Subcaracteristica[]>('/subcaracteristicas/all');
        setSubcaracteristicas(response.data);
      } catch (err) {
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
      [`${pautaId}-${listaVerificacionId}`]: prevRespuestas[`${pautaId}-${listaVerificacionId}`] === valor ? null : valor,
    }));
  };

  const handleCommentChange = (pautaId: string, comentario: string) => {
    setComentarios(prevComentarios => ({
      ...prevComentarios,
      [pautaId]: comentario,
    }));
  };

  const handleSubmit = async () => {
    const formattedRespuestas = Object.keys(respuestas).map(key => {
      const [pautaId, listaVerificacionId] = key.split('-');
      return {
        pautaId,
        listaVerificacion: listaVerificacionId,
        valor: respuestas[key],
        comentario: comentarios[pautaId] || null
      };
    });

    const data = {
      proyectoId,
      tipo: 'allSubcaracteristicas',
      respuestas: formattedRespuestas,
      nombre: nombreRespuesta
    };

    try {
      await api.post('/respuestas/guardar-respuestas', data);
      alert('Respuestas guardadas exitosamente');
      navigate(`/pruebas/${proyectoId}`);
    } catch (error) {
      alert('Hubo un error al guardar las respuestas');
    }
  };

  // Aplanar las pautas y dividirlas en páginas
  const allPautas = subcaracteristicas.flatMap(sub => 
    sub.metricas.flatMap(metrica => 
      metrica.listaVerificacion.pautas
    )
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedPautas = allPautas.slice(startIndex, endIndex);

  const totalPages = Math.ceil(allPautas.length / ITEMS_PER_PAGE);
  const hasPendingPages = currentPage < totalPages;

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

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

      {subcaracteristicas.length > 0 && paginatedPautas.length > 0 ? (
        subcaracteristicas.flatMap(sub => 
          sub.metricas.flatMap(metrica => 
            metrica.listaVerificacion.pautas.map(pauta => (
              paginatedPautas.includes(pauta) && (
                <div key={pauta._id} className="mb-6">
                  <h2 className="text-xl font-semibold mb-2 text-gray-700">{sub.nombre}</h2>
                  <h3 className="text-lg font-medium mb-2 text-gray-600">{metrica.nombre}</h3>
                  <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
                    <h4 className="text-md font-medium mb-2 text-gray-500">{metrica.listaVerificacion.nombre}</h4>
                    <h5 className="text-md font-normal mb-1 text-gray-600">{pauta.pregunta}</h5>
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
                    <textarea
                      className="w-full p-2 mt-2 border bg-white text-black border-gray-300 rounded"
                      placeholder="Añadir comentario (opcional)"
                      value={comentarios[pauta._id] || ''}
                      onChange={(e) => handleCommentChange(pauta._id, e.target.value)}
                    />
                  </div>
                </div>
              )
            ))
          )
        )
      ) : (
        <p className="text-center text-gray-500">No se encontraron pautas.</p>
      )}

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 ${currentPage === 1 ? 'bg-gray-300 text-gray-700' : 'bg-gray-500 text-white'} rounded-lg shadow-md hover:${currentPage === 1 ? 'bg-gray-400' : 'bg-gray-600'} focus:outline-none focus:ring-2 focus:ring-gray-300`}
        >
          Anterior
        </button>
        <span className="text-gray-700">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 ${currentPage === totalPages ? 'bg-gray-300 text-gray-700' : 'bg-gray-500 text-white'} rounded-lg shadow-md hover:${currentPage === totalPages ? 'bg-gray-400' : 'bg-gray-600'} focus:outline-none focus:ring-2 focus:ring-gray-300`}
        >
          Siguiente
        </button>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!nombreRespuesta || currentPage < totalPages}
        className={`px-4 py-2 mt-4 ${(!nombreRespuesta || currentPage < totalPages) ? 'bg-blue-300 text-gray-700' : 'bg-blue-500 text-white'} rounded-lg shadow-md hover:${(!nombreRespuesta || currentPage < totalPages) ? 'bg-blue-400' : 'bg-blue-600'} focus:outline-none focus:ring-2 focus:ring-blue-400`}
      >
        Guardar respuestas
      </button>
    </div>
  );
};

export default SubcategoriesResponses;
