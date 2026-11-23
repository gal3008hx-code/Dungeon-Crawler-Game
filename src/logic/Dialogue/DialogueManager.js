import { DialogueData } from "/src/GlobalData.js";

export async function TriggerDialogueEvent(ID) {
    CurrentLine = 0;
    TotalLines = DialogueData[ID].length;
    
}



export async function ContinueDialogue(ID) {

}