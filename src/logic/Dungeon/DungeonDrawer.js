import { PLAYER } from "/src/Player.js";
import { CheckTile } from "/src/logic/Dungeon/DungeonMapManager.js";
import { MainScene } from "/src/GlobalData.js";
import { sprite } from "/src/engine/Classes.js";

// Each file is a complete wall image. Images are kept at their native dimensions.
const TileInfo = {
    "2_3_4": "/assets/Tilesets/House/Walls/Wall_2_3_4.png",
    "7_8": "/assets/Tilesets/House/Walls/Wall_7_8.png",
    "10_11_12": "/assets/Tilesets/House/Walls/Wall_10_11_12.png",
    "13_16": "/assets/Tilesets/House/Walls/Wall_13_16.png",
    "14_15": "/assets/Tilesets/House/Walls/Wall_14_15.png",
    "17_18_19": "/assets/Tilesets/House/Walls/Wall_17_18_19.png",
    "20_23": "/assets/Tilesets/House/Walls/Wall_20_23.png",
    "21_22": "/assets/Tilesets/House/Walls/Wall_21_22.png"
};

// Wall IDs that use each image. IDs 1 and 5 share the 2_3_4 texture.
const WallTextures = {
    1: "2_3_4",
    2: "2_3_4",
    3: "2_3_4",
    4: "2_3_4",
    5: "2_3_4",
    7: "7_8",
    8: "7_8",
    10: "10_11_12",
    11: "10_11_12",
    12: "10_11_12",
    13: "13_16",
    16: "13_16",
    14: "14_15",
    15: "14_15",
    17: "17_18_19",
    18: "17_18_19",
    19: "17_18_19",
    20: "20_23",
    23: "20_23",
    21: "21_22",
    22: "21_22"
};

// true means the image is flipped horizontally before drawing.
const MirrorX = {
    2: false,
    3: false,
    4: false,
    6: false,
    9: true,
    10: false,
    11: false,
    12: true,
    13: false,
    16: true,
    17: false,
    18: false,
    19: false,
    20: false,
    23: true,
    21: false,
    22: true
};

// Temporary top-left canvas coordinates. Adjust these after testing.
// Wall 21 is intentionally fixed at (0, 0), as provided.
const WallPositions = {
    1: [0, 0],
    2: [0, 0],
    3: [0, 0],
    4: [0, 0],
    5: [0, 0],
    6: [0, 0],
    7: [0, 0],
    8: [0, 0],
    9: [0, 0],
    10: [0, 0],
    11: [0, 0],
    12: [0, 0],
    13: [0, 0],
    14: [0, 0],
    15: [0, 0],
    16: [0, 0],
    17: [0, 0],
    18: [0, 0],
    19: [0, 0],
    20: [0, 0],
    21: [0, 0],
    22: [0, 0],
    23: [0, 0]
};

// The visibility tree follows the reference diagram.
// A wall blocks only its own branch; sibling branches continue independently.
const DrawOrder = {
    21: [20, 17],
    17: [13],
    18: [14, 11, 15],
    14: [10],
    10: [6],
    6: [1],
    11: [7, 3, 8],
    7: [2],
    8: [4],
    15: [12],
    12: [9],
    22: [23, 19],
    19: [16]
};

const RootWalls = [21, 18, 22];
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
        entries.map(async ([key, path]) => [key, await LoadImage(path)])
    );

    return Object.fromEntries(loaded);
}

function DrawWall(ctx, wallID, images) {
    const textureKey = WallTextures[wallID];
    if (!textureKey) return;

    const image = images[textureKey];
    if (!image) return;

    const [x, y] = WallPositions[wallID];
    const mirrored = MirrorX[wallID] === true;

    if (mirrored) {
        ctx.save();
        ctx.translate(x * 2 + image.naturalWidth, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(image, x, y);
        ctx.restore();
        return;
    }

    ctx.drawImage(image, x, y);
}

function DrawBranch(ctx, wallID, dungeonData, images, direction) {
    const offset = PosInfo[wallID][direction];

    const hasWall = CheckTile(
        dungeonData.x + offset[0],
        dungeonData.z + offset[1]
    );

    if (hasWall) {
        DrawWall(ctx, wallID, images);
        return;
    }

    for (const childID of DrawOrder[wallID] ?? []) {
        DrawBranch(ctx, childID, dungeonData, images, direction);
    }
}

const PosInfo = {
    1: [[-2, -3], [3, -2], [2, 3], [-3, 2]],
    2: [[-1, -3], [3, -1], [1, 3], [-3, 1]],
    3: [[0, -3], [3, 0], [0, 3], [-3, 0]],
    4: [[1, -3], [3, 1], [-1, 3], [-3, -1]],
    5: [[2, -3], [3, 2], [-2, 3], [-3, -2]],
    6: [[-2, -2], [2, -2], [2, 2], [-2, 2]],
    7: [[-1, -2], [2, -1], [1, 2], [-2, 1]],
    8: [[1, -2], [2, 1], [-1, 2], [-2, -1]],
    9: [[2, -2], [2, 2], [-2, 2], [-2, -2]],
    10: [[-1, -2], [2, -1], [1, 2], [-2, 1]],
    11: [[0, -2], [2, 0], [0, 2], [-2, 0]],
    12: [[1, -2], [2, 1], [-1, 2], [-2, -1]],
    13: [[-2, -1], [1, -2], [2, 1], [-1, 2]],
    14: [[-1, -1], [1, -1], [1, 1], [-1, 1]],
    15: [[1, 1], [-1, 1], [-1, -1], [1, -1]],
    16: [[2, 1], [1, -2], [-2, -1], [1, -2]],
    17: [[-1, -1], [1, -1], [1, 1], [-1, 1]],
    18: [[0, -1], [1, 0], [0, 1], [-1, 0]],
    19: [[1, 1], [-1, 1], [-1, -1], [1, -1]],
    20: [[-2, 0], [0, -2], [2, 0], [0, 2]],
    21: [[-1, 0], [0, -1], [1, 0], [0, 1]],
    22: [[1, 0], [0, 1], [-1, 0], [0, -1]],
    23: [[2, 0], [0, 2], [-2, 0], [0, -2]]
};

export async function DrawDungeon() {
    const currentVersion = ++drawVersion;
    const dungeonData = PLAYER.DungeonData;
    const mainCanvas = document.getElementById("game");

    if (!mainCanvas) {
        console.error('DungeonDrawer: canvas "#game" was not found.');
        return;
    }

    try {
        const images = await LoadWallImages();

        // Ignore an older render if the player moved while textures were loading.
        if (currentVersion !== drawVersion) return;

        const canvas = document.createElement("canvas");
        canvas.width = mainCanvas.width;
        canvas.height = mainCanvas.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
            console.error("DungeonDrawer: could not create a 2D context.");
            return;
        }

        for (const wallID of RootWalls) {
            DrawBranch(ctx, wallID, dungeonData, images, dungeonData.dir);
        }

        // Replace the previous dungeon image with the completed composite.
        MainScene.dungeon.length = 0;
        MainScene.dungeon.push(
            new sprite(canvas, 0, 0, null, null, true, "DungeonView")
        );
    } catch (error) {
        console.error("DungeonDrawer:", error);
    }
}
