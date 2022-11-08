import React,{ PropsWithChildren, useEffect, useState, useImperativeHandle, ReactNode} from 'react'
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import './PopUp.scss'

export interface PopUpProps{
  text:string
}

const PopUp: React.FC<PopUpProps> = React.memo<PopUpProps>(({text}) => {
  let [show,setShow] = useState<boolean>(false)
  // let [text,setText] = useState<string>("")


  return (
    <div 
      className='popContainer'
    >{text}</div>
  )
})

PopUp.defaultProps = {
  text: ''
};


export default function ({props}: { props: PopUpProps }) {

  let div:HTMLDivElement
  let popContainer:any

  function onOpen(){
    div = document.createElement('div');
    document.body.appendChild(div);
    popContainer = createRoot(div)
    popContainer.render(<PopUp
      {...props}
    >
   </PopUp>)
  }
    
  function onClose(){
    popContainer.unmount()
  }
 
  return {
    onOpen,onClose
  }
}
