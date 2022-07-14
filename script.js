// ****************************************
// *              Constants                *
// ****************************************
var system = {
    point: 0,
    upgrade: {
        amount: 0,
        expBase: 1.5,
        baseCost: 10
    },
    milestone: [
        [10, "unlockUpgrade"]
    ],
    unlockedMilestones: []
};

const milestones = {
    "unlockUpgrade": () => {upgradeButton.hidden = false;}
}

const mainButton = document.querySelector("#mainButton");
const upgradeButton = document.querySelector("#upgradeButton");
const counter = document.querySelector("#counter");
const saveButton = document.querySelector("#save");
const counterFormat = counter.innerHTML;
const mainButtonFormat = mainButton.innerHTML;
const upgradeButtonFormat = upgradeButton.innerHTML;
let filterSwitch = false;
let ev = null;


function updateSystem() {
    system.Point = system.Point;
    system.UpgradeCost = system.UpgradeCost;
    system.Upgrade = system.Upgrade;
}

function loadMilestones() {
    system.unlockedMilestones.forEach(milestone => { milestones[milestone](); });
}

function defineSystem() {
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
                        unlockedMilestone = this.milestone.shift()[1];
                        system.unlockedMilestones.push(unlockedMilestone);
                        milestones[unlockedMilestone]();
                        continue;
                    }
                }
                break;
            }
        }
    })
    
    Object.defineProperty(system, "UpgradeCost", {
        get: function() {
            return upgradeCostCalc(this.upgrade.amount + 1);
        }
    })
    
    Object.defineProperty(system, "Upgrade", {
        get: function() {
            return this.upgrade.amount;
        },
        set: function(val) {
            this.upgrade.amount = val;
            upgradeButton.innerHTML = upgradeButtonFormat.replace("{cost}", String(expo(this.UpgradeCost))).replace("{i}", String(this.upgrade.amount));
        }
    })

    Object.defineProperty(system, "PointInc", {
        get: function() {
            return (1 + this.upgrade.amount)
        }
    })
}

defineSystem();
updateSystem();
updateButtons(mainButton, upgradeButton);

function updateButtons(buttons) {
    if (~(buttons instanceof Array)) {
        buttons = [buttons]
    }
    buttons.forEach(button => {
        switch (button) {
            case mainButton:
                mainButton.innerHTML = mainButtonFormat.replace("{up}", String(system.PointInc));
                break;
            
            case upgradeButton:
                upgradeButton.innerHTML = upgradeButtonFormat.replace("{cost}", String(expo(system.UpgradeCost))).replace("{i}", String(system.upgrade.amount));
                break;
    
            default:
                console.error(`invalid button: ${button}`);
                break;
        }
    });
}

function isValid(e) {
    return (e.pointerType || e.mozInputSource == 1);
}

function click(e) {
    if (isValid(e)) {
        system.Point += system.PointInc;
    }
    else {
        alert("i said click me, dumbass.");
    }
}

function expFunc(base, mult, x) {
    if (base != 1) {
        return (mult * ((base ** (x)) - 1)) / (base-1);
    }
    else {
        return mult;
    }
}

let costed = 0;
function upgrade(e) {
    if (isValid(e) && system.Point >= system.UpgradeCost) {
        system.Point -= system.UpgradeCost;
        costed += system.UpgradeCost;
        system.Upgrade++;
        updateButtons(mainButton, upgradeButton);
    }
}

function upgradeCostCalc(to, from=to-1) {
    return Math.round(expFunc(system.upgrade.expBase, system.upgrade.baseCost, to) - expFunc(system.upgrade.expBase, system.upgrade.baseCost, from));
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
    console.log("saved");
}

function checkSave() {
    if (localStorage.getItem("save")) {
        return true;
    }
    return false;
}

function onLoad(e) {
    if (checkSave()) {
        load();
    }
}

function load() {
    system = JSON.parse(localStorage.getItem("save"));
    defineSystem();
    updateSystem();
    loadMilestones();
    updateButtons(mainButton, upgradeButton);
}

function saveEvent(e) {
    if (isValid(e)) {
        save()
    }
}

function beforeunload(e) {
    // e.preventDefault();
    // if (window.confirm("want to save before you go?\n(press \"OK\" to save)")) {
        save();
    // }
}

function deleteSave() {
    removeEventListener("beforeunload", beforeunload);
    localStorage.removeItem("save");
    window.location.reload();
}

setInterval(save, 60000);

    
mainButton.addEventListener("click", click);
upgradeButton.addEventListener("click", upgrade);
saveButton.addEventListener("click", saveEvent);
window.addEventListener("beforeunload", beforeunload);