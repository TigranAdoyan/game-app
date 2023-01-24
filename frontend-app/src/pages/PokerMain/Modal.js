import React, {useEffect} from 'react';
import cns from "classnames";
import * as Yup from "yup";
import {useFormik} from 'formik';
import dashboardIo from "../../services/socket/dashboard";
import './styles/model.scss';
import ProfileImg from '../../components/ProfileImg';
import Loading from '../../components/Loading';


export default function Modal(props) {
   const [isOpen, setIsOpen] = React.useState(props.status);
   const [isLoading, setIsLoading] = React.useState(false);

   const formik = useFormik({
      initialValues: {
         message: '',
      },
      validationSchema: Yup.object().shape({
         message: Yup
             .string().required('message is required')
             .min(1, `min length is 1 letter`)
             .max(50, `max length is 50 letter`),
      }),
      onSubmit: (data) => {
         setIsLoading(true);
         dashboardIo.socket.emit(dashboardIo.events.client.invite_to_game, {
            receiverId: props.player.id,
            message: data.message
         }, (err) => {
            debugger;
            // Todo console.log(err);
         })
      },
   });

   function onClose() {
      setIsOpen(false);
      setTimeout(() => {
         props.setModalStatus({
            status: false,
         })
      }, 300)
   }

   function submitInvitation() {
      dashboardIo.socket.emit(dashboardIo.events.client.submit_invite_to_game, {
         token: props.token,
      }, (err) => {
         console.log(err);
      })
   }

   useEffect(() => {
      if (props.status === false) onClose();
      else setIsOpen(true);
   }, [props.status]);

   return (
       <div className={cns(['poker_modal_container', {show: isOpen, hide: !isOpen}])} onClick={onClose}>
          {
             props.type === 'send_invite' ? (
                 <div className="poker_modal" onClick={(e) => e.stopPropagation()}>
                    <div className="poker_modal_header">
                       <ProfileImg src={props?.player.profile_img_url} online={props?.player?.online}/>
                       <div className="poker_modal_header_info">
                          <span> {props?.player?.username} </span>
                          <span> {props?.player?.email} </span>
                       </div>
                    </div>
                    <div className="poker_modal_form_container">
                <textarea
                    className="poker_modal_textarea"
                    name="message"
                    spellCheck={false}
                    onChange={formik.handleChange}
                    value={formik.values.message}
                />
                       {formik.submitCount > 0 && formik.errors.message && (
                           <span className="poker_modal_error_span"> {formik.errors.message} </span>
                       )}
                    </div>
                    <div>
                       <div className="poker_modal_btn" onClick={() => formik.handleSubmit()}>
                          {isLoading ? <Loading/> : 'Send'}
                       </div>
                    </div>
                 </div>
             ) : props.type === 'receive_invite' && (
                 <div className="poker_modal" style={{ height: '150px' }} onClick={(e) => e.stopPropagation()}>
                    {props.player.username} inviting you to play durak
                    <div style={{ marginTop: 'auto' }}>
                       <div className="poker_modal_btn" onClick={submitInvitation}>
                          {isLoading ? <Loading/> : 'Play'}
                       </div>
                    </div>
                 </div>
             )
          }
       </div>
   )
}
