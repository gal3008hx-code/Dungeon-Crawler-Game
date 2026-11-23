import { WasPressed, ClearPressed } from "/src/logic/Input/InputDetector.js";

import { ChangeSelection, ChooseSelection } from "/src/logic/UI/UIManager.js";

import { Rotate, MoveForward} from "/src/logic/Dungeon/DungMovement.js";

import { PLAYER } from "/src/Player.js";

const INPUT_COOLDOWN = 50; // Milisegundos
let NextInputTime = 0;

export function ListenInputEvent() {

    if (PLAYER.OnDialogue) {
        ClearPressed();
        return;
    }

    // Cooldown
    if (performance.now() < NextInputTime) {
        ClearPressed();
        return;
    }

    switch (PLAYER.PlayerState) {
        case "UI":
            UIInput();
            break;

        case "DUNGEON":
            DungeonInput();
            break;

        case "COMBAT":
            CombatInput();
            break;

        default:
            ClearPressed();
            break;
    }
}

function RegisterInput() {
    NextInputTime = performance.now() + INPUT_COOLDOWN;
}

function UIInput() {
    if (WasPressed("w")) {
        ChangeSelection(-1);
        RegisterInput();
    }
    else if (WasPressed("s")) {
        ChangeSelection(1);
        RegisterInput();
    }
    else if (WasPressed("c")) {
        ChooseSelection();
        RegisterInput();
    }
}

function DungeonInput() {
    if (WasPressed("w")) {
        MoveForward();
        RegisterInput();
    }
    else if (WasPressed("a")) {
        Rotate(-1);
        RegisterInput();
    }
    else if (WasPressed("d")) {
        Rotate(1);
        RegisterInput();
    }
    
}

function CombatInput() {

}