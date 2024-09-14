import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
  isLogin: boolean;
  allowedRoles: string[]; 
  userRoles: string[]; 
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, isLogin, allowedRoles, userRoles }) => {
 
  const hasAccess = allowedRoles.some(role => userRoles.includes(role));

  
  if (!isLogin || !hasAccess) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
