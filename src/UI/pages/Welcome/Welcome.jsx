// This file is for demonstration purposes, so feel free to delete it once everyone understands the repo
import * as React from "react";
const { useState } = React;
import "./Welcome.scss";
import TodoList from "../../components/TodoList/TodoList";

const initialTodos = [
  { isComplete: true, description: "Download the repo" },
  { isComplete: true, description: "Spin up a development server" },
  { isComplete: false, description: "Explore the project file structure" },
  {
    isComplete: false,
    description: "Find and solve an issue on GitHub",
  },
  { isComplete: false, description: "Make your first pull request" },
  { isComplete: false, description: "Build the Argo Editor!" },
];

export default function Welcome() {
  const [todos, setTodos] = useState(initialTodos);

  function toggleCompleted(index) {
    const todo = { ...todos[index] };
    todo.isComplete = !todo.isComplete;
    setTodos([...todos.slice(0, index), todo, ...todos.slice(index + 1)]);
  }

  return (
    <div className="Welcome">
      <h1>Welcome</h1>
      <hr />
      <p className="intro-text">
        Hey there, welcome to the Argo Editor! Well actually, a todo list for
        building the editor. But since you are here, it won't be a todo list for
        long! If you have any questions about the project structure, check out
        the GitHub or ask a friend. Review the items below to move forward.
      </p>
      <TodoList todos={todos} onToggle={toggleCompleted} />
    </div>
  );
}
