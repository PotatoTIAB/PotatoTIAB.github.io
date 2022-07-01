const system = {
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
const counterFormat = counter.innerHTML;
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
system.Point = system.Point;

Object.defineProperty(system, "UpgradeCost", {
    get: function() {
        return this.upgradeCost;
    },
    set: function(val) {
        this.upgradeCost = val;
        upgradeButton.innerHTML = upgradeButtonFormat.replace("{cost}", String(expo(this.upgradeCost)));
    }
})
system.UpgradeCost = system.UpgradeCost;


function click(e) {
    if (e.pointerType) {
        system.Point++;
    }
    else {
        alert("i said click me, dumbass.")
    }
}

let costed = 0;
function upgrade(e) {
    if (e.pointerType) {
        system.upgrade++;
        costed += system.UpgradeCost;
        system.UpgradeCost = Math.round(10 * (1.5 ** system.upgrade));
        console.log(`at:${system.upgrade}\nreal value:${costed}\nestimated:${Math.round(20 * (1.5 ** system.upgrade) - 20)}`);
    }
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
    
mainButton.addEventListener("click", click);
upgradeButton.addEventListener("click", upgrade)