import { useState } from "react";
import "../styles/tasklist.scss";
import { FiTrash, FiCheckSquare } from "react-icons/fi";
import { nanoid } from "nanoid";

interface Task {
  id: number | string;
  title: string;
  isComplete: boolean;
}

interface Error {
  [key: string]: string;
}

export function TaskList() {
  console.log("componente renderizou");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [error, setError] = useState<Error | null>(null);

  function removeError(type: string) {
    if (error) {
      let newError = {};
      for (const [key, value] of Object.entries(error)) {
        console.log(`${key}: ${value}`);
        if (key != type) {
          newError = { ...newError, [key]: value };
        }
      }

      setError(newError);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNewTaskTitle(e.target.value);
    removeError("newTask");
  }

  function handleCreateNewTask() {
    // Crie uma nova task com um id random, não permita criar caso o título seja vazio.
    if (!newTaskTitle) {
      setError((err) =>
        err
          ? { ...err, newTask: "Preencha o nome da tarefa" }
          : { newTask: "Preencha o nome da tarefa" }
      );
      return;
    }

    const id = nanoid();
    setTasks((tasks) => [
      ...tasks,
      { id, title: newTaskTitle, isComplete: false },
    ]);
  }

  function handleToggleTaskCompletion(id: number | string) {
    // Altere entre `true` ou `false` o campo `isComplete` de uma task com dado ID
    setTasks((tasks) =>
      tasks.map((task) =>
        task.id == id ? { ...task, isComplete: !task.isComplete } : task
      )
    );
  }

  function handleRemoveTask(id: number | string) {
    // Remova uma task da listagem pelo ID
    setTasks((tasks) => tasks.filter((task) => task.id != id));
  }

  return (
    <section className="task-list container">
      <header>
        <h2>Minhas tasks</h2>

        <div className="input-group">
          <div>
            <input
              type="text"
              placeholder="Adicionar novo todo"
              onChange={handleChange}
              value={newTaskTitle}
              className={error?.newTaks && "input-error"}
            />
            {error?.newTask && (
              <p className="error-message">{error?.newTask}</p>
            )}
          </div>

          <button
            type="submit"
            data-testid="add-task-button"
            onClick={handleCreateNewTask}
          >
            <FiCheckSquare size={16} color="#fff" />
          </button>
        </div>
      </header>

      <main>
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <div
                className={task.isComplete ? "completed" : ""}
                data-testid="task"
              >
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    readOnly
                    checked={task.isComplete}
                    onClick={() => handleToggleTaskCompletion(task.id)}
                  />
                  <span className="checkmark"></span>
                </label>
                <p>{task.title}</p>
              </div>

              <button
                type="button"
                data-testid="remove-task-button"
                onClick={() => handleRemoveTask(task.id)}
              >
                <FiTrash size={16} />
              </button>
            </li>
          ))}
        </ul>
      </main>
    </section>
  );
}
