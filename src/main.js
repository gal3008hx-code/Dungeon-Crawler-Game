// src/main.js
import { ListenInputEvent } from "/src/logic/Input/InputManager.js";
import { DrawCRT } from "/src/misc/CRT.js";
import { MainScene } from  "/src/GlobalData.js";
import { PLAYER } from "/src/Player.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function StartGame() {
    PLAYER.SetState("UI", "MainMenu");
}

function UpdateLogic() {
    ListenInputEvent();
}

function Render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    MainScene.draw_scene(ctx);
    DrawCRT();
}

function MainLoop() {
    UpdateLogic();
    Render();
    requestAnimationFrame(MainLoop);
}

StartGame();
MainLoop();