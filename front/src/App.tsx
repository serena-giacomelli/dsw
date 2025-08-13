import React from 'react';
import { Route, Routes, useLocation } from "react-router-dom";
import Header from './components/Estructura/header.tsx';

import Home from './components/Estructura/home.tsx';
import Usuariocontainer from './components/Usuario/usuariocontainer.tsx';
import Productocontainer from './components/Producto/productocontainer.tsx';
import TipoProductocontainer from './components/TipoProducto/tipoProductocontainer.tsx';
import EmpresaContainer from './components/Empresa/empresacontainer.tsx';
import Login from './login.tsx';
import Banner from './components/Estructura/banner.tsx';
import Perfil from './components/Logica/perfil.tsx';
import Breadcrumb from './components/Estructura/breadcrumb.tsx';
import './styles/App.css';
import PrivateRoute from './privateRoute.tsx';
import TipoProductoUser from './components/TipoProducto/tipoProductoUser.tsx';
import ProductoListContainerUser from './components/Producto/productoUser.tsx';
import Carrito from './components/CU/carrito.tsx';
import FinalizarPedido from './components/CU/finalizarPedido.tsx';
import MisPedidos from './components/Usuario/misPedidos.tsx';
import AdminPedidos from './components/Admin/adminPedidos.tsx';
import TestCheckout from './components/Logica/testCheckout.tsx';
import ProductDetail from './components/Producto/productDetail.tsx';
import Register from './components/Logica/register.tsx';
import EmailVerification from './components/Logica/emailVerification.tsx';
import Footer from "./components/Estructura/footer";
import EmpresaDetail from "./components/Empresa/empresaDetail.tsx";
import EmpresaContainerUser from './components/Empresa/empresacontainerUser.tsx';


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
            user?.tipoUsuario === "admin" ? (
              <PrivateRoute requiredTipo="admin">
                <EmpresaContainer />
              </PrivateRoute>
            ) : (
              <EmpresaContainerUser />
            )
          } />
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
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email/:token" element={<EmailVerification />} />
          <Route path="/empresa/:id" element={<EmpresaDetail />} />
         </Routes>
         <Banner />
         <Footer />
     </>
    );
};

export default App;


