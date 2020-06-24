import React,{useState} from 'react';


export const AuthContext = React.createContext({
    isAuth:false,
    login:() => {

    }
})

const AuthContextProvider = props => {
    const [isAuthenticated,setIsAuthenticated]  = useState(false);

    const logiHandler =() => {
        setIsAuthenticated(true);
    }
    return (
        // a valid react component is created
        <AuthContext.Provider value={{isAuth:isAuthenticated, login:logiHandler}} > 
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider;