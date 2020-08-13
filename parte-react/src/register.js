import React, { useState, useEffect } from 'react';


function Registro() {
    let [mensaje, setMensaje] = useState('');
    let mensajeJSX = null;

    function guardar() {

        let nombre = document.getElementById("nombre").value;
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        let object = {
            nombre: nombre,
            email: email,
            password: password
        }
        fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(object)
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            setMensaje("Te has registrado correctamente.");
            
        })
    }
    function volver(){
        setMensaje('');
    }
    if (mensaje !== '') {
        mensajeJSX = <><p>{mensaje}</p><button onClick={volver}>OK</button></>
    }
    
    return (
        <>
            <input type="text" id="nombre" placeholder="nombre" />
            <input type="text" id="email" placeholder="email" />
            <input type="password" id="password" placeholder="password" />
            <button onClick={guardar}>Regístrate</button>
            {mensajeJSX}
        </>
    )

}


export default Registro;