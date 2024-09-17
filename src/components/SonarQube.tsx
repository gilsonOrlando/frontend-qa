import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import api from '../api';

interface Proyecto {
    _id?: string;
    nombre: string;
    link: string;
    branch?: string;
    githubtoken?: string;
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
    const [githubToken, setGithubToken] = useState('');
    const [projectKey, setProjectKey] = useState('');
    const [metricKeys, setMetricKeys] = useState<string[]>([]);
    const [measures, setMeasures] = useState<Map<string, string>>(new Map());
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [disenio, setDisenio] = useState(0.0);
    const [duplicaciones, setDuplicaciones] = useState(0.0);
    const [cobertura, setCobertura] = useState(0.0);
    const [malaPractica, setMalaPractica] = useState(0.0);
    const [obsoleto, setObsoleto] = useState(0.0);
    const [redundante, setRedundante] = useState(0.0);
    const [cognitiveC, setCognitiveC] = useState(0.0);
    const [confuso, setConfuso] = useState(0.0);
    const [dificultadE, setDificultadE] = useState(0.0);
    const [densidadC, setDensidadC] = useState(0.0);

    useEffect(() => {
        const login = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/sonarqube/login', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });

                if (response.ok) {
                    setIsLoggedIn(true);
                    console.log("Inicio de sesión exitoso");
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
                    setGithubToken(proyecto.githubtoken || '');

                    if (proyecto.link) {
                        const repoUrl = proyecto.link;
                        const repoName = repoUrl.split('github.com/')[1];
                        const filePath = 'sonar-project.properties';

                        // URL pública de la API de GitHub para obtener el archivo
                        const githubApiUrl = `https://api.github.com/repos/${repoName}/contents/${filePath}?ref=${branch}`;
                        console.log(githubApiUrl);

                        // Realizamos la petición usando el token obtenido del proyecto
                        const githubResponse = await fetch(githubApiUrl, {
                            headers: {
                                Authorization: `token ${githubToken}`,
                                'Content-Type': 'application/json',
                            },
                        });

                        if (!githubResponse.ok) {
                            throw new Error('Error fetching GitHub file');
                        }

                        const fileData = await githubResponse.json();

                        // Procesamos el contenido del archivo si existe
                        if (fileData.content) {
                            const decodedContent = atob(fileData.content.replace(/\n/g, ''));
                            const lines = decodedContent.split('\n');
                            const projectKeyLine = lines.find(line => line.startsWith('sonar.projectKey='));
                            console.log(projectKeyLine);
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
    }, [id, branch, isLoggedIn, githubToken]);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const metricsResponse = await fetch('http://localhost:5000/api/sonarqube/metrics', {

                });
                console.log(metricsResponse);
                const metricsData = await metricsResponse.json();
                console.log(metricsData);
                const keys = metricsData?.metricKeys || [];
                setMetricKeys(keys);

                const metricsString = keys.length > 0 ? keys.join(',') : '';
                const measuresResponse = await fetch(`http://localhost:5000/api/sonarqube/measures?component=${projectKey}&metricKeys=${metricsString}`, {
                });
                console.log(measuresResponse);
                if (!measuresResponse.ok) {
                    throw new Error('Error fetching measures');
                }
                const measuresData = await measuresResponse.json();
                console.log(measuresData);
                const measuresMap = new Map<string, string>();
                measuresData?.data?.component?.measures?.forEach((measure: Measure) => {
                    measuresMap.set(measure.metric, measure.value);
                });
                setMeasures(measuresMap);

                const ncloc = parseFloat(measuresMap.get('ncloc') || '0');
                const codeSmells = parseFloat(measuresMap.get('code_smells') || '0');
                const complexity1 = parseFloat(measuresMap.get('complexity') || '0');
                const duplicatedLines = parseFloat(measuresMap.get('duplicated_lines') || '0');
                const lineCoverage = parseFloat(measuresMap.get('lines_to_cover') || '0');
                const cognitiveComplexity = parseFloat(measuresMap.get('cognitive_complexity') || '0');
                const commentLinesDensity = parseFloat(measuresMap.get('comment_lines_density') || '0');

                setDisenio(ncloc > 0 ? complexity1 / ncloc : 0);
                setDuplicaciones(ncloc > 0 ? duplicatedLines / ncloc : 0);
                setCobertura(ncloc > 0 ? lineCoverage / ncloc : 0);
                setMalaPractica(ncloc > 0 ? codeSmells / ncloc : 0);
                setObsoleto(ncloc > 0 ? codeSmells / ncloc : 0);
                setRedundante(ncloc > 0 ? duplicatedLines / ncloc : 0);
                setCognitiveC(ncloc > 0 ? cognitiveComplexity / ncloc : 0);
                setConfuso(ncloc > 0 ? codeSmells / ncloc : 0);
                setDificultadE(ncloc > 0 ? cognitiveComplexity / ncloc : 0);
                setDensidadC(commentLinesDensity ? 100 - commentLinesDensity : 100);

            } catch (error) {
                console.error('Error al obtener métricas o medidas:', error);
            }
        };

        if (projectKey) {
            fetchMetrics();
        }
    }, [projectKey, isLoggedIn]);


    const calculateAverage = (metrics: number[]): number => {
        const total = metrics.reduce((acc, metric) => acc + metric, 0);
        return metrics.length > 0 ? total / metrics.length : 0;
    };

    const modularidadMetrics = [parseFloat((disenio *100).toFixed(2)), parseFloat((duplicaciones *100).toFixed(2)), parseFloat((cobertura *100).toFixed(2))];
    const reusabilidadMetrics = [parseFloat((malaPractica*100).toFixed(2)), parseFloat((obsoleto*100).toFixed(2)), parseFloat((disenio*100).toFixed(2)), parseFloat((duplicaciones*100).toFixed(2))];
    const analizabilidadMetrics = [parseFloat((malaPractica*100).toFixed(2)), parseFloat((redundante*100).toFixed(2)), parseFloat((cognitiveC*100).toFixed(2)), parseFloat((confuso*100).toFixed(2)), parseFloat((disenio*100).toFixed(2)), parseFloat((dificultadE*100).toFixed(2)), parseFloat((densidadC).toFixed(2))];
    const capacidadModificadoMetrics = [parseFloat((malaPractica*100).toFixed(2)), parseFloat((redundante*100).toFixed(2)), parseFloat((disenio*100).toFixed(2)), parseFloat((duplicaciones*100).toFixed(2))];
    const capacidadProbadoMetrics = [parseFloat((redundante*100).toFixed(2)), parseFloat((disenio *100).toFixed(2)), parseFloat((dificultadE*100).toFixed(2)), parseFloat((cobertura *100).toFixed(2))];
    console.log(analizabilidadMetrics)
    // Calculate the averages for each subcharacteristic
    const modularidadAvg = calculateAverage(modularidadMetrics);
    console.log(modularidadAvg)
    const reusabilidadAvg = calculateAverage(reusabilidadMetrics);
    console.log(reusabilidadAvg)
    const analizabilidadAvg = calculateAverage(analizabilidadMetrics);
    console.log(analizabilidadAvg)
    const capacidadModificadoAvg = calculateAverage(capacidadModificadoMetrics);
    console.log(capacidadModificadoAvg)
    const capacidadProbadoAvg = calculateAverage(capacidadProbadoMetrics);
    console.log(capacidadProbadoAvg)

    // Apply the transformation 100 - average
    const modularidadResult = 100 - modularidadAvg;
    const reusabilidadResult = 100 - reusabilidadAvg;
    const analizabilidadResult = 100 - analizabilidadAvg;
    const capacidadModificadoResult = 100 - capacidadModificadoAvg;
    const capacidadProbadoResult = 100 - capacidadProbadoAvg;

    // Calculate the final average of the results
    const finalAverage = calculateAverage([
        modularidadResult,
        reusabilidadResult,
        analizabilidadResult,
        capacidadModificadoResult,
        capacidadProbadoResult
    ]);

    const getMantenibilidadDescripcion = (valor: number) => {
        if (valor >= 0 && valor <= 25) {
            return 'Deficiencia en la mantenibilidad';
        } else if (valor > 25 && valor <= 64) {
            return 'Dificultad en la mantenibilidad';
        } else if (valor > 64 && valor <= 85) {
            return 'Moderadamente mantenible';
        } else if (valor > 85 && valor <= 100) {
            return 'Completamente mantenible';
        } else {
            return '';
        }
    };

    const mantenibilidadDescripcion = getMantenibilidadDescripcion(finalAverage);

    // Métricas que quieres mostrar y traducir
    const allowedMetrics = [
        { key: 'code_smells', label: 'Olores a código' },
        { key: 'comment_lines_density', label: 'Densidad de comentarios' },
        { key: 'duplicated_lines_density', label: 'Densidad de líneas duplicadas' },
        { key: 'violations', label: 'Violaciones' },
        { key: 'maintainability_issues', label: 'Problemas de mantenibilidad' },
        { key: 'security_issues', label: 'Problemas de seguridad' },
        { key: 'cognitive_complexity', label: 'Complejidad cognitiva' },
        { key: 'quality_gate_details', label: 'Estado de calidad' },
        { key: 'lines_to_cover', label: 'Líneas de cobertura' },
        { key: 'complexity', label: 'Complejidad ciclomática' },
        { key: 'ncloc', label: 'líneas de código' },
        { key: 'duplicated_lines', label: 'líneas de duplicadas' }
    ];

    const renderProgressBar = (value: number, text: string, color: string) => (
        <div className="flex flex-col items-center justify-center">
            <div className="w-20 h-20">
                <CircularProgressbar
                    value={value}
                    text={`${value}`}
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
            <div className="overflow-x-auto w-full max-w-6xl mb-6">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="p-4 text-left text-sm font-medium text-gray-700">Métrica</th>
                            <th className="p-4 text-left text-sm font-medium text-gray-700">Valor (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-200">
                            <td className="p-4 text-sm font-medium text-gray-700">Diseño</td>
                            <td className="p-4 text-sm text-gray-500">{(disenio* 100).toFixed(2)}%</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                            <td className="p-4 text-sm font-medium text-gray-700">Duplicaciones</td>
                            <td className="p-4 text-sm text-gray-500">{(duplicaciones * 100).toFixed(2)}%</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                            <td className="p-4 text-sm font-medium text-gray-700">Cobertura</td>
                            <td className="p-4 text-sm text-gray-500">{(cobertura * 100).toFixed(2)}%</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                            <td className="p-4 text-sm font-medium text-gray-700">Mala Práctica</td>
                            <td className="p-4 text-sm text-gray-500">{(malaPractica * 100).toFixed(2)}%</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                            <td className="p-4 text-sm font-medium text-gray-700">Obsoleto</td>
                            <td className="p-4 text-sm text-gray-500">{(obsoleto * 100).toFixed(2)}%</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                            <td className="p-4 text-sm font-medium text-gray-700">Redundante</td>
                            <td className="p-4 text-sm text-gray-500">{(redundante * 100).toFixed(2)}%</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                            <td className="p-4 text-sm font-medium text-gray-700">Complejidad Cognitiva</td>
                            <td className="p-4 text-sm text-gray-500">{(cognitiveC * 100).toFixed(2)}%</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                            <td className="p-4 text-sm font-medium text-gray-700">Confuso</td>
                            <td className="p-4 text-sm text-gray-500">{(confuso * 100).toFixed(2)}%</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                            <td className="p-4 text-sm font-medium text-gray-700">Dificultad en Escritura</td>
                            <td className="p-4 text-sm text-gray-500">{(dificultadE * 100).toFixed(2)}%</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                            <td className="p-4 text-sm font-medium text-gray-700">Densidad de Comentarios</td>
                            <td className="p-4 text-sm text-gray-500">{(densidadC).toFixed(2)}%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="w-full max-w-2xl mt-6">
                <h2 className="text-xl font-bold mb-2 text-center text-black">
                    Grado de Mantenibilidad: {finalAverage.toFixed(2)}% - {mantenibilidadDescripcion}
                </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                {allowedMetrics.map(({ key, label }) => {
                    const value = parseFloat(measures.get(key) || '0');
                    let color = value > 50 ? 'red' : value > 20 ? 'orange' : 'green';

                    if (key === 'maintainability_issues' || key === 'security_issues') {
                        try {
                            const issues = JSON.parse(measures.get(key) || '{}');
                            return (
                                <div key={key} className="p-4 text-center bg-white shadow-md rounded-lg flex flex-col items-center justify-center">
                                    <h2 className="text-xl font-bold mb-2 text-black">{label}</h2>
                                    <p className="text-center items-center text-gray-700">Total: {issues.total || 0}</p>
                                </div>
                            );
                        } catch (error) {
                            console.error('Error parsing issues:', error);
                            return null; // or some fallback UI
                        }
                    }

                    if (key === 'quality_gate_details') {
                        try {
                            const qualityGate = JSON.parse(measures.get(key) || '{"level": "Desconocido"}');
                            const qualityLevel = qualityGate.level || 'Desconocido';
                            return (
                                <div key={key} className="p-4 bg-white shadow-md rounded-lg flex flex-col items-center justify-center">
                                    <h2 className="text-xl font-bold mb-2 text-black">{label}</h2>
                                    <p className={`text-center font-bold ${qualityLevel === 'OK' ? 'text-green-500' : 'text-red-500'}`}>
                                        {qualityLevel}
                                    </p>
                                </div>
                            );
                        } catch (error) {
                            console.error('Error parsing quality gate:', error);
                            return null; // or some fallback UI
                        }
                    }

                    if (key === 'ncloc') {
                        try {
                            const qualityGate = JSON.parse(measures.get(key) || '0');
                            return (
                                <div key={key} className="p-4 bg-white shadow-md rounded-lg flex flex-col items-center justify-center">
                                    <h2 className="text-xl font-bold mb-2 text-black">{label}</h2>
                                    <p className="text-center font-bold text-gray-700">
                                        {qualityGate}
                                    </p>
                                </div>
                            );
                        } catch (error) {
                            console.error('Error parsing ncloc:', error);
                            return null; // or some fallback UI
                        }
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
