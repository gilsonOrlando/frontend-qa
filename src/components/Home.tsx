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
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">Code Testing</h1>
                            <p className="text-lg text-gray-700 mb-6">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque non mollis lacus.
                            </p>
                            <p className="text-lg text-gray-700 mb-6">
                                Cras in placerat felis. Duis nec metus vitae nunc varius nec velit sed, suscipit nisi.
                            </p>
                            <Link to="/lista_proyectos" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition duration-300">
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
