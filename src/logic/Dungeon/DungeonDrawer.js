import { PLAYER } from "/src/Player.js";
import { CheckTile } from "/src/logic/Dungeon/DungeonMapManager.js";
import { MainScene } from "/src/GlobalData.js";
import { sprite } from "/src/engine/Classes.js";

import {
    TileInfo,
    WallTextures,
    MirrorX,
    WallPositions,
    DrawOrder,
    RootWalls,
    PosInfo
} from "/src/logic/Dungeon/DungeonInfo.js";


const ImageCache = new Map();
let drawVersion = 0;

function LoadImage(path) {
    if (!ImageCache.has(path)) {
        const imagePromise = new Promise((resolve, reject) => {
            const image = new Image();

            image.onload = () => resolve(image);

            image.onerror = () => reject(
                new Error(`Could not load dungeon texture: ${path}`)
            );

            image.src = path;
        });

        ImageCache.set(path, imagePromise);
    }

    return ImageCache.get(path);
}

async function LoadWallImages() {
    const entries = Object.entries(TileInfo);

    const loaded = await Promise.all(
        entries.map(async ([key, path]) => [
            key,
            await LoadImage(path)
        ])
    );

    return Object.fromEntries(loaded);
}

// Instead of drawing to a secondary canvas,
// create a sprite and append it to the dungeon array.
function DrawWall(wallID, images, dungeonPieces) {
    const textureKey = WallTextures[wallID];

    if (!textureKey) return;

    const image = images[textureKey];

    if (!image) return;

    const [x, y] = WallPositions[wallID];
    const mirrored = MirrorX[wallID] === true;

    dungeonPieces.push(
        new sprite(
            image,
            x,
            y,
            null,
            null,
            true,
            `Wall_${wallID}`,
            mirrored
        )
    );
}

function DrawBranch(
    wallID,
    dungeonData,
    images,
    dungeonPieces,
    direction
) {
    const offset = PosInfo[wallID][direction];

    const hasWall = CheckTile(
        dungeonData.x + offset[0],
        dungeonData.z + offset[1]
    );

    if (hasWall) {
        DrawWall(wallID, images, dungeonPieces);
        return;
    }

    for (const childID of DrawOrder[wallID] ?? []) {
        DrawBranch(
            childID,
            dungeonData,
            images,
            dungeonPieces,
            direction
        );
    }
}

export async function DrawDungeon() {
    const currentVersion = ++drawVersion;
    const dungeonData = { ...PLAYER.DungeonData };

    try {
        const images = await LoadWallImages();

        // Ignore outdated renders.
        if (currentVersion !== drawVersion) return;

        // Temporary array: do not replace the current dungeon
        // until the new render has been completely prepared.
        const dungeonPieces = [];

        for (const wallID of RootWalls) {
            DrawBranch(
                wallID,
                dungeonData,
                images,
                dungeonPieces,
                dungeonData.dir
            );
        }

        // Replace the old pieces with the newly ordered pieces.
        MainScene.dungeon.splice(
            0,
            MainScene.dungeon.length,
            ...dungeonPieces
        );

    } catch (error) {
        console.error("DungeonDrawer:", error);
    }
}
