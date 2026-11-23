//INSTANCES
import { MainScene } from "/src/GlobalData.js";
import { CRT } from "/src/misc/CRT.js"
import { PLAYER } from "/src/Player.js";

export async function SetMenu(MenuID) {
    PLAYER.SetState("UI", MenuID);
}

export async function NewGame(Arg = null) {
    MainScene.removeall();
    PLAYER.SetState("DUNGEON", "Home", 0);
}



