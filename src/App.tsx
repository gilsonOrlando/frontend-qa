/*import Protect from "./components/Protect"
import Public from "./components/Public"
import useAuth from "./hooks/useAuth"

function App() {
  const isLogin = useAuth();
  return isLogin ? <Protect /> : <Public />;
}

export default App
*/


import React from 'react';
import { Routes, Route } from "react-router-dom";
import PautaForm from './components/PautaForm';
import PautaList from './components/PautaList';
import ListaVerificacionForm from './components/ListaVerificacionForm';
import ListaVerificacionList from './components/ListaVerificacionList';
import MetricaForm from './components/MetricaForm';
import MetricaList from './components/MetricaList';
import SubcaracteristicaForm from './components/SubcaracteristicaForm';
import SubcaracteristicaList from './components/SubcaracteristicaList';
import ProyectoForm from './components/ProyectoForm';
import ProyectoList from './components/ProyectoList';
import Pruebas from './components/Pruebas';
import SubcategoriesResponses from './components/SubcategoriesResponses';
import SubcategoryResponse from './components/SubcategoryResponse';
import MetricsResponse from './components/MetricasResponses';
import MetricaResponse from './components/MetricaReponse';
import ProjectResponses from './components/ProjectResponses';
import Calculos from './components/Calculos';
import Navbar from './components/Navbar';
import Home from './components/Home';

const App: React.FC = () => {
    return (
        <div className="App">
            <Navbar/>
            <Routes>
                <Route
                    path='/'
                    element={
                        <Home/>
                    }
                />
                <Route
                    path='/crear_pauta'
                    element={
                        <PautaForm />
                    }
                />
                <Route
                    path='lista_pauta'
                    element={
                        <PautaList />
                    }
                />
                <Route
                    path="/editar_pauta/:id"
                    element={
                        <PautaForm />
                    }
                />
                <Route
                    path="/lista_verificacion"
                    element={
                        <ListaVerificacionList />
                    }
                />
                <Route
                    path="/crear_listaVerificacion"
                    element={
                        <ListaVerificacionForm />
                    }
                />
                <Route
                    path="/editar_listaVerificacion/:id"
                    element={
                        <ListaVerificacionForm />
                    }
                />
                <Route
                    path="/lista_metrica"
                    element={
                        <MetricaList />
                    }
                />
                <Route
                    path="/crear_metrica"
                    element={
                        <MetricaForm />
                    }
                />
                <Route
                    path="/editar_metrica/:id"
                    element={
                        <MetricaForm />
                    }
                />
                <Route
                    path="/lista_subcaracteristicas"
                    element={
                        <SubcaracteristicaList />
                    }
                />
                <Route
                    path="/crear_subcaracteristica"
                    element={
                        <SubcaracteristicaForm />
                    }
                />
                <Route
                    path="/editar_subcaracteristica/:id"
                    element={
                        <SubcaracteristicaForm />
                    }
                />
                <Route path="/lista_proyectos"
                    element={
                        <ProyectoList />
                    }
                />
                <Route
                    path="/crear_proyecto"
                    element={
                        <ProyectoForm />
                    }
                />
                <Route
                    path="/editar_proyecto/:id"
                    element={
                        <ProyectoForm />
                    }
                />
                <Route
                    path="/pruebas/:id"
                    element={
                        <Pruebas />
                    }
                />
                <Route
                    path="/subcategoriesresponses/:id"
                    element={
                        <SubcategoriesResponses />
                    }
                />
                <Route
                    path="/subcategoryresponse/:id/:id2"
                    element={
                        <SubcategoryResponse />
                    }
                />
                <Route
                    path="/metricsresponse/:id"
                    element={
                        <MetricsResponse />
                    }
                />
                <Route
                    path="/metricaresponse/:id/:id2"
                    element={
                        <MetricaResponse />
                    }
                />
                <Route 
                    path="/projectresponses/:id" 
                    element={
                        <ProjectResponses 
                        />
                    } 
                />
                 <Route 
                    path="/calculos/:id" 
                    element={
                        <Calculos 
                        />
                    } 
                />
            </Routes>

        </div>
    );
};

export default App;
