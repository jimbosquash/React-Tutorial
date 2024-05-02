import { Canvas } from '@react-three/fiber'
import '../../styles.css'
import {useRef} from 'react'
import React from 'react';
import CanvasFun from './canvasFun.jsx';
import Overlay from './overlay.jsx';




export default function ViewerFun()
{
    const containerRef = useRef(null);


    console.log('viewer')
    return <>
    <CanvasFun/>
    <Overlay/>
    </>
      
}
