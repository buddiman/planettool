socket = null;
isElite = false;
w = [];
h = null;
isInBattle = false;
r = null;
currentPokemonName = '';
p = null;
n = 0x1;
y = false;
fight = () => {
    clearTimeout(p);
    console.log("DEBUG r > " + r)
    socket.send(r);
    n = 0x1;
    p = setInterval(() => {
        new Uint8Array(r)[0x34] += n;
        n = (n > 0x0 ? n + 0x1 : n - 0x1) * -0x1;
        socket.send(r);
    }, 0x3e8);
};

console.log("PPOTool > PPOTool started")
ppotoolWindow = document.createElement('div');
ppotoolWindow.style = "position:absolute;right:0;top:15%;height:50%;width:25%;background-color:rgba(255,255,255,0.7);display:flex;flex-direction:column;font-family:\"Trebuchet MS\"";
ppotoolWindow.innerHTML = "<h2>Mons to hunt</h2><div></div><button onclick=\"ppotoolWindow.children[1].innerHTML+=`<a href='javascript:void(0)' onclick='this.remove()'>`+g()+`<br></a>`\">Add (click mons to remove)</button><button style=\"margin-top:auto\" onclick=\"n()\">Next</button>";
g = () => prompt("Mon to add");

n = () => {
    pokemonToCatchList = [...ppotoolWindow.children[0x1].children].map(_0x158ebf => _0x158ebf.textContent);
    if(pokemonToCatchList) {
        console.log("PPOTool > Catchlist: " + pokemonToCatchList)
    }
    ["Moves to use", '', "Add (enter \"elite\" for all elites)", "Next (default is slot 1)"].forEach((_0x53d138, _0x27ce07) => ppotoolWindow.children[_0x27ce07].innerHTML = _0x53d138);
    g = () => prompt("Mon") + " - " + prompt("Move to use (ie. 1 for move in slot 1)");
    n = () => {
        pokemonSpecialMoveList = Object.fromEntries([...ppotoolWindow.children[0x1].children].map(_0x1c287e => _0x1c287e.textContent.split(" - ").map((_0x37dcc5, _0x2c06b5) => _0x2c06b5 ? _0x37dcc5 > 0x4 || _0x37dcc5 < 0x1 ? 0x1 : parseInt(_0x37dcc5) : _0x37dcc5)));
        ppotoolWindow.innerHTML = "<h2>Take a step</h2>";
        z = _0xbee556 => {
            let unknFileReader = new FileReader();
            unknFileReader.addEventListener("loadend", () => {
                let _0x7f2b45 = new Uint8Array(unknFileReader.result);
                let _0x634c7 = String.fromCharCode(..._0x7f2b45);
                let _0x18c87c = (_0x634c7.split("\b\0") ?? []).map(_0x55f493 => _0x55f493.split("\0")[0x0].slice(0x1));
                if (_0x634c7.includes("encounterType")) {
                    console.log("POKENAME: " + currentPokemonName)
                    currentPokemonName = /[^a-z]/i.test(_0x18c87c[0x2]) ? _0x18c87c[0x3] : _0x18c87c[0x2];
                    console.log("POKENAME 2: " + currentPokemonName)
                }
                if (!_0x634c7.includes("senderName") && _0x634c7.toLowerCase().includes("elite")) {
                    isElite = true;
                }
                if (_0x634c7.includes("|win|")) {
                    // Set battle = false. Win battle
                    isInBattle = false;
                    isElite = false;
                    clearInterval(p);
                } else {
                    if (_0x634c7.includes("upkeep")) {
                        fight();
                    }
                }
                window.k = _0x7f2b45.find((_0x16e097, _0x136965, _0x5e1826) => _0x5e1826[_0x136965 + 0x1] == 0x0 && _0x5e1826[_0x136965 + 0x2] == 0x1 && _0x5e1826[_0x136965 + 0x3] == 0x63);
                if (!isNaN(k) && h && _0x634c7.includes('battleId')) {
                    // Set Battle = true?
                    isInBattle = true;
                    for (j = 0x0; j < 0x4; j++) {
                        new Uint8Array(h[j])[0x54] = 0x0;
                    }
                    new Uint8Array(r)[0x35] = k;
                    p = setTimeout(() => y = true, 0x64);
                }
                if (_0x634c7.includes("battleType") || y) {
                    y = false;
                    if (!r) {
                        return;
                    }
                    if (pokemonToCatchList.includes(currentPokemonName)) {
                        console.log("POKENAME: " + currentPokemonName)
                        fetch(discord[0x0], {
                            'method': "post",
                            'headers': {
                                'Content-Type': "application/json"
                            },
                            'body': JSON.stringify({
                                'content': '<@' + discord[0x1] + "> we got " + currentPokemonName + '!',
                                'allowed_mentions': {
                                    'parse': ["users"]
                                }
                            })
                        });
                        return;
                    }
                    new Uint8Array(r)[0x4c] = (isElite ? pokemonSpecialMoveList.elite : pokemonSpecialMoveList[currentPokemonName] + 0x30) ?? 0x31;
                    fight();
                }
            });
            unknFileReader.readAsArrayBuffer(_0xbee556.data);
        };
        const _0x530e22 = WebSocket.prototype.send;
        WebSocket.prototype.send = function (_0x47af98) {
            // Possible check -> 79 / 23 -> Prob. 23, only infight
            console.log("PACKAGE LENGTH: " + _0x47af98.byteLength)
            if (_0x47af98.byteLength == 23) {
                /*
                if (!r) {
                    ppotoolWindow.remove();
                }
                 */
                r = _0x47af98;
            }

            // 0x91 = 145
            if (_0x47af98.byteLength == 0x91 && !h) {
                w.push(_0x47af98);
                if (w.length == 0x2) {
                    ppotoolWindow.children[0x0].innerHTML = "Walk backwards";
                }
                if (w.length == 0x4) {
                    ppotoolWindow.children[0x0].innerHTML = "Use a move once the encounter starts. Refresh page to stop the bot. Happy hunting!";
                    h = w;
                    x = setInterval(() => {
                        // MOVEMENT HERE!
                        if (!isInBattle) {
                            for (i = 0x0; i < 0x4; i++) {
                                for (j = 0x0; j < 0x4; j++) {
                                    let _0x458770 = new Uint8Array(h[j]);
                                    _0x458770[0x45]++;
                                    if (_0x458770[0x45] == 0x0) {
                                        _0x458770[0x44]++;
                                    }
                                    if (i % 0x2 > 0x0) {
                                        _0x458770[0x54]++;
                                    }
                                }
                                socket.send(h[i]);
                            }
                        }
                    }, 0x190);
                }
            }
            if (!socket) {
                socket = this;
                socket.addEventListener("message", z);
            }
            _0x530e22.call(this, _0x47af98);
        };
    };
};
document.body.appendChild(ppotoolWindow);