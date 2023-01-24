import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";

import loginImg from '../../assets/images/background_login.jpg';
import mainImg from '../../assets/images/background_main.jpg';
import durakImg from '../../assets/images/background_durak.jpg';

export default function useBackgroundImage() {
   let location = useLocation();
   const [backgroundImage, setBackgroundImage] = useState();

   useEffect(() => {
      if (location.pathname === '/login') {
         setBackgroundImage(loginImg);
      } else if (location.pathname === '/main') {
         setBackgroundImage(mainImg);
      } else if (['durak', 'poker'].includes(location.pathname.split('/')[1])) {
         setBackgroundImage(durakImg);
      }
   }, [location.pathname])

   return backgroundImage;
}
