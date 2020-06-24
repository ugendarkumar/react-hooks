import React, { useState, useEffect, useCallback, useReducer,useMemo } from "react";

import ItemForm from "./ItemForm";
import ItemList from "./ItemList";
import Search from "./Search";
import ErrorModal from "../UI/ErrorModal";

const itemReducer = (currentBook, action) => {
  switch (action.type) {
    case "SET":
      return action.items;
    case "ADD":
      return [...currentBook, action.item];
    case "DELETE":
      return currentBook.filter((ing) => ing.id !== action.id);
    default:
      throw new Error("Invalid action");
  }
};

const httpHandler = (currentHttpState, action) => {
  switch (action.type) {
    case "requestMade":
      return { loading: true, error:null };
    case "successResponse":
      return {...currentHttpState, loading: false };
    case "errorResponse":
      return { error: action.errorMessage,loading:false };
    case "clearError":
      return { error: null, loading:null };
    default:
      throw new Error("Invalid action");
  }
};

function Items() {
  const [userBook, dispatch] = useReducer(itemReducer, []);
  // const [userBook,setUserBook] = useState([]);
  // const [isLoading,setIsLoading] = useState(false);
  // const [error,setError] = useState(false);

  const [httpActionState, dispatchHttpAction] = useReducer(httpHandler, {
    loading: false,
    error: null,
  });

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
    console.log("Rendering Books", userBook);
  }, [userBook]);

  const addItem = useCallback((book) => {
    //   setIsLoading(true)
    dispatchHttpAction({ type: "requestMade" });
    fetch("https://react-hooks-1b5f2.firebaseio.com/ingredients.json", {
      method: "POST",
      body: JSON.stringify(book),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        dispatchHttpAction({ type: "successResponse" });
        //   setIsLoading(false)
        // setUserBook((prevIngredient) => [
        //   ...prevIngredient,
        //   { id: responseData.name, ...book },
        // ]);
        dispatch({ type: "ADD", item: { id: responseData.name, ...book } });
      })
      .catch((err) => {
        dispatchHttpAction({
          type: "errorResponse",
          errorMessage: "Something Went wrong",
        });
        // setError('Something went wrong');
        // setIsLoading(false);
      });
  },[]);

  const removeItem = useCallback((id) => {
    dispatchHttpAction({ type: "requestMade" });
    fetch(`https://react-hooks-1b5f2.firebaseio.com/ingredients/${id}.json`, {
      method: "DELETE",
    })
      .then((response) => {
        dispatchHttpAction({ type: "successResponse" });
        // setUserBook(prevBook => prevBook.filter(x => x.id !== id));
        dispatch({ type: "DELETE", id: id });
      })
      .catch((err) => {
        dispatchHttpAction({
          type: "errorResponse",
          errorMessage: "Something Went wrong",
        });
        // setError('Something went wrong');
        // setIsLoading(false);
      });
  },[]);

  const filteredBooks = useCallback((books) => {
    dispatch({ type: "SET", items: books });
  }, []);

  const clearError = () => {
    // setError(null);
    dispatchHttpAction({ type: "clearError" });
  };

  const itemList = useMemo(() => {
    return  <ItemList items={userBook} onRemoveItem={removeItem} />
  },[userBook,removeItem])

  return (
    <div className="App">
      {httpActionState.error && (
        <ErrorModal onClose={clearError}>{httpActionState.error} </ErrorModal>
      )}
      <ItemForm onAddIngredient={addItem} loading={httpActionState.loading} />
      <section>
        <Search onLoadBooks={filteredBooks} />
       {itemList}
      </section>
    </div>
  );
}

export default Items;
