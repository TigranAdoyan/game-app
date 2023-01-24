import {useEffect, useState} from "react";
import { useNavigate } from 'react-router'
import {useDispatch, useSelector} from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { actions as authActions } from '../../store/reducers/auth/reducer';
import authService from '../../services/auth';
import {
   Container,
   Header,
   Form,
   CustomLabel,
   CustomInput,
   SubmitButton
} from './components';

export default function Login() {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
   const [responseErrMsg, setResponseErrMsg] = useState('');

   const formik = useFormik({
      initialValues: {
         username: '',
         password: ''
      },
      validationSchema: Yup.object().shape({
         username: Yup.string().required('Required'),
         password: Yup.string().required('Required'),
      }),
      onSubmit: data => {
         setResponseErrMsg('');
         authService.login(data, (err, data) => {
            if (err) {
               setResponseErrMsg(err.message)
            } else {
               localStorage.setItem('token', data.token);
               dispatch(authActions.setAuthUser(data.user));
               navigate('/main');
            }
         })
      },
   });

   useEffect(() => {
      if (isAuthenticated) navigate('/main');
   }, [])

   return (
       <Container>
          <Header> Sign-in </Header>
          <Form>
             <div style={{ width: '100%' }}>
                <CustomLabel for="username">username*</CustomLabel>
                <CustomInput
                    id="username"
                    name="username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                />
             </div>

             <div style={{ width: '100%', marginTop: '30px' }}>
                <CustomLabel for="password">password*</CustomLabel>
                <CustomInput
                    id="password"
                    type="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                />
             </div>
             {responseErrMsg && (<span style={{color: 'red', fontSize: '20px'}}> {responseErrMsg} </span>)}
             <SubmitButton
                 onClick={formik.handleSubmit}
                 disabled={!Object.values(formik.values).every(el => el)}
             >
                Sign-in
             </SubmitButton>
          </Form>

       </Container>
   )
}