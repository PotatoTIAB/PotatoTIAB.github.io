// ****************************************
// *              Constants                *
// ****************************************
var system = {
    point: 0,
    upgradeCost: 10,
    upgrade: 0,
    milestone: [
        [10, unlockUpgrade]
    ]
};

const mainButton = document.querySelector("#mainButton");
const upgradeButton = document.querySelector("#upgradeButton");
const counter = document.querySelector("#counter");
const saveButton = document.querySelector("#save");
const counterFormat = counter.innerHTML;
const mainButtonFormat = mainButton.innerHTML;
const upgradeButtonFormat = upgradeButton.innerHTML;
let filterSwitch = false;
let ev = null;



Object.defineProperty(system, "Point", {
    get: function() {
        return this.point;
    },
    set: function(val) {
        this.point = val;
        counter.innerHTML = counterFormat.replace("{i}", String(expo(this.point)));
        while (true) {
            if (this.milestone.length > 0) {
                if (this.milestone[0][0] <= this.point) {
                    this.milestone.shift()[1]();
                    continue;
                }
            }
            break;
        }
    }
})

Object.defineProperty(system, "UpgradeCost", {
    get: function() {
        return this.upgradeCost;
    },
    set: function(val) {
        this.upgradeCost = val;
        upgradeButton.innerHTML = upgradeButtonFormat.replace("{cost}", String(expo(this.upgradeCost)));
    }
})

Object.defineProperty(system, "Upgrade", {
    get: function() {
        return this.upgrade;
    },
    set: function(val) {
        this.upgrade = val;
        mainButton.innerHTML = mainButtonFormat.replace("{up}", String(this.upgrade + 1));
    }
})
update();

function update() {
    system.Point = system.Point;
    system.UpgradeCost = system.UpgradeCost;
    system.Upgrade = system.Upgrade;
}


function isValid(e) {
    return (e.pointerType || e.mozInputSource == 1);
}

function click(e) {
    if (isValid(e)) {
        system.Point += (1 + system.Upgrade);
    }
    else {
        alert("i said click me, dumbass.");
    }
}

let costed = 0;
function upgrade(e) {
    if (isValid(e) && system.Point >= system.UpgradeCost) {
        system.Point -= system.UpgradeCost;
        system.Upgrade++;
        costed += system.UpgradeCost;
        system.UpgradeCost = upgradeCostCalc(system.Upgrade);
        console.log(`at:${system.Upgrade}\nreal value:${costed}\nestimated:${Math.round(20 * (1.5 ** system.Upgrade) - 20)}`);
    }
}

function upgradeCostCalc(to, from=to-1) {
    return Math.round(20 * (1.5 ** to) - 20) - Math.round(20 * (1.5 ** from) - 20);
}

function invert() {
    filterSwitch = ~filterSwitch
    const html = document.documentElement;
    if (filterSwitch) {        
        html.style.filter = "invert(1)";
    }
    else {        
        html.style.filter = "invert(0)";
    }
}

function unlockUpgrade() {
    upgradeButton.hidden = false;
}

function expo(number) {
    if (number >= 1000) {
        return Number.parseFloat(number).toExponential(3);
    }
    else {
        return number;
    }
}

function getCookie(cookie) {
    res = "";
    document.cookie.split(';').forEach(arr => {
        [item, value] = arr.split('=');
        if (item == cookie) {
            res = value;
            return;
        }
    });
    return res;
}

function setCookie(cookie, value, exp="1e12") {
    document.cookie = `${cookie}=${value};max-age=${exp * 1000};path=/`;
}

function save() {
    localStorage.setItem("save", JSON.stringify(system));
}

function load() {
    system = localStorage.getItem("save");
}

function saveEvent(e) {
    if (isValid(e)) {
        save()
    }
}

    
mainButton.addEventListener("click", click);
upgradeButton.addEventListener("click", upgrade)