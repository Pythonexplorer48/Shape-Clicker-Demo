const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 1920;
canvas.height = 1080;

const SHOP_X = canvas.width - 460;
const UPGRADE_X = canvas.width - 1300;

const mouseState = {
    x: 0,
    y: 0,
    isDown: false
};

function bigint(value) {
    try {
        return typeof value === 'bigint' ? value : BigInt(Math.floor(Number(value)));
    } catch (e) {
        return 0n; 
    }
}

window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseState.x = (e.clientX - rect.left) * (1920 / rect.width);
    mouseState.y = (e.clientY - rect.top) * (1080 / rect.height);
});

window.addEventListener('mousedown', () => {
    mouseState.isDown = true;
});
window.addEventListener('mouseup', () => { 
    mouseState.isDown = false; 
});

let scrollY = 0;
const maxScroll = 1000;
window.addEventListener('wheel', (e) => {
    if (mouseState.x > canvas.width - 460) {
        scrollY += e.deltaY;
        if (scrollY < 0) scrollY = 0;
        if (scrollY > maxScroll) scrollY = maxScroll;
    }
});

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

const suffixes = ["K", "M", "B", "T", "Qd", "Qn", "Sx", "Sp", "Ot", "No",
"De", "UDe", "DDe", "TDe", "QdDe", "QnDe", "SxDe", "SpDe", "OcDe", "NoDe",
"Vt", "UVt", "DVt", "TVt", "QdVt", "QnVt", "SxVt", "SpVt", "OcVt", "NoVt",
"Tg", "UTg", "DTg", "TTg", "QdTg", "QnTg", "SxTg", "SpTg", "OcTg", "NoTg",
"qg", "Uqg", "Dqg", "Tqg", "Qdqg", "Qnqg", "Sxqg", "Spqg", "Ocqg", "Noqg",
"Qg", "UQg", "DQg", "TQg", "QdQg", "QnQg", "SxQg", "SpQg", "OcQg", "NoQg",
"sg", "Usg", "Dsg", "Tsg", "Qdsg", "Qnsg", "Sxsg", "Spsg", "Ocsg", "Nosg",
"Sg", "USg", "DSg", "TSg", "QdSg", "QnSg", "SxSg", "SpSg", "OcSg", "NoSg",
"Og", "UOg", "DOg", "TOg", "QdOg", "QnOg", "SxOg", "SpOg", "OcOg", "NoOg",
"Ng", "UNg", "DNg", "TNg", "QdNg", "QnNg", "SxNg", "SpNg", "OcNg", "NoNg",
"Ce", "UCe" ,"DCe", "TCe", "QdCe", "QnCe", "SxCe", "SpCe", "OcCe", "NoCe",
"DeCe", "UDeCe", "DDeCe", "TDeCe", "QdDeCe", "QnDeCe", "SxDeCe", "SpDeCe", "OcDeCe", "NoDeCe",
"VtCe", "UVtCe", "DVtCe", "TVtCe", "QdVtCe", "QnVtCe", "SxVtCe", "SpVtCe", "OcVtCe", "NoVtCe",
"TgCe", "UTgCe", "DTgCe", "TTgCe", "QdTgCe", "QnTgCe", "SxTgCe", "SpTgCe", "OcTgCe", "NoTgCe",
"qgCe", "UqgCe", "DqgCe", "TqgCe", "QdqgCe", "QnqgCe", "SxqgCe", "SpqgCe", "OcqgCe", "NoqgCe",
"QgCe", "UQgCe", "DQgCe", "TQgCe", "QdQgCe", "QnQgCe", "SxQgCe", "SpQgCe", "OcQgCe", "NoQgCe",
"sgCe", "UsgCe", "DsgCe", "TsgCe", "QdsgCe", "QnsgCe", "SxsgCe", "SpsgCe", "OcsgCe", "NosgCe",
"SgCe", "USgCe", "DSgCe", "TSgCe", "QdSgCe", "QnSgCe", "SxSgCe", "SpSgCe", "OcSgCe", "NoSgCe",
"OgCe", "UOgCe", "DOgCe", "TOgCe", "QdOgCe", "QnOgCe", "SxOgCe", "SpOgCe", "OcOgCe", "NoOgCe",
"NgCe", "UNgCe", "DNgCe", "TNgCe", "QdNgCe", "QnNgCe", "SxNgCe", "SpNgCe", "OcNgCe", "NoNgCe", "Du"];

function formatLargeNumber(n) {
    const s = bigint(n).toString();
    const n_len = s.length;

    if (n_len <= 3) return s;

    const idx = Math.floor((n_len - 1) / 3) - 1;
    
    if (idx >= suffixes.length) {
        return `${s[0]}.${s.substring(1, 3)}e+${n_len - 1}`;
    }

    const preDecimalCount = (n_len - 1) % 3 + 1;
    const wholePart = s.substring(0, preDecimalCount);
    
    const decimalPart = s.substring(preDecimalCount, preDecimalCount + 2).padEnd(2, "0");

    return `${wholePart}.${decimalPart} ${suffixes[idx]}`;
}

let mouseRect = { x: 0, y: 0, width: 1, height: 1 };

const shapeData = {
    "line": {
        src: "images/Shapes Clicker Line.png",
        hitboxWidth: 384,
        hitboxHeight: 30
    },
    "circle": {
        src: "images/Shapes Clicker Circle.png",
        hitboxWidth: 80, 
        hitboxHeight: 80
    },
    "triangle": {
        src: "images/Shapes Clicker Triangle.png",
        hitboxWidth: 80, 
        hitboxHeight: 80
    },
    "square": {
        src: "images/Shapes Clicker Square.png",
        hitboxWidth: 100, 
        hitboxHeight: 100
    },
    "hexagon": {
        src: "images/Shapes Clicker Hexagon King.png",
        hitboxWidth: 150, 
        hitboxHeight: 150
    }
};

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class ClickerLine {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.img = new Image();
        this.img.src = shapeData["line"].src;
        
        const data = shapeData["line"];
        this.baseWidth = data.hitboxWidth;
        this.baseHeight = data.hitboxHeight;
        
        this.width = this.baseWidth;
        this.height = this.baseHeight;

        this.wasPressed = false;
    }

    draw() {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    update() {
        if (checkCollision(mouseRect, this)) {
            
            this.width = this.baseWidth * 1.2; 
            this.height = this.baseHeight * 1.2;

            if (mouseState.isDown && !this.wasPressed) {
                lines += LPC; 
            }
        } else {
            this.width = this.baseWidth;
            this.height = this.baseHeight;
        }

        this.wasPressed = mouseState.isDown;
    }
}
class ClickerCircle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.img = new Image();
        this.img.src = shapeData["circle"].src;
        
        const data = shapeData["circle"];
        this.baseWidth = data.hitboxWidth;
        this.baseHeight = data.hitboxHeight;
        
        this.width = this.baseWidth;
        this.height = this.baseHeight;

        this.wasPressed = false;
    }

    draw() {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    update() {
        if (checkCollision(mouseRect, this)) {
            
            this.width = this.baseWidth * 1.2; 
            this.height = this.baseHeight * 1.2;

            if (mouseState.isDown && !this.wasPressed) {
                lines += LPC; 
            }
        } else {
            this.width = this.baseWidth;
            this.height = this.baseHeight;
        }

        this.wasPressed = mouseState.isDown;
    }
}

class ShopButton {
    static instances = []; 
    constructor(x, y, name, iconSrc, initialCost, rewardFunc) {
        this.x = x;
        this.y = y;
        this.width = 450;
        this.height = 120;
        this.name = name;
        this.cost = BigInt(initialCost);
        this.reward = rewardFunc;
        this.icon = new Image();
        this.icon.src = iconSrc;
        this.wasPressed = false;

        ShopButton.instances.push(this);
    }

    update() {
        let scrolledRect = { 
            x: this.x, 
            y: this.y - scrollY, 
            width: this.width, 
            height: this.height 
        };
        let isHovering = checkCollision(mouseRect, scrolledRect);

        if (isHovering && mouseState.isDown && !this.wasPressed) {
            if (lines >= this.cost) {
                try {
                    lines -= BigInt(this.cost);
                } catch (error) {
                    console.warn("Math failed, forcing BigInt conversion:", error);
                    lines = BigInt(lines || 0n) - BigInt(this.cost || 0n);
                }
                this.reward();
                this.cost = BigInt(Math.round(Number(this.cost) * 1.35));
            }
        }
        this.wasPressed = mouseState.isDown;
    }

    draw() {
        const drawY = this.y - scrollY;

        if (drawY + this.height < 85 || drawY > canvas.height) return;

        const isHovering = checkCollision(mouseRect, { 
            x: this.x, 
            y: drawY, 
            width: this.width, 
            height: this.height 
        });

        ctx.fillStyle = "#cccccc";
        ctx.strokeStyle = "#666666";
        ctx.lineWidth = 6;
        ctx.fillRect(this.x, drawY, this.width, this.height);
        ctx.strokeRect(this.x, drawY, this.width, this.height);

        ctx.fillStyle = "#d9d9d9";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.fillRect(this.x + 10, drawY + 10, 100, 100);
        ctx.strokeRect(this.x + 10, drawY + 10, 100, 100);
        ctx.setLineDash([]);

        ctx.drawImage(this.icon, this.x + 20, drawY + 20, 80, 80);

        ctx.fillStyle = "black";
        ctx.font = "30px ShapeMaelstrom, Arial, sans-serif";
        ctx.fillText(this.name, this.x + 125, drawY + 50);
    
        ctx.font = "20px ShapeMaelstrom, Arial, sans-serif";
        ctx.fillStyle = (lines >= this.cost) ? "green" : "red";
        ctx.fillText(`${formatLargeNumber(this.cost)}: LINES`, this.x + 125, drawY + 90);
        if (isHovering) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
            ctx.fillRect(this.x, drawY, this.width, this.height);
        }
    }
}

const IdleLine = new ClickerLine(30, 455);
const IdleCircle = new ClickerCircle(30, 455);
let lines = 0n;
let LPC = 1n; // LPC stands for lines per click
let LPS = 0n; // LPS stand for lines per second
let onedBuilders = 0;
let lineFactories = 0;
let beamWeavers = 0;
let fluxTransmuters = 0;
let cursorPowers = 0;
let macroExtruders = 0;
let lineCutters = 0;
let linearSingularities = 0;
let nanostrandSpinners = 0;
let magnetarExtractors = 0;
let novaPressurizers = 0;
let xenoWeavers = 0;
let xenoEXTRUDERS = 0;
let XENOrollers = 0;
let OMNIBUILDERS = 0;
let circles = 0n;
let CPC = 1n;
let CPS = 0n;
let gamelooptwo = 0;

function gameloop() {
    if (gamelooptwo === 1) {
    gameloop2();
    return;
    }
    ctx.fillStyle = "black"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "cyan";
    ctx.fillRect(0, 70, canvas.width, 5)
    ctx.fillRect(600, 70, 3, canvas.height - 70)
    mouseRect.x = mouseState.x;
    mouseRect.y = mouseState.y;

    IdleLine.update();
    IdleLine.draw();
    if (!window.lastIdleTime) window.lastIdleTime = Date.now();

    if (Date.now() - window.lastIdleTime >= 1000) {
        try {
            lines += BigInt(LPS || 0n); 
        } catch (error) {
            console.warn("LPS Addition failed:", error);
            lines = BigInt(lines || 0n) + BigInt(LPS || 0n);
        }
        window.lastIdleTime = Date.now();
    }

    builderButton.update();
    builderButton.draw();
    factoryButton.update();
    factoryButton.draw();
    weaverButton.update();
    weaverButton.draw();
    transmuterButton.update();
    transmuterButton.draw();
    cursorPower.update();
    cursorPower.draw();
    extruderButton.update();
    extruderButton.draw();
    cutterButton.update();
    cutterButton.draw();
    singularityButton.update();
    singularityButton.draw();
    clickDoubler.update();
    clickDoubler.draw();
    spinnerButton.update();
    spinnerButton.draw();
    extractorButton.update();
    extractorButton.draw();
    pressurizerButton.update();
    pressurizerButton.draw();
    loomButton.update();
    loomButton.draw();
    xenoweaverButton.update();
    xenoweaverButton.draw();
    xenoextruderButton.update();
    xenoextruderButton.draw();
    xenorollerButton.update();
    xenorollerButton.draw();
    omnibuilderButton.update();
    omnibuilderButton.draw();
    clickSquared.update();
    clickSquared.draw();
    evolve.update();
    evolve.draw();
    
    ctx.fillStyle= "black";
    ctx.fillRect(0, 0, canvas.width, 70);
    ctx.fillStyle = "cyan";
    ctx.fillRect(0, 70, canvas.width, 5)
    ctx.fillStyle = "white";
    ctx.font = "60px ShapeMaelstrom, Arial, sans-serif"; 
    ctx.fillText("Shape Clicker", canvas.width / 2.7, 63);

    ctx.fillStyle = "white"
    ctx.font = "40px ShapeMaelstrom, Arial, sans-serif";
    ctx.fillText(`${formatLargeNumber(lines)}: lines`, 2, canvas.height / 2.8);

    ctx.fillStyle = "white"
    ctx.font = "20px ShapeMaelstrom, Arial, sans-serif";
    ctx.fillText(`${formatLargeNumber(LPS)}: lines per sec`, 2, canvas.height / 2.5)

    requestAnimationFrame(gameloop);
}

function gameloop2() {
    ctx.fillStyle = "black"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "cyan";
    ctx.fillRect(0, 70, canvas.width, 5)
    ctx.fillRect(600, 70, 3, canvas.height - 70)
    mouseRect.x = mouseState.x;
    mouseRect.y = mouseState.y;

    IdleCircle.update();
    IdleCircle.draw();
    if (!window.lastIdleTime) window.lastIdleTime = Date.now();
    if (Date.now() - window.lastIdleTime >= 1000) {
        circles += BigInt(CPS || 0n);
        window.lastIdleTime = Date.now();
    }
    
    ctx.fillStyle= "black";
    ctx.fillRect(0, 0, canvas.width, 70);
    ctx.fillStyle = "cyan";
    ctx.fillRect(0, 70, canvas.width, 5)
    ctx.fillStyle = "white";
    ctx.font = "60px ShapeMaelstrom, Arial, sans-serif"; 
    ctx.fillText("Shape Clicker", canvas.width / 2.7, 63);

    ctx.fillStyle = "white"
    ctx.font = "40px ShapeMaelstrom, Arial, sans-serif";
    ctx.fillText(`${formatLargeNumber(circles)}: circles`, 2, canvas.height / 2.8);

    ctx.fillStyle = "white"
    ctx.font = "20px ShapeMaelstrom, Arial, sans-serif";
    ctx.fillText(`${formatLargeNumber(CPS)}: circles per sec`, 2, canvas.height / 2.5)

    requestAnimationFrame(gameloop2);
}
document.fonts.load('60px ShapeMaelstrom').then(() => {
    gameloop();
});

window.onload = () => {
    const canvas = document.getElementById('gameCanvas');
    canvas.width = 1920;
    canvas.height = 1080;
    window.dispatchEvent(new Event('resize'));
};

const builderButton = new ShopButton(SHOP_X, 85, "1D BUILDER", "images/1D_Builder.png", 15, () => { LPS += 1n; onedBuilders++; });
const factoryButton = new ShopButton(SHOP_X, 215, "LINE FACTORY", "images/Line Factory.png", 225, () => { LPS += 10n; lineFactories++; });
const weaverButton = new ShopButton(SHOP_X, 345, "Beam weaver", "images/beam weaver.png", 3750, () => { LPS += 75n; beamWeavers++; });
const transmuterButton = new ShopButton(SHOP_X, 475, "Flux Transmuter", "images/Flux Transmuter.png", 77777, () => { LPS += 777n; fluxTransmuters++; });
const cursorPower = new ShopButton(UPGRADE_X, 85, "Cursor Power", "images/Cursor Power.png", 100000, () => { LPC += 1n; cursorPowers++; });
const extruderButton = new ShopButton(SHOP_X, 605, "Macro-Extruder", "images/Macro-Extruder.png", 785000, () => { LPS += 8250n; macroExtruders++; });
const cutterButton = new ShopButton(SHOP_X, 735, "Line Cutter", "images/Line Cutter.png", 8585000, () => { LPS += 78000n; lineCutters++; });
const singularityButton = new ShopButton(SHOP_X, 865, "1D Singularity", "images/Linear Singularity.png", 114035000, () => { LPS += 1200000n; linearSingularities++; });
const clickDoubler = new ShopButton(UPGRADE_X, 215, "Click doubler", "images/Click Doubler.png", 300000000, () => { LPC *= 2n; clickDoubler.cost = BigInt(Math.round(Number(clickDoubler.cost) * 4.5)); });
const spinnerButton = new ShopButton(SHOP_X, 995, "NanoLine Roller", "images/Nanostrand Spinner.png", 5250000850, () => { LPS += 885000n; nanostrandSpinners++; });
const extractorButton = new ShopButton(SHOP_X, 1125, "Magnetar Siphon", "images/Magnetar Extractor.png", 186250958350, () => { LPS += 3000000n; magnetarExtractors++; });
const pressurizerButton = new ShopButton(SHOP_X, 1255, "Nova Chamber", "images/Nova Pressurizer.png", 5300402821000, () => { LPS += 10500000n; novaPressurizers++; });
const loomButton = new ShopButton(SHOP_X, 1255, "Metaversal Loom", "images/Metaversal Loom.png", 98007065432100, () => { LPS += 89325000n; novaPressurizers++; });
const xenoweaverButton = new ShopButton(SHOP_X, 1385, "XENO-weaver", "images/xeno-weaver.png", 860000000000000, () => { LPS += 1080525000n; xenoWeavers++; });
const xenoextruderButton = new ShopButton(SHOP_X, 1515, "xeno-EXTRUDER", "images/xeno-extruder.png", 3860000000145000, () => { LPS += 24800329500n; xenoEXTRUDERS++; });
const xenorollerButton = new ShopButton(SHOP_X, 1645, "XENO-ROLLER", "images/xeno-roller.png", 98057060900145297, () => { LPS += 854609833700n; XENOrollers++; });
const clickSquared = new ShopButton(UPGRADE_X, 345, "Click Squared", "images/Clicker Squarer.png", 500000000000000000, () => { LPC *= LPC; clickSquared.cost *= clickSquared.cost; });
const omnibuilderButton = new ShopButton(1080, 1850, "OMNI-BUILDER", "images/Omni-Builder.png", 888888888888888888, () => { LPS += 18999999999999999n; LPC *= 3n; omnibuilderButton.cost = BigInt(Math.round(Number(omnibuilderButton.cost) / 1.35 * 100)); OMNIBUILDERS++; });
const evolve = new ShopButton(900, 930, "EVOLVE", "images/Shapes Clicker Circle.png", 1000000000000000000, () => { gamelooptwo = 1; });

function handleAutoSave() {
    const data = {
        lines: lines.toString(),
        LPC: LPC.toString(),
        LPS: LPS.toString(),
        circles: circles.toString(),
        CPC: CPC.toString(),
        CPS: CPS.toString(),
        gamelooptwo: gamelooptwo,
        counts: {
            onedBuilders, lineFactories, beamWeavers, fluxTransmuters,
            cursorPowers, macroExtruders, lineCutters, linearSingularities,
            nanostrandSpinners, magnetarExtractors, novaPressurizers,
            xenoWeavers, xenoEXTRUDERS, XENOrollers, OMNIBUILDERS
        },
        buttonCosts: ShopButton.instances.map(btn => btn.cost.toString())
    };
    localStorage.setItem('ShapeClicker_Save', JSON.stringify(data));
    console.log("Game Saved!");
}

function handleAutoLoad() {
    const saved = localStorage.getItem('ShapeClicker_Save');
    if (!saved) return;
    try {
        const data = JSON.parse(saved);
        lines = BigInt(data.lines || "0");
        LPC = BigInt(data.LPC || "1");
        LPS = BigInt(data.LPS || "0");
        circles = BigInt(data.circles || "0");
        CPC = BigInt(data.CPC || "1");
        CPS = BigInt(data.CPS || "0");
        gamelooptwo = Number(data.gamelooptwo || 0);
        if (data.counts) {
            onedBuilders = Number(data.counts.onedBuilders || 0);
            lineFactories = Number(data.counts.lineFactories || 0);
            beamWeavers = Number(data.counts.beamWeavers || 0);
            fluxTransmuters = Number(data.counts.fluxTransmuters || 0);
            cursorPowers = Number(data.counts.cursorPowers || 0);
            macroExtruders = Number(data.counts.macroExtruders || 0);
            lineCutters = Number(data.counts.lineCutters || 0);
            linearSingularities = Number(data.counts.linearSingularities || 0);
            nanostrandSpinners = Number(data.counts.nanostrandSpinners || 0);
            magnetarExtractors = Number(data.counts.magnetarExtractors || 0);
            novaPressurizers = Number(data.counts.novaPressurizers || 0);
            xenoWeavers = Number(data.counts.xenoWeavers || 0);
            xenoEXTRUDERS = Number(data.counts.xenoEXTRUDERS || 0);
            XENOrollers = Number(data.counts.XENOrollers || 0);
            OMNIBUILDERS = Number(data.counts.OMNIBUILDERS || 0);
        }
        if (data.buttonCosts && data.buttonCosts.length === ShopButton.instances.length) {
            data.buttonCosts.forEach((costStr, index) => {
                ShopButton.instances[index].cost = BigInt(costStr);
            });
        }
        console.log("Progress restored!");
    } catch (e) {
        console.error("Save data corrupted.", e);
    }
}

handleAutoLoad();
setInterval(handleAutoSave, 10000);
window.onbeforeunload = handleAutoSave;
