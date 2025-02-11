import React, { useEffect, useState } from 'react';
import api from '../api';

interface CriteriosValoracion {
  _id: string;
  valor1: number;
  valor2: number;
  criterio: string;
}

interface ValoracionMantenibilidad {
  _id: string;
  valor1: number;
  valor2: number;
  criterio: string;
}

interface PropiedadCalidad {
  _id: string;
  propiedad: string;
  valor: number;
}

const CriteriosValoracionTable: React.FC = () => {
  const [criterios, setCriterios] = useState<CriteriosValoracion[]>([]);
  const [valoracion, setValoracion] = useState<ValoracionMantenibilidad[]>([]);
  const [propiedades, setPropiedades] = useState<PropiedadCalidad[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeData, setActiveData] = useState<'criterios' | 'valoracion' | 'propiedades'>('criterios');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [criteriosRes, valoracionRes, propiedadesRes] = await Promise.all([
          api.get('/criteriosValoracion'),
          api.get('/valoracionMantenibilidad'),
          api.get('/propiedadCalidad')
        ]);
        setCriterios(criteriosRes.data);
        setValoracion(valoracionRes.data);
        setPropiedades(propiedadesRes.data);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdate = async (id: string, updatedData: Partial<CriteriosValoracion | ValoracionMantenibilidad | PropiedadCalidad>) => {
    try {
      const endpoint =
        activeData === 'criterios'
          ? '/criteriosValoracion'
          : activeData === 'valoracion'
          ? '/valoracionMantenibilidad'
          : '/propiedadCalidad';

      const response = await api.put(`${endpoint}/${id}`, updatedData);

      if (activeData === 'criterios') {
        setCriterios((prev) =>
          prev.map((item) => (item._id === id ? { ...item, ...response.data } : item))
        );
      } else if (activeData === 'valoracion') {
        setValoracion((prev) =>
          prev.map((item) => (item._id === id ? { ...item, ...response.data } : item))
        );
      } else {
        setPropiedades((prev) =>
          prev.map((item) => (item._id === id ? { ...item, ...response.data } : item))
        );
      }

      alert('Registro actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el registro:', error);
      alert('Error al actualizar el registro');
    }
  };

  const handleInputChange = (id: string, field: string, value: string | number) => {
    if (activeData === 'criterios') {
      setCriterios((prev) =>
        prev.map((item) => (item._id === id ? { ...item, [field]: value } : item))
      );
    } else if (activeData === 'valoracion') {
      setValoracion((prev) =>
        prev.map((item) => (item._id === id ? { ...item, [field]: value } : item))
      );
    } else {
      setPropiedades((prev) =>
        prev.map((item) => (item._id === id ? { ...item, [field]: value } : item))
      );
    }
  };

  const dataToDisplay =
    activeData === 'criterios' ? criterios : activeData === 'valoracion' ? valoracion : propiedades;

  // Descripción condicional
  const description =
    activeData === 'criterios'
      ? 'En la presente tabla se configura el rango de valoración de la lista de verificación.'
      : activeData === 'valoracion'
      ? 'En la presente tabla se configura el rango de valoración del grado de mantenbilidad.'
      : 'En la presente tabla se configura la condición si una propiedad de calidad no cumple con el porcentaje aceptable, por lo cual es considerado como un error lo que desencadena un defecto de mantenibilidad, la propiedad en porcentaje depende de la cantidad de líneas de código.';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-4xl w-full bg-white p-8 shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-blue-950 mb-6">
          {activeData === 'criterios'
            ? 'Criterios de Valoración'
            : activeData === 'valoracion'
            ? 'Valoración de Mantenibilidad'
            : 'Propiedades de Calidad'}
        </h1>

        <p className="text-lg mb-6">{description}</p> {/* Descripción dinámica */}

        <div className="mb-4">
          <label htmlFor="data-select" className="mr-2 text-gray-700">
            Cambiar:
          </label>
          <select
            id="data-select"
            value={activeData}
            onChange={(e) => setActiveData(e.target.value as 'criterios' | 'valoracion' | 'propiedades')}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="criterios">Lista de Verificación</option>
            <option value="valoracion">Grado de Mantenibilidad</option>
            <option value="propiedades">Propiedades de Calidad</option>
          </select>
        </div>

        {loading ? (
          <p className="text-center">Cargando...</p>
        ) : (
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-950 text-white">
                {activeData === 'propiedades' ? (
                  <>
                    <th className="border border-gray-300 px-4 py-2">Propiedad</th>
                    <th className="border border-gray-300 px-4 py-2">Valor</th>
                  </>
                ) : (
                  <>
                    <th className="border border-gray-300 px-4 py-2">Valor 1</th>
                    <th className="border border-gray-300 px-4 py-2">Valor 2</th>
                    <th className="border border-gray-300 px-4 py-2">Criterio</th>
                  </>
                )}
                <th className="border border-gray-300 px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {dataToDisplay.map((item) => (
                <tr key={item._id} className="text-center">
                  {activeData === 'propiedades' ? (
                    <>
                      <td className="border border-gray-300 px-4 py-2">{(item as PropiedadCalidad).propiedad} {item.valor}% = ERROR</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="number"
                          value={(item as PropiedadCalidad).valor}
                          onChange={(e) =>
                            handleInputChange(item._id, 'valor', parseFloat(e.target.value))
                          }
                          className="w-full p-1 border border-gray-300 rounded"
                        />
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="number"
                          value={item.valor1}
                          onChange={(e) =>
                            handleInputChange(item._id, 'valor1', parseFloat(e.target.value))
                          }
                          className="w-full p-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="number"
                          value={item.valor2}
                          onChange={(e) =>
                            handleInputChange(item._id, 'valor2', parseFloat(e.target.value))
                          }
                          className="w-full p-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">{item.criterio}</td>
                    </>
                  )}
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() =>
                        handleUpdate(item._id, activeData === 'propiedades' ? { valor: item.valor } : { valor1: item.valor1, valor2: item.valor2, criterio: item.criterio })
                      }
                      className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                      Actualizar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CriteriosValoracionTable;
