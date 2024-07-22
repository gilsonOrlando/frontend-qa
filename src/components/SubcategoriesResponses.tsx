import React, { useEffect, useState } from 'react';
import api from '../api';

// Define las interfaces para los datos
interface Pauta {
  descripcion: string;
  pregunta: string;
  nivelesCumplimiento: {
    descripcion: string;
    valor: number;
  }[];
}

interface ListaVerificacion {
  nombre: string;
  pautas: Pauta[];
}

interface Metrica {
  nombre: string;
  listaVerificacion: ListaVerificacion;
}

interface Subcaracteristica {
  nombre: string;
  metricas: Metrica[];
}

const SubcategoriesResponses: React.FC = () => {
  const [subcaracteristicas, setSubcaracteristicas] = useState<Subcaracteristica[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [respuestas, setRespuestas] = useState<{ [key: string]: number | null }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get<Subcaracteristica[]>('/subcaracteristicas/all');
        console.log('Datos recibidos:', response.data);
        setSubcaracteristicas(response.data);
      } catch (err) {
        console.error('Error al obtener los datos:', err);
        setError('Error al obtener los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectChange = (pautaDescripcion: string, valor: number) => {
    setRespuestas(prevRespuestas => ({
      ...prevRespuestas,
      [pautaDescripcion]: prevRespuestas[pautaDescripcion] === valor ? null : valor,
    }));
  };

  const handleSubmit = async () => {
    try {
      await api.post('/guardar-respuestas', respuestas);
      alert('Respuestas guardadas exitosamente');
    } catch (error) {
      console.error('Error al guardar las respuestas:', error);
      alert('Hubo un error al guardar las respuestas');
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  console.log('Datos en el estado:', subcaracteristicas);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Cuestionario</h1>
      {subcaracteristicas.length > 0 ? (
        subcaracteristicas.map((subcaracteristica) => (
          <div key={subcaracteristica.nombre} className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-700">{subcaracteristica.nombre}</h2>
            {subcaracteristica.metricas.length > 0 ? (
              subcaracteristica.metricas.map((metrica) => (
                <div key={metrica.nombre} className="mb-4">
                  <h3 className="text-lg font-medium mb-1 text-gray-600">{metrica.nombre}</h3>
                  <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
                    <h4 className="text-md font-medium mb-2 text-gray-500">{metrica.listaVerificacion.nombre}</h4>
                    {metrica.listaVerificacion.pautas.length > 0 ? (
                      metrica.listaVerificacion.pautas.map((pauta) => (
                        <div key={pauta.descripcion} className="mb-4">
                          <h5 className="text-md font-normal mb-1 text-gray-600">{pauta.pregunta}</h5>
                          <ul className="list-disc pl-5">
                            {pauta.nivelesCumplimiento.length > 0 ? (
                              pauta.nivelesCumplimiento.map((nivel) => (
                                <li key={nivel.descripcion} className="mb-1">
                                  <label className="flex items-center text-gray-700">
                                    <input
                                      type="checkbox"
                                      name={pauta.descripcion}
                                      value={nivel.valor}
                                      checked={respuestas[pauta.descripcion] === nivel.valor}
                                      onChange={() => handleSelectChange(pauta.descripcion, nivel.valor)}
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
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No hay pautas</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No hay métricas</p>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No se encontraron subcaracterísticas.</p>
      )}
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Guardar respuestas
      </button>
    </div>
  );
};

export default SubcategoriesResponses;
