
import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: JSX.Element;
  requiredTipo?: 'admin'; 
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredTipo }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const parsedUser = JSON.parse(user);

  if (requiredTipo && parsedUser.tipoUsuario !== requiredTipo) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;