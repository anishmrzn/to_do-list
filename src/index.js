import { useEffect, useState } from "react";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function App() {
  const [items, setItems] = useState(() => {
    const localValue = localStorage.getItem("Items");
    if (localValue == null) return [];

    return JSON.parse(localValue);
  });
  const [editId, setEditId] = useState(null);
  const [editedItems, setEditedItems] = useState("");

  useEffect(() => {
    localStorage.setItem("Items", JSON.stringify(items));
  }, [items]);

  function handleAddItems(item) {
    setItems((items) => [...items, item]);
  }
  function handleDeleteItems(id) {
    setItems(items.filter((item) => item.id !== id));
  }
  function handleToggleItem(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  }
  function handleUpdate() {
    setItems((items) =>
      items.map((item) =>
        item.id === editId ? { ...item, description: editedItems } : item
      )
    );
    setEditId(null);
    setEditedItems("");
  }
  function handleEditItems(id) {
    const editedItem = items.find((items) => items.id === id);

    setEditId(id);
    setEditedItems(editedItem.description);
  }
  function clearAll() {
    setItems([]);
  }
  return (
    <div>
      <div className=" container md:max-w-[40rem] rounded-2xl">
        <Head />
        <hr className="line w-full"></hr>

        <Form onAddItems={handleAddItems} />

        <List
          items={items}
          onDeleteItem={handleDeleteItems}
          onToggleItem={handleToggleItem}
          onEditItem={handleEditItems}
          editId={editId}
          setEditId={setEditId}
          editedItems={editedItems}
          setEditedItems={setEditedItems}
          handleUpdate={handleUpdate}
          clearAll={clearAll}
        />
      </div>
    </div>
  );
}
function Head() {
  return (
    <div className="flex gap-5  items-center pr-16 ">
      <div className="text-black text-5xl">
        <ion-icon name="document-outline"></ion-icon>
      </div>
      <div className="text-black font-extrabold  text-sm md:text-3xl    ">
        To Do List
      </div>
    </div>
  );
}

function Form({ onAddItems }) {
  const [description, setDescription] = useState("");
  function handleSubmit(e) {
    e.preventDefault();
    if (!description) return;
    const newItem = { description, done: false, id: Date.now() };
    onAddItems(newItem);
    setDescription("");
  }

  return (
    <div className="flex gap-[1rem] md:gap-[5rem]">
      <form onSubmit={handleSubmit} className="felx gap-[1rem]">
        <input
          className="md:text-xl border border-slate-400 px-2 py-1 text-sm md:px-5 rounded-xl md:py-2 "
          type="text"
          placeholder="list.."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></input>
        <button className="text-sm md:text-xl font-bold text-white bg-[#fd7e14] hover:bg-[#f76707] transition duration-500  px-2 py-1 md:ml-5 md:px-10 md:py-2 rounded-xl">
          Add
        </button>
      </form>
    </div>
  );
}

function List({
  items,
  onDeleteItem,
  onToggleItem,
  onEditItem,
  editId,
  setEditId,
  editedItems,
  setEditedItems,
  handleUpdate,
  clearAll,
}) {
  return (
    <div className="h-20 flex flex-col gap-10 ">
      <ul className="flex flex-col gap-5">
        {items.map((items) => (
          <Items
            onToggleItem={onToggleItem}
            onDeleteItem={onDeleteItem}
            onEditItem={onEditItem}
            editId={editId}
            setEditId={setEditId}
            editedItems={editedItems}
            setEditedItems={setEditedItems}
            handleUpdate={handleUpdate}
            items={items}
            key={items.id}
          />
        ))}
      </ul>
      <button
        className=" text-sm md:text-xl w-[10rem] font-bold text-white bg-[#fd7e14] hover:bg-[#f76707] transition duration-500  px-1 py-1 md:ml-5 md:px-10 md:py-2 rounded-xl"
        onClick={clearAll}
      >
        Clear all
      </button>
    </div>
  );
}
function Items({
  items,
  onDeleteItem,
  onToggleItem,
  onEditItem,
  editId,
  setEditId,
  editedItems,
  setEditedItems,
  handleUpdate,
}) {
  console.log(items.description);

  return (
    <li className="w-full  border-b-blue-[500]  ">
      <div className="flex gap-[5rem] md:gap-[15rem] justify-between">
        <div className="flex gap-5">
          <input
            type="checkbox"
            value={items.done}
            onChange={() => onToggleItem(items.id)}
          ></input>
          {editId === items.id ? (
            <input
              className="text-sm w-[5rem] md:w-[10rem] md:text-xl text-black border border-[#fff0f6] bg-[#ffdeeb]"
              type="text"
              value={editedItems}
              onChange={(e) => setEditedItems(e.target.value)}
            ></input>
          ) : (
            <span
              className="text-sm md:text-xl text-black"
              style={items.done ? { textDecoration: "line-through" } : {}}
            >
              {items.description}
            </span>
          )}
        </div>
        <div className="flex gap-5">
          {editId === items.id ? (
            <button onClick={handleUpdate}>✅</button>
          ) : (
            <button onClick={() => onEditItem(items.id)}>✏️</button>
          )}

          <button onClick={() => onDeleteItem(items.id)}>🧽</button>
        </div>
      </div>
      <hr className="lines w-full"></hr>
    </li>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
