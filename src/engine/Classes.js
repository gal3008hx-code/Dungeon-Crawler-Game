import { DrawBox } from "/src/logic/UI/UIDrawer.js";
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const GameFont = new FontFace(
    "GameFont",
    "url(./assets/UI/Fonts/PixeloidSans-lxa3y.ttf)"
);
await GameFont.load();
document.fonts.add(GameFont);

ctx.font = "18px GameFont";
ctx.fillStyle = "white";
ctx.textBaseline = "alphabetic";



export class scene {
    constructor() {
        this.dungeon = [];
        this.objects = [];
    }

    add(object, ID = null) {
        if (ID !== null) {
            this.objects = this.objects.filter(
                obj => obj.ID !== ID
            );
            object.ID = ID;
        }
        this.objects.push(object);
    }

    addOnPos(object, ID = null, pos) {
        if (ID !== null) {
            this.objects = this.objects.filter(
                obj => obj.ID !== ID
            );
            object.ID = ID;
        }
        this.objects.splice(pos, 0, object);
    }

    remove(object) {
        this.objects = this.objects.filter(
            obj => obj !== object
        );
    }

    removeall() {
        this.objects.length = 0;
    }

    draw_scene(ctx) {
        // Draw dungeon pieces first.
        for (let i = 0; i < this.dungeon.length; i++) {
            this.dungeon[i].draw(ctx);
        }

        // Draw regular scene objects afterward.
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].draw(ctx);
        }
    }
}

export class sprite {
    constructor(image, x, y, width, height, v, name, flipX = false) {
        this.image = image;

        this.x = x;
        this.y = y;

        if (width == null || height == null) {
            this.w = image.width;
            this.h = image.height;
        } else {
            this.w = width;
            this.h = height;
        }

        this.name = name;
        this.visible = v;
        this.flipX = flipX;
    }

    draw(ctx) {
        if (!this.visible) return;

        if (this.flipX) {
            ctx.save();

            ctx.translate(this.x * 2 + this.w, 0);
            ctx.scale(-1, 1);

            ctx.drawImage(
                this.image,
                this.x,
                this.y,
                this.w,
                this.h
            );

            ctx.restore();
            return;
        }

        ctx.drawImage(
            this.image,
            this.x,
            this.y,
            this.w,
            this.h
        );
    }
}



export class TextBox {
    constructor(txts, x, y, width, v, name) {
        this.box = DrawBox(width, txts.length);
        this.txts = txts; //txts NO es un string, es un array de strings.

        this.x = x;
        this.y = y;
        this.name = name;
        this.visible = v;
    }
    draw(ctx) {
        if (!this.visible) return;

        ctx.drawImage( 
            this.box,
            this.x,
            this.y,
        )
        let DrawY = this.y + 32;
        for(let i = 0; i < this.txts.length; i++) {
            ctx.fillText(
                this.txts[i],
                this.x + 16,
                DrawY
            )
            DrawY += 32;
        }
    }
}
export class Dungeon {
        constructor(v, name) {
        this.name = name;
        this.visible = v;
    }
    
}