import React, { useState } from "react";

const TaskList = () => {
  return (
    <div>
      <h1>Lista de Tarefas</h1>
      <h3>Olá User</h3>
      <div className="task-actions">
        <button>Adicionar Tarefa</button>
      </div>

      <div className="tasks">
        <h3>Lista de Tarefas</h3>
      </div>
    </div>
  );
};

export default TaskList;
