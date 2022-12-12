import { readFile, writeFile } from 'node:fs/promises';

let subcommand = process.argv[2]
function parseData(info){
   let data = JSON.parse(info)
   return data
}
class Pet {
    constructor(age, kind, name) {
        this.age = age;
        this.kind = kind;
        this.name = name;
    }
}
async function read(){
    let index = process.argv[3]
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
async function create(){
    let age = process.argv[3];
    let kind = process.argv[4];
    let name = process.argv[5];
    if(age === undefined || kind === undefined || name === undefined){
        console.error("Usage: node pets.js create AGE KIND NAME")
        process.exit([1]);
    } else {
        let newPet = new Pet(age, kind, name)
        let readPromise = await readFile("./pets.json" , 'utf-8');
        let data = parseData(readPromise);
        data.push(newPet)
        let jsonUpdate = JSON.stringify(data)
        writeFile("./pets.json" , jsonUpdate)
    }
}
async function update(){
    let index = process.argv[3]; 
    let age = process.argv[4];
    let kind = process.argv[5];
    let name = process.argv[6];
    if(index === undefined ||age === undefined || kind === undefined || name === undefined){
        console.error('Usage: node pets.js update INDEX AGE KIND NAME')
        process.exit([1]);
    } else {
        let newPet = new Pet(age, kind, name);
        let readPromise = await readFile("./pets.json" , 'utf-8');
        let data = parseData(readPromise);
        data[index] = newPet
        let jsonUpdate = JSON.stringify(data)
        writeFile("./pets.json" , jsonUpdate)
    }
}
async function destroy(){
    let index = process.argv[3];
    if(index === undefined){
        console.error('Usage: node pets.js destroy INDEX')
        process.exit([1]);
    } else {
        let readPromise = await readFile("./pets.json" , 'utf-8');
        let data = parseData(readPromise);
        data.splice(index,1);
        let jsonUpdate = JSON.stringify(data)
        writeFile("./pets.json" , jsonUpdate)
        }
    }    
if( subcommand === 'read'){
    read();
} else if (subcommand === 'create'){
    create();
} else if(subcommand === 'update'){
    update();
} else if(subcommand === 'destroy'){
    destroy();
} else {
    console.error('Usage: node pets.js [read | create | update | destroy]');
    process.exit([1]);
}
