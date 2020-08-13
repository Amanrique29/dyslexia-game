import React, { useState, useEffect } from 'react';

function Login(props) {
    let [form, setForm] = useState(<>
        <input type="text" id="email" placeholder="email" />
        <input type="password" id="password" placeholder="password" />
        <button onClick={user}>Iniciar Sesión</button>
    </>)
    function user() {
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        let object = {
            email: email,
            password: password
        }
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(object)
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            console.log(data);
            if (data.mensaje === "denegado") {
                setForm("Necesitas registrarte primero.");
            } else {
                setForm("Sesión iniciada correctamente.");
                props.saludo(`Hola ${data.user.name}`);
            }

            

        })
    }
    return (
        <>
            {form}
        </>
    )
}


export default Login;