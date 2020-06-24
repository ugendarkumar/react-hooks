import React,{useContext} from 'react';

import Items from './components/Items/Items';
import Auth from './components/Auth';
import {AuthContext} from './context/auth-context';

const App = props => {

  const AuthContextValidation = useContext(AuthContext);

  let content = <Items/>;

  if(!AuthContextValidation.isAuth){
    content = <Auth/>
  }


  return content;
};

export default App;
