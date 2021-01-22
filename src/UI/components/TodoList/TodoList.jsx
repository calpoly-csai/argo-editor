// This file is for demonstration purposes, so feel free to delete it once everyone understands the repo
import * as React from "react";
import "./TodoList.scss";
import { CheckCircle, Circle } from "react-feather";

export default function TodoList({ todos, onToggle }) {
  return (
    <div className="TodoList">
      <ul>
        {todos.map((todo, i) => (
          <Todo {...todo} onToggle={() => onToggle(i)} key={i} />
        ))}
      </ul>
    </div>
  );
}

function Todo({ isComplete, description, onToggle }) {
  return (
    <li className="Todo" onClick={onToggle}>
      <p className="status-icon">
        {isComplete ? <CheckCircle color="green" /> : <Circle />}
      </p>
      <p className="description">{description}</p>
    </li>
  );
}
