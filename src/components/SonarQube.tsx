import React, { Component, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import api from '../api';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import ModalCCG from './modalCCG';
//import ModalCCG1 from './modalCCG';
//import ModalCCG2 from './modalCCG';
//import ModalCCG3 from './modalCCG';
//import ModalCCG4 from  './modalCCG';

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
interface LineaAfectada {
    startLine: number;
    endLine: number;
}
interface Issue {
    descripcion: string;
    regla: string;
    severidad: string;
    estado: string;
    tipo: string[];
    categoria: string[];
    archivo: string;
    linea: number;
    tiempo_estimado: string;
    linea_afectada: LineaAfectada[];
}

interface Componente {
    Nombre: string;
    Tipo: string;
    Enlace: string;
    Medidas: string[];
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
    const navigate = useNavigate(); // Inicializa el hook de navegación
    const [valoracion, setValoracion] = useState<ValoracionMantenibilidad[]>([]);
    const [propiedades, setPropiedades] = useState<PropiedadCalidad[]>([]);
    const [mostrarMetricas, setMostrarMetricas] = useState(false);
    const [errores, setErrors] = useState([]);
    const [issues, setIssues] = useState([]);
    const [componentes, setComponentes] = useState([]);

    const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [fileContent, setFileContent] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    useEffect(() => {
        const login = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/sonarqube/login', {
                    //const response = await fetch('backend-qa-ckavg5ewbqeubrgb.canadacentral-01.azurewebsites.net/api/sonarqube/login', {

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
                    //const metricsResponse = await fetch('backend-qa-ckavg5ewbqeubrgb.canadacentral-01.azurewebsites.net/api/sonarqube/metrics', {
                });
                console.log(metricsResponse);
                const metricsData = await metricsResponse.json();
                console.log(metricsData);
                const keys = metricsData?.metricKeys || [];
                setMetricKeys(keys);

                const metricsString = keys.length > 0 ? keys.join(',') : '';

                const measuresResponse = await fetch(`http://localhost:5000/api/sonarqube/measures?component=${projectKey}&metricKeys=${metricsString}`, {
                    //const measuresResponse = await fetch(`backend-qa-ckavg5ewbqeubrgb.canadacentral-01.azurewebsites.net/api/sonarqube/measures?component=${projectKey}&metricKeys=${metricsString}`, {
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

    useEffect(() => {
        // Obtener valores de mantenibilidad desde la base de datos
        const fetchValoracion = async () => {
            try {
                const response = await api.get('/valoracionMantenibilidad');
                setValoracion(response.data);
            } catch (error) {
                console.error('Error al obtener valoración de mantenibilidad:', error);
            }
        };

        fetchValoracion();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [propiedadesRes] = await Promise.all([
                    api.get('/propiedadCalidad')
                ]);
                setPropiedades(propiedadesRes.data); // Guardamos las propiedades en el estado
            } catch (error) {
                console.error('Error al obtener datos:', error);
            }
        };
        fetchData();
    }, []);


    useEffect(() => {
        // Función para obtener los issues desde la API
        const fetchIssues = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/sonarqube/issues?projectKey=${projectKey}`, {});

                if (!response.ok) {
                    throw new Error('Error fetching issues');
                }

                const data = await response.json();
                setIssues(data.issues);
                const issuesMapped = data.issues.map(issue => ({
                    descripcion: issue.message, // Descripción del problema
                    regla: issue.rule, // Regla asociada
                    severidad: issue.severity, // Severidad del problema

                    estado: issue.status, // Estado (ejemplo: abierto, resuelto)
                    tipo: issue.type, // Tipo de problema
                    categoria: issue.tags ? issue.tags.join(", ") : "Sin categoría", // Categorías (si tiene múltiples tags)
                    archivo: issue.component, // Archivo donde se encuentra el problema
                    linea: issue.line || "No especificada", // Línea donde ocurre el problema
                    tiempo_estimado: issue.effort || "No definido", // Tiempo estimado de corrección
                    linea_afectada: issue.textRange ? issue.textRange.startLine : "No disponible" // Línea afectada específica
                }));
                // Mapear los errores de la respuesta

                setErrors(issuesMapped);

            } catch (error) {
                console.error(error);
            }
        };

        // Llama la función para obtener los issues
        if (projectKey) {
            fetchIssues();
        }
    }, [projectKey, isLoggedIn]);

    useEffect(() => {
        // Función para obtener los issues desde la API
        const fetchComponent = async () => {
            try {
                console.log("ESTE ES EL PROJECT: " + projectKey);
                if (projectKey) {
                    const response = await fetch(`http://localhost:5000/api/sonarqube/measures/component_tree?component=${projectKey}&metricKeys=duplicated_lines,lines_to_cover,complexity,cognitive_complexity,comment_lines_density,ncloc`);

                    if (!response.ok) {
                        throw new Error('Error fetching issues');
                    }

                    const data = await response.json();
                    console.log("API Response:", data);  // Verifica la estructura real de data

                    if (!data.data || !data.data.components || !Array.isArray(data.data.components)) {
                        throw new Error("La API no devolvió un array en 'components'");
                    }



                    const componentesMapped = data.data.components.map(componente => ({
                        Nombre: componente.name,
                        Tipo: componente.qualifier,
                        Enlace: componente.path,
                        Medidas: componente.measures,
                    }));
                    console.log("Responsesas:", componentesMapped);

                    setComponentes(componentesMapped);
                }
            } catch (error) {
                console.error("Error en fetchComponent:", error);
            }
        };

        // Llama la función para obtener los issues
        if (projectKey) {
            fetchComponent();
        }
    }, [projectKey, isLoggedIn]);


    const calculateAverage = (metrics: number[]): number => {
        const total = metrics.reduce((acc, metric) => acc + metric, 0);
        return metrics.length > 0 ? total / metrics.length : 0;
    };

    const modularidadMetrics = [parseFloat((disenio * 100).toFixed(2)), parseFloat((duplicaciones * 100).toFixed(2)), parseFloat((cobertura * 100).toFixed(2))];
    const reusabilidadMetrics = [parseFloat((malaPractica * 100).toFixed(2)), parseFloat((obsoleto * 100).toFixed(2)), parseFloat((disenio * 100).toFixed(2)), parseFloat((duplicaciones * 100).toFixed(2))];
    const analizabilidadMetrics = [parseFloat((malaPractica * 100).toFixed(2)), parseFloat((redundante * 100).toFixed(2)), parseFloat((cognitiveC * 100).toFixed(2)), parseFloat((confuso * 100).toFixed(2)), parseFloat((disenio * 100).toFixed(2)), parseFloat((dificultadE * 100).toFixed(2)), parseFloat((densidadC).toFixed(2))];
    const capacidadModificadoMetrics = [parseFloat((malaPractica * 100).toFixed(2)), parseFloat((redundante * 100).toFixed(2)), parseFloat((disenio * 100).toFixed(2)), parseFloat((duplicaciones * 100).toFixed(2))];
    const capacidadProbadoMetrics = [parseFloat((redundante * 100).toFixed(2)), parseFloat((disenio * 100).toFixed(2)), parseFloat((dificultadE * 100).toFixed(2)), parseFloat((cobertura * 100).toFixed(2))];
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

    const getMantenibilidadDescripcion = (valor: number): string => {
        for (const rango of valoracion) {
            if (valor >= rango.valor1 && valor <= rango.valor2) {
                return rango.criterio;
            }
        }
        return 'Sin descripción';
    };

    const mantenibilidadDescripcion = getMantenibilidadDescripcion(finalAverage);

    // Métricas que quieres mostrar y traducir
    const allowedMetrics = [
        { key: 'duplicated_lines', label: 'Duplicated Lines', condicion: '>', defecto: 'Líneas duplicadas' },
        { key: 'lines_to_cover', label: 'Líneas de cobertura', condicion: '<', defecto: 'Código no probado' },
        { key: 'complexity', label: 'Complejidad ciclomática', condicion: '>', defecto: 'Complejidad del código' },
        { key: 'code_smells', label: 'Olores a código', condicion: '>', defecto: 'Malas prácticas de programación' },
        { key: 'cognitive_complexity', label: 'Complejidad cognitiva', condicion: '>', defecto: 'Complejidad del código' },
        { key: 'comment_lines_density', label: 'Densidad de comentarios', condicion: '>=', defecto: 'Falta de documentación' }
    ];

    const renderProgressBar = (value: number, text: string, color: string) => (
        <div className="flex flex-col items-center justify-center">
            <div className="w-20 h-20">
                <CircularProgressbar
                    value={value}
                    text={`${value.toFixed(2)}%`} // Mostrar el valor del porcentaje dentro de la barra
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


    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 1  // Mantén solo 1 item
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 1  // Mantén solo 1 item
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 1  // Mantén solo 1 item
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1  // Mantén solo 1 item
        }
    };
    const clasificarSeveridad = (severity: string) => {
        switch (severity) {
            case 'BLOCKER':
                return 'Bloqueante';
            case 'CRITICAL':
                return 'Crítica';
            case 'MAJOR':
                return 'Mayor';
            case 'INFO':
                return 'Informativa';
            default:
                return severity; // Retorna el valor original si no coincide con ninguno
        }
    };
    const clasificarEstado = (estado: string) => {
        switch (estado) {
            case 'OPEN':
                return 'Abierto';
            case 'CONFIRMED':
                return 'Confirmado';
            case 'RESOLVED':
                return 'Resuelto';
            case 'REOPENED':
                return 'Reabierto';
            case 'CLOSED':
                return 'Cerrado';
            default:
                return estado; // Retorna el valor original si no coincide con ninguno
        }
    };
    const filtrarMalasPracticas = (tipo: string) => {
        return tipo === "CODE_SMELL";
    };
    const filtrarArchivos = (archivo: string) => {
        return archivo === "FIL";
    };
    const ComplejidadCognitiva = (valor: string) => {
        switch (valor) {
            case 'OPEN':
                return 'Abierto';
            case 'CONFIRMED':
                return 'Confirmado';
        }
    };
    const metricNames = {
        cognitive_complexity: "Complejidad cognitiva",
        comment_lines_density: "Densidad de comentarios",
        complexity: "Complejidad ciclomática",
        duplicated_lines: "Líneas duplicadas",
        lines_to_cover: "Líneas de cobertura"
    };
    const handleOpenModal = (metric: string) => {

        console.log("Métrica seleccionada para el modal:", metric);
        setSelectedMetric(metric);
        console.log("Métrica asa seleccionada:", selectedMetric);
        setIsModalOpen(true);
        console.log("Estado del modal:", isModalOpen);
    };

    // Función para cerrar el modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMetric(null); // Limpiar la métrica seleccionada
    };

    // Función para renderizar el modal adecuado según la métrica seleccionada
    const renderModal = () => {
        if (!isModalOpen) return null;

        switch (selectedMetric) {
            case 'Complejidad ciclomática':
                return <ModalCCG isOpen={isModalOpen} onClose={handleCloseModal} selectedMetric={selectedMetric} />;
            case 'Densidad de comentarios':
                return <ModalCCG isOpen={isModalOpen} onClose={handleCloseModal} selectedMetric={selectedMetric} />;
            case 'Líneas duplicadas':
                return <ModalCCG isOpen={isModalOpen} onClose={handleCloseModal} selectedMetric={selectedMetric} />;
            case 'Líneas de cobertura':
                return <ModalCCG isOpen={isModalOpen} onClose={handleCloseModal} selectedMetric={selectedMetric} />;
            case 'Complejidad cognitiva':
                return <ModalCCG isOpen={isModalOpen} onClose={handleCloseModal} selectedMetric={selectedMetric} />;
            default:
                return null;
        }
    };
    const handleViewFile = async (fileKey: string) => {
        try {
            const response = await fetch(`http://localhost:5000/api/sonarqube/sonar-file?key=${encodeURIComponent(fileKey)}`, {
                headers: {
                    "Accept": "text/plain",
                }
            });

            if (!response.ok) throw new Error(`Error ${response.status}: No se pudo obtener el archivo`);

            const content = await response.text();
            setFileContent(content);
            setSelectedFile(fileKey);
        } catch (error) {
            console.error("Error al cargar el archivo:", error);
            setFileContent("Error al cargar el archivo.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
            <div className="border border-gray-300 p-4 rounded-lg mb-1 w-auto max-w-full">
                <h2 className="text-xl font-bold text-blue-900 text-center">Información del Proyecto</h2>
                <div className="mt-2 text-sm bg-[#D6ECFA] p-4 rounded-lg">
                    <p><strong>Nombre:</strong> {nombre}</p>
                    <p><strong>Link:</strong> <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600">{link}</a></p>
                    <p><strong>Rama:</strong> {branch}</p>
                    <p><strong>Grado de Mantenibilidad:</strong> {finalAverage.toFixed(2)}%</p>
                    <p><strong>Líneas de Código:</strong> {measures.get('ncloc')}</p>
                    <p><strong>Criterio de valoración:</strong> {mantenibilidadDescripcion}</p>
                    <label htmlFor="toggleMetricas" className="text-gray-700 cursor-pointer mr-2">
                        <strong>Ver mediciones de mantenibilidad:</strong>
                    </label>
                    <input
                        type="checkbox"
                        id="toggleMetricas"
                        checked={mostrarMetricas}
                        onChange={() => setMostrarMetricas(!mostrarMetricas)}
                        className="cursor-pointer"
                    />


                </div>
            </div>
            {/* Modal fuera del carrusel */}
            {fileContent && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                    onClick={() => setFileContent(null)} // Cerrar modal al hacer clic fuera
                >
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg w-[80%] max-w-4xl max-h-[80%] relative"
                        onClick={(e) => e.stopPropagation()} // Evitar cerrar modal al hacer clic dentro
                    >
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Código</h2>
                        <h2 className="text-xl font-bold mb-4 text-gray-800">
                            {selectedFile.split(':').slice(1).join(':')}
                        </h2>
                        <pre className="bg-gray-900 text-white p-4 max-h-80 overflow-x-auto rounded-lg whitespace-pre-wrap">
                            {fileContent.split('\n').map((line, index) => (
                                <div key={index} className="flex">
                                    <span className="text-gray-400 pr-4">{index + 1}</span> {/* Numeración */}
                                    <span className="whitespace-pre-wrap">{line}</span> {/* Línea de código */}
                                </div>
                            ))}
                        </pre>
                        <button
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-all"
                            onClick={() => setFileContent(null)}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            <div className="w-full max-w-4xl mt-6 p-4 border border-gray-300 rounded-lg" >
                <h2 className="text-xl font-bold text-center mb-4 text-blue-900">DEFECTOS DE MANTENIBILIDAD</h2>
                <div className="mt-2 text-sm text-gray-600 mb-3">
                    <p><strong>Contexto:</strong> El presente apartado se muestra información respecto a los defectos de mantenibilidad, en el cual, si una propiedad no cumple con el porcentaje de aceptacion esta desencadena un defecto.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                    {allowedMetrics.map(({ key, label, condicion, defecto }, index) => {
                        const value = parseFloat(measures.get(key) || '0'); // Obtener el valor de la métrica
                        let color = 'green'; // Valor predeterminado (si la condición se cumple)
                        let porcentaje = 0; // Inicializamos el porcentaje
                        let mensaje = 'ACEPTABLE'; // Mensaje predeterminado (si la condición se cumple)

                        // Asignar un valor único de la base de datos para cada propiedad
                        let propiedadValor = '';
                        if (propiedades.length > 0) {
                            propiedadValor = propiedades[index] ? propiedades[index].valor : ''; // Asignar el valor correspondiente a cada propiedad
                        }

                        // Condición especial para "Olores a código" y "Densidad de comentarios"
                        if (label === "Olores a código" || label === "Densidad de comentarios") {
                            porcentaje = value; // Usar el valor real para "Olores a código"
                        } else {
                            // Calcular el porcentaje basado en las líneas de código
                            const ncloc = parseFloat(measures.get('ncloc') || '0');
                            porcentaje = ncloc > 0 ? (value / ncloc) * 100 : 0;
                        }

                        // Verificar la condición de la propiedad y cambiar el color si no se cumple
                        if (condicion === '>') {
                            if (porcentaje > propiedadValor) {
                                color = 'red'; // Rojo si no cumple la condición
                                mensaje = 'DEFECTO'; // Si no cumple, mostrar "DEFECTO"
                            }
                        } else if (condicion === '<') {
                            if (porcentaje < propiedadValor) {
                                color = 'red'; // Rojo si no cumple la condición
                                mensaje = 'DEFECTO'; // Si no cumple, mostrar "DEFECTO"
                            }
                        } else if (condicion === '>=') {
                            if (porcentaje >= propiedadValor) {
                                color = 'red'; // Rojo si no cumple la condición
                                mensaje = 'DEFECTO'; // Si no cumple, mostrar "DEFECTO"
                            }
                        }

                        // Concatenar el porcentaje y el valor de la BD con '%' excepto para "Olores a código" y "Densidad de comentarios"
                        let porcentajeConCondicion;
                        if (label === "Olores a código") {
                            // Si es una propiedad especial, no concatenar '%'
                            porcentajeConCondicion = `${porcentaje} ${condicion} ${propiedadValor}`;
                        } else {
                            // Para las demás propiedades, concatenar '%' al porcentaje y al valor de la BD
                            porcentajeConCondicion = `${porcentaje.toFixed(2)}% ${condicion} ${propiedadValor}%`;
                        }
                        return (
                            <div key={key} className="p-4 bg-white shadow-md rounded-lg flex flex-col items-center justify-center bg-[#F7F1E3] p-4 rounded-lg">
                                <h2 className="text-xl font-bold mb-2 text-black text-center">{defecto}</h2>
                                <div className="w-full text-left">
                                    <p className="text-gray-700"><strong>Propiedad:</strong> {label}</p>
                                    <p className="text-gray-700"><strong>Medición #:</strong> {value}</p>
                                    <p className="text-gray-700"><strong>Porcentaje según líneas de código:</strong> {porcentaje.toFixed(2) + '%'}</p>
                                    <p className="text-gray-700"><strong>CONDICIÓN:</strong> {porcentajeConCondicion}</p>
                                </div>
                                <p className="text-center text-gray-700" style={{ color: color }}>
                                    <strong>{mensaje}</strong>
                                </p>
                                {renderProgressBar(porcentaje, defecto, color)}
                            </div>
                        );
                    })}
                </div>
            </div>
            {mostrarMetricas && (
                <div className="border border-gray-300 p-6 rounded-lg mb-6 w-auto max-w-full mt-6 shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">MEDICIONES DE MANTENIBILIDAD</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Tabla de Métricas de Calidad */}
                        <div className="overflow-x-auto">
                            <h3 className="text-lg font-semibold text-gray-700 text-center mb-3">Métricas de Calidad</h3>
                            <table className="w-full bg-white border border-gray-200 rounded-lg shadow">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="p-4 text-left text-sm font-medium text-gray-700">Métrica</th>
                                        <th className="p-4 text-left text-sm font-medium text-gray-700">Valor (%)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { name: "Diseño", value: disenio },
                                        { name: "Duplicaciones", value: duplicaciones },
                                        { name: "Cobertura", value: cobertura },
                                        { name: "Mala Práctica", value: malaPractica },
                                        { name: "Obsoleto", value: obsoleto },
                                        { name: "Redundante", value: redundante },
                                        { name: "Complejidad Cognitiva", value: cognitiveC },
                                        { name: "Confuso", value: confuso },
                                        { name: "Dificultad en Escritura", value: dificultadE },
                                        { name: "Densidad de Comentarios", value: densidadC }
                                    ].map(({ name, value }) => (
                                        <tr key={name} className="border-b border-gray-200">
                                            <td className="p-4 text-sm font-medium text-gray-700">{name}</td>
                                            <td className="p-4 text-sm text-gray-500">{(value * 100).toFixed(2)}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Tabla de Subcaracterísticas de Mantenibilidad */}
                        <div className="overflow-x-auto">
                            <h3 className="text-lg font-semibold text-gray-700 text-center mb-3">Subcaracterísticas de Mantenibilidad</h3>
                            <table className="w-full bg-white border border-gray-200 rounded-lg shadow">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="p-4 text-left text-sm font-medium text-gray-700">Subcaracterística</th>
                                        <th className="p-4 text-left text-sm font-medium text-gray-700">Valor (%)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { name: "Modularidad", value: modularidadAvg },
                                        { name: "Reusabilidad", value: reusabilidadAvg },
                                        { name: "Analizabilidad", value: analizabilidadAvg },
                                        { name: "Capacidad de Modificación", value: capacidadModificadoAvg },
                                        { name: "Capacidad de Prueba", value: capacidadProbadoAvg }
                                    ].map(({ name, value }) => (
                                        <tr key={name} className="border-b border-gray-200">
                                            <td className="p-4 text-sm font-medium text-gray-700">{name}</td>
                                            <td className="p-4 text-sm text-gray-500">{value.toFixed(2)}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
            <div className="border border-gray-300 p-6 rounded-lg mb-6 w-auto max-w-full mt-6 shadow-md">

                <h2 className="text-xl font-bold text-blue-900 text-center" >GUIA PARA SOLUCIÓN DE RRRORES DE MANTENIBILIDAD</h2>
                <div className="text-sm text-gray-600 text-left mb-4">
                    <p><strong>Contexto:</strong> Cada uno de los defectos mencionados anteriormente, es el resultado de un error o acciona humana durante el desarrollo del software</p>
                    <p>lo que desencadena defectos de mantenibilidad.</p>
                    <p><strong>Registro de errores relacionada con defectos de:</strong></p>
                    <h2 className="text-xl text-gray-800 text-center" >Malas practicas de programación</h2>

                </div>

                {/* Carrusel de errores */}
                <div className="flex justify-center items-center">
                    <Carousel responsive={responsive} arrows={true} autoPlay={false} className="w-full max-w-4xl">
                        {issues.length > 0 ? (
                            issues.filter(issue => filtrarMalasPracticas(issue.tipo)) // Filtrar por 'CODE_SMELL'
                                .map((issue, index) => (
                                    <div key={index} className="p-4 bg-gray-200 rounded-lg shadow-md w-full flex justify-center items-center bg-[#C9E0C3] p-4 rounded-lg">
                                        <div className="w-3/4 max-w-lg text-left "> {/* Centrado en el carrusel pero alineado a la izquierda */}

                                            <h3 className="text-xl font-bold text-center">{issue.descripcion}</h3>
                                            <p><strong>Incumplimiento de la regla:</strong> {issue.regla}</p>
                                            <p><strong>Severidad:</strong> {clasificarSeveridad(issue.severidad)}</p>

                                            <p><strong>Defecto: </strong> Malas practicas de codificación</p>
                                            <p><strong>Archivo: </strong>
                                                {issue.archivo}
                                            </p>
                                            <a
                                                onClick={(e) => {
                                                    handleViewFile(issue.archivo); // Llamada a la función
                                                }}
                                                className="text-blue-500 underline hover:text-blue-700 transition-all flex items-center gap-1 cursor-pointer"
                                            >
                                                Ver Código
                                            </a>
                                            <p><strong>Tiempo estimado:</strong> {issue.tiempo_estimado}</p>
                                            <p><strong>Lineas afectadas:</strong></p>
                                            <ul className="list-disc pl-5">
                                                {(Array.isArray(issue.linea_afectada) ? issue.linea_afectada : [issue.linea_afectada]).map((linea, idx) => (
                                                    <li key={idx}>
                                                        {`Numero del inicio de la linea: ${linea.startLine}, Numero del fin de la linea: ${linea.endLine}`}
                                                    </li>
                                                ))}
                                            </ul>

                                        </div>
                                    </div>
                                ))
                        ) : (
                            <p>No hay issues disponibles</p>
                        )}

                    </Carousel>
                </div>


                <div className="text-sm text-gray-600 text-left mb-4"></div>
                <div className="text-sm text-gray-600 text-left mb-4">
                    <h2 className="text-xl text-gray-800 text-center" >Líneas duplicadas, Código no probado, Complejidad del código y Falta de documentación</h2>

                </div>

                {/* Carrusel de errores                         Medidas: componente.measures,
 */}
                <div className="flex justify-center items-center">
                    <Carousel responsive={responsive} arrows={true} autoPlay={false} className="w-full max-w-4xl">
                        {componentes ? (
                            componentes.filter(componente => filtrarArchivos(componente.Tipo)) // Filtrar por 'CODE_SMELL'
                                .map((componente, index) => (
                                    <div key={index} className="p-4 bg-[#C9E0C3] p-4 rounded-lg rounded-lg shadow-md w-full flex justify-center items-center">

                                        <div className="w-3/4 max-w-lg text-left"> {/* Centrado en el carrusel pero alineado a la izquierda */}
                                            <h3 className="text-xl font-bold text-center">
                                                Las soluciones a los defectos se llevan a cabo en función del método de programación utilizado por el desarrollador.
                                            </h3>
                                            <p><strong>Archivo:</strong> {componente.Nombre}</p>
                                            <p><strong>Dirección:</strong> {componente.Enlace}</p>
                                            <p><strong>Errores identificados según propiedades de calidad:</strong></p>

                                            {/* Filtramos las métricas una vez y las reutilizamos */}
                                            {componente.Medidas && componente.Medidas.length > 0 ? (() => {
                                                const medidasFiltradas = componente.Medidas.filter(medida => {
                                                    const nclocMeasure = componente.Medidas.find(m => m.metric === "ncloc");
                                                    const nclocValue = nclocMeasure ? parseFloat(nclocMeasure.value) : null;
                                                    const linesToCoverCondition =
                                                        medida.metric === "lines_to_cover" &&
                                                        nclocValue &&
                                                        !isNaN(nclocValue) &&
                                                        (parseFloat(medida.value) / nclocValue) * 100 < 70;

                                                    return (
                                                        (medida.bestValue === false && medida.value >= 0) ||
                                                        (medida.metric === "complexity" && medida.value > 10) ||
                                                        linesToCoverCondition
                                                    );
                                                });

                                                return (
                                                    <>
                                                        <ul>
                                                            {medidasFiltradas.map((medida, i) => {
                                                                const nclocMeasure = componente.Medidas.find(m => m.metric === "ncloc");
                                                                const nclocValue = nclocMeasure ? parseFloat(nclocMeasure.value) : null;
                                                                const percentage = medida.metric === "lines_to_cover" && nclocValue ?
                                                                    (parseFloat(medida.value) / nclocValue) * 100 : null;

                                                                const metricName = metricNames[medida.metric] || medida.metric;

                                                                return (
                                                                    <li key={i}>
                                                                        {metricName}: {percentage ? `${percentage.toFixed(2)}%` : medida.value + "%"}
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>

                                                        {/* Sección de Reglas (solo métricas que pasaron el filtro) */}
                                                        <p><strong>Incumplimiento de la regla:</strong></p>
                                                        <p>Soluciones:</p>
                                                        <p>
                                                            {Array.from(
                                                                new Set(
                                                                    medidasFiltradas
                                                                        .filter(medida => Object.keys(metricNames).includes(medida.metric))
                                                                        .map(medida => metricNames[medida.metric])
                                                                )
                                                            ).map((metric, index) => (
                                                                <a
                                                                    key={index}
                                                                    href="#"
                                                                    className="text-blue-500 underline mr-2 cursor-pointer"
                                                                    onClick={() => {
                                                                        console.log(`Métrica clickeada: ${metric}`); // Esto imprimirá la métrica clickeada
                                                                        handleOpenModal(metric);
                                                                    }}
                                                                >
                                                                    {metric}
                                                                </a>
                                                            ))}
                                                        </p>

                                                    </>
                                                );
                                            })() : (
                                                <p>No hay medidas relevantes disponibles</p>
                                            )}
                                        </div>

                                    </div>
                                ))
                        ) : (
                            <p>No hay issues disponibles</p>
                        )}

                    </Carousel>
                    {renderModal()}
                </div>

            </div>

            <div className="grid grid-cols-1 gap-6 w-start mt-6 mb-6">
                <button
                    onClick={() => navigate('/lista_proyectos')} // Navega a la ruta de lista de proyectos
                    className="px-4 py-2 bg-blue-950 text-white rounded hover:bg-blue-800 transition-all"
                    style={{ alignSelf: 'flex-start' }}
                >
                    Ir a Proyectos
                </button>

            </div>
        </div >
    );
};

export default SonarQube;
