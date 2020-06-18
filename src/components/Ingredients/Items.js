import React, { useState,useEffect,useCallback,useReducer } from 'react';

import IngredientForm from './ItemForm';
import ItemList from './ItemList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';


const itemReducer = (currentBook,action) => {
  console.log(action)
  switch (action.type) {
    case 'SET':
      return action.items;
    case 'ADD':
      return [...currentBook, action.item];
    case 'DELETE':
      return currentBook.filter(ing => ing.id !== action.id);
    default:
} 
}

function Items() {
   
  const [userBook,dispatch] = useReducer(itemReducer,[]);
 // const [userBook,setUserBook] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const [error,setError] = useState(false);
  // note data is fetched twice we can remove the below useEffect. It's already called in search
  // when useEffect there is invoked for the first time.
  
  // useEffect(() => {
  //   fetch("https://react-hooks-1b5f2.firebaseio.com/ingredients.json")
  //   .then(response => response.json())
  //   .then(responseData => {
  //     let bookArray = [];
  //     for(let x in responseData){
  //       bookArray.push({id:x,title:responseData[x].title,amount:responseData[x].amount});
  //     }
  //     dispatch({action:"SET",items:bookArray});
  //   })
  // },[])

  useEffect(() => {
    console.log("Rendering Books",userBook);
  },[userBook])
  
  const addItem = (book) => {
    setIsLoading(true)
    fetch("https://react-hooks-1b5f2.firebaseio.com/ingredients.json", {
      method: "POST",
      body: JSON.stringify(book),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        setIsLoading(false)
        // setUserBook((prevIngredient) => [
        //   ...prevIngredient,
        //   { id: responseData.name, ...book },
        // ]);
        dispatch({action:'ADD',item: { id: responseData.name, ...book }})
      }).catch(err =>{
        setError('Something went wrong');
        setIsLoading(false);
      });
  };

  const removeItem = id => {
    setIsLoading(true)
    fetch(`https://react-hooks-1b5f2.firebaseio.com/ingredients/${id}.json`,{method:"DELETE"})
    .then(response => {
      setIsLoading(false)
      // setUserBook(prevBook => prevBook.filter(x => x.id !== id));
      dispatch({action:"DELETE",id:id})
    }).catch(err =>{
      setError('Something went wrong');
      setIsLoading(false);
    });
   
  }

  const filteredBooks = useCallback(books => {
    dispatch({action:'SET',items:books});
  },[])

  const clearError = () => {
    setError(null);
  }

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error} </ErrorModal>}
      <IngredientForm onAddIngredient = {addItem} loading={isLoading}/>
      <section>
        <Search onLoadBooks = {filteredBooks}/>
    <ItemList items = {userBook} onRemoveItem={removeItem}/>
      </section>
    </div>
  );
}

export default Items;
