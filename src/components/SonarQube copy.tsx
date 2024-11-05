import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import api from '../api'; // Asegúrate de que `api` esté configurado para manejar las solicitudes.

interface Proyecto {
    _id?: string;
    nombre: string;
    link: string;
    branch?: string;
}

interface Metric {
    id: string;
    key: string;
    name: string;
}

interface Measure {
    metric: string;
    value: string;
    bestValue: boolean;
}

const SonarQube: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [nombre, setNombre] = useState('');
    const [link, setLink] = useState('');
    const [branch, setBranch] = useState('main');
    const [projectKey, setProjectKey] = useState('');
    const [metricKeys, setMetricKeys] = useState<string[]>([]);
    const [measures, setMeasures] = useState<Map<string, string>>(new Map());
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const loginCredentials = {
        login: 'admin',
        password: 'admin12345',
    };

    useEffect(() => {
        const login = async () => {
            try {
                const response = await fetch('backend-qa-ckavg5ewbqeubrgb.canadacentral-01.azurewebsites.net/api/sonarqube/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(loginCredentials),
                    credentials: 'include'
                });

                if (response.ok) {
                    setIsLoggedIn(true);
                } else {
                    console.error('Login failed');
                }
            } catch (error) {
                console.error('Error during login:', error);
            }
        };

        login();
    }, []);

    useEffect(() => {
        const fetchProyecto = async () => {
            if (id && isLoggedIn) {
                try {
                    const response = await api.get(`/proyectos/${id}`);
                    const proyecto = response.data;
                    setNombre(proyecto.nombre);
                    setLink(proyecto.link);
                    setBranch(proyecto.branch || 'main');

                    if (proyecto.link) {
                        const repoUrl = proyecto.link;
                        const repoName = repoUrl.split('github.com/')[1];
                        const filePath = 'sonar-project.properties';

                        const githubApiUrl = `https://api.github.com/repos/${repoName}/contents/${filePath}?ref=${branch}`;

                        const githubResponse = await fetch(githubApiUrl);
                        if (!githubResponse.ok) {
                            throw new Error('Error fetching GitHub file');
                        }
                        const fileData = await githubResponse.json();

                        if (fileData.content) {
                            const decodedContent = atob(fileData.content.replace(/\n/g, ''));
                            const lines = decodedContent.split('\n');
                            const projectKeyLine = lines.find(line => line.startsWith('sonar.projectKey='));

                            if (projectKeyLine) {
                                const projectKeyValue = projectKeyLine.split('=')[1];
                                setProjectKey(projectKeyValue);
                            }
                        }
                    }

                } catch (error) {
                    console.error('Error al obtener proyecto o archivo:', error);
                }
            }
        };

        fetchProyecto();
    }, [id, branch, isLoggedIn]);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const metricsResponse = await fetch('backend-qa-ckavg5ewbqeubrgb.canadacentral-01.azurewebsites.net/api/sonarqube/metrics', {
                    method: 'GET',
                    headers: { 
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });
                
                const metricsData = await metricsResponse.json();
                const keys = metricsData?.metricKeys || [];
                setMetricKeys(keys);

                const metricsString = keys.length > 0 ? keys.join(',') : '';
                const measuresResponse = await fetch(`backend-qa-ckavg5ewbqeubrgb.canadacentral-01.azurewebsites.net/api/sonarqube/measures?component=${projectKey}&metricKeys=${metricsString}`, {
                    method: 'GET',
                    headers: { 
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });
                if (!measuresResponse.ok) {
                    throw new Error('Error fetching measures');
                }
                const measuresData = await measuresResponse.json();
                const measuresMap = new Map<string, string>();
                measuresData?.data?.component?.measures?.forEach((measure: Measure) => {
                    measuresMap.set(measure.metric, measure.value);
                });
                setMeasures(measuresMap);
            } catch (error) {
                console.error('Error al obtener métricas o medidas:', error);
            }
        };

        fetchMetrics();
    }, [projectKey, isLoggedIn]);

    // Métricas que quieres mostrar y traducir
    const allowedMetrics = [
        { key: 'code_smells', label: 'Olores a código' },
        { key: 'comment_lines_density', label: 'Densidad de comentarios' },
        { key: 'duplicated_lines_density', label: 'Densidad de líneas duplicadas' },
        { key: 'violations', label: 'Violaciones' },
        { key: 'maintainability_issues', label: 'Problemas de mantenibilidad' },
        { key: 'security_issues', label: 'Problemas de seguridad' },
        { key: 'reliability_issues', label: 'Problemas de fiabilidad' },
        { key: 'quality_gate_details', label: 'Estado de calidad' },
        { key: 'coverage', label: 'Cobertura' },
        { key: 'security_hotspots_reviewed', label: 'Puntos críticos de seguridad revisados' }
    ];

    const renderProgressBar = (value: number, text: string, color: string) => (
        <div className="flex flex-col items-center justify-center">
            <div className="w-20 h-20">
                <CircularProgressbar 
                    value={value} 
                    text={`${value}%`} 
                    styles={buildStyles({
                        pathColor: color,
                        textColor: color,
                        trailColor: '#d6d6d6',
                    })}
                />
            </div>
            <p className="text-center mt-2 font-bold text-black">{text}</p>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-blue-900 mb-6">
                {nombre || 'Proyecto SonarQube'}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                {allowedMetrics.map(({ key, label }) => {
                    const value = parseFloat(measures.get(key) || '0');
                    let color = value > 50 ? 'red' : value > 20 ? 'orange' : 'green';
                    
                    // Para campos que no son numéricos (objetos)
                    if (key === 'maintainability_issues' || key === 'security_issues' || key === 'reliability_issues') {
                        const issues = JSON.parse(measures.get(key) || '{}');
                        return (
                            <div key={key} className="p-4 text-center bg-white shadow-md rounded-lg flex flex-col items-center justify-center">
                                <h2 className="text-xl font-bold mb-2 text-black">{label}</h2>
                                <p className="text-center items-center text-gray-700">Total: {issues.total || 0}</p>
                            </div>
                        );
                    }

                    // Para calidad de puertas (quality_gate_details)
                    if (key === 'quality_gate_details') {
                        const qualityGate = JSON.parse(measures.get(key) || '{"level": "Desconocido"}');
                        const qualityLevel = qualityGate.level;  // Extraemos solo el nivel de la calidad
                        return (
                            <div key={key} className="p-4 bg-white shadow-md rounded-lg flex flex-col items-center justify-center">
                                <h2 className="text-xl font-bold mb-2 text-black">{label}</h2>
                                <p className={`text-center font-bold ${qualityLevel === 'OK' ? 'text-green-500' : 'text-red-500'}`}>
                                    {qualityLevel}
                                </p>
                            </div>
                        );
                    }                    

                    return (
                        <div key={key} className="p-4 bg-white shadow-md rounded-lg flex flex-col items-center justify-center">
                            {renderProgressBar(value, label, color)}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SonarQube;
