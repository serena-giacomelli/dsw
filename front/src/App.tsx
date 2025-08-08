import React from 'react';
import { Route, Routes, useLocation } from "react-router-dom";
import Header from './components/header';

import Home from './components/home.tsx';
import Usuariocontainer from './components/Usuario/Usuariocontainer';
import Productocontainer from './components/Producto/Productocontainer';
import TipoProductocontainer from './components/TipoProducto/tipoProductocontainer';
import EmpresaContainer from './components/Empresa/empresacontainer.tsx';
import Login from './Login.tsx';
import Banner from './components/banner.tsx';
import Perfil from './components/Perfil.tsx';
import Breadcrumb from './components/Breadcrumb.tsx';
import './styles/App.css';
import PrivateRoute from './PrivateRoute.tsx';
import TipoProductoUser from './components/TipoProducto/TipoProductoUser.tsx';
import ProductoListContainerUser from './components/Producto/ProductoUser.tsx';
import Carrito from './components/Carrito.tsx';
import FinalizarPedido from './components/finalizarPedido.tsx';
import MisPedidos from './components/Usuario/MisPedidos.tsx';
import AdminPedidos from './components/Admin/AdminPedidos.tsx';
import TestCheckout from './components/TestCheckout.tsx';

const App: React.FC = () => {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    
    return (
    <>
         <Header />
         <Breadcrumb />
         <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          
          {/* Ruta específica DEBE ir antes que la ruta general */}
          <Route path="/productos/tipo/:id" element={<ProductoListContainerUser />} />
          
          <Route path="/productos" element={ user?.tipoUsuario === "admin" ? (
            <PrivateRoute requiredTipo="admin">
                <Productocontainer />
            </PrivateRoute> ) : (
            <ProductoListContainerUser />
            )} />
          <Route path="/usuarios" element={
            <PrivateRoute requiredTipo="admin">
                <Usuariocontainer />
            </PrivateRoute>} />
          <Route path="/tipoproductos" element={user?.tipoUsuario === "admin" ? (
          <PrivateRoute requiredTipo="admin">
            <TipoProductocontainer />
          </PrivateRoute>
            ) : (
            <TipoProductoUser />
            )}/>
          <Route path="/empresas" element={
            <PrivateRoute requiredTipo="admin">
                <EmpresaContainer />
            </PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/finalizar-pedido" element={<FinalizarPedido />} />
          <Route path="/mis-pedidos" element={<MisPedidos />} />
          <Route path="/admin/pedidos" element={
            <PrivateRoute requiredTipo="admin">
                <AdminPedidos />
            </PrivateRoute>} />
          <Route path="/admin/gestion" element={
            <PrivateRoute requiredTipo="admin">
                <AdminPedidos />
            </PrivateRoute>} />
          <Route path="/test-checkout" element={<TestCheckout />} />
         </Routes>
         <Banner />
     </>
    );
};

export default App;


