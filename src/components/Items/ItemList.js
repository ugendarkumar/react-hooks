import React from 'react';

import './IngredientList.css';

const ItemList = props => {

  console.log('Rendering Item list')

  return (

    <section className="ingredient-list">
      <h2>Loaded Ingredients</h2>
      <ul>
        {props.items && props.items.map(ig => (
          <li key={ig.id} onClick={props.onRemoveItem.bind(this, ig.id)}>
            <span>{ig.title}</span>
            <span>{ig.amount}x</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ItemList;
