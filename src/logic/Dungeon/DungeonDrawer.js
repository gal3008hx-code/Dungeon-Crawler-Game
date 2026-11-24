import { PLAYER } from "/src/Player.js";
import { CheckTile } from "/src/logic/Dungeon/DungeonMapManager.js";

const TileInfo = {
    "Walls": "/assets/Tilesets/House/Walls/",
    "Doors": "/assets/Tilesets/House/Doors/",//Probablemente no se use, pero por si acaso

    "2_3_4": "/assets/Tilesets/House/Walls/Wall_2_3_4.png",
    "7_8": "/assets/Tilesets/House/Walls/Wall_7_8.png",
    "10_11_12": "/assets/Tilesets/House/Walls/Wall_10_11_12.png",
    "13_16": "/assets/Tilesets/House/Walls/Wall_13_16.png",
    "14_15": "/assets/Tilesets/House/Walls/Wall_14_15.png",
    "17_18_19": "/assets/Tilesets/House/Walls/Wall_17_18_19.png",
    "20_23": "/assets/Tilesets/House/Walls/Wall_20_23.png",
    "21_22": "/assets/Tilesets/House/Walls/Wall_21_22.png",

    //Mirror x?
    2: false,
    3: false,
    4: false,
    6: false,
    9: true,
    10: false,
    11: false,
    12: true,
    13: false,
    16: true,
    17: false,
    18: false,
    19: false,
    20: false,
    23: true,
    21: false,
    22: true

}

const PosInfo = {
    1:[
        [-2, -3], //Ahora PLAYER.dir son numeros del 0 al 3, 0 = Norte, 1 = Este, 2 = Sur, 3 = Oeste
        [3, -2],
        [2, 3],
        [-3, 2]
    ],
    2:[
        [-1, -3],
        [3, -1],
        [1, 3],
        [-3, 1]
    ],
    3:[
        [0, -3],
        [3, 0],
        [0, 3],
        [-3, 0]
    ],
    4:[
        [1, -3],
        [3, 1],
        [-1, 3],
        [-3, -1]
    ],
    5:[
        [2, -3],
        [3, 2],
        [-2, 3],
        [-3, -2]
    ],
    6:[
        [-2, -2],
        [2, -2],
        [2, 2],
        [-2, 2]
    ],
    7:[
        [-1, -2],
        [2, -1],
        [1, 2],
        [-2, 1]
    ],
    8:[
        [1, -2],
        [2, 1],
        [-1, 2],
        [-2, -1]
    ],
    9:[
        [2, -2],
        [2, 2],
        [-2, 2],
        [-2, -2]
    ],
    10:[
        [-1, -2],
        [2, -1],
        [1, 2],
        [-2, 1]
    ],
    11: [
        [0, -2],
        [2, 0],
        [0, 2],
        [-2, 0]
    ],
    12: [
        [1, -2],
        [2, 1],
        [-1, 2],
        [-2, -1]
    ],
    13: [
        [-2, -1],
        [1, -2],
        [2, 1],
        [-1, 2]
    ],
    14: [
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, 1]
    ],
    15: [
        [1, 1],
        [-1, 1],
        [-1, -1],
        [1, -1]
    ],
    16: [
        [2, 1],
        [1, -2],
        [-2, -1],
        [1, -2]
    ],
    17: [
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, 1]
    ],
    18: [
        [0, -1],
        [1, 0],
        [0, 1],
        [-1, 0]
    ],
    19: [
        [1, 1],
        [-1, 1],
        [-1, -1],
        [1, -1]
    ],
    20: [
        [-2, 0],
        [0, -2],
        [2, 0],
        [0, 2]
    ],
    21: [
        [-1, 0],
        [0, -1],
        [1, 0],
        [0, 1]
    ],
    22: [
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1]
    ],
    23: [
        [2, 0],
        [0, 2],
        [-2, 0],
        [0, -2]
    ],

}
const DrawOrder = {
    
}

export function DrawDungeon() {
    const DungeonDT = PLAYER.DungeonData;
    const Dir = DungeonDT.dir;

    for (let i = 1; i <= 23; i++) {
        const Offset = PosInfo[i][Dir];

        const Value = CheckTile(
            DungeonDT.x + Offset[0],
            DungeonDT.z + Offset[1]
        );

        console.log("ID:", i, "Value:", Value);
    }
}