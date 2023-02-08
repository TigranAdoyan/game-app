import {Navigate, Route, Routes} from "react-router";
import {useSelector} from "react-redux";
import LoginPage from '../pages/Login';
import MainPage from '../pages/Main';
import DurakGame from '../pages/DurakGame';
import ChessGame from '../pages/ChessGame';
import PokerMain from '../pages/PokerMain';
import React from "react";

const routes = [
   {
      path: '/login',
      Element: LoginPage,
      isAuthRequired: false
   },
   {
      path: '/main',
      Element: MainPage,
      isAuthRequired: true
   },
   {
      path: '/durak/:id',
      Element: DurakGame,
      isAuthRequired: true
   },
   {
      path: '/chess/*',
      Element: ChessGame,
      isAuthRequired: false,
   },
   {
      path: '/poker/*',
      Element: PokerMain,
      isAuthRequired: true
   },
];

export const ProtectedRoute = ({children}) => {
   const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
   if (!isAuthenticated) {
      return <Navigate to="/login"/>;
   }
   return children;
};

export default function RootRouter() {
   return (
       <Routes>
          {routes.map(({path, isAuthRequired, Element}) => (
                 <Route key={path} element={
                     isAuthRequired ? <ProtectedRoute><Element key={path}/></ProtectedRoute> : <Element key={path}/>
                 } path={path}/>
          ))}
          <Route path="/*" element={<Navigate to="/main" replace={true}/>}/>
       </Routes>
   )
}
