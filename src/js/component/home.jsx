import React, { useState, useEffect } from "react";

const Home = () => {
  const [tarea, setTarea] = useState("");
  const [lista, setLista] = useState([]);
  const userName = "kevinvillafuerte"; 

  const crearUsuario = async () => {
    try {
      const response = await fetch(`https://assets.breatheco.de/apis/fake/todos/users/${userName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([])
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error creando usuario:', error);
    }
  };

  const obtenerLista = async () => {
    try {
      const response = await fetch(`https://assets.breatheco.de/apis/fake/todos/todos/${userName}`, {
        method: 'GET'
      });
      const data = await response.json();
      setLista(data);
    } catch (error) {
      console.error('Error obteniendo lista:', error);
    }
  };

  const borrarLista = async () => {
    try {
      const response = await fetch(`https://assets.breatheco.de/apis/fake/todos/users/${userName}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      console.log(data.result);
      if (data.result === "ok") {
        setLista([]);
      }
    } catch (error) {
      console.error('Error borrando lista:', error);
    }
  };

  const actualizar = async () => {
    try {
      for (const item of lista) {
        const response = await fetch(`https://assets.breatheco.de/apis/fake/todos/todos/${item.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(item)
        });
        const data = await response.json();
        console.log(data);
      }
    } catch (error) {
      console.error('Error actualizando lista:', error);
    }
  };

  useEffect(() => {
    crearUsuario();
    obtenerLista();
  }, []);

  useEffect(() => {
    if (lista.length) {
      actualizar();
    }
  }, [lista]);

  const agregarTarea = (e) => {
    e.preventDefault();
    setLista((prevLista) => [...prevLista, { label: tarea, done: false }]);
    setTarea("");
  };

  const borrarTarea = (indexItem) => {
    setLista((prevState) => prevState.filter((_, index) => index !== indexItem));
  };

  return (
    <>
      <div className="card container d-flex bg-light mt-3 md-w50">
        <h2 className="titulo m-auto p-2">TODO LIST</h2>
        <div className="card-body">
          <input
            type="text"
            className="input m-1 w-75"
            value={tarea}
            id="exampleInput"
            aria-describedby="inputHelp"
            onChange={(e) => setTarea(e.target.value)}
			placeholder="Ingresa algo"
          />
          <button type="submit" className="btn btn-primary btn-sm" onClick={agregarTarea}>
            Agregar
          </button>
        </div>
        <div className="to-do-list d-flex">
          <ul>
            {lista.map((item, index) => (
              <li key={index}>
                {item.label}
                <button className="btn" onClick={() => borrarTarea(index)}>
                  <i className="fas fa-trash-alt" />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="delete-lista d-flex justify-content-center mt-3 md-w50 mb-2">
          <button type="submit" className="btn btn-danger btn-sm" onClick={borrarLista}>
            Delete list
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
