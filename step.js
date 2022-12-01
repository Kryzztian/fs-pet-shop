import { readFile, writeFile } from 'node:fs/promises';

let subcommand = process.argv[2]
let index = process.argv[3]

function parseData(info){
   let data = JSON.parse(info)
   return data
}

async function read(){
    let readPromise = await readFile("./pets.json" , 'utf-8');
    let data = parseData(readPromise);
    if( index >= data.length || 0 > index){
        console.error("Usage: node pets.js read INDEX")
        process.exit([1]);
    } else if(index === undefined) {
        console.log(data)
    } else {
        console.log(data[index])
    }
}

if( subcommand === 'read'){
    read();
}
