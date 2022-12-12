import http from "node:http";
import {readFile} from "node:fs/promises";

let petRegExp = /^\/pets\/(.*)$/;

let server = http.createServer((request, response) => {
    let { method, url } = request;

    if (method === "GET" && url == "/pets"){
        readFile("./pets.json", "utf-8").then((text) => {
            response.setHeader("Content-Type" , "application/json");
            response.end(text);
        });
    } else if(method === "GET" && petRegExp.test(url)){
        let matches = petRegExp.exec(url);
        let index = matches[1]
        readFile("./pets.json", "utf-8").then((text) => {
            let pets = JSON.parse(text);
            let selectedPet = pets[index];
            response.setHeader("Content-Type" , "application/json");
            response.end(JSON.stringify(selectedPet));
        });
    } else{
        response.end("Unknown request")
    }
});

server.listen(3000, () => {
    console.log("Server running on port 3000")
})