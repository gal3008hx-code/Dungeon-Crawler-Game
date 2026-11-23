const Dungeons = await fetch("/src/data/DungeonMaps.json");
export const DungeonData = await Dungeons.json();

import { PLAYER } from "/src/Player.js";

function GetCurrentDungeon() {
    return DungeonData[PLAYER.DungeonData.Dungeon];
}

export function SetDung(Dungeon, entrance = 0) {
    let DungeonDT = PLAYER.DungeonData;

    const CurrentDungeon = DungeonData[Dungeon];

    if (!CurrentDungeon) {
        console.error("Dungeon not found:", Dungeon);
        return;
    }

    const CurrentEntrance = CurrentDungeon.Entrances[entrance];

    if (!CurrentEntrance) {
        console.error("Entrance not found:", entrance);
        return;
    }

    DungeonDT.Dungeon = Dungeon;
    DungeonDT.x = CurrentEntrance.x;
    DungeonDT.z = CurrentEntrance.z;
    DungeonDT.dir = CurrentEntrance.d;

    console.log("Dungeon loaded:", Dungeon);
}

export function CheckTile(x, z) {
    const Dungeon = GetCurrentDungeon();

    if (!Dungeon) return true;

    if (x < 0 || x >= Dungeon.width ||
        z < 0 || z >= Dungeon.height) {
        return true;
    }

    const Position = z * Dungeon.width + x;

    return Dungeon.MainLayout[Position] !== 0;
}