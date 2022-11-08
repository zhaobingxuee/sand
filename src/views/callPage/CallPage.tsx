import React, {
  useEffect,
  PropsWithChildren,
  useState,
  useRef,
  useMemo,
} from "react";
import { io, Socket } from "socket.io-client";
import Avator from "../../components/Avator";
import Peer, { ConnectionType } from "peerjs";
import "./callPage.scss";
import axios from "axios";
import { BsTelephoneX, BsCameraVideo, BsCameraVideoOff } from "react-icons/Bs";
import { TbMicrophone, TbMicrophoneOff } from "react-icons/Tb";
import Draggable from "react-draggable";
import useWindowSize from "../../hooks/useWindowSize";
import callPageBcg from "../../../public/img/callPageBcg.png";
//用state传参 参数不会在地址栏显示 但是刷新页面参数丢失
interface Props {
  location: {
    isExact: boolean;
    params: any;
    path: string;
    url: string;
    state: any;
  };
}
interface OtherData {
  other: string;
  peerId: string;
  phone: string;
  roomId: string;
  state: number;
  __v: number;
  _id: string;
}

const CallPage = (props: PropsWithChildren<Props>) => {
  const [isWaiting, setIsWaiting] = useState<boolean>(true); //判断当前是否为等待状态
  let [typeId, setTypeId] = useState("");
  let [mySocketID, setMySocketID] = useState<string>();
  let [otherId, setOtherId] = useState<string>();

  const [transX, setTransX] = useState(0); //视频的时候本人的框x移动值
  const [transY, setTransY] = useState(0); //视频的时候本人的框y移动值
  const { windowWidth, windowHeight } = useWindowSize();
  const [localId, setLocalId] = useState(""); //本地Peerid
  const [remoteId, setRemoteId] = useState(""); //对方的Peerid
  const [audioOpen, setAudioOpen] = useState<boolean>(false); //设置自己的音频是否打开
  const [videoOpen, setVideoOpen] = useState<boolean>(true); //设置自己的视频是否打开
  const currentCall: any = useRef();
  const currentConnection = useRef();
  const peer = useRef<Peer>();
  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const localStream = useRef<MediaStream>();
  const remoteStream = useRef<MediaStream>();
  const [socket, setSocket] = useState<Socket>();
  const socketRef = useRef<Socket>();

  //获取本地存储的标签id
  const getSeesionLocal = (): null | string => {
    return sessionStorage.getItem("typeId");
  };
  const getSessionPhone = (): null | string => {
    return sessionStorage.getItem("phone");
  };
  //页面挂载时 获取房间号和当前用户的手机号 这里后续一定要记得修改！！！！！！！
  useEffect(() => {
    //判断当前页面有没有传typeId 有就放到sessionStorage 没有就从sessionStorage获取
    let id = props.location.state?.roomId;
    if (typeof id !== "undefined") {
      sessionStorage.setItem("typeId", id);
      setTypeId(id);
    } else {
      setTypeId(getSeesionLocal() as string);
    }
    //当typeId有值之后  就要添加接口开始等待接听状态
    if (String(typeId) && localId) {
      //查看用户通话信息是否存在
      checkInsertCall();
      //连接socket.io
      console.log("开始连接socket");
      let _socket = io("http://localhost:8081", {
        transports: ["websocket", "polling", "flashsocket"],
      });
      setSocket(_socket);
      _socket.emit("join", typeId);
      _socket.on("comeIn", (data) => {
        //当检测到有人进入这个房间 就要开始找数据库里面该房间下正在等待通话的人
        getRoomWaiting();
      });
      // _socket.on('changeStream',(data)=>{
      //   console.log(data)
      // })
    }
    //当远程用户id有值之后要开始建立通话连接了
    if (remoteId) {
      console.log(remoteId, localId);
      setIsWaiting(false);
      callUser();
    }
  }, [typeId, localId, remoteId]);

  useEffect(() => {
    if (socket) {
      socketRef.current = socket;
    }
  }, [socket]);

  useEffect(() => {
    //创建peer连接之后 就要操作数据库添加用户通话状态
    createPeer();
  }, []);
  async function checkInsertCall() {
    try {
      let hasCallData = await axios({
        //判断数据库知否有当用户通话记录
        url: "http://localhost:8080/getCall",
        data: {
          phone: getSessionPhone(),
        },
        method: "post",
      });
      let addOrChangeCallRes = null;
      if (hasCallData.data.data.length) {
        //已经有该通话记录,修改用户的peerId
        addOrChangeCallRes = await axios({
          url: "http://localhost:8080/changeCallPeerId",
          data: {
            phone: getSessionPhone(),
            peerId: localId,
          },
          method: "post",
        });
      } else {
        addOrChangeCallRes = await axios({
          url: "http://localhost:8080/addCall",
          data: {
            phone: getSessionPhone(),
            roomId: typeId,
            peerId: localId,
          },
          method: "post",
        });
      }
      //当新增或者修改好peerId之后开始获取同一标签正在等待通话的用户列表 我觉得这里要有个轮询效果 不然不能获得最新进入通话的人
      //这里用socket监听了新加入房间的人 不用轮询了 但是只能实现前后两个人视频 不能预备池里面随机找一个
      if (addOrChangeCallRes.data.err === 0) {
        getRoomWaiting();
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function getRoomWaiting() {
    axios({
      url: "http://localhost:8080/getRoomWaitCall",
      data: {
        roomId: typeId,
      },
      method: "post",
    })
      .then((data) => {
        randomInRoom(data.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //随机获取同一房间下正在等待通话的用户信息   这个应该是核心功能 但是这写的有点太简单了
  async function randomInRoom(dataArr: [OtherData]) {
    let otherList = dataArr.filter((obj) => obj.phone !== getSessionPhone());
    if (otherList.length) {
      const randomIndex = ~~(Math.random() * otherList.length);
      setRemoteId(otherList[randomIndex].peerId);
    }
  }

  // 结束通话
  function endCall() {
    console.log("卸载");
    if (peer.current) {
      // currentCall.current.close()
      axios({
        url: "http://localhost:8080/callDel",
        method: "post",
        data: {
          phone: getSessionPhone(),
        },
      })
        .then((data) => {
          // console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
      peer.current.destroy();

      window.location.replace("/#/index");
      // setIsWaiting(true);
    }
    Object.getOwnPropertyDescriptor(window, "stream")
      ?.value.getTracks()
      .forEach((track: any) => track.stop());

    const localStream = localVideo.current?.srcObject as MediaStream;
    if (localStream) {
      const localTracks = localStream.getTracks();
      if (localTracks) {
        localTracks.forEach(function (track: any) {
          track.stop();
        });
        localVideo.current!.srcObject = null;
      }
    }

    const remoteStream = remoteVideo.current?.srcObject as MediaStream;
    if (remoteStream) {
      const remoteTracks = remoteStream.getTracks();
      if (remoteTracks) {
        remoteTracks.forEach(function (track: any) {
          track.stop();
        });
        remoteVideo.current!.srcObject = null;
      }
    }
  }

  // 创建本地 Peer
  function createPeer() {
    //以下相当于处理本地的
    peer.current = new Peer({
      config: {
        iceServers: [
          { url: "stun:stun.l.google.com:19302" },
          {
            urls: "turn:124.70.0.135:3487?transport=udp",
            username: "zhizhong",
            credential: "123456",
          },
        ],
      },
    });
    peer.current.on("open", (id: string) => {
      setLocalId(id);
    });

    // 纯数据传输
    peer.current.on("connection", (connection: any) => {
      // // 接受对方传来的数据 发送消息用的 暂时用不到
      // connection.on("data", (data: any) => {
      //   setMessages((curtMessages: any) => [
      //     ...curtMessages,
      //     { id: curtMessages.length + 1, type: "remote", data },
      //   ]);
      // });

      connection.on("close", () => {
        console.log("发起视频一方关闭，接听的监听");
        endCall();
      });
      // 记录当前的 connection
      currentConnection.current = connection;
    });

    // 媒体传输 当监听到有数据流传入时 设置双方的流并响应 交换
    peer.current.on("call", async (call: any) => {
      // 获取本地流
      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoOpen,
        audio: audioOpen,
      });
      localStream.current = stream;
      if (!window.hasOwnProperty("stream")) {
        Object.defineProperty(window, "stream", {
          value: stream,
          enumerable: true,
        });
      }
      localVideo.current!.srcObject = stream;
      // 响应
      call.answer(stream);

      // 监听视频流，并更新到 remoteVideo 上
      call.on("stream", (stream: any) => {
        socketRef.current!.on("closeVideo", (data) => {
          console.log(data, "关闭了视频");
        });
        socketRef.current!.on("openVideo", (data) => {
          console.log(data, "打开了视频");
        });
        remoteVideo.current!.srcObject = stream;
      });

      call.on("close", () => {
        endCall();
      });
      currentCall.current = call;
    });
  }

  // 开始通话
  const callUser = async () => {
    // 获取本地视频流
    const stream = await navigator.mediaDevices.getUserMedia({
      video: videoOpen,
      audio: audioOpen,
    });

    if (!window.hasOwnProperty("stream")) {
      Object.defineProperty(window, "stream", {
        value: stream,
        writable: true,
      });
    }

    localVideo.current!.srcObject = stream;
    localVideo.current!.play();

    // 数据传输
    const connection = peer.current!.connect(remoteId) as any;
    currentConnection.current = connection;
    connection.on("open", () => {
      console.log("已连接");
      //连接上之后要修改通话state
      axios({
        url: "http://localhost:8080/changeState",
        method: "post",
        data: {
          phone: getSessionPhone(),
        },
      })
        .then((data) => {})
        .catch((err) => {
          console.log(err);
        });
    });

    // 多媒体传输
    const call = peer.current!.call(remoteId, stream) as any;

    call.on("stream", (stream: any) => {
      //当远程流添加进来的时候被触发
      remoteVideo.current!.srcObject = stream;
      remoteVideo.current!.play();
    });
    call.on("error", (err: any) => {
      console.error(err);
    });
    call.on("close", () => {
      endCall();
    });

    currentCall.current = call;
  };

  const handleVideo = () => {
    localStream.current!.getVideoTracks()[0].enabled =
      !localStream.current!.getVideoTracks()[0].enabled;
    setVideoOpen(!videoOpen);
    socketRef.current!.emit(videoOpen ? "openVideo" : "closeVideo", socket!.id);
  };

  const audioHandle = () => {
    if (audioOpen) {
      //关闭麦克风
      setAudioOpen(false);
      socket!.emit("closeAudio", socket!.id);
    } else {
      //打开麦克风
      setAudioOpen(true);
      socket!.emit("openAudio", socket!.id);
    }
  };

  const stopDrag = (e: any, data: any) => {
    const containWidth = Number(
      window.getComputedStyle(e.target).width.split("p")[0]
    );
    const containHeight = Number(
      window.getComputedStyle(e.target).height.split("p")[0]
    );

    //获取当前元素距离四个边的距离
    const leftWidth = (data.x / windowWidth) * 100; //左边距离百分比
    const rightWidth =
      ((windowWidth - data.x - containWidth) / windowWidth) * 100;
    const topHeight = (data.y / windowHeight) * 100;
    const bottomHeight =
      ((windowHeight - data.y - containHeight) / windowHeight) * 100;

    const numArr = [leftWidth, rightWidth, topHeight, bottomHeight];
    let minNum = leftWidth;
    numArr.map((num) => {
      if (num < minNum) {
        minNum = num;
      }
    });
    switch (minNum) {
      case leftWidth:
        setTransX(0);
        setTransY(data.y);
        break;
      case rightWidth:
        setTransX(windowWidth - containWidth);
        setTransY(data.y);
        break;
      case topHeight:
        setTransX(data.x);
        setTransY(0);
        break;
      case bottomHeight:
        setTransX(data.x);
        setTransY(windowHeight - containHeight);
        break;
      default:
        break;
    }
  };
  return (
    <div className="audioContainer">
      <div
        className="bottomVideo"
        style={{ backgroundImage: `url(${callPageBcg})` }}
      >
        <video autoPlay ref={remoteVideo}>
          对方视频流
        </video>
      </div>
      <div className="mainOption">
        {isWaiting ? (
          <div style={{ flex: 1 }}>
            <div className="avator">
              <div>标签名字</div>
            </div>
            <div className="promptText">
              {isWaiting ? "正在等待中..." : "正在通话中..."}
            </div>
          </div>
        ) : (
          <div style={{ width: "100%", height: "100%" }}>
            <Draggable
              bounds={"parent"}
              // defaultPosition={{x:200,y:200}}
              position={{ x: transX, y: transY }}
              onStop={(e, data) => {
                stopDrag(e, data);
              }}
            >
              <div className="elseVideoContainer">
                <video
                  style={{
                    width: "100%",
                    display: videoOpen ? "inline-block" : "none",
                  }}
                  autoPlay
                  ref={localVideo}
                ></video>
              </div>
            </Draggable>
          </div>
        )}
        <div className="optionBtns">
          <div className="callBtn">
            <div
              className="btnContainer audioBtn"
              onClick={() => {
                // setAudioOpen(!audioOpen);
                audioHandle();
              }}
            >
              {/* 是否打开语音 */}
              {audioOpen ? <TbMicrophone /> : <TbMicrophoneOff />}
            </div>
          </div>
          <div className="callBtn">
            <div
              className="btnContainer closeBtn"
              onClick={() => {
                endCall();
              }}
            >
              {/* 挂断电话 */}
              <BsTelephoneX />
            </div>
          </div>
          <div className="callBtn">
            <div
              className="btnContainer videoBtn"
              onClick={() => {
                handleVideo();
              }}
            >
              {/* 是否打开视频 */}
              {videoOpen ? <BsCameraVideo /> : <BsCameraVideoOff />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CallPage;
