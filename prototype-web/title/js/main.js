"use strict"
import FrameSizing from "./lib/FrameSizing.js"

(function(){

    window.addEventListener('resize', FrameSizing)

    window.addEventListener('load', async (e)=>{

        document.addEventListener('contextmenu', () => {return false})

        FrameSizing()

    })
})()