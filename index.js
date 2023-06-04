require("dotenv").config();
const nedb = require("nedb");
const express = require("express");
const server = express();

async function getData(link)
{
    const fetch = await import("node-fetch");
    return await (await fetch.default(link)).json();
}

const database = new nedb("public/weather.dat");
database.loadDatabase();

const port = process.env.PORT || 1000;
server.listen(port, () => console.log(`Server is listening at port ${port} ~( ˘▾˘~)`));
server.use(express.static("public"));
server.use(express.json("1mb"));

server.post("/api", (request, response) => {
    console.log("I got a request (!! `◯`)∑");
    
    database.insert({...request.body});
    
    response.json({
        status: "Data saved successfuly ＼(￣O￣)"
    });
});

server.get("/api", (request, response) => {
    console.log("I got a request (!! `◯`)∑");
    
    database.find({}, (error, data) => {
        response.json(data);
    });
});

server.get("/api/:lat/:lon", async (request, response) => {
    console.log("I got a request (!! `◯`)∑");
    
    const apiKey = process.env.API_KEY;
    const weatherApiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${request.params.lat}&lon=${request.params.lon}&appid=${apiKey}`;
    const airQualityApiURL = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${request.params.lat}&lon=${request.params.lon}&appid=${apiKey}`;
    
    const weatherData = await getData(weatherApiURL);
    const airQualityData = await getData(airQualityApiURL);
    
    response.json({
        weather: weatherData,
        air_quality: airQualityData
    });
});