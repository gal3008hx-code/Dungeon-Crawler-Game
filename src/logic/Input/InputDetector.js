const keys = {};
const pressedKeys = new Set();

document.addEventListener("keydown", (event) => {
    if (event.repeat) return;

    keys[event.key] = true;
    pressedKeys.add(event.key);
});

document.addEventListener("keyup", (event) => {
    keys[event.key] = false;
});

export function IsPressed(key) {
    return keys[key] === true;
}

export function WasPressed(key) {
    if (!pressedKeys.has(key)) return false;

    pressedKeys.delete(key);
    return true;
}

export function ClearPressed() {
    pressedKeys.clear();
}