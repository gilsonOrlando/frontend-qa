import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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

const SubcategoryResponse: React.FC = () => {
  const [subcaracteristica, setSubcaracteristica] = useState<Subcaracteristica | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [respuestas, setRespuestas] = useState<{ [key: string]: { valor: number | null; comentario: string } }>({});
  const [nombreRespuesta, setNombreRespuesta] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [alerta, setAlerta] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id: subcaracteristicaId, id2: proyectoId, id3: intentosId } = useParams<{ id: string; id2: string; id3: string }>();
  const location = useLocation();
  const additionalSubcaracteristicas = location.state?.additionalSubcaracteristicas || [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subcaracteristicaIds = [subcaracteristicaId, ...additionalSubcaracteristicas].join(',');
        const [response] = await Promise.all([
          api.get<Subcaracteristica[]>(`/subcaracteristicas/one/${subcaracteristicaIds}`)
        ]);

        const subcaracteristicas = response.data;
        setSubcaracteristica(subcaracteristicas[0]); // Setear solo la primera para iniciar

        if (intentosId === '2') {
          const respuestasResponse = await api.get(`/respuestas/${proyectoId}`);
          const respuesta = respuestasResponse.data.find(
            (r: any) => r.subcaracteristicaId === subcaracteristicaId && r.tipo === 'singleSubcaracteristica'
          );

          if (respuesta) {
            const respuestasMap = respuesta.respuestas.reduce((acc: any, resp: any) => {
              acc[`${resp.pautaId}-${resp.listaVerificacion}`] = {
                valor: resp.valor ?? null,
                comentario: resp.comentario ?? ''
              };
              return acc;
            }, {});
            setRespuestas(respuestasMap);
            setNombreRespuesta(respuesta.nombre);
          }
        }
      } catch (err) {
        setError('Error al obtener los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subcaracteristicaId, proyectoId, additionalSubcaracteristicas, intentosId]);


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
    // Validación de título de la prueba vacío
    if (!nombreRespuesta.trim()) {
      alert('El título de la prueba está vacío');
      return;
    }

    // Validación de pautas sin responder
    const pautasSinResponder = subcaracteristica?.metricas.some(metrica =>
      metrica.listaVerificacion.pautas.some(pauta =>
        !respuestas[`${pauta._id}-${metrica.listaVerificacion._id}`]?.valor
      )
    );
    if (pautasSinResponder) {
      alert('Aun existen pautas sin responder');
      return;
    }


    if (!intentosId) {
      alert('El número de intentos no está definido.');
      return;
    }
    const formattedRespuestas = Object.keys(respuestas).map(key => {
      const [pautaId, listaVerificacionId] = key.split('-');
      return {
        pautaId,
        listaVerificacion: listaVerificacionId,
        valor: respuestas[key].valor,
        comentario: respuestas[key].comentario || '',
      };
    });

    const data = {
      proyectoId,
      tipo: 'singleSubcaracteristica',
      subcaracteristicaId,
      respuestas: formattedRespuestas,
      nombre: nombreRespuesta,
      intentos: parseInt(intentosId, 10)
    };

    try {
      await api.post('/respuestas/guardar-respuestas', data);
      alert('Respuestas guardadas exitosamente');
      navigate(`/pruebas/${proyectoId}`);
    } catch (error) {
      alert('Hubo un error al guardar las respuestas');
    }
  };
  const handleCancel = () => {
    const confirmCancel = window.confirm("¿Desea cancelar la ejecución de la lista de verificación?");
    if (confirmCancel) {
      navigate(`/pruebas/${proyectoId}`);
    }
  };
  const isSubmitDisabled = () => {
    return !nombreRespuesta.trim(); // Si el campo está vacío, deshabilita el botón
  };

  const allPautas = subcaracteristica ? subcaracteristica.metricas.flatMap(metrica =>
    metrica.listaVerificacion.pautas
  ) : [];

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
      {subcaracteristica ? (
        <>
          {paginatedPautas.map((pauta) => (
            <div key={pauta._id} className="mb-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-700">{subcaracteristica.nombre}</h2>
              {subcaracteristica.metricas.map(metrica => (
                metrica.listaVerificacion.pautas.includes(pauta) && (
                  <div key={metrica._id} className="mb-4">
                    <h3 className="text-lg font-medium mb-1 text-gray-600">{metrica.nombre}</h3>
                    <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
                      <h4 className="text-md font-medium mb-2 text-gray-500">{metrica.listaVerificacion.nombre}</h4>
                      <h5 className="text-md font-normal mb-1 text-gray-600">{pauta.pregunta}</h5>
                      <ul className="list-disc pl-5">
                        {pauta.nivelesCumplimiento.length > 0 ? (
                          pauta.nivelesCumplimiento.map(nivel => (
                            <li key={nivel.descripcion} className="mb-1">
                              <label className="flex items-center text-gray-700">
                                <input
                                  type="checkbox"
                                  name={`${pauta._id}-${metrica.listaVerificacion._id}`}
                                  value={nivel.valor}
                                  checked={respuestas[`${pauta._id}-${metrica.listaVerificacion._id}`]?.valor === nivel.valor}
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
                        placeholder="Anotaciones"
                        value={respuestas[`${pauta._id}-${metrica.listaVerificacion._id}`]?.comentario || ''}
                        onChange={(e) =>
                          handleCommentChange(pauta._id, metrica.listaVerificacion._id, e.target.value)
                        }
                        className="w-full p-2 border bg-white text-black border-gray-300 rounded mt-2"
                      />
                    </div>
                  </div>
                )
              ))}
            </div>
          ))}
        </>
      ) : (
        <p className="text-center text-gray-500">No se encontraron subcaracterísticas.</p>
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
          className={`w-48 px-4 py-2 ${isSubmitDisabled() ? 'bg-gray-300 text-gray-700' : 'bg-blue-500 text-white'} rounded-lg shadow-md hover:${isSubmitDisabled() ? 'bg-gray-400' : 'bg-blue-600'} focus:outline-none focus:ring-2 focus:ring-blue-400`}
        >
          Guardar respuestas
        </button>
        <button
          onClick={handleCancel}
          className="w-48 px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          Cancelar
        </button>
      </div>

    </div>
  );
};

export default SubcategoryResponse;
