// UIDrawer.js

const uiBox = new Image();
uiBox.src = "./assets/UI/UI_Box.png";

await uiBox.decode();

export function DrawBox(width, itemCount) {

    const height = itemCount * 2 + 2;

    // Crear Canvas temporal
    const canvas = document.createElement("canvas");

    canvas.width = width * 16;
    canvas.height = height * 16;

    const ctx = canvas.getContext("2d");

    // Dibujar un tile
    function DrawTile(tileId, x, y) {

        const sourceX = (tileId % 3) * 16;
        const sourceY = Math.floor(tileId / 3) * 16;

        ctx.drawImage(
            uiBox,
            sourceX, sourceY, 16, 16,
            x, y, 16, 16
        );
    }

    // Construir la caja
    for (let tileY = 1; tileY <= height; tileY++) {

        for (let tileX = 1; tileX <= width; tileX++) {

            let tileId;

            if (tileY === 1) {
                if (tileX === 1) tileId = 0;
                else if (tileX === width) tileId = 2;
                else tileId = 1;

            } else if (tileY === height) {
                if (tileX === 1) tileId = 6;
                else if (tileX === width) tileId = 8;
                else tileId = 7;

            } else if (tileX === 1) {
                tileId = 3;

            } else if (tileX === width) {
                tileId = 5;

            } else {
                tileId = 4;
            }

            DrawTile(
                tileId,
                (tileX - 1) * 16,
                (tileY - 1) * 16
            );
        }
    }

    return canvas;
}