"use strict";
const readline = require('readline');
 
const readInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
readInterface.question("入力してください >",
    inputString=>{
        readInterface.close();
        console.log( `
            入力された文字
            >>>${inputString }
            文字数
            >>>${inputString.length}
        `);
    }
);