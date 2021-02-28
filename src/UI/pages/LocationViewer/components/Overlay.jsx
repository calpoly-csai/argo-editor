import React from "react";
const { useState } = React;
import { X, ArrowLeft, Link } from "react-feather";

const views = {
  base: BaseView,
  actions: ActionsView,
  createLink: CreateLinkView,
};

export default function Overlay({ onDelete, x, y }) {
  const [viewName, setViewName] = useState("base");
  const CurrentView = views[viewName];
  const positionStyles = { left: x + "px", top: y + "px" };
  function navBack() {
    if (viewName === "base") onDelete();
    setViewName(viewName === "actions" ? "base" : "actions");
  }

  return (
    <section className="Overlay" style={positionStyles}>
      <nav>
        <button className="wrapper" onClick={navBack}>
          {viewName === "base" ? <X /> : <ArrowLeft />}
        </button>
      </nav>
      <CurrentView changeView={setViewName} />
    </section>
  );
}

function BaseView({ changeView }) {
  return (
    <div className="BaseView">
      <input type="text" placeholder="Title" />
      <input type="text" placeholder="Description" />

      <button onClick={() => changeView("actions")}>Add Actions</button>
    </div>
  );
}

function ActionsView({ changeView }) {
  const actions = [
    {
      symbol: Link,
      to: "createLink",
      name: "Link to Resource",
    },
  ];

  return (
    <div className="ActionsView">
      <h1>Actions</h1>
      <ul>
        {actions.map((action) => (
          <li className="action">
            <action.symbol />
            <a onClick={() => changeView(action.to)}>{action.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CreateLinkView({ changeView }) {
  return <div className="CreateLinkView"></div>;
}
