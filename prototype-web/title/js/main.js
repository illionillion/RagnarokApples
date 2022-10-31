"use strict"
import FrameSizing from "../../../local_build/js/lib/FrameSizing.js"

(function(){

    window.addEventListener('resize', FrameSizing)

    window.addEventListener('load', async (e)=>{

        document.addEventListener('contextmenu', () => {return false})

        FrameSizing()

    })
})()