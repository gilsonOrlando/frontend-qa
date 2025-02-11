import React from 'react';
import portada from '../assets/sd.png';
const Informacion: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-lg w-full bg-white p-8 shadow-md rounded-lg">
                <h1 className="text-2xl font-bold text-blue-950 mb-6 text-center">
                    INFORMACIÓN DEL PROYECTO
                </h1>
                <img
                    src={portada}
                    alt="Control de Calidad"
                    className="mx-auto mb-6 rounded-lg shadow-md object-cover"
                    style={{
                        width: '100%', // La imagen ocupará todo el ancho del contenedor
                        height: '200px', // Ajusta la altura de la imagen al tamaño que desees
                    }}
                />



                <div className="text-justify mb-6">
                    Evaluación de mantenibilidad para aplicaciones web en producción de los laboratorios de la carrera de computación de la UNL
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Autor del Proyecto:</label>
                    <p className="text-gray-600">Gilson Orlando Quezada Guartizaca</p>
                    <a
                        href="https://orcid.org/0009-0009-4396-7792"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                    >
                        https://orcid.org/0009-0009-4396-7792
                    </a>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Director:</label>
                    <p className="text-gray-600">Ing. Francisco Javier Álvarez Pineda Mg. Sc.</p>
                    <a
                        href="https://orcid.org/0000-0002-5470-6047"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                    >
                        https://orcid.org/0000-0002-5470-6047
                    </a>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Nombre del Software:</label>
                    <p className="text-gray-600">QualityCCode</p>
                </div>
            </div>
        </div>
    );
};

export default Informacion;
