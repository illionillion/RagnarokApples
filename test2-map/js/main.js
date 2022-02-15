"use strict";

(function(){
    // console.log(document.getElementById('screen'));
    window.addEventListener('load',(e)=>{

        const point_eles = document.getElementsByClassName('map-touch')
        // console.log(point_eles);
        for (const point of point_eles) {
            // console.log(point);
            point.addEventListener('click',(e)=>{
                // console.log(e.target);
                alert(e.target.dataset.place);
            })

        }
    })
})();