socket = null;
isElite = false;
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
ppotoolWindow.style = "position:absolute;right:0;top:15%;height:50%;width:25%;background-color:rgba(255,255,255,0.7);display:flex;flex-direction:column;font-family:\"Trebuchet MS\"";
ppotoolWindow.innerHTML = "<h2>Mons to hunt</h2><div></div><button onclick=\"ppotoolWindow.children[1].innerHTML+=`<a href='javascript:void(0)' onclick='this.remove()'>`+g()+`<br></a>`\">Add (click mons to remove)</button><button style=\"margin-top:auto\" onclick=\"n()\">Next</button>";
g = () => prompt("Mon to add");

n = () => {
    pokemonToCatchList = [...ppotoolWindow.children[0x1].children].map(_0x158ebf => _0x158ebf.textContent);
    if (pokemonToCatchList) {
        console.log("PPOTool > Catchlist: " + pokemonToCatchList)
    }
    ["Moves to use", '', "Add (enter \"elite\" for all elites)", "Next (default is slot 1)"].forEach((_0x53d138, _0x27ce07) => ppotoolWindow.children[_0x27ce07].innerHTML = _0x53d138);
    g = () => prompt("Mon") + " - " + prompt("Move to use (ie. 1 for move in slot 1)");
    n = () => {
        pokemonSpecialMoveList = Object.fromEntries([...ppotoolWindow.children[0x1].children].map(_0x1c287e => _0x1c287e.textContent.split(" - ").map((_0x37dcc5, _0x2c06b5) => _0x2c06b5 ? _0x37dcc5 > 0x4 || _0x37dcc5 < 0x1 ? 0x1 : parseInt(_0x37dcc5) : _0x37dcc5)));
        ppotoolWindow.innerHTML = "<h2>Take a step</h2>";
        z = _0xbee556 => {
            let webSocketReader = new FileReader();
            webSocketReader.addEventListener("loadend", () => {
                let receivedPackage = new Uint8Array(webSocketReader.result);
                let receivedPackageAsString = String.fromCharCode(...receivedPackage);
                let _0x18c87c = (receivedPackageAsString.split("\b\0") ?? []).map(_0x55f493 => _0x55f493.split("\0")[0].slice(1));
                if (receivedPackageAsString.includes("gametype")) {
                    const match = receivedPackageAsString.match(/player\|p\d+\|[^|]*\|\|\n\|player\|p2\|([^|]*)\|\|/)
                    currentPokemonName = match ? match[1] : null
                    if (!currentPokemonName) {
                        console.log("No pokemon name found. ERROR!")
                    }
                    console.log("POKENAME: " + currentPokemonName)
                }

                /*
                if (!receivedPackageAsString.includes("senderName") && receivedPackageAsString.toLowerCase().includes("elite")) {
                    isElite = true;
                }
                 */

                if (receivedPackageAsString.includes("|win|")) {
                    // Set battle = false. Win battle
                    isInBattle = false;
                    isElite = false;
                    clearInterval(p);
                } else {
                    if (receivedPackageAsString.includes("upkeep")) {
                        // TODO: investigate
                        console.log("UPKEEP?!?!")
                        fight();
                    }
                }

                if (receivedPackageAsString.includes("gametype")) { // || y) {
                    isInBattle = true;
                    if (!fightPackage) {
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

                    console.log("Checksums: " + checksums);

                    if (pokemonToCatchList.includes(currentPokemonName)) {
                        fetch(discord[0], {
                            'method': "post",
                            'headers': {
                                'Content-Type': "application/json"
                            },
                            'body': JSON.stringify({
                                'content': '<@' + discord[1] + "> we got " + currentPokemonName + '!',
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
                    }, 400);
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