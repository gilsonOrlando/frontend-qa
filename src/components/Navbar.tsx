import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/sd2.png';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-white shadow-md w-full z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link to="/lista_proyectos">
              <img src={Logo} alt="Logo" className="h-14 w-auto" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link
              to="/lista_pauta"
              className="relative text-gray-800 hover:text-blue-600 px-3 py-2 text-sm font-medium group"
            >
              Pautas
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/lista_verificacion"
              className="relative text-gray-800 hover:text-blue-600 px-3 py-2 text-sm font-medium group"
            >
              Listas de verificación
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/lista_metrica"
              className="relative text-gray-800 hover:text-blue-600 px-3 py-2 text-sm font-medium group"
            >
              Métricas
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/lista_subcaracteristicas"
              className="relative text-gray-800 hover:text-blue-600 px-3 py-2 text-sm font-medium group"
            >
              Subcaracterísticas
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`h-6 w-6 ${isOpen ? 'hidden' : 'block'}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
              <svg
                className={`h-6 w-6 ${isOpen ? 'block' : 'hidden'}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`${isOpen ? 'block' : 'hidden'} md:hidden`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/lista_pauta"
            className="text-gray-800 hover:bg-blue-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Pautas
          </Link>
          <Link
            to="/lista_verificacion"
            className="text-gray-800 hover:bg-blue-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Listas de verificación
          </Link>
          <Link
            to="/lista_metrica"
            className="text-gray-800 hover:bg-blue-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Métricas
          </Link>
          <Link
            to="/lista_subcaracteristicas"
            className="text-gray-800 hover:bg-blue-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Subcaracterísticas
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
