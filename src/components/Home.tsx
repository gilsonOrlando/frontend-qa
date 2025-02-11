import { Link } from 'react-router-dom';
import Institution1 from '../assets/logounl.png';
import Institution2 from '../assets/logo_sistemas.jpg';
import Institution3 from '../assets/sd2.png';
import principal from '../assets/Designerpng.png'

const Home = () => {
    return (
        <div className="min-h-screen bg-blue-100 flex flex-col">
            {/* Hero Section */}
            <section className="flex-grow flex items-center justify-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Left Content */}
                        <div className="flex flex-col justify-center">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">QualityCCode</h1>
                            <p className="text-lg text-gray-700 mb-6">
                                El propósito de la aplicación web es verificar la mantenibilidad del software, conforme a la norma ISO/IEC 25000.
                            </p>
                            <p className="text-lg text-gray-700 mb-6">
                                Usted puede registrar su proyecto de desarrollo de software (Aplicación web JS o Python) y aplicar pruebas mediante lista de verificación y calcular el grado de mantenibilidad mediante análisis de código estático utilizando SonarQube.
                            </p>
                            <Link
                                to="/lista_proyectos"
                                className="self-start bg-blue-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition duration-300"
                                style={{ maxWidth: '200px', textAlign: 'center' }}
                            >
                                Proyectos
                            </Link>
                        </div>
                        {/* Right Content - Illustration */}
                        <div className="relative">
                            <img src={principal} alt="Code Testing Illustration" className="w-full h-auto" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Section with Logos */}
            <footer className="bg-white py-8 shadow-inner">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-around items-center">
                        <a href="https://www.unl.edu.ec/" target="_blank" rel="noopener noreferrer">
                            <img src={Institution1} alt="Institution 1" className="h-16 cursor-pointer" />
                        </a>
                        <a href="https://computacion.unl.edu.ec/" target="_blank" rel="noopener noreferrer">
                            <img src={Institution2} alt="Institution 2" className="h-16 cursor-pointer" />
                        </a>
                        <a href="" rel="noopener noreferrer">
                            <img src={Institution3} alt="Institution 3" className="h-16 cursor-pointer" />
                        </a>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default Home;
