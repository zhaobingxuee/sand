import React,{useState,useEffect} from 'react'
import './circle.scss'
import { PropsWithChildren } from 'react'

interface Circle {
    // size: string,
    // text: string,
}

const Circle: React.FC<Circle>= (props: PropsWithChildren<Circle>) => {

    // useEffect(() => {
    //     //获取每个canvas

    //     let canvas = document.getElementById('canvas') as HTMLCanvasElement
    //     let ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    //     // context.arc(x,y,r,sAngle,eAngle,counterclockwise); 以x,y为圆心，r为半径，起始角度为sAngle，结束角度为eAngle，counterclockwise为false表示为顺时针，true为逆时针
    //     ctx.arc(50, 50, 50, 0, Math.PI * 2, true); // 绘制圆形
    //     //填充渐变色 createRadialGradient(x,y,r,x1,y1,r1) 以x，y为起点，
    //     //r为半径画圆，此处为起始区域，以x1,y1为起点,r1为半径画圆，此处为终止区域
    //     var grd = ctx.createRadialGradient(0,0,45,0,0,75);
    //     grd.addColorStop(0,'#C76AF3');
    //     grd.addColorStop(1,'#F19088');
    //     // grd.addColorStop(0,'#A1BBFF');
    //     // grd.addColorStop(1,'#ED7280');
    //     ctx.fillStyle = grd;
    //     // ctx.fillText('写点字',90,90)//补充字
    //     ctx.fill();
    //     ctx.strokeStyle = "rgba(0,0,0,0)";//边框颜色
    //     ctx.stroke();
    // }) 

    
    return (
        // <canvas id='canvas'></canvas>
        <div className="effect">
            <div className="blueball1"></div>
            <div className="blueball2"></div>
        </div>
    )
}
export default Circle