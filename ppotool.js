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
    "Bronzong", "Bonsly", "Mime Jr.", "Spiritomb", "Gible", "Munchlax", "Hippopotas", "Hippowdon", "Skorupi", "Drapion",
    "Snover", "Abomasnow", "Mamoswine", "Phione", "Sandile", "Solosis", "Foongus", "Amoonguss", "Litwick", "Lampent",
    "Druddigon", "Golett", "Pawniard", "Deino", "Hydreigon", "Larvesta", "Volcarona", "Chespin", "Fennekin",
    "Fletchling", "Helioptile", "Goomy", "Klefki", "Machop"]

const legendaries = ["Articuno", "Zapdos", "Moltres", "Mew", "Raikou", "Entei", "Suicune", "Heatran",
    "Cresselia", "Manaphy", "Darkrai", "Shaymin"]

const Directions = {
    None: 0,
    Up: 1,
    Right: 2,
    Down: 3,
    Left: 4
}

const ppotoolWindow = document.createElement('div');
const ppotoolContent = document.createElement('div');
const ppotoolHeader = document.createElement('div');
const resizer = document.createElement('div');

// Settings Variables
let pokemonToCatchList = [];
let shouldRunOnElite = false;
let shouldFightAllElites = false;
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
let playerXcoord = 0;
let playerYcoord = 0;
let playerDirection = Directions.Down;
let stepCounter = 0;
let incrementMoveEvents = 0;
let xsteps = 0;
let needTurnaround = true;
let walkRight = true;
let isMovePackageInitialized = false

// Package Variables
let fullFightPackage = null;
let fightPackageBegin = null;
let fightPackageEnd = null
let catchPackageBegin = null;
let catchPackageToken = null;
let catchPackageEnd = null;
let fullMovePackage = null;

// Other Variables
let socket = null;
let w = [];
let h = null;
let checksums = null;
let p = null;

function startup() {
    console.log("PPOTool > PPOTool started");
    ppotoolWindow.appendChild(ppotoolHeader);
    ppotoolWindow.appendChild(ppotoolContent);
    ppotoolWindow.style = "position:absolute;left:0;top:0;height:45%;width:25%;background-color:rgba(255,255,255,0.8);display:flex;flex-direction:column;font-family:\"Trebuchet MS\"";
    ppotoolHeader.innerHTML = "<div id='ppotoolHeader' style='cursor: move; padding: 8px; background-color: #3498db; color: #fff;'>PPOTool</div>";
    ppotoolContent.innerHTML = "<div></div>Welcome to the PPOTool. Just click on next and the setup will begin. When the tool is running, you can change " +
        "the List of Pokémon when it should stop. By Default, it will stop at all Very Rare, Extremely Rare and Legendary Pokémon.";
    resizer.style.cssText = "width: 10px; height: 10px; background-color: #3498db; position: absolute; bottom: 0; right: 0; cursor: se-resize;";
    ppotoolWindow.appendChild(resizer);

    const minimizeButton = document.createElement('button');
    minimizeButton.textContent = 'Minimize';
    minimizeButton.style.marginRight = '5px'; // Adjust margin as needed

    // Add event listener to minimize button
    minimizeButton.addEventListener('click', () => {
        ppotoolContent.style.display = ppotoolContent.style.display === 'none' ? 'block' : 'none';
    });

    ppotoolHeader.appendChild(minimizeButton);

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

    ppotoolHeader.addEventListener('mousedown', (e) => {
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

    ppotoolContent.appendChild(moveButton);
    ppotoolContent.appendChild(fishButton);
    ppotoolContent.appendChild(miningButton)

    document.body.appendChild(ppotoolWindow);

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
    if (mode === "default") {
        ppotoolContent.innerHTML = "<h2>Take a step in any direction</h2>";
    }
    if (mode === "fishing") {
        ppotoolContent.innerHTML = "<h2>Fishing mode activated</h2>Walk to water, use your fishing rod. Make sure that " +
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
                    if (isElite && !pokemonToCatchList.includes(currentPokemonName)) {
                        if (shouldFightAllElites) {
                            fight()
                            console.log("PPOTool > Forcing fighting all elites without stop")
                            return
                        }
                        if (shouldRunOnElite) {
                            runAway()
                            console.log("PPOTool > Successfully ran away from Elite!")
                        }
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

            if (receivedPackageAsString.includes("call.hook") && catchPackageBegin && !isPaused) {
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

                setTimeout(function () {
                    socket.send(fullCatchPackage)
                }, randomNumber);
            }
        });
        webSocketReader.readAsArrayBuffer(_0xbee556.data);
    };

    const webSocketSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (origPackage) {
        if (!socket) {
            socket = this;
            socket.addEventListener("message", z);
        }

        if (origPackage == null) {
            return;
        }
        if (origPackage.byteLength === 79 && !fullFightPackage) {
            fullFightPackage = origPackage;
            fightPackageBegin = new Uint8Array(origPackage.slice(0, 51))
            fightPackageEnd = new Uint8Array(origPackage.slice(54, 72))
        }

        if (origPackage.byteLength === 100 && !catchPackageBegin && mode === "fishing") {
            ppotoolContent.innerHTML = "Fishing is running! Refresh page to stop the bot."
            setupUI()
            console.log("Initial Catch package received!")
            catchPackageBegin = new Uint8Array(origPackage.slice(0, 69))
            catchPackageEnd = new Uint8Array(origPackage.slice(85, 99))
        }

        // 0x91 = 145
        if (origPackage.byteLength === 145 && (!fullMovePackage || isPaused) && mode === "default") {
            fullMovePackage = origPackage;

            incrementMoveEvents = origPackage[0x45]
            stepCounter = origPackage[0x54]
            playerDirection = origPackage[0x5c]
            playerXcoord = origPackage[0x64]
            playerYcoord = origPackage[0x6c]
            isMovePackageInitialized = true
            console.log("Movepackage initialized")

            setupUI()

            const interval = setInterval(function() {
                buildMovementPackage()
                socket.send(fullMovePackage)
            }, 5000);



        }
        webSocketSend.call(this, origPackage);
    };
}

startup()

function buildMovementPackage() {
    console.log("building movement package")
    if (needTurnaround) {
        fullMovePackage[0x90] = 0x00;
        setInt64LE(fullMovePackage, 0x3e, ++incrementMoveEvents, 4)
        if (walkRight) {
            fullMovePackage[0x5c] = Directions.Left;
            walkRight = false;
        } else {
            fullMovePackage[0x5c] = Directions.Right;
            walkRight = true;
        }
        xsteps = 0
        needTurnaround = false
        console.log("Turnaround finished!")

    } else {
        setInt64LE(fullMovePackage, 0x3e, ++incrementMoveEvents, 4)
        setInt64LE(fullMovePackage, 0x54, ++stepCounter, 4)
        if(walkRight) {
            setInt64LE(fullMovePackage, 0x72, ++playerXcoord)
            fullMovePackage[0x5c] = Directions.Right;
        } else {
            setInt64LE(fullMovePackage, 0x72, --playerXcoord)
            fullMovePackage[0x5c] = Directions.Left;
        }

        console.log("Moved to X-Coord " + playerXcoord)

        fullMovePackage[0x90] = 0x01;

        xsteps++
        if (xsteps === 3) {
            console.log("Set turnaround")
            needTurnaround = true
        }

    }
}

function readInt64LE(bytes, offset, typeOffset = 0) {
    // This reads only an int32!!
    const buffer = new ArrayBuffer(4);
    const dataView = new DataView(buffer);

    for (let i = 0; i < 4; i++) {
        console.log(bytes[offset + i + typeOffset])
        dataView.setUint8(i, bytes[offset + i + typeOffset]);
    }

    return dataView.getUint32(0, true);
}

function setInt64LE(bytes, offset, value, typeOffset = 0) {
    // This sets only an int32!!
    const dataView = new DataView(bytes);

    // Set the 32-bit integer at the specified offset in little-endian format
    dataView.setInt32(offset + typeOffset, value, true);
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
            stopButton.style.backgroundColor = 'green'
            stopButton.textContent = 'Tool is running... Click here to pause!'
        }
    });


    const runOnEliteCheckbox = document.createElement('input');
    runOnEliteCheckbox.type = 'checkbox';
    runOnEliteCheckbox.id = 'runOnEliteCheckbox';

    const runOnEliteCheckboxLabel = document.createElement('label');
    runOnEliteCheckboxLabel.textContent = 'Run on all ELITES?';
    runOnEliteCheckboxLabel.htmlFor = 'runOnEliteCheckbox';

    runOnEliteCheckbox.style.marginTop = '10px';
    runOnEliteCheckbox.style.marginRight = '5px';
    runOnEliteCheckboxLabel.style.marginTop = '10px';

    runOnEliteCheckbox.addEventListener('change', function () {
        shouldRunOnElite = runOnEliteCheckbox.checked;
        console.log('PPOTool > Checkbox state changed. shouldRunOnElite:', shouldRunOnElite);
    });

    const fightAllEliteCheckbox = document.createElement('input');
    fightAllEliteCheckbox.type = 'checkbox';
    fightAllEliteCheckbox.id = 'fightAllEliteCheckbox';

    const fightAllEliteCheckboxLabel = document.createElement('label');
    fightAllEliteCheckboxLabel.textContent = 'Fight ALL ELITES? (Prio over run!)';
    fightAllEliteCheckboxLabel.htmlFor = 'fightAllEliteCheckbox';

    fightAllEliteCheckbox.style.marginTop = '10px';
    fightAllEliteCheckbox.style.marginRight = '5px';
    fightAllEliteCheckboxLabel.style.marginTop = '10px';

    fightAllEliteCheckbox.addEventListener('change', function () {
        shouldFightAllElites = fightAllEliteCheckbox.checked;
        console.log('PPOTool > Checkbox state changed. shouldfightAllElite:', shouldFightAllElites);
    });

    // Append the stop button to the ppotoolWindow
    ppotoolContent.appendChild(stopButton);
    ppotoolContent.appendChild(selectBox);
    ppotoolContent.appendChild(removeButton);
    ppotoolContent.appendChild(addButton);
    ppotoolContent.appendChild(runOnEliteCheckbox);
    ppotoolContent.appendChild(runOnEliteCheckboxLabel);
    ppotoolContent.appendChild(fightAllEliteCheckbox)
    ppotoolContent.appendChild(fightAllEliteCheckboxLabel)


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

    const regex = /\|p2\|.*shiny\|/;

    if (regex.test(battlePackageAsString)) {
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

