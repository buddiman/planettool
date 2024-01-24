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
let n = 0x1;
let y = false;

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
ppotoolWindow.style = "position:absolute;left:0;top:0;height:40%;width:25%;background-color:rgba(255,255,255,0.7);display:flex;flex-direction:column;font-family:\"Trebuchet MS\"";
ppotoolWindow.innerHTML = "<h2>PPOTool</h2><div></div><button style=\"margin-top:auto\" id=\"nextButton\">Next</button>";

// Add an event listener to the 'Next' button
document.getElementById('nextButton').addEventListener('click', initializeTool);
function initializeTool() {
    ppotoolWindow.innerHTML = "<h2>Take a step</h2>";
    const z = _0xbee556 => {
        let webSocketReader = new FileReader();
        webSocketReader.addEventListener("loadend", () => {
            let receivedPackage = new Uint8Array(webSocketReader.result);
            let receivedPackageAsString = String.fromCharCode(...receivedPackage);
            // ... (rest of the 'z' function)

            if (receivedPackageAsString.includes("gametype")) {
                isInBattle = true;
                if (!fightPackage && isPaused) {
                    return;
                }

                // ... (rest of the 'z' function)

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

    const _0x530e22 = WebSocket.prototype.send;
    WebSocket.prototype.send = function (origPackage) {
        if (origPackage == null) {
            return;
        }
        if (origPackage.byteLength == 79 && !fightPackage) {
            fightPackage = origPackage;
        }

        // ... (rest of the WebSocket.prototype.send modification)

        if (!socket) {
            socket = this;
            socket.addEventListener("message", z);
        }
        _0x530e22.call(this, origPackage);
    };
}

// Initial call to initializeTool
// initializeTool();

// Create a button for the 'Next' action
const nextButton = document.createElement('button');
nextButton.textContent = 'Next';
nextButton.addEventListener('click', initializeTool);

// Append the 'Next' button to the ppotoolWindow
ppotoolWindow.appendChild(nextButton);

document.body.appendChild(ppotoolWindow);