import React, { useEffect, useState } from "react";

export const Home = () => {
  const [inputValue, setInputValue] = useState("");
  const [tasks, setTasks] = useState([]);
  const username = "kevinvillafuerte";

  //funcion para manejar la respuesta de la API
  const handleResponse = async (response, action) => {
    if (!response.ok) {
      throw new Error(`Error al ${action}`);
    }
    return response.json();
  };

  // Crear un nuevo usuario
  const createUser = async () => {
    try {
      await fetch("https://playground.4geeks.com/todo/users", {
        method: "POST",
        body: JSON.stringify({ username }),
        headers: { "Content-Type": "application/json" },
      });
      sincronizar();
    } catch (error) {
      console.error("Error al crear usuario:", error);
    }
  };

  // Sincronizar tareas
  const sincronizar = async () => {
    try {
      const response = await fetch(`https://playground.4geeks.com/todo/users/${username}`);
      const data = await handleResponse(response, "sincronizar tareas");
      setTasks(data.todos);
    } catch (error) {
      console.error("Error en sincronizar tareas:", error);
    }
  };

  //Reactualizar 
  const getUserAgain = async () => {
    try {
      await fetch(`https://playground.4geeks.com/todo/users/${username}`, {
        method: "POST",
        body: JSON.stringify([]),
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error en reiniciar usuario:", error);
    }
  };

  // Agregar tarea
  const addTask = async (todo) => {
    try {
      const response = await fetch(`https://playground.4geeks.com/todo/todos/${username}`, {
        method: "POST",
        body: JSON.stringify(todo),
        headers: { "Content-Type": "application/json" },
      });
      const data = await handleResponse(response, "agregar tarea");
      setTasks((prevTasks) => [...prevTasks, data]);
    } catch (error) {
      console.error("Error al agregar tarea:", error);
    }
  };

  // Eliminar tarea
  const eliminarTask = async (id) => {
    try {
      await fetch(`https://playground.4geeks.com/todo/todos/${username}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };

  // Limpiar todas las tareas
  const clearTasks = async () => {
    try {
      await fetch(`https://playground.4geeks.com/todo/users/${username}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      setTasks([]);
      getUserAgain();
    } catch (error) {
      console.error("Error al limpiar tareas:", error);
    }
  };

  useEffect(() => {
    createUser();
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && inputValue.trim()) {
      const newTask = { label: inputValue, is_done: false };
      setInputValue("");
      addTask(newTask);
    } else if (event.key === "Enter") {
      alert("Ingrese algo");
    }
  };

  const handleDeleteAll = () => {
    if (window.confirm("¿Estás seguro de eliminar todas las task?")) {
      clearTasks();
    }
  };

  return (
    <React.Fragment>
      <h1>Todos</h1>
      <div className="container">
        <div className="list">
          <ul>
            <li>
              <input
                type="text"
                placeholder="Input Task"
                onChange={(event) => setInputValue(event.target.value)}
                value={inputValue}
                onKeyDown={handleKeyDown}
              />
            </li>
            {!tasks.length && (
              <li>
                <strong>No hay tareas, agrega una nueva</strong>
              </li>
            )}
            {tasks.map((task) => (
              <li key={task.id} className="containerLi">
                {task.label}
                <button
                  type="button"
                  onClick={() => {
                    setTasks((prevTasks) => prevTasks.filter((t) => t.id !== task.id));
                    eliminarTask(task.id);
                  }}
                >
                  X
                </button>
              </li>
            ))}
          </ul>
        </div>
        <p>{tasks.length + " item left"}</p>
      </div>
      <div className="stick"></div>
      <div className="stick2"></div>
      <button
        className="buttonDeleteAll btn btn-danger"
        type="button"
        onClick={handleDeleteAll}
      >
        Delete All Task
      </button>
    </React.Fragment>
  );
};

export default Home;
