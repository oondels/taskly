import React, { useState } from "react";

const TaskList = () => {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  const changeText = (e) => {
    setText(e.target.value);
  };

  const increment = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <h1>Lista de Tarefas</h1>
      <h3>Seu nome é: {text}</h3>
      <input type="text" value={text} onChange={changeText} />

      <p>Contagem: {count}</p>
      <button onClick={increment}>Click</button>
    </div>
  );
};

export default TaskList;
