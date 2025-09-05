import { useState } from 'react';
import './App.css';
import "./index.css";

const initialItems = [
  { id: 1, description: "Passports", quantity: 2, packed: false },
  { id: 2, description: "Socks", quantity: 12, packed: false },
  { id: 3, description: "Charger", quantity: 1, packed: false },
];

export default function App() {
  const [items,setItems] = useState(initialItems);
  function handleAddItems(item){
    setItems((items) => [...items,item]);
  }
  function handleDeleteItem(id) {
    //console.log(id);
    setItems((items) => items.filter((item) => item.id !== id ));
  }
  function handleToggleItem(id) {
    setItems((items) => 
      items.map((item) => 
        item.id === id ? {...item, packed: !item.packed } : item
      )
    );
  }
  function handleClearList(){
    const confirmed = window.confirm("Are you sure you want to clear the list?");
    if(confirmed) setItems([]);
  }
  return <div className='app'> 
      <Logo /> 
      <Form onAddItems={handleAddItems}/>
      <PackingList items={items} onDeleteItem={handleDeleteItem} onToggleItem={handleToggleItem} onClearList={handleClearList} />
      <Stats items={items}/>
  </div>;
}


function Logo() {
  return <h1>🏝️ Far Away 🧳</h1>;
}

function Form({onAddItems}) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] =  useState(1);

  function handleSubmit(e) {
    e.preventDefault();
    if(!description) return;
    const newItem = { 
      description,
      quantity,
      packed : false,
      id : Date.now()
    };
    console.log(newItem);
    onAddItems(newItem);
  }
  return(
    <form className='add-form' onSubmit={handleSubmit}>
      <h3>What do you need for your 😍 trip?</h3>
      <select value={quantity} onChange={(e) => setQuantity(e.target.value)}>
        {Array.from({length : 20 },(_,i) => i + 1).map((num) => (
          <option value={num} key={num}>{num}</option>
        ))};
        
      </select>
      <input type='text' placeholder='item...'  value={description} onChange={(e) => setDescription(e.target.value)}/>
      <button>add</button>
    </form>
  );
}


function PackingList({items,onDeleteItem,onToggleItem,onClearList}) {
  const [sortBy,setSortBy] = useState("input");
  let sortedItems;
  if (sortBy === "input") sortedItems = items;
  if (sortBy === "description") sortedItems = items.slice().sort((a, b) => a.description.localeCompare(b.description));
  if (sortBy === "packed") sortedItems = items.slice().sort((a, b) => Number(a.packed) - Number(b.packed));

  return <div className='list'>
    <ul>
      {sortedItems.map((item) => (<Item item={item} key={item.id} onDeleteItem ={onDeleteItem} onToggleItem={onToggleItem} />))}
    </ul>
    <div className='actions'>
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="input">Sort by input order</option>  
        <option value="description">Sort by description</option>  
        <option value="packed">Sort by packed status</option>  
      </select>
      <button onClick={onClearList}>Clear list</button>      
    </div>
  </div>;
}

function Stats({items}) {
  const numItems = items.length;
  const numPacked = items.filter((item) => item.packed).length;
  const percentage = Math.round((numPacked / numItems)*100);
  if(!items.length) return <p className='stats'><em>
      Start adding  some items to your packing list🚀
    </em></p>


  return <footer className='stats'>
    <em>{percentage === 100 ? 'You got everything! Ready to go ✈️' : `💼 You have ${numItems} items on your list, and you already packed ${numPacked} (${percentage} %)`}</em>
  </footer>;
}

function Item({item,onDeleteItem,onToggleItem}) {
  return(
    <li>
      <input type='checkbox' onClick={() => {onToggleItem(item.id)}} /> 
      <span style={item.packed ? {textDecoration : "line-through"} : {}}>{item.quantity} {item.description}</span>
      <button onClick={() => onDeleteItem(item.id)}>❌</button>
    </li>
  );
}