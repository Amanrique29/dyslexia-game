import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Link, useParams } from 'react-router-dom';
import './App.css';
import Registro from './register';
import Login from './login';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import { Container, Row, Col } from 'react-bootstrap';

function App() {
  let [palabra, setPalabra] = useState([]);
  let [juego, setJuego] = useState('');
  let [x, setX] = useState(false);
  let [y, setY] = useState(false);
  let [numero, setNumero] = useState(0);
  let [largo, setLargo] = useState(0);
  let [aciertos, setAciertos] = useState(0);
  let [fallos, setFallos] = useState(0);
  let [p, setP] = useState('');
  let [saludo, setSaludo] = useState('');
  function nombre(nombre) {
    setSaludo(nombre);
  }

  useEffect(function () {
    fetch('/juegouno').then(function (response) {
      return response.json();
    }).then(function (data) {
      setLargo(data.length - 1);
      setP(data[numero].respuestaCorrecta);
      setPalabra(data[numero].pregunta);
      setJuego(data[numero].respuestas.map(function (letra, indice) {
        if (letra === data[numero].respuestaCorrecta) {
          return (
            <h2 id={`respuesta-${indice}`} className="botonBusq" draggable="true" onDragStart={drag}>{letra}</h2>
          );
        } else {
          return (
            <h2 id={`respuesta-${indice}`} className="botonBusq" draggable="true" onDragStart={drag}>{letra}</h2>
          );
        }
      }));
    })
  }, [numero]);
  function Continuar() {
    if (x === true && numero < largo) {

      setNumero(numero + 1);
      setX(false);
      setY(false);
      setAciertos(aciertos + 1);
    } else if (y === true && numero < largo) {
      setNumero(numero + 1);
      setX(false);
      setY(false);
      setFallos(fallos + 1);
    } else if (x === true && numero === largo) {
      setX(false);
      setY(false);
      setJuego(<p className="aviso">Test finalizado. Pincha en Continuar para reiniciar.</p>);
      setAciertos(aciertos + 1);
    } else if (y === true && numero === largo) {
      setX(false);
      setY(false);
      setFallos(fallos + 1);
      setJuego(<p className="aviso">Test finalizado. Pincha en Continuar para reiniciar.</p>);
    } else {
      reset();
    }
  };
  function Resultados() {
    return (
      <>
        <p className="aciertoFallo">Aciertos: {aciertos}</p>
        <p className="aciertoFallo">Fallos: {fallos}</p>
      </>
    );
  };
  function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.innerHTML);
  };
  function drop(ev) {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("text");
    console.log(data);
    let nuevaPalabra = [];
    for (let i = 0; i < palabra.length; i++) {
      if (palabra[i] === " ") {
        nuevaPalabra.push(data);
      } else {
        nuevaPalabra.push(palabra[i]);
      }
    }
    setPalabra(nuevaPalabra);
    if (p === data) {
      acierto();
    } else {
      error();
    }
  };
  function acierto() {
    setX(true);
    setJuego(<p className="aviso">¡Respuesta correcta!</p>);

  };
  function error() {
    setY(true);
    setJuego(<p className="aviso">Respuesta incorrecta.</p>);

  };
  function allowdrop(ev) {
    ev.preventDefault();
  };
  function reset() {
    setNumero(0);
    setAciertos(0);
    setFallos(0);
  }

  let palabraJSX = palabra.map(function
    (letras, indice) {
    if (letras === " ") {
      return (
        <h2 key={indice} onDrop={drop} onDragOver={allowdrop} className="botonBusq2">{letras}</h2>
      )
    }
    return (
      <h2 key={indice}>{letras}</h2>
    )
  })
  return (
    <BrowserRouter>
      <div className="cuerpo">
        <div className="index">
          <div className="title">
            <h1>DISLEXIAPP</h1>
          </div>
          <section className="barra">
            <h2 className="saludo">{saludo}</h2>
            <Link to="/">Inicio</Link>
            <Link to="/registrar">Regístrate</Link>
            <Link to="/login">Iniciar Sesión</Link>
            <Link to="/juego1">Completa la palabra</Link>
          </section>
        </div>
        <Route exact path="/">
        <div>
        <img className="niño" src="https://images.vexels.com/media/users/3/149895/isolated/preview/f6ede53c6ddc62d42e6f561ddd716d9c-kid-running-silhouette-by-vexels.png" alt=""/>
        </div>
        </Route>
        <Route path="/juego1">
          <div className="cajaJuego">
            <div className="alinear1">{palabraJSX}</div>
            <div className="alinear2">{juego}</div>
            <div className="alinear3">
              <div>
                <button onClick={Continuar}>Continuar</button>
              </div>
              <div>
                <Resultados />
              </div>
            </div>
          </div>
        </Route>
        <Route path="/registrar">
          <div className="registro">
            <Registro />
          </div>
        </Route>
        <Route path="/login">
          <div className="registro">
            <Login saludo={nombre} />
          </div>
        </Route>
      </div>
    </BrowserRouter>
  )
};
export default App;