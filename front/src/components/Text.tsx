import React from "react";
import { useState } from "react";
import TextH2 from "./TextH2";

const Text: React.FC = () => {
    const [show, setShow] = useState<boolean>(true);

    function handleShow(): void {
        setShow(!show);
    }

    return (
        <div>
            <button onClick={handleShow}>{show ? "Ocultar" : "Mostrar"}</button>
            {show && <TextH2 />}
        </div>
    );
};

export default Text;
