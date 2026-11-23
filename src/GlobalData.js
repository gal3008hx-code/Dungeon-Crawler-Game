const Dialogues = await fetch("./src/data/Dialogue.json");
export const DialogueData = await Dialogues.json();

import { scene } from "/src/engine/Classes.js";
export const MainScene = new scene();