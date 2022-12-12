import express, { application } from "express";
import { readFile, writeFile } from 'node:fs/promises';
import morgan from "morgan";

let app = express();
let info = await readFile("./pets.json" , 'utf-8')
let data = (JSON.parse(info));
let jsonUpdate = JSON.stringify(data)

let create = (newPet) => {
    data.push(newPet);
    return jsonUpdate
}

// let update = (change) => {
//     for( let key in change) {
//         existingPet[key] = change[key]
//     }
//     return jsonUpdate
// }

app.use(express.json());
app.use(morgan("tiny"));


app.get('/pets', async (req, res) => {
    res.send(data)
})

app.get('/pets/:index', async (req, res) => {
    let { index } = req.params;
    if(data[index] === undefined){
        res.status(404).send('Not Found') 
    } else{
        res.send(data[index])
    }
})


app.post('/pets', async (req, res) => {
    let pet = req.body;
    if(typeof pet.age !== "number" || pet.kind === undefined || pet.name === undefined){
        res.status(400).send('Bad Request')
    } else {
        writeFile("./pets.json" , create(pet));
        res.send(pet);
    }
})

app.patch('/pets/:index', async (req, res) => {
    let change = req.body;
    //let { index } = req.params; why doesnt this work for me
    let index = req.params.index;
    let existingPet = data[index];
    if((Object.hasOwn(change, "age") === true && typeof change.age === "number") 
    || Object.hasOwn(change, "kind") === true 
    || Object.hasOwn(change, "name") === true)
        {
        for( let key in change) {
        existingPet[key] = change[key];
        }
    res.send(data[index])
    writeFile("./pets.json" , JSON.stringify(data));
    } else {
        res.status(400).send('bad response')
            // '| Request Method | Request URL | Request Body | Response Status | <br> | Response Content-Type | Response Body | <br> | POST | /pets | { "name": "", "age": "two", "kind": "" } | 400 | text/plain | Bad Request | |'
            // what the hell is this even
    // had issue where I was writing  writeFile("./pets.json" , jsonupdate);
    // but since jsonUpdate was the original data it was just writing the original stuff
    // had to change it to above, so that the modified data was stringified.
     }
})

app.delete('/pets/:index', (req, res) => {
    let index = req.params.index;
    res.send(data[index]);
    data.splice(index, 1);
    writeFile("./pets.json" , JSON.stringify(data));
}) 

app.use((req, res) => {
    res.status(404).send("Not Found")
})

app.get('/boom', (req, res) => {
    res.status(500).send("Internal Server Error")
})

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send("internal Sataus Error")
})


// app.get(path, async function(req, res){
//     if(req.params.index === undefined){
//         res.send('data.index')
//         //res.send(req.params)
//         process.exit([1])
//     } else {
//         res.send(data)
//         console.dir(req.params)
//         //process.exit([1])
//     }  
// })  unfortunately this did not work as expected. gonna use router function I think


app.listen(3000, function(){
    console.log('server is running')
})