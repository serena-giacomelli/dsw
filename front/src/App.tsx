import React from 'react';
import { Route, Routes, useLocation } from "react-router-dom";
import Header from './components/header';

import Home from './components/home.tsx';
import Usuariocontainer from './components/Usuario/Usuariocontainer';
import Productocontainer from './components/Producto/Productocontainer';
import TipoProductocontainer from './components/TipoProducto/tipoProductocontainer';
import EmpresaContainer from './components/Empresa/empresacontainer.tsx';
import Login from './components/login.tsx';
import Banner from './components/banner.tsx';

import './styles/App.css';

const App: React.FC = () => {
    const location = useLocation();

    return (
    <>
         <Header />
         <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productocontainer />} />
          <Route path="/usuarios" element={<Usuariocontainer />} />
          <Route path="/tipoproductos" element={<TipoProductocontainer />} />
          <Route path="/empresas" element={<EmpresaContainer />} />
          <Route path= "/login" element={<Login/>}/>
         </Routes>
         <Banner />
     </>
    );
};

export default App;


