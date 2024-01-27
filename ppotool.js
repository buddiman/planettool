const runPackageEndSequence = new Uint8Array([0x03, 0x72, 0x75, 0x6e])
const catchPackageEndSequence = new Uint8Array([0x02]);
const minWaitTimeFish = 1150;
const maxWaitTimeFish = 1875;

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
    "Jellicent", "Ferroseed", "Inkay", "Binacle", "Skrelp", "Clauncher", "Clefairy", "Rotom-Heat", "Rotom-Wash",
    "Rotom-Frost", "Rotom-Fan", "Rotom-Mow"]

const extremeRares = ["Bulbasaur", "Venusaur", "Charmander", "Charizard", "Squirtle", "Blastoise", "Machoke",
    "Farfetch'd", "Onix", "Rhyhorn", "Kangaskhan", "Scyther", "Electabuzz", "Pinsir", "Snorlax", "Dratini", "Dragonair",
    "Dragonite", "Chikorita", "Meganium", "Cyndaquil", "Typhlosion", "Totodile", "Feraligatr", "Sudowoodo", "Gligar",
    "Steelix", "Heracross", "Sneasel", "Swinub", "Skarmory", "Elekid", "Treecko", "Sceptile", "Torchic", "Mudkip",
    "Swampert", "Mawile", "Numel", "Swablu", "Altaria", "Feebas", "Milotic", "Duskull", "Dusclops", "Tropius", "Glalie",
    "Spheal", "Walrein", "Bagon", "Salamence", "Turtwig", "Chimchar", "Infernape", "Piplup", "Empoleon", "Bronzor",
    "Bronzong", "Bonsly", "Mime Jr.", "Spritomb", "Gible", "Munchlax", "Hippopotas", "Hippowdon", "Skorupi", "Drapion",
    "Snover", "Abomasnow", "Mamoswine", "Phione", "Sandile", "Solosis", "Foongus", "Amoonguss", "Litwick", "Lampent",
    "Druddigon", "Golett", "Pawniard", "Deino", "Hydreigon", "Larvesta", "Volcarona", "Chespin", "Fennekin",
    "Fletchling", "Helioptile", "Goomy", "Klefki", "Machop"]

const legendaries = ["Articuno", "Zapdos", "Moltres", "Mew", "Raikou", "Entei", "Suicune", "Heatran",
    "Cresselia", "Manaphy", "Darkrai", "Shaymin"]

const ppotoolWindow = document.createElement('div');
const resizer = document.createElement('div');

// Settings Variables
let pokemonToCatchList = [];
let shouldRunOnElite = false;
let mode = "default"
let isResizing = false;
let lastX, lastY, startX, startY;
let isDragging = false;

// Status Variables
let isElite = false;
let isShiny = false;
let isPaused = false;
let isInBattle = false;
let currentPokemonName = '';

// Package Variables
let fullFightPackage = null;
let fightPackageBegin = null;
let fightPackageEnd = null
let catchPackageBegin = null;
let catchPackageToken = null;
let catchPackageEnd = null;

// Other Variables
let socket = null;
let w = [];
let h = null;
let checksums = null;
let p = null;

function startup() {
    console.log("PPOTool > PPOTool started");
    ppotoolWindow.style = "position:absolute;left:0;top:0;height:45%;width:25%;background-color:rgba(255,255,255,0.8);display:flex;flex-direction:column;font-family:\"Trebuchet MS\"";
    ppotoolWindow.innerHTML = "<h2>PPOTool</h2><div></div>Welcome to the PPOTool. Just click on next and the setup will begin. When the tool is running, you can change " +
        "the List of Pokémon when it should stop. By Default, it will stop at all Very Rare, Extremely Rare and Legendary Pokémon.";
    resizer.style.cssText = "width: 10px; height: 10px; background-color: #3498db; position: absolute; bottom: 0; right: 0; cursor: se-resize;";
    ppotoolWindow.appendChild(resizer);
    document.body.appendChild(ppotoolWindow);

    resizer.addEventListener('mousedown', (e) => {
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
    });

    document.addEventListener('mousemove', (e) => {
        if (isResizing) {
            const width = ppotoolWindow.offsetWidth + (e.clientX - startX);
            const height = ppotoolWindow.offsetHeight + (e.clientY - startY);
            ppotoolWindow.style.width = `${width}px`;
            ppotoolWindow.style.height = `${height}px`;
            startX = e.clientX;
            startY = e.clientY;
        }
    });

    document.addEventListener('mouseup', () => {
        isResizing = false;
    });

    document.getElementById('ppotoolHeader').addEventListener('mousedown', (e) => {
        isDragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = e.clientX - lastX;
            const deltaY = e.clientY - lastY;
            const newLeft = ppotoolWindow.offsetLeft + deltaX;
            const newTop = ppotoolWindow.offsetTop + deltaY;
            ppotoolWindow.style.left = `${newLeft}px`;
            ppotoolWindow.style.top = `${newTop}px`;
            lastX = e.clientX;
            lastY = e.clientY;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    const moveButton = document.createElement('button');
    moveButton.textContent = 'Normal Mode';
    moveButton.addEventListener('click', () => {
        runTool()
    });

    const fishButton = document.createElement('button');
    fishButton.textContent = 'Fishing Mode';
    fishButton.addEventListener('click', () => {
        mode = "fishing"
        runTool()
    });

    const miningButton = document.createElement('button');
    miningButton.textContent = 'Mining Mode (UNAVAILABLE)';
    miningButton.addEventListener('click', () => {
        mode = "mining"
        runTool()
    });

    ppotoolWindow.appendChild(moveButton);
    ppotoolWindow.appendChild(fishButton);
    ppotoolWindow.appendChild(miningButton)

    pokemonToCatchList = legendaries.concat(extremeRares, veryRares);
    pokemonToCatchList.sort();
}


function fight() {
    if (isPaused) {
        return;
    }
    clearTimeout(p);
    new Uint8Array(fullFightPackage)[51] = checksums[0];
    new Uint8Array(fullFightPackage)[52] = checksums[1];
    new Uint8Array(fullFightPackage)[53] = checksums[2];
    p = setInterval(() => {
        socket.send(fullFightPackage);
    }, 1000);
}

function runAway() {
    clearTimeout(p);
    const totalLength = fightPackageBegin.length + fightPackageEnd.length + runPackageEndSequence.length + 3;
    const runAwayPackage = new Uint8Array(totalLength)

    runAwayPackage.set(fightPackageBegin, 0)
    runAwayPackage.set(checksums, 51)
    runAwayPackage.set(fightPackageEnd, 54)
    runAwayPackage.set(runPackageEndSequence, 72)

    runAwayPackage[2] = 0x49


    p = setInterval(() => {
        if (isPaused) {
            return;
        }
        socket.send(runAwayPackage);
    }, 1000);
}



function runTool() {
    if(mode === "default") {
        ppotoolWindow.innerHTML = "<h2>Take a step in any direction</h2>";
    }
    if(mode === "fishing") {
        ppotoolWindow.innerHTML = "<h2>Fishing mode activated</h2>Walk to water, use your fishing rod. Make sure that " +
            "you hook correctly in the green or yellow part. After that, select your action to use in the fight. After " +
            "that, everything is setup and you don't need to do anything.";
    }

    const z = _0xbee556 => {
        let webSocketReader = new FileReader();
        webSocketReader.addEventListener("loadend", () => {
            let receivedPackage = new Uint8Array(webSocketReader.result);
            let receivedPackageAsString = String.fromCharCode(...receivedPackage);

            if (receivedPackageAsString.includes("gametype")) {
                setCurrentPokemonName(receivedPackageAsString)
                checkForShinyAndElite(receivedPackageAsString)

                isInBattle = true;
                if (!fullFightPackage || isPaused) {
                    return;
                }

                extractFightChecksum(receivedPackage)

                if (pokemonToCatchList.includes(currentPokemonName) || isElite || isShiny) {
                    sendStopMessageToDiscord()
                    if (shouldRunOnElite && isElite) {
                        runAway()
                        console.log("PPOTool > Successfully ran away from Elite!")
                    }
                    return;
                }
                fight();
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
                    console.log("PPOTool > Upkeep received!")
                    fight();
                }
            }

            if(receivedPackageAsString.includes("call.hook") && catchPackageBegin && !isPaused) {
                let token = receivedPackage.slice(30, 46)
                catchPackageToken = token

                const totalLength = catchPackageBegin.length + catchPackageToken.length + catchPackageEnd.length + 1;
                const fullCatchPackage = new Uint8Array(totalLength)

                fullCatchPackage.set(catchPackageBegin, 0)
                fullCatchPackage.set(catchPackageToken, catchPackageBegin.length)
                fullCatchPackage.set(catchPackageEnd, catchPackageBegin.length + catchPackageToken.length)
                fullCatchPackage.set(catchPackageEndSequence, totalLength - 1)

                const randomFraction = Math.random();
                const randomNumber = Math.floor(randomFraction * (maxWaitTimeFish - minWaitTimeFish + 1)) + minWaitTimeFish;

                setTimeout(function() {
                    socket.send(fullCatchPackage)
                }, randomNumber);
            }
        });
        webSocketReader.readAsArrayBuffer(_0xbee556.data);
    };

    const webSocketSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (origPackage) {
        if (origPackage == null) {
            return;
        }
        if (origPackage.byteLength === 79 && !fullFightPackage) {
            fullFightPackage = origPackage;
            fightPackageBegin = new Uint8Array(origPackage.slice(0, 51))
            fightPackageEnd = new Uint8Array(origPackage.slice(54, 72))
        }

        if (origPackage.byteLength === 100 && !catchPackageBegin && mode === "fishing") {
            ppotoolWindow.children[0].innerHTML = "Fishing is running! Refresh page to stop the bot."
            setupUI()
            console.log("Initial Catch package received!")
            catchPackageBegin = new Uint8Array(origPackage.slice(0, 69))
            catchPackageEnd = new Uint8Array(origPackage.slice(85, 99))
        }

        // 0x91 = 145
        if (origPackage.byteLength === 145 && !h && mode === "default") {
            w.push(origPackage);
            if (w.length === 2) {
                ppotoolWindow.children[0].innerHTML = "Take a step in the opposite direction";
            }
            if (w.length === 4) {
                ppotoolWindow.children[0].innerHTML = "Use a move once the encounter starts. This move will be executed everytime in a fight now. Refresh page to stop the bot.";
                h = w;
                doMovement()
                setupUI()

            }
        }

        if (!socket) {
            socket = this;
            socket.addEventListener("message", z);
        }
        webSocketSend.call(this, origPackage);
    };
}

startup()

function doMovement() {
    x = setInterval(() => {
        // MOVEMENT HERE!
        if (!isInBattle) {
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
        if(isPaused) {
            clearInterval(x)
            console.log("PPOTool > Tool paused!")
        }
    }, 400);
}

function setupUI() {
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

    // Pause Button
    const stopButton = document.createElement('button');
    stopButton.textContent = 'Tool is running... Click here to pause!';
    stopButton.style.marginTop = '10px'; // Add some margin for better visibility
    stopButton.style.backgroundColor = 'green'

    // Add event listener to the stop button
    stopButton.addEventListener('click', () => {
        if (!isPaused) {
            isPaused = true
            stopButton.style.backgroundColor = 'red'
            stopButton.textContent = 'Tool is NOT running... Click here to restart!'
        } else {
            isPaused = false
            doMovement()
            stopButton.style.backgroundColor = 'green'
            stopButton.textContent = 'Tool is running... Click here to pause!'
        }
    });

    // Create a checkbox element
    const runOnEliteCheckbox = document.createElement('input');
    runOnEliteCheckbox.type = 'checkbox';

    const runOnEliteCheckboxLabel = document.createElement('label');
    runOnEliteCheckboxLabel.textContent = 'Run on all ELITES?';

    runOnEliteCheckbox.style.marginTop = '10px';
    runOnEliteCheckbox.style.marginRight = '5px';
    runOnEliteCheckboxLabel.style.marginTop = '10px';

    runOnEliteCheckbox.addEventListener('change', function () {
        // Update the global variable based on the checkbox state
        shouldRunOnElite = runOnEliteCheckbox.checked;

        // Perform any actions with the updated value
        console.log('PPOTool > Checkbox state changed. shouldRunOnElite:', shouldRunOnElite);
    });

    // Append the stop button to the ppotoolWindow
    ppotoolWindow.appendChild(stopButton);
    ppotoolWindow.appendChild(selectBox);
    ppotoolWindow.appendChild(removeButton);
    ppotoolWindow.appendChild(addButton);
    ppotoolWindow.appendChild(runOnEliteCheckbox);
    ppotoolWindow.appendChild(runOnEliteCheckboxLabel);


    function updateSelectBoxOptions() {
        selectBox.innerHTML = '';
        pokemonToCatchList.forEach(pokemonName => {
            const optionElement = document.createElement('option');
            optionElement.value = pokemonName;
            optionElement.textContent = pokemonName;
            selectBox.appendChild(optionElement);
        });
    }
}

function extractFightChecksum(battlePackage) {
    // Sequence to find ("result")
    const sequenceToFind = new Uint8Array([0x75, 0x70, 0x64, 0x61, 0x74, 0x65]);

    for (let i = 0; i < battlePackage.length; i++) {
        if (battlePackage.subarray(i, i + sequenceToFind.length).every((value, index) => value === sequenceToFind[index])) {
            i += sequenceToFind.length;

            const extractedBytes = battlePackage.subarray(i + 5, i + 8);
            checksums = Array.from(extractedBytes);
            break;
        }
    }
}

function checkForShinyAndElite(battlePackageAsString) {
    if (battlePackageAsString.includes("ELITE")) {
        isElite = true;
    }

    if (battlePackageAsString.includes("shiny")) {
        console.log("PPOTool > SHINY FOUND!")
        isShiny = true;
    }
}

function setCurrentPokemonName(battlePackageAsString) {
    const match = battlePackageAsString.match(/\|player\|p2\|([^|]*)\|\|/)
    currentPokemonName = match ? match[1] : null
    if (!currentPokemonName) {
        console.log("PPOTool > No pokemon name found. ERROR!")
    }
    console.log("PPOTool > Current Pokemon: " + currentPokemonName)
}

function sendStopMessageToDiscord() {
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
}

