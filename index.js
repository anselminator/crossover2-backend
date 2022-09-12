const express = require("express");
const app = express();
const fs = require("fs");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

const port = process.env.PORT || 5000;

let players = require("./basketballPlayers.json");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use(morgan("dev"));

app.get("/", (req, res) => {
    const countries = players.map((country) => country.country);
    res.status(200).send(countries);
});

app.get("/:country", (req, res) => {
    const countryName = req.params.country;
    const team = players.filter((country) => {
        return country.country === countryName;
    })[0];
    if (!team) {
        res.status(404).send("error: team " + countryName + " doesnt exist.");
    }

    console.log("team =", team);
    const playersNames = team.players.map((p) => p.name);
    res.status(200).send(playersNames);
});

app.get("/:country/:player", (req, res) => {
    const countryName = req.params.country;
    const playerName = req.params.player;
    const team = players.filter((country) => {
        return country.country === countryName;
    })[0];
    if (!team) {
        res.status(404).send("error: team " + countryName + " doesnt exist.");
    }
    console.log("team =", team);
    const playersNames = team.players.map((p) => p.name);
    const player = team.players.find((p) => p.name === playerName);
    if (!player) {
        res
            .status(404)
            .send(
                "error: player " +
                playerName +
                " in team " +
                countryName +
                " doesnt exist."
            );
    }
    console.log("player details ", player);
    res.status.send(player);
});

app.delete("/:country/:player", (req, res) => {
    const countryName = req.params.country;
    const playerName = req.params.player;
    const team = players.filter((country) => {
        return country.country === countryName;
    })[0];
    if (!team) {
        res.status(404).send("error: team " + countryName + " doesnt exist.");
    }
    console.log("team =", team);
    const indexOfTeam = players.findIndex((team) => team.country === countryName);

    const playersNames = team.players.map((p) => p.name);
    const player = team.players.find((p) => p.name === playerName);
    if (!player) {
        res
            .status(404)
            .send(
                "error: player " +
                playerName +
                " in team " +
                countryName +
                " doesnt exist."
            );
    }
    players[indexOfTeam].players = players[indexOfTeam].players.filter(
        (p) => p.name != playerName
    );

    fs.writeFile("./basketballPlayers.json", JSON.stringify(players), (err) => {
        if (err) {
            console.log(err);
            throw err;
        }
    });

    console.log("player details ", player);
    res.status(200).send(player);
});

app.post("/:country", (req, res) => {
    const { country } = req.params;
    console.log(country);
    const newPlayer = req.body;
    const indexOfTeam = players.findIndex((team) => team.country === country);
    if (indexOfTeam == -1) {
        res.status(404).send("error: team " + country + " doesnt exist.");
    }

    console.log("country", country, " is team with index", indexOfTeam);
    if (players[indexOfTeam].players.find((n) => n.name === newPlayer.name)) {
        console.log("player already exists");
        res
            .status(404)
            .send(
                "error: player " + newPlayer.name + " already is in team " + country
            );
    }
    players[indexOfTeam].players = [...players[indexOfTeam].players, newPlayer];
    console.log(players);

    fs.writeFile("./basketballPlayers.json", JSON.stringify(players), (err) => {
        if (err) {
            console.log(err);
            throw err;
        }
    });
    res.status(200).send(players);
});

app.listen(port, () => console.log("Server started on port " + port));
