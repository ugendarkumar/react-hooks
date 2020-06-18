import React,{useState, useEffect,useRef} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {

  const [enteredFilter, setEenteredFilter] = useState('');
  const {onLoadBooks} = props;
   
  const inputRef = useRef();

  useEffect(() => {
  const timer =  setTimeout(() => {
   if(enteredFilter === inputRef.current.value){
    const queryParam = enteredFilter.length === 0 ? '':`?orderBy="title"&equalTo="${enteredFilter}"`
    fetch("https://react-hooks-1b5f2.firebaseio.com/ingredients.json"+queryParam)
    .then(response => response.json())
    .then(responseData => {
      let bookArray = [];
      for(let x in responseData){
        bookArray.push({id:x,title:responseData[x].title,amount:responseData[x].amount});
      }
      onLoadBooks(bookArray);
    })
   }
    },500)

    return () => {
  clearTimeout(timer)
    }

  },[enteredFilter,onLoadBooks,inputRef])

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input type="text" 
          ref={inputRef}
          onChange={event => setEenteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
