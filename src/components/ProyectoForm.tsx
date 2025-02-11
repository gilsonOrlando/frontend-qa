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
  const [mostrarToken, setMostrarToken] = useState(false);
  const navigate = useNavigate();

   // Estados para las alertas
   const [alertas, setAlertas] = useState({
    nombre: false,
    link: false,
    branch: false,
    githubtoken: false,
  });

  const [errores, setErrores] = useState({
    nombre: '',
    link: '',
    branch: '',
    githubtoken: '',
  });

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

  const handleInputChange = (field: keyof typeof alertas, value: string) => {
    if (value.trim() === '') {
      setErrores((prev) => ({ ...prev, [field]: 'El siguiente campo es obligatorio' }));
    } else {
      setErrores((prev) => ({ ...prev, [field]: '' }));
    }

    setAlertas((prev) => ({ ...prev, [field]: true }));

    setTimeout(() => {
      setAlertas((prev) => ({ ...prev, [field]: false }));
    }, 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !link || !branch || !githubtoken) {
      setErrores({
        nombre: nombre ? '' : 'El siguiente campo es obligatorio',
        link: link ? '' : 'El siguiente campo es obligatorio',
        branch: branch ? '' : 'El siguiente campo es obligatorio',
        githubtoken: githubtoken ? '' : 'El siguiente campo es obligatorio',
      });
      return;
    }

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
        // Mensaje general para actualización exitosa
      } else {
        // CREAR NUEVO PROYECTO EN SONARQUBE
        const sonarQubeResponse = await api.post('/sonarqube/proyectos/crear', { nombreProyecto: nombre });
        
        if (sonarQubeResponse.status === 200) {
          // CREAR NUEVO PROYECTO EN LA BD
          await api.post('/proyectos', data);
          
          console.log(branch);
          console.log(nombre);
          await api.post('/sonarqube/rename', { name: branch, project: nombre });
          
          // Mensaje general para creación exitosa
          alert('Proyecto creado exitosamente.');
        } else {
          throw new Error('Error en la comunicacion con el servicio de SonarQube, intentelo en un momento');
        }
      }
      navigate('/lista_proyectos');
    } catch (error) {
      console.error('Error al guardar proyectos:', error);
      alert('Se produjo un error al crear el proyecto.'); // Mensaje general de error
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
              onChange={(e) => {
                setNombre(e.target.value);
                handleInputChange('nombre', e.target.value);
              }}
              className="w-full p-2 border border-gray-300 rounded bg-white text-black"
              disabled={!!id}
            />
            {alertas.nombre && <p className="text-blue-500 text-sm">Favor, conservar el nombre, ya que será utilizado para el análisis en SonarQube.</p>}
            {errores.nombre && <p className="text-red-500 text-sm">{errores.nombre}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-blue-950 font-semibold mb-2">Link GitHub del proyecto</label>
            <input
              type="text"
              value={link}
              onChange={(e) => {
                setLink(e.target.value);
                handleInputChange('link', e.target.value);
              }}
              className="w-full p-2 border border-gray-300 rounded bg-white text-black"
            />
            {alertas.link && <p className="text-blue-500 text-sm">Favor, verificar link</p>}
            {errores.link && <p className="text-red-500 text-sm">{errores.link}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-blue-950 font-semibold mb-2">Branch</label>
            <input
              type="text"
              value={branch}
              onChange={(e) => {
                setBranch(e.target.value);
                handleInputChange('branch', e.target.value);
              }}
              className="w-full p-2 border border-gray-300 rounded bg-white text-black"
            />
            {alertas.branch && <p className="text-blue-500 text-sm">Favor, verificar el nombre de la rama</p>}
            {errores.branch && <p className="text-red-500 text-sm">{errores.branch}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-blue-950 font-semibold mb-2">Token GitHub</label>
            <div className="flex items-center">
            <input
              type={mostrarToken ? 'text' : 'password'} // Input de tipo password para mayor seguridad
              value={githubtoken}
              onChange={(e) => {
                setGithubToken(e.target.value);
                handleInputChange('githubtoken', e.target.value);
              }}
              className="w-full p-2 border border-gray-300 rounded bg-white text-black"
            />
            <input
                type="checkbox"
                checked={mostrarToken}
                onChange={() => setMostrarToken(!mostrarToken)}
                className="ml-2"
              />
               <span className="ml-2 text-black">Mostrar</span>
               </div>
            {alertas.githubtoken && <p className="text-blue-500 text-sm">Considerar, el token generado corresponde a la cuenta donde está alojado el proyecto</p>}
            {errores.githubtoken && <p className="text-red-500 text-sm">{errores.githubtoken}</p>}
            <a
              className='text'
              href='https://github.com/settings/tokens'
              target="_blank"
              rel="noopener noreferrer"
            >
              ⚙️ Generar Token
            </a>
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
