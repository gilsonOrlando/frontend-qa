
import React from 'react';
import { Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './components/Home';
import useAuth from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';

// Importa tus componentes
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
import SelectSubcaracteristicas from './components/SelectSubcaracteristicas';
import SelectMetricas from './components/SelectMetricas';
import SonarQube from './components/SonarQube';
import SonarQubeInstructions from './components/SonarQubeInstructions';

const App: React.FC = () => {
  const { isLogin, userId, roles, logout } = useAuth();

  return (
    <div className="App">
      <Navbar isLogin={isLogin} onLogout={logout} />
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Rutas para estudiantes */}
        <Route 
          path="/crear_proyecto"
          element={
            <ProtectedRoute isLogin={isLogin} allowedRoles={['estudiante','admin']} userRoles={roles}>
              <ProyectoForm idpersona={userId || ''} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editar_proyecto/:id"
          element={
            <ProtectedRoute isLogin={isLogin} allowedRoles={['estudiante','admin']} userRoles={roles}>
              <ProyectoForm idpersona={userId || ''} />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/lista_proyectos"
          element={
            <ProtectedRoute isLogin={isLogin} allowedRoles={['estudiante','admin']} userRoles={roles}>
              <ProyectoList idpersona={userId || ''} />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/pruebas/:id"
          element={
            <ProtectedRoute isLogin={isLogin} allowedRoles={['estudiante','admin']} userRoles={roles}>
              <Pruebas />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/subcategoriesresponses/:id"
          element={
            <ProtectedRoute isLogin={isLogin} allowedRoles={['estudiante','admin']} userRoles={roles}>
              <SubcategoriesResponses />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/subcategoryresponse/:id/:id2/:id3"
          element={
            <ProtectedRoute isLogin={isLogin} allowedRoles={['estudiante','admin']} userRoles={roles}>
              <SubcategoryResponse />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/metricsresponse/:id"
          element={
            <ProtectedRoute isLogin={isLogin} allowedRoles={['estudiante','admin']} userRoles={roles}>
              <MetricsResponse />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/metricaresponse/:id/:id2/:id3"
          element={
            <ProtectedRoute isLogin={isLogin} allowedRoles={['estudiante','admin']} userRoles={roles}>
              <MetricaResponse />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/projectresponses/:id"
          element={
            <ProtectedRoute isLogin={isLogin} allowedRoles={['estudiante','admin']} userRoles={roles}>
              <ProjectResponses />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/calculos/:id"
          element={
            <ProtectedRoute isLogin={isLogin} allowedRoles={['estudiante','admin']} userRoles={roles}>
              <Calculos />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/select-subcaracteristicas/:id/:id2"
          element={
            <ProtectedRoute isLogin={isLogin} allowedRoles={['estudiante','admin']} userRoles={roles}>
              <SelectSubcaracteristicas />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/select-metricas/:id/:id2"
          element={
            <ProtectedRoute isLogin={isLogin} allowedRoles={['estudiante','admin']} userRoles={roles}>
              <SelectMetricas />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/sonarqube/:id"
          element={
            <ProtectedRoute isLogin={isLogin} allowedRoles={['estudiante','admin']} userRoles={roles}>
              <SonarQube />
            </ProtectedRoute>
          }
        />
         <Route 
          path="/sonarqube/instructions/:id"
          element={
            <ProtectedRoute isLogin={isLogin} allowedRoles={['estudiante','admin']} userRoles={roles}>
              <SonarQubeInstructions />
            </ProtectedRoute>
          }
        />

        {/* Rutas para admin y estudiantes */}
        <Route 
          path="/crear_pauta"
          element={
            <ProtectedRoute isLogin={isLogin} allowedRoles={['admin']} userRoles={roles}>
              <PautaForm />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/lista_pauta"
          element={
            <ProtectedRoute isLogin={isLogin} allowedRoles={['admin']} userRoles={roles}>
              <PautaList />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/crear_listaVerificacion"
          element={
            <ProtectedRoute isLogin={isLogin} allowedRoles={['admin']} userRoles={roles}>
              <ListaVerificacionForm />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/lista_verificacion"
          element={
            <ProtectedRoute isLogin={isLogin} allowedRoles={['admin']} userRoles={roles}>
              <ListaVerificacionList />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/crear_metrica"
          element={
            <ProtectedRoute isLogin={isLogin} allowedRoles={['admin']} userRoles={roles}>
              <MetricaForm />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/lista_metrica"
          element={
            <ProtectedRoute isLogin={isLogin} allowedRoles={['admin']} userRoles={roles}>
              <MetricaList />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/crear_subcaracteristica"
          element={
            <ProtectedRoute isLogin={isLogin} allowedRoles={['admin']} userRoles={roles}>
              <SubcaracteristicaForm />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/lista_subcaracteristicas"
          element={
            <ProtectedRoute isLogin={isLogin} allowedRoles={['admin']} userRoles={roles}>
              <SubcaracteristicaList />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
