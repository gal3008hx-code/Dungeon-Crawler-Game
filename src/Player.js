//UI
import { SetMenu } from "/src/logic/UI/UIManager.js";
//DUNGEON
import { DrawDungeon } from "/src/logic/Dungeon/DungeonDrawer.js";
import { SetDung } from "/src/logic/Dungeon/DungeonMapManager.js";
class PLR {
    constructor() {
        this.states = ["NONE", "UI", "DUNGEON", "COMBAT"];
        this.OnDialogue = false;
        this.PlayerState = "UI";
        this.UIData = {
            Menu: null,
            UIPosition: 0,
            Orientation: 0,
            BackgroundImage: null,
            Selected: 0
        };
        this.DungeonData = {
            Dungeon: null,
            x: 0,
            z: 0,
            dir: 0
        }
        
    }
    SetUI(Menu) {
        SetMenu(Menu);
    }

    SetDungeon(Dungeon, entrance = null) {
        SetDung(Dungeon, entrance);
    }

    StartCombat(BattleID) {

    }

    SetState(State, Args, Arg2) {
        if (!this.states.includes(State)) return;
        this.PlayerState = State;
        switch (State) {
            case "NONE":
                return;
            case "UI":
                this.SetUI(Args);
                return;
            case "DUNGEON":
                this.SetDungeon(Args, Arg2);
                return;
            case "COMBAT":
                this.StartCombat(Args);
                return;
        }
    }
}

export const PLAYER = new PLR();