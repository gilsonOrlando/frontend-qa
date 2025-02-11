import React, { useEffect, useState } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import api from '../api';

interface Proyecto {
    _id: string;
    nombre: string;
    link: string;
    branch: string;
}

const sonarToken = 'bda650c195bd537f57431c78763720da67937d7d'; // Token SonarQube estático

const SonarQubeInstructions: React.FC = () => {
    const { id } = useParams(); // Simplificado sin especificar el tipo explícitamente
    const [proyecto, setProyecto] = useState<Proyecto | null>(null);
    const navigate = useNavigate(); // Inicializa el hook de navegación

    useEffect(() => {
        const fetchProyecto = async () => {
            try {
                const response = await api.get(`/proyectos/${id}`);
                setProyecto(response.data);
            } catch (error) {
                console.error('Error al obtener proyecto:', error);
            }
        };

        fetchProyecto();
    }, [id]);

    if (!proyecto) {
        return <div>Cargando...</div>;
    }

    // Contenido del archivo .yml como texto plano para evitar problemas de renderizado
    const buildYml = `
name: Build
on:
  push:
    branches:
      - ${proyecto.branch}
  pull_request:
    types: [opened, synchronize, reopened]
jobs:
  sonarcloud:
    name: SonarCloud
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0  # Shallow clones should be disabled for better analysis
      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: \${{ secrets.TOKENG }}
          SONAR_TOKEN: \${{ secrets.SONAR_TOKEN }}
    `;

    const sonarProperties = `
sonar.projectKey=gilsonOrlando_${proyecto.nombre}
sonar.organization=gilsonorlando
sonar.sources=.
    `;

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
            <div className="w-full max-w-3xl bg-white p-6 shadow-md rounded-lg">
                <h2 className="text-2xl font-bold text-blue-950 mb-4">
                    Configuración de Análisis SonarQube para {proyecto.nombre}
                    
                </h2>
                <a className='text-[#0cb7f2] ml-6 leading-8' href='https://youtu.be/s6wIJwm05e8' target="_blank">
                        Video tutorial configuracion de Github.
                    </a>
                {/* GitHub Secret */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-blue-950 mb-2">1. Crear un GitHub Secret</h3>
                    <p className='text-black' target="_blank">
                        En su cuenta personal de Github se debe crear un token, una alternativa seguir el siguiente enlace:
                    </p>
                    <a className='text-black' href='https://github.com/settings/tokens' target="_blank">
                       Precione Aquí:
                    </a>
                    <div>
                        <p className='text-black' target="_blank">
                            Nota: Si anteriormente creó un token y cuenta con el mismo ya no es necesario crear otro, o puede encontrar el token en la actualización de proyecto.
                        </p>
                    </div>
                    <p className='text-black text-justify'>
                        En el repositorio de GitHub del proyecto, ir a <strong>Settings &gt; Secrets &gt; Actions</strong> y crear un nuevo secreto con los siguientes detalles:
                    </p>
                    <p className='text-black text-justify'>
                        - <strong>Secreto para el token personal</strong>:
                    </p>
                    <pre className="bg-gray-100 p-4 rounded text-black">
                        <strong>Nombre: </strong>TOKENG.<br />
                        <strong>Valor:</strong> Token generado.
                    </pre>
                    <p className='text-black text-justify'>
                    <strong>- Secreto para el token del servicio de SonarQube (copiar y pegar):</strong>
                    </p>
                    
                    <pre className="bg-gray-100 p-4 rounded text-black">
                        <strong>Nombre:</strong> SONAR_TOKEN<br />
                        <strong>Valor:</strong> {sonarToken}
                    </pre>
                </div>
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-blue-950 mb-2">2. Crear un archivo <code>sonar-project.properties</code></h3>
                    <a className='text-black' target="_blank">
                        Copiar y pegar al el archivo sonar-project.properties:
                    </a>
                    <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
                        <code className='text-black'>{sonarProperties}</code>
                    </pre>
                </div>
                {/* Archivo build.yml */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-blue-950 mb-2">3. Crear o actualizar el archivo <code>.github/workflows/build.yml</code></h3>
                    <p className='text-black'>Copiar y pegar en el archivo de configuración para comunicación, entre GitHub y SonarQube:</p>
                    <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
                        <code className='text-black'>{buildYml}</code>
                    </pre>
                </div>

                {/* Archivo sonar-project.properties */}
                
                <button
                    onClick={() => navigate('/lista_proyectos')} // Navega a la ruta de lista de proyectos
                    className="px-4 py-2 bg-blue-950 text-white rounded hover:bg-blue-800 transition-all"
                    style={{ alignSelf: 'flex-start' }}
                >
                     Ir a Proyectos
                </button>
            </div>
        </div>
    );
};

export default SonarQubeInstructions;
