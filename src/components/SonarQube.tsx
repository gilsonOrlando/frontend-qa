import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

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

    // Suponemos que ya tienes un Bearer Token guardado
    const bearerToken = 'sqp_2fc1c2295088a0be80cf527b6ef95fa8dc583759';

    useEffect(() => {
        const fetchProyecto = async () => {
            if (id) {
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
    }, [id, branch, bearerToken]);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await fetch('/apiv1/metrics/search', {
                   
                    headers: {
                        Authorization: `Bearer ${bearerToken}`  // Añadir el Bearer Token aquí
                    }
                });
                console.log(response)
                const data = await response.json();
                console.log(data)
                const keys = data.map((metric: Metric) => metric.key);
                setMetricKeys(keys);

                if (projectKey) {
                    const metricsString = keys.join(',');
                    const measuresResponse = await fetch(`/apiv1/measures/component?component=${projectKey}&metricKeys=${metricsString}`, {
                       
                        headers: {
                            Authorization: `Bearer ${bearerToken}`  // Añadir el Bearer Token aquí
                        }
                    });
                    const measuresData = await measuresResponse.json();

                    const measuresMap = new Map<string, string>();
                    measuresData.component.measures.forEach((measure: Measure) => {
                        measuresMap.set(measure.metric, measure.value);
                    });
                    setMeasures(measuresMap);
                }
            } catch (error) {
                console.error('Error al obtener métricas o medidas:', error);
            }
        };

        if (projectKey) {
            fetchMetrics();
        }
    }, [projectKey, bearerToken]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="max-w-2xl w-full bg-white p-8 shadow-md rounded-lg">
                <h1 className="text-2xl font-bold text-blue-950 mb-6">
                    {projectKey}
                </h1>
                <ul>
                    {metricKeys.map((metricKey) => (
                        <li key={metricKey}>
                            <strong>{metricKey}:</strong> {measures.get(metricKey) || 'No data'}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SonarQube;
