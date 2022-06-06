"use strict";
const readline = require('readline');

// コマンドライン引数を受け取れるようにした
if(process.argv.slice(2).length > 0){
    const inputString = process.argv.slice(2)[0]
    console.log( `
        入力された文字
        >>>${inputString}
        文字数
        >>>${inputString.length}
    `);
}else{
    
    const readInterface = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    readInterface.question("入力してください >",
    inputString=>{
        readInterface.close();
        console.log( `
        入力された文字
        >>>${inputString}
        文字数
        >>>${inputString.length}
        `);
    }
    );
}