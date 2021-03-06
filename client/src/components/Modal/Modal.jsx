import React from 'react';
import classes from './Modal.css';

import Aux from '../../hoc/Aux.jsx';
import Backdrop from '../Backdrop/Backdrop.jsx';
import Comment from '../../components/Comments/Comment/Comment.jsx';

/* 
1) Modal should render once a user clicks on a comment from anywhere in the Mariner UI.
2) Modal will show Comment in a centered box on the page. It will also have a backdrop component that will
  'darken' the background of the main Mariner page.
3) Response form will also be shown here, along with a "Reply" button.
*/

const modal = (props) => (
  props.isVisible ? (
    <Aux>
      <Backdrop clicked={props.dismissModalHandler} isVisible={props.isVisible} />
      <div 
        className={classes.Modal}
        style={{
          opacity: props.isVisible ? '1' : '0'
        }}>
        <p className={classes.modalTitle}>
          COMMENT DETAILS
        </p>
        {props.loadedComment ? <Comment comment={props.loadedComment}/> : <p>Loading...</p>}
        {/* <Comment comment={props.loadedComment} /> */}
        <form className={classes.modalForm} action="http://localhost:3000/comments/reply" method="post">
          <textarea defaultValue={"Type your reply here..."} className={classes.modalTextArea} onChange={props.captureText}/>
          <input className={classes.replyButton} type="submit" name="Reply" value="Reply" />
        </form>
      </div>
    </Aux>
  ) :
  (
    null
  )
);

export default modal;