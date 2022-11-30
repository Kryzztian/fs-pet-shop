#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';

// console.log(process.argv)
let subcommand = process.argv[2]
if( subcommand === 'read'){
    readFile("./pets.json" , 'utf-8').then((info) => {
        let data = JSON.parse(info)
        let x = process.argv[3]
        if( x >= data.length || 0 > x){
            console.error("Usage: node pets.js read INDEX")
            process.exit([1]);
        } else if(x === undefined) {
            console.log(data)
        } else {
            console.log(data[x])
        }
    })

} else if(subcommand === 'create'){
    let age = process.argv[3];
    let kind = process.argv[4];
    let name = process.argv[5];
    if(age === undefined || kind === undefined || name === undefined){
        console.error("Usage: node pets.js create AGE KIND NAME")
        process.exit([1]);
    } else {
        let newData = {
            "age": Number(age),
            "kind": kind,
            "name": name
        }
        readFile("./pets.json" , 'utf-8').then((info) => {
            let data = JSON.parse(info)
            data.push(newData)
            let jsonUpdate = JSON.stringify(data)
            writeFile("./pets.json" , jsonUpdate)
            // this works. but I dont like it. there is a better way
            // WE HAVE THE TECHNOLOGY
            // Maybe use constructor with classes
            // and use await for the async functions?
            })
        }

    
    } else if (subcommand === 'update') {
        let index = process.argv[3]; 
        let age = process.argv[4];
        let kind = process.argv[5];
        let name = process.argv[6];
        if(index === undefined ||age === undefined || kind === undefined || name === undefined){
            console.error('Usage: node pets.js update INDEX AGE KIND NAME')
            process.exit([1]);
        } else {
            let newData = {
                "age": Number(age),
                "kind": kind,
                "name": name
            }
            readFile("./pets.json" , 'utf-8').then((info) => {
                let data = JSON.parse(info)
                data[index] = newData
                let jsonUpdate = JSON.stringify(data)
                writeFile("./pets.json" , jsonUpdate)
            })
            // this code also works. but again I dont like it
            // see subcommand === create notes
        }
    } else if (subcommand === 'destroy'){
        let index = Number(process.argv[3]) 
        if(index === undefined){
            console.error('Usage: node pets.js destroy INDEX')
            process.exit([1]);
        } else {
            readFile("./pets.json" , 'utf-8').then((info) => {
                let data = JSON.parse(info)
                data.splice(index,1);
                let jsonUpdate = JSON.stringify(data)
                writeFile("./pets.json" , jsonUpdate)
            })
            // again this all works, but there is a better whey
        }

    } else {
    console.error('Usage: node pets.js [read | create | update | destroy]');
    process.exit([1]);
}