import { PLAYER } from "/src/Player.js";
import { CheckTile } from "/src/logic/Dungeon/DungeonMapManager.js";
import { DrawDungeon } from "/src/logic/Dungeon/DungeonDrawer.js";
let DungeonDT = PLAYER.DungeonData;

function GetCurrentDungeon() {
    return DungeonData[DungeonDT.Dungeon];
}

function PrintData() {
    DrawDungeon();
    console.log(
        DungeonDT.Dungeon,
        DungeonDT.x,
        DungeonDT.z,
        DungeonDT.dir
    );
    
}


export function Rotate(input) {
    if (input === 1) {
        if (DungeonDT.dir === 3) {
            DungeonDT.dir = 0;
        } else {
            DungeonDT.dir += 1;
        }
        
    } else {
        if (DungeonDT.dir === 0) {
            DungeonDT.dir = 3;
        } else {
            DungeonDT.dir -= 1;
        }
    }
    PrintData();
}

export function MoveForward() {
    switch (DungeonDT.dir) {
        case 0: 
            if(!CheckTile(DungeonDT.x, DungeonDT.z -1)) {
                DungeonDT.z -= 1;
            }
            break;
        case 1:
            if (!CheckTile(DungeonDT.x + 1, DungeonDT.z)) {
                DungeonDT.x += 1;
            }
            break;
        case 2:
            if (!CheckTile(DungeonDT.x, DungeonDT.z + 1)) {
                DungeonDT.z += 1;
            }
            break;
        case 3:
            if (!CheckTile(DungeonDT.x - 1, DungeonDT.z)) {
                DungeonDT.x -= 1;
            }
            break;
    }
    PrintData();
}