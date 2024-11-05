import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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

                {/* GitHub Secret */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-blue-950 mb-2">1. Crear un GitHub Secret</h3>
                    <a className='text-black' href='https://github.com/settings/tokens' target="_blank">
                        Primero tiene que crear el token de Github, con las siguiente nombre (Precione Aquí):
                    </a>
                    <pre className="bg-gray-100 p-4 rounded text-black">
                        <strong>TOKENG:</strong><br />
                        <strong>Valor:</strong> Es el resultado del link personal del token de Github.
                    </pre>

                    <p className='text-black'>
                        En tu repositorio de GitHub, ve a <strong>Settings &gt; Secrets &gt; Actions</strong> y crea un nuevo secreto con los siguientes detalles:
                    </p>
                    <pre className="bg-gray-100 p-4 rounded text-black">
                        <strong>Nombre:</strong> SONAR_TOKEN<br />
                        <strong>Valor:</strong> {sonarToken}
                    </pre>
                </div>

                {/* Archivo build.yml */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-blue-950 mb-2">2. Crear o actualizar el archivo <code>.github/workflows/build.yml</code></h3>
                    <p className='text-black'>Aquí tienes una configuración base para GitHub Actions:</p>
                    <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
                        <code className='text-black'>{buildYml}</code>
                    </pre>
                </div>

                {/* Archivo sonar-project.properties */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-blue-950 mb-2">3. Crear el archivo <code>sonar-project.properties</code></h3>
                    <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
                        <code className='text-black'>{sonarProperties}</code>
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default SonarQubeInstructions;
