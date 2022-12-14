import express, { application } from "express";
import { readFile, writeFile } from 'node:fs/promises';
import morgan from "morgan";
import postgres from "postgres";



let app = express();
// let info = await readFile("./pets.json" , 'utf-8');
// let data = (JSON.parse(info));
// let jsonUpdate = JSON.stringify(data);
// let create = (newPet) => {
    //     data.push(newPet);
    //     return jsonUpdate
    // }
// MAYBE I will not be using the above variables

let sql = postgres({
    database : 'petshop',
    password : 'Kryzztian1!'
});

let crudFunc = {
    async pets(){ 
        let pet = await sql`SELECT * FROM pets`;
        return pet
    },
    async selectPet(index){
        let pet = await sql `SELECT * FROM pets WHERE id = ${index}`
        return pet
    }, 
    async createPet(age, name, kind){
        let pet = await sql`INSERT INTO pets 
        (age, name, kind) 
        VALUES
        (${age},${name},${kind}) 
        RETURNING name, age;`
        return pet;
    },
    async updatePet(change, id){
        let pet = await sql`
            UPDATE pets 
            SET ${sql(change)}
            WHERE id = ${id} RETURNING *
            `
            return pet
            //sql(`${existingPet}, ${name || null}, ${age || null}, ${kind || null}`)
            //console.log(id)
        }
        
    }


app.use(express.json());
app.use(morgan("tiny"));

app.get('/pets', async (req, res) => {
   res.send(await crudFunc.pets())
})

app.get('/pets/:index', async (req, res) => {
    let index = req.params.index;
    let result = await crudFunc.selectPet(index);
    if (result.length === 0){
        res.status(404);
        res.set("Content-Type", "text/plain");
        res.send("Not Found");
    } else {
        res.json((result)[0])
    }
})


app.post('/pets', async (req, res) => {
    let pet = req.body;
    let { age, name, kind } = pet;
    if(typeof age !== "number" || kind === undefined || name === undefined){
        res.status(400).send('Bad Request')
    } else {
        await crudFunc.createPet(age, name, kind);
        res.send(pet);
    }
})

app.patch('/pets/:index', async (req, res) => {
    let change = req.body;
    let id = req.params.index;
    let existingPet = await crudFunc.selectPet(id);
    if((Object.hasOwn(change, "age") === true && typeof change.age === "number") 
    || Object.hasOwn(change, "kind") === true 
    || Object.hasOwn(change, "name") === true) {
        let updatedPet = await crudFunc.updatePet(change, id);
        res.send(updatedPet[0])
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