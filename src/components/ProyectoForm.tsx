import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

interface Proyecto {
  _id?: string;
  nombre: string;
  link: string;
  idPersona: string;
  branch: string;
  githubtoken: string;
}

interface ProyectoFormProps {
  idpersona: string;
}

const ProyectoForm: React.FC<ProyectoFormProps> = ({ idpersona }) => {
  const { id } = useParams<{ id: string }>();
  const [nombre, setNombre] = useState('');
  const [link, setLink] = useState('');
  const [branch, setBranch] = useState('main'); // Valor por defecto
  const [githubtoken, setGithubToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProyecto = async () => {
      if (id) {
        try {
          const response = await api.get(`/proyectos/${id}`);
          const proyecto = response.data;
          setNombre(proyecto.nombre);
          setLink(proyecto.link);
          setBranch(proyecto.branch || 'main');
          setGithubToken(proyecto.githubtoken);
        } catch (error) {
          console.error('Error al obtener proyecto:', error);
        }
      }
    };

    fetchProyecto();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: Proyecto = { 
      nombre, 
      link, 
      idPersona: idpersona, 
      branch, 
      githubtoken 
    };

    try {
      if (id) {
        // ACTUALIZAR PROYECTO EXISTENTE
        await api.put(`/proyectos/${id}`, data);
        alert('Proyecto actualizado exitosamente');
      } else {
        // CREAR NUEVO PROYECTO
        await api.post('/proyectos', data); // Crear proyecto en tu sistema local
        alert('Proyecto creado exitosamente');

        // Crear el proyecto en SonarQube
        const sonarQubeResponse = await api.post('/sonarqube/proyectos/crear', { nombreProyecto: nombre });
        if (sonarQubeResponse.status === 200) {
          alert('Proyecto creado en SonarQube exitosamente');
        } else {
          alert('Error al crear el proyecto en SonarQube');
        }
      }
      navigate('/lista_proyectos');
    } catch (error) {
      console.error('Error al guardar proyecto:', error);
      alert('Error al guardar proyecto');
    }
  };

  const handleCancel = () => {
    setNombre('');
    setLink('');
    setBranch('main');
    setGithubToken('');
    navigate('/lista_proyectos');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-2xl w-full bg-white p-8 shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-blue-950 mb-6">
          {id ? 'Editar Proyecto' : 'Crear Proyecto'}
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-blue-950 font-semibold mb-2">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded bg-white text-black"
            />
          </div>
          <div className="mb-4">
            <label className="block text-blue-950 font-semibold mb-2">Link</label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded bg-white text-black"
            />
          </div>
          <div className="mb-4">
            <label className="block text-blue-950 font-semibold mb-2">Branch</label>
            <input
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded bg-white text-black"
            />
          </div>
          <div className="mb-4">
            <label className="block text-blue-950 font-semibold mb-2">GitHub Token</label>
            <input
              type="password" // Input de tipo password para mayor seguridad
              value={githubtoken}
              onChange={(e) => setGithubToken(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded bg-white text-black"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-950 text-white rounded"
            >
              {id ? 'Actualizar Proyecto' : 'Crear Proyecto'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-400 text-white rounded"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProyectoForm;
