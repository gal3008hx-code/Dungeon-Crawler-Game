
import { MainScene } from "/src/GlobalData.js";

import {PLAYER} from "/src/Player.js";

import { TextBox, sprite } from "/src/engine/Classes.js";

import { ExecuteGlobalFunc } from "/src/Functions/Executer.js";

// CONFIGURATION

const MENU_ITEM_SPACING = 32;
const CURSOR_OFFSET_X = 8;
const CURSOR_OFFSET_Y = 16;

// RESOURCES

const MenuResponse = await fetch("./src/data/Menu.json");
const MenuData = await MenuResponse.json();

const CursorImage = new Image();
CursorImage.src = "/assets/sprites/SelectionCursor.png";

const Cursor = new sprite(CursorImage, 0, 0, 4, 18, false, "CurrentCursor");

// MENU MANAGEMENT

export async function SetMenu(MenuName) {

    const CurrentMenu = MenuData[MenuName];

    if (!CurrentMenu) {
        console.error("Menu not found:", MenuName);
        return;
    }

    PLAYER.UIData.menu = MenuName;
    PLAYER.UIData.UIPosition = 0;
    PLAYER.UIData.Selected = 0;

    PLAYER.UIData.BackgroundImage = CurrentMenu.BackgroundImage ?? null;

    // BACKGROUND

    if (CurrentMenu.BackgroundImage) {

        const BackgroundImage = new Image();
        BackgroundImage.src = CurrentMenu.BackgroundImage;

        await BackgroundImage.decode();

        const CurrentBackground = new sprite(
            BackgroundImage,
            0, 0,
            null, null,
            true,
            "CurrentBackground"
        );

        MainScene.addOnPos(CurrentBackground, "CurrentBackground", 0);
    }

    // MENU TEXT

    const CurrentMenuSprite = new TextBox(
        CurrentMenu.Text,
        CurrentMenu.x,
        CurrentMenu.y,
        CurrentMenu.w,
        true,
        "CurrentMenu"
    );

    MainScene.add(CurrentMenuSprite, "CurrentMenu");

    // CURSOR

    Cursor.x = CurrentMenu.x + CURSOR_OFFSET_X;
    Cursor.y = CurrentMenu.y + CURSOR_OFFSET_Y;
    Cursor.visible = true;

    MainScene.add(Cursor, "CurrentCursor");
}

// SELECTION

export function ChangeSelection(Direction) {

    const CurrentMenu = MenuData[PLAYER.UIData.menu];

    if (!CurrentMenu) return;

    const NewSelection = PLAYER.UIData.Selected + Direction;

    if (NewSelection < 0 || NewSelection >= CurrentMenu.Text.length) {
        return;
    }

    PLAYER.UIData.Selected = NewSelection;

    Cursor.y = CurrentMenu.y +
        CURSOR_OFFSET_Y +
        NewSelection * MENU_ITEM_SPACING;
}

// ACTION EXECUTION

export function ChooseSelection() {

    const CurrentMenu = MenuData[PLAYER.UIData.menu];

    const SelectedAction = CurrentMenu?.Actions?.[PLAYER.UIData.Selected];

    if (!SelectedAction) return;

    ExecuteGlobalFunc(
        SelectedAction.Function,
        SelectedAction.Args ?? []
    );
}
