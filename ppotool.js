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

let socket = null;
let isElite = false;
let isShiny = false;
let isPaused = false;
let w = [];
let h = null;
let checksums = null;
let isInBattle = false;
let fightPackage = null;
let currentPokemonName = '';
let p = null;
let encounterRateTimeout = 0;

let pokemonToCatchList = legendaries.concat(extremeRares, veryRares);
pokemonToCatchList.sort();

function fight() {
    clearTimeout(p);
    new Uint8Array(fightPackage)[51] = checksums[0];
    new Uint8Array(fightPackage)[52] = checksums[1];
    new Uint8Array(fightPackage)[53] = checksums[2];
    p = setInterval(() => {
        if (isPaused) {
            return;
        }
        socket.send(fightPackage);
    }, 1000);
}

console.log("PPOTool > PPOTool started");
const ppotoolWindow = document.createElement('div');
ppotoolWindow.style = "position:absolute;left:0;top:0;height:40%;width:25%;background-color:rgba(255,255,255,0.8);display:flex;flex-direction:column;font-family:\"Trebuchet MS\"";
ppotoolWindow.innerHTML = "<h2>PPOTool</h2><div></div>Welcome to the PPOTool. Just click on next and the setup will begin. When the tool is running, you can change " +
    "the List of Pokémon when it should stop. By Default, it will stop at all Very Rare, Extremely Rare and Legendary Pokémon.";

function initializeTool() {
    ppotoolWindow.innerHTML = "<h2>Take a step in any direction</h2>";
    const z = _0xbee556 => {
        let webSocketReader = new FileReader();
        webSocketReader.addEventListener("loadend", () => {
            let receivedPackage = new Uint8Array(webSocketReader.result);
            let receivedPackageAsString = String.fromCharCode(...receivedPackage);
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
                // Win or run away successful
                isInBattle = false;
                isElite = false;
                isShiny = false;
                clearInterval(p);
            } else {
                if (receivedPackageAsString.includes("upkeep") && !isPaused) {
                    // Is called when an action in battle is executed but the fight is not finished
                    console.log("UPKEEP?!?!")
                    fight();
                }
            }

            if (receivedPackageAsString.includes("gametype")) {
                isInBattle = true;
                if (!fightPackage && isPaused) {
                    return;
                }

                // Sequence to find ("result")
                const sequenceToFind = new Uint8Array([0x75, 0x70, 0x64, 0x61, 0x74, 0x65]);

                for (let i = 0; i < receivedPackage.length; i++) {
                    if (receivedPackage.subarray(i, i + sequenceToFind.length).every((value, index) => value === sequenceToFind[index])) {
                        i += sequenceToFind.length;

                        const extractedBytes = receivedPackage.subarray(i + 5, i + 8);
                        checksums = Array.from(extractedBytes);
                        break;
                    }
                }

                if (pokemonToCatchList.includes(currentPokemonName) || isElite || isShiny) {
                    let pokemonName = "";
                    if (isElite) {
                        pokemonName += "ELITE ";
                    }
                    if (isShiny) {
                        pokemonName += "SHINY ";
                    }
                    pokemonName += currentPokemonName;
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
                fight();
            }
        });
        webSocketReader.readAsArrayBuffer(_0xbee556.data);
    };

    const webSocketSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (origPackage) {
        if (origPackage == null) {
            return;
        }
        if (origPackage.byteLength === 79 && !fightPackage) {
            fightPackage = origPackage;
        }

        // 0x91 = 145
        if (origPackage.byteLength === 145 && !h) {
            w.push(origPackage);
            if (w.length === 2) {
                ppotoolWindow.children[0].innerHTML = "Take a step in the opposite direction";
            }
            if (w.length === 4) {
                ppotoolWindow.children[0].innerHTML = "Use a move once the encounter starts. This move will be executed everytime in a fight now. Refresh page to stop the bot.";
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
                            setTimeout(function() {
                                socket.send(h[i]);
                            }, encounterRateTimeout);

                        }
                    }
                }, 400);

                // Create a selectable textbox dynamically
                const selectBox = document.createElement('select');
                selectBox.style.marginTop = '10px'; // Add some margin for better visibility

                // Populate the select box with options from pokemonToCatchList
                pokemonToCatchList.forEach(pokemonName => {
                    const optionElement = document.createElement('option');
                    optionElement.value = pokemonName;
                    optionElement.textContent = pokemonName;
                    selectBox.appendChild(optionElement);
                });

                // Create a button to remove the selected Pokémon
                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remove Pokémon';
                removeButton.style.marginTop = '5px'; // Add some margin for better visibility
                removeButton.addEventListener('click', () => {
                    const selectedPokemon = selectBox.value;
                    const index = pokemonToCatchList.indexOf(selectedPokemon);
                    if (index !== -1) {
                        // Remove the selected Pokémon from the array
                        pokemonToCatchList.splice(index, 1);

                        // Update the select box options
                        updateSelectBoxOptions();
                    }
                });

                // Create a button to add a Pokémon using a dialog prompt
                const addButton = document.createElement('button');
                addButton.textContent = 'Add Pokémon';
                addButton.style.marginTop = '5px'; // Add some margin for better visibility
                addButton.addEventListener('click', () => {
                    // Show a dialog prompt to add a Pokémon
                    const newPokemon = prompt('Enter the name of the Pokémon to add:');
                    if (newPokemon && !pokemonToCatchList.includes(newPokemon)) {
                        // Add the new Pokémon to the array
                        pokemonToCatchList.push(newPokemon);
                        pokemonToCatchList.sort()

                        // Update the select box options
                        updateSelectBoxOptions();
                    }
                });


                // Create a stop button dynamically
                const stopButton = document.createElement('button');
                stopButton.textContent = 'Bot is running... Stop Bot!';
                stopButton.style.marginTop = '10px'; // Add some margin for better visibility
                stopButton.style.backgroundColor = 'green'

                // Add event listener to the stop button
                stopButton.addEventListener('click', () => {
                    if (!isPaused) {
                        isPaused = true
                        stopButton.style.backgroundColor = 'red'
                        stopButton.textContent = 'Bot is NOT running... Restart Bot!'
                    } else {
                        isPaused = false
                        stopButton.style.backgroundColor = 'green'
                        stopButton.textContent = 'Bot is running... Stop Bot!'
                    }
                });

                const encounterRateTextboxLabel = document.createElement('label');
                encounterRateTextboxLabel.textContent = 'Encounter rate delay in ms:';
                encounterRateTextboxLabel.style.display = 'block';  // Make the label a block element
                encounterRateTextboxLabel.style.marginTop = '10px';
                const encounterRateTextboxId = 'encounterRateTextboxId';  // Set a unique id for the textbox
                encounterRateTextboxLabel.setAttribute('for', encounterRateTextboxId);


                const encounterRateTextbox = document.createElement('input');
                encounterRateTextbox.type = 'number';
                encounterRateTextbox.placeholder = '0';

                encounterRateTextbox.style.marginTop = '10px';
                encounterRateTextbox.style.padding = '5px';
                encounterRateTextbox.id = encounterRateTextboxId;

                encounterRateTextbox.addEventListener('input', function() {
                    encounterRateTextbox.value = encounterRateTextbox.value.replace(/[^0-9]/g, '')
                    encounterRateTimeout = parseInt(encounterRateTextbox.value, 10)
                });


                // Append the stop button to the ppotoolWindow
                ppotoolWindow.appendChild(stopButton);
                ppotoolWindow.appendChild(selectBox);
                ppotoolWindow.appendChild(removeButton);
                ppotoolWindow.appendChild(addButton);
                document.body.appendChild(encounterRateTextbox);


                function updateSelectBoxOptions() {
                    // Clear existing options
                    selectBox.innerHTML = '';

                    // Populate the select box with updated options
                    pokemonToCatchList.forEach(pokemonName => {
                        const optionElement = document.createElement('option');
                        optionElement.value = pokemonName;
                        optionElement.textContent = pokemonName;
                        selectBox.appendChild(optionElement);
                    });
                }
            }
        }

        if (!socket) {
            socket = this;
            socket.addEventListener("message", z);
        }
        webSocketSend.call(this, origPackage);
    };
}

const nextButton = document.createElement('button');
nextButton.textContent = 'Next';
nextButton.addEventListener('click', initializeTool);


ppotoolWindow.appendChild(nextButton);

document.body.appendChild(ppotoolWindow);