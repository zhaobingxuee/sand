import React from "react";
import {BsTelephoneForward} from 'react-icons/Bs'
import phoneBcg from '../../../public/img/phoneBcg.png'
import PhoneBtn from '../../components/phoneBtn/PhoneBtn'

import './indexPage.scss'

const IndexPage = () => {
  return(
    <div className="container">
      <div className="bcg indexBcg">
        <div className="upper indexUpper"></div>
        <div className="phoneBtnContiner">
          <PhoneBtn/>
        </div>
      </div>
    </div>
  )
}
export default IndexPage