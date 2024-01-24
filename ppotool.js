socket = null;
isElite = false;
isShiny = false;
isPaused = false;
w = [];
h = null;
checksums = null
isInBattle = false;
fightPackage = null;
currentPokemonName = '';
p = null;
n = 0x1;
y = false;
fight = () => {
    clearTimeout(p);
    new Uint8Array(fightPackage)[51] = checksums[0];
    new Uint8Array(fightPackage)[52] = checksums[1];
    new Uint8Array(fightPackage)[53] = checksums[2];
    p = setInterval(() => {
        socket.send(fightPackage);
    }, 1000);
};

console.log("PPOTool > PPOTool started")
ppotoolWindow = document.createElement('div');
ppotoolWindow.style = "position:absolute;left:0;top:0;height:40%;width:25%;background-color:rgba(255,255,255,0.7);display:flex;flex-direction:column;font-family:\"Trebuchet MS\"";
ppotoolWindow.innerHTML = "<h2>Mons to hunt</h2><div></div><button onclick=\"ppotoolWindow.children[1].innerHTML+=`<a href='javascript:void(0)' onclick='this.remove()'>`+g()+`<br></a>`\">Add (click mons to remove)</button><button style=\"margin-top:auto\" onclick=\"n()\">Next</button>";
g = () => prompt("Mon to add");

n = () => {
    let customList = [...ppotoolWindow.children[0x1].children].map(_0x158ebf => _0x158ebf.textContent);

    let pokemonToCatchList
    if(customList.length === 0) {
        pokemonToCatchList = legendaries.concat(extremeRares, veryRares)
    } else {
        pokemonToCatchList = customList
    }

    if (pokemonToCatchList) {
        console.log("PPOTool > Catchlist: " + pokemonToCatchList)
    }
    ["Moves to use GEHT NET", '', "Add (enter \"elite\" for all elites)", "Next (default is slot 1)"].forEach((_0x53d138, _0x27ce07) => ppotoolWindow.children[_0x27ce07].innerHTML = _0x53d138);
    g = () => prompt("Mon") + " - " + prompt("Move to use (ie. 1 for move in slot 1)");
    n = () => {
        let pokemonSpecialMoveList = Object.fromEntries([...ppotoolWindow.children[0x1].children].map(_0x1c287e => _0x1c287e.textContent.split(" - ").map((_0x37dcc5, _0x2c06b5) => _0x2c06b5 ? _0x37dcc5 > 0x4 || _0x37dcc5 < 0x1 ? 0x1 : parseInt(_0x37dcc5) : _0x37dcc5)));
        ppotoolWindow.innerHTML = "<h2>Take a step</h2>";
        z = _0xbee556 => {
            let webSocketReader = new FileReader();
            webSocketReader.addEventListener("loadend", () => {
                let receivedPackage = new Uint8Array(webSocketReader.result);
                let receivedPackageAsString = String.fromCharCode(...receivedPackage);
                let _0x18c87c = (receivedPackageAsString.split("\b\0") ?? []).map(_0x55f493 => _0x55f493.split("\0")[0].slice(1));
                if (receivedPackageAsString.includes("gametype")) {
                    const match = receivedPackageAsString.match(/\|player\|p2\|([^|]*)\|\|/)
                    currentPokemonName = match ? match[1] : null
                    if (!currentPokemonName) {
                        console.log("No pokemon name found. ERROR!")
                    }
                    console.log("POKENAME: " + currentPokemonName)
                }


                if (receivedPackageAsString.includes("gametype") && receivedPackageAsString.includes("ELITE")) {
                    console.log("ELITE FOUND!")
                    isElite = true;
                }

                if (receivedPackageAsString.includes("gametype") && receivedPackageAsString.includes("SHINY")) {
                    console.log("SHINY FOUND!")
                    isShiny = true;
                }


                if (receivedPackageAsString.includes("|win|")) {
                    // Set battle = false. Win battle
                    isInBattle = false;
                    isElite = false;
                    isShiny = false;
                    clearInterval(p);
                } else {
                    if (receivedPackageAsString.includes("upkeep") && !isPaused) {
                        // TODO: investigate
                        console.log("UPKEEP?!?!")
                        fight();
                    }
                }

                if (receivedPackageAsString.includes("gametype")) { // || y) {
                    isInBattle = true;
                    if (!fightPackage && isPaused) {
                        return;
                    }

                    // Sequence to find ("result")
                    const sequenceToFind = new Uint8Array([0x75, 0x70, 0x64, 0x61, 0x74, 0x65]);

                    for (let i = 0; i < receivedPackage.length; i++) {
                        // Check if the current position matches the start of the sequence
                        if (receivedPackage.subarray(i, i + sequenceToFind.length).every((value, index) => value === sequenceToFind[index])) {
                            i += sequenceToFind.length;

                            const extractedBytes = receivedPackage.subarray(i + 5, i + 8);
                            checksums = Array.from(extractedBytes);
                            break;
                        }
                    }

                    if (pokemonToCatchList.includes(currentPokemonName) || isElite) {
                        let pokemonName = ""
                        if(isElite) {
                            pokemonName += "ELITE "
                        }
                        if(isShiny) {
                            pokemonName += "SHINY "
                        }
                        pokemonName += currentPokemonName
                        fetch(discord[0], {
                            'method': "post",
                            'headers': {
                                'Content-Type': "application/json"
                            },
                            'body': JSON.stringify({
                                'content': '<@' + discord[1] + "> we got " + pokemonName + '!',
                                'allowed_mentions': {
                                    'parse': ["users"]
                                }
                            })
                        });
                        return;
                    }
                    // new Uint8Array(fightPackage)[76] = (isElite ? pokemonSpecialMoveList.elite : pokemonSpecialMoveList[currentPokemonName] + 0x30) ?? 0x31;
                    fight();
                }
            });
            webSocketReader.readAsArrayBuffer(_0xbee556.data);
        };
        const _0x530e22 = WebSocket.prototype.send;
        WebSocket.prototype.send = function (origPackage) {
            // Possible check -> 79 / 23 -> Prob. 23, only infight, 79 when using a move!
            if (origPackage.byteLength == 79 && !fightPackage) {
                fightPackage = origPackage;
            }

            // 0x91 = 145
            if (origPackage.byteLength == 145 && !h) {
                w.push(origPackage);
                if (w.length == 2) {
                    ppotoolWindow.children[0].innerHTML = "Walk backwards";
                }
                if (w.length == 4) {
                    ppotoolWindow.children[0].innerHTML = "Use a move once the encounter starts. Refresh page to stop the bot. Happy hunting!";
                    h = w;
                    x = setInterval(() => {
                        // MOVEMENT HERE!
                        if (!isInBattle && !isPaused) {
                            for (i = 0; i < 4; i++) {
                                for (j = 0; j < 4; j++) {
                                    let _0x458770 = new Uint8Array(h[j]);
                                    _0x458770[0x45]++;
                                    if (_0x458770[69] == 0) {
                                        _0x458770[68]++;
                                    }
                                    if (i % 2 > 0) {
                                        _0x458770[84]++;
                                    }
                                }
                                socket.send(h[i]);
                            }
                        }
                    }, 400);

                    // Create a stop button dynamically
                    const stopButton = document.createElement('button');
                    stopButton.textContent = 'Bot is running... Stop Bot!';
                    stopButton.style.marginTop = '10px'; // Add some margin for better visibility
                    stopButton.style.backgroundColor  = 'green'

                    // Add event listener to the stop button
                    stopButton.addEventListener('click', () => {
                        if(!isPaused) {
                            isPaused = true
                            stopButton.style.backgroundColor  = 'red'
                            stopButton.textContent = 'Bot is NOT running... Restart Bot!'
                        } else {
                            isPaused = false
                            stopButton.style.backgroundColor  = 'green'
                            stopButton.textContent = 'Bot is running... Stop Bot!'
                        }
                    });


                    // Append the stop button to the ppotoolWindow
                    ppotoolWindow.appendChild(stopButton);
                }
            }
            if (!socket) {
                socket = this;
                socket.addEventListener("message", z);
            }
            _0x530e22.call(this, origPackage);
        };
    };
};
document.body.appendChild(ppotoolWindow);

const veryRares = ["Pikachu", "Raichu", "Vulpix", "Jigglypuff", "Psyduck", "Golduck", "Growlithe", "Abra",
    "Kadabra", "Alakazam", "Ponyta", "Rapidash", "Slowpoke", "Slowbro", "Doduo", "Dodrio", "Seel", "Dewgong",
    "Exeggcute", "Cubone", "Marowak", "Chansey", "Tangela", "Seadra", "Staryu", "Starmie", "Magmar", "Tauros",
    "Ditto", "Chinchou", "Pichu", "Cleffa", "Igglybuff", "Natu", "Mareep", "Flaaffy", "Ampharos", "Yanma",
    "Murkrow", "Wobbuffet", "Girafarig", "Teddiursa", "Ursaring", "Corsola", "Mantine", "Houndour", "Houndoom",
    "Phanpy", "Donphan", "Magby", "Miltank", "Makuhita", "Hariyama", "Nosepass", "Aron", "Lairon", "Aggron",
    "Electrike", "Manectric", "Carvanha", "Sharpedo", "Wailmer", "Wailord", "Torkoal", "Spoink", "Trapinch",
    "Flygon", "Zangoose", "Seviper", "Lunatone", "Solrock", "Barboach", "Whishcash", "Baltoy", "Claydol",
    "Shuppet", "Banette", "Absol", "Clamperl", "Relicanth", "Starly", "Shinx", "Luxio", "Luxray", "Buizel",
    "Floatzel", "Happiny", "Croagunk", "Toxicroak", "Mantyke", "Yanmega", "Rotom", "Roggenrola", "Woobat",
    "Drilbur", "Excadrill", "Timburr", "Maractus", "Sigilyph", "Trubbish", "Zoroark", "Gothita", "Frillish",
    "Jellicent", "Ferroseed", "Inkay", "Binacle", "Skrelp", "Clauncher"]

const extremeRares = ["Bulbasaur", "Venusaur", "Charmander", "Charizard", "Squirtle", "Blastoise", "Machoke",
    "Farfetch'd", "Onix", "Rhyhorn", "Kangaskhan", "Scyther", "Electabuzz", "Pinsir", "Snorlax", "Dratini", "Dragonair",
    "Dragonite", "Chikorita", "Meganium", "Cyndaquil", "Typhlosion", "Totodile", "Feraligatr", "Sudowoodo", "Gligar",
    "Steelix", "Heracross", "Sneasel", "Swinub", "Skarmory", "Elekid", "Treecko", "Sceptile", "Torchic", "Mudkip",
    "Swampert", "Mawile", "Numel", "Swablu", "Altaria", "Feebas", "Milotic", "Duskull", "Dusclops", "Tropius", "Glalie",
    "Spheal", "Walrein", "Bagon", "Salamence", "Turtwig", "Chimchar", "Infernape", "Piplup", "Empoleon", "Bronzor",
    "Bronzong", "Bonsly", "Mime Jr.", "Spritomb", "Gible", "Munchlax", "Hippopotas", "Hippowdon", "Skorupi", "Drapion",
    "Snover", "Abomasnow", "Mamoswine", "Phione", "Sandile", "Solosis", "Foongus", "Amoonguss", "Litwick", "Lampent",
    "Druddigon", "Golett", "Pawniard", "Deino", "Hydreigon", "Larvesta", "Volcarona", "Chespin", "Fennekin",
    "Fletchling", "Helioptile", "Goomy", "Klefki"]

const legendaries = ["Articuno", "Zapdos", "Moltres", "Mew", "Raikou", "Entei", "Suicune", "Heatran",
    "Cresselia", "Manaphy", "Darkrai", "Shaymin"]