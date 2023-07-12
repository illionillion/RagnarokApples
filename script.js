'use strict'
import { convert2Dakuon } from './convert2Dakuon.js'
import { convert2HanDakuon } from './convert2HanDakuon.js'
import { convert2Komoji } from './convert2Komoji.js'

let input = document.querySelectorAll("input")
let named = document.getElementById("name")
let names = []
let Count = 0

// console.log(input);

input.forEach(function(ele) {
    ele.addEventListener('click', function() {

        if(ele.value === '削除') {
            console.log('削除');
            deleteBtn()
            return

        }if(ele.value === '小字') {
            komojiBtn()
            return

        }if(ele.value === '全削除') {
            allDeleteBtn()
            return

        }if(ele.value === '゛') {
            dakuBtn()
            return

        }if(ele.value === '゜') {
            HandakuBtn()
            return
        }

        typed(ele)
        // console.log(ele.value);
    })
});

function typed(ele) {
    names[Count] = ele.value     
    named.innerHTML = names.join("")

    console.log(named);
    Count++
    console.log(names);
}

// 削除ボタン
function deleteBtn() {
    if (Count !== 0) { // この条件式がないと配列が空の時に、削除ボタンを押すと添字がマイナスになる
        names.pop()
        named.innerHTML = names.join("")
        Count--
        console.log(names);
    }
}

function komojiBtn() {
    let komoji = convert2Komoji(names[names.length -1])

    if(komoji !== undefined) {
        names.slice(names.length)
        Count--
        names[Count] =  komoji
        named.innerHTML = names.join("")
        Count++

        console.log(names);
    }
}

// スペースボタン
function allDeleteBtn() {

    if (Count !==0) {
        names = []
        Count = 0
    }
    named.innerHTML = names.join("")
    console.log(names);
}

// 濁点ボタン
function dakuBtn() {
    // let daku = names[names.length - 1]
    // convert2Dakuon(daku)
    let dakumoji = convert2Dakuon(names[names.length -1])

    if(dakumoji !== undefined) {
        names.slice(names.length)
        Count--
        names[Count] =  dakumoji
        named.innerHTML = names.join("")
        Count++

        console.log(names);
    }
}

function HandakuBtn() {
    let Handakumoji = convert2HanDakuon(names[names.length -1])

    if(Handakumoji !== undefined) {
        names.slice(names.length)
        Count--
        names[Count] =  Handakumoji
        named.innerHTML = names.join("")
        Count++

        console.log(names);
    }
}


for (let i = 0; i < input.length; i++) {
    input[i].addEventListener("click", function() {

        this.blur(".keyboard-wrapper .keys input:focus ")

        // setTimeoutが効かない
        // setTimeout(() => { 
        //     this.blur(".keyboard-wrapper .keys input:focus ")
        // }, 10);
    })
}

