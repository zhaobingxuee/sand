import React,{PropsWithChildren, useEffect,useRef, useState, useImperativeHandle} from 'react'
import PubSub from 'pubsub-js';
import './phoneInput.css'
import PopUp from '../popUp/PopUp'

interface PhoneProps {
	getPhone: (phone:string)=>void,
}


const PhoneInput: React.FC<PhoneProps> = (props: PropsWithChildren<PhoneProps>) => {
	
	const [phone,setPhone] = useState<string>('')
	//订阅事件
	useEffect(()=>{
		PubSub.subscribe("localPhoneValue",(msg,data)=>{
			setPhone(data)
		})
		return ()=>{
			PubSub.unsubscribe('localPhoneValue')
		}
	},[])


	function changeValue(e:React.ChangeEvent<HTMLInputElement>):void{
		setPhone(e.target.value)
		props.getPhone(e.target.value)
	}
	
	return (
		<div>
			{/* <PopUp onRef={popUpRef}></PopUp> */}
			<div className="group">
				<input 
					placeholder="手机号"
					type="search" 
					className="input"
					value={phone}
					onChange={changeValue}
				/>
			</div>
		</div>
	)
}
export default PhoneInput