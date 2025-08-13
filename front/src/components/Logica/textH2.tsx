import React, { useState } from "react";

const TextH2: React.FC = () => {
    const [text, setText]=useState("");
    const handleText = (e) => {
        setText(e.target.value);


    }    
    return (
        <div>
        <input type="text" onChange={handleText}/>
        <h2>{text}</h2>
        </div>
    );
};

export default TextH2;
