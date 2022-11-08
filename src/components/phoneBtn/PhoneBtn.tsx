import axios from "axios";
import React, { useEffect, useState } from "react";
import { BsTelephoneForward } from "react-icons/Bs";
import phoneBcg from "../../../public/img/phoneBcg.png";
import {
  HashRouter as Router,
  Route,
  NavLink,
  Redirect,
  Switch,
} from "react-router-dom";

import "./phoneBtn.scss";

interface Item {
  id: number;
  name: string;
  selected: boolean;
}
const PhoneBtn = () => {
  //获取所有的标签
  const [types, setTypes] = useState<Array<Item>>([]);

  useEffect(() => { 
    axios
      .get("http://localhost:8080/getAllRooms")
      .then((data) => {
        setTypes(data.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  //是否显示展示标签的块
  const [showType, setShowType] = useState(false);
  //储存选择的标签的id
  const [hoomId, setHoomId] = useState<number>();
  const getSelect = (id: number) => {
    for (let item of types) {
      if (item.id === id) {
        item.selected = true;
        setHoomId(id);
      } else {
        item.selected = false;
      }
    }
    let newTypes = Object.assign([], types);
    setTypes(newTypes);
  };

  const callTo = () => {
    // window.location.href = `/#/callPage/${hoomId}`
  };
  const delCall = () => {};
  return (
    <div>
      {showType && (
        <div className="moreContainer">
          <div className="selectItems">
            <h4>请选择标签</h4>
            <div className="types">
              {types.map((type) => {
                return (
                  <div
                    className={type.selected ? "typeSelect" : "type"}
                    onClick={() => {
                      getSelect(type.id);
                    }}
                    data-id={type.id}
                    key={type.id}
                  >
                    {type.name}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="selectFoot">
            <NavLink
              to={{ pathname: "/callPage", state: { roomId: hoomId } }}
              // onClick={() => {
              //   callTo();
              // }}
            >
              确定
            </NavLink>
            <button
              onClick={() => {
                setShowType(false);
              }}
            >
              取消
            </button>
          </div>
        </div>
      )}
      <div
        className="phoneBtn"
        style={{ backgroundImage: `url(${phoneBcg})` }}
        onClick={() => {
          setShowType(true);
        }}
      >
        <BsTelephoneForward />
      </div>
    </div>
  );
};
export default PhoneBtn;
