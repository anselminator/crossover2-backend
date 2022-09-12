const express = require('express');
const app = express();
const mongoose = require("mongoose");
const cors = require('cors');

const port = process.env.PORT || 5000;

const players = require("../basketballPlayers.json");

app.get("/", (req,res) => {
    const countries = players.map((country) => country.country);
    res.send(countries);
})


app.get("/:country", (req,res) => {
    const countryName = req.params.country;
    const team = players.filter(country => {return country.country === countryName} )[0]; 
    console.log("team =",team);
    const playersNames = team.players.map((p) => p.name);
    res.send(playersNames);
})

app.get("/:country/:player", (req,res) => {
    const countryName = req.params.country;
    const playerName = req.params.player;
    const team = players.filter(country => {return country.country === countryName} )[0]; 
    console.log("team =",team);
    const playersNames = team.players.map((p) => p.name);
    const player = team.players.find((p) => p.name===playerName);
    console.log("player details ", player);
    res.send(player);
})



app.listen(port, () => console.log('Server started on port ' + port));