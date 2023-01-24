import {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import { useNavigate } from 'react-router';
import { actions as authActions } from "../store/reducers/auth/reducer";
import authService from '../services/auth';
import useBackgroundImage from "./hooks/useBackgroundImage";
import {AppContainer} from './components';
import RootRouter from "./routes";

export default function App() {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const backgroundImage = useBackgroundImage();
   const [isAppReady, setIsAppReady] = useState(false);

   useEffect(() => {
      if (localStorage.getItem('token')) {
         authService.syncAccount((err, data) => {
            if (err) {
               navigate('/login');
               localStorage.removeItem('token');
            } else {
               dispatch(authActions.setAuthUser(data))
            }
            setIsAppReady(true);
         });
      } else {
         setIsAppReady(true);
         navigate('/login')
      }
   }, []);

   return (
       <>
          {isAppReady && <AppContainer props={{ backgroundImage }}>
                 <RootRouter/>
             </AppContainer>}
       </>
   );
}
