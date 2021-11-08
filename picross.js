const width = 500;
const height = 600;
const widRatio = 0.9;
const heiRatio = 0.95;

const app = new PIXI.Application({ width: width, height: height });

document.body.appendChild(app.renderer.view);

// app.renderer.view.style.position = "relative";
// app.renderer.view.style.width = "500px";
// app.renderer.view.style.height = "600px";
// app.renderer.view.style.display = "block";

// app.renderer.view.style.border = "2px dashed black";

app.renderer.backgroundColor = 0x999999;

// let Application = PIXI.Application;

// //アプリケーション宣言
// const width = 500;
// const height = 600;
// const widRatio = 0.9;
// const heiRatio = 0.95;
// let app = new Application({
//     width: width,
//     height: height,
//     backgroundColor: 0xAAAAAA,
// });

//貼り付け
// document.getElementById("game").appendChild(app.renderer.view);

function screenResize() {
    let wid = widRatio * window.innerWidth;//ゲームを表示できる最大横幅
    let hei = heiRatio * window.innerHeight;//ゲームを表示できる最大縦幅
    let x = width;
    let y = height;
    app.stage.scale.x = app.stage.scale.y = 1;//スクリーン幅が十分の時は画面倍率を1にする
    resizeRatio = Math.min(wid / width, hei / height);//横幅と縦幅の、ゲーム画面に対する比のうち小さい方に合わせる
    if (wid < width || hei < height) {//スクリーン幅が足りないとき
        //リサイズ倍率を調整
        x = width * resizeRatio;
        y = height * resizeRatio;
        app.stage.scale.x = resizeRatio;
        app.stage.scale.y = resizeRatio;
    }
    app.renderer.resize(x, y);//レンダラーをリサイズ
}
window.addEventListener("load", screenResize);//ロード時に画面サイズを変える
window.addEventListener('resize', screenResize, false);

let rectSize = 40;

var ajax = new XMLHttpRequest();

var answer = [];
var answerTemp = [];
var count = false;

ajax.open("get", "./reimu.txt");
ajax.send(null); // 通信させます。
ajax.addEventListener("load", function () { // loadイベントを登録します。
    console.log(this.response); // 通信結果を出力します。
    answerTemp = this.response.split(/\r\n/);
}, false);


var board = [];

const hintTop = [
    ['5', ' ', ' '],
    ['2', '1', ' '],
    ['3', ' ', ' '],
    ['1', ' ', ' '],
    ['1', ' ', ' ']
];
const hintLeft = [
    ['2', ' ', ' '],
    ['1', ' ', ' '],
    ['3', ' ', ' '],
    ['5', ' ', ' '],
    ['1', '1', ' ']
];

app.ticker.add(delta => this.gameLoop(delta, board, answerTemp, answer));

function gameLoop(delta, board, answerTemp, answer) {
    if (!count) {
        for (let y = 0; y < answerTemp.length; y++) {
            const row = answerTemp[y].split(',');
            answerTemp[y] = row;
        }
        for (let y = 0; y < answerTemp.length; y++) {
            board[y] = [];
            for (let x = 0; x < answerTemp[y].length; x++) {
                board[y][x] = 0;
            }
        }
        for (let y = 0; y < answerTemp.length; y++) {
            answer[y] = [];
            for (let x = 0; x < answerTemp[y].length; x++) {
                answer[y][x] = parseInt(answerTemp[y][x], 10);
            }
        }
        count = true;
    }

    const textStyle = new PIXI.TextStyle({
        fontFamily: "Arial", // フォント
        fontSize: 20,// フォントサイズ
        fill: 0xffffff, // 色(16進数で定義するので#ffffffと書かずに0xffffffと書く)
        dropShadow: true, // ドロップシャドウを有効にする（右下に影をつける）
        dropShadowDistance: 2, // ドロップシャドウの影の距離
    });

    let bool = true;

    if (!array_equal(board, answer)) {
        bool = true;
        draw_box(board, bool);
    } else {
        bool = false;
        draw_box(board, bool);
        const text = new PIXI.Text(`完成！`, textStyle);
        text.anchor.x = 0.5;
        text.x = 200;
        text.y = 200;
        app.stage.addChild(text);
    }
    console.log(board);
    console.log(answer);
}

function draw_box(b, check) {
    let box = [];
    for (let y = 0; y < b.length; y++) {
        box[y] = [];
        for (let x = 0; x < b[y].length; x++) {
            box[y][x] = new PIXI.Graphics();
            box[y][x].x = 150 + rectSize * x;
            box[y][x].y = 50 + rectSize * y;
            box[y][x].width = rectSize;
            box[y][x].height = rectSize;
            box[y][x].lineStyle(1, 0x000000, 1);
            switch (b[y][x]) {
                case 0:
                    box[y][x].beginFill(0xffffff);
                    break;
                case 1:
                    box[y][x].beginFill(0x000000);
                    break;
                case 2:
                    box[y][x].beginFill(0x999999);
            }

            box[y][x].drawRect(0, 0, rectSize, rectSize);
            box[y][x].endFill();
            box[y][x].interactive = true;
            box[y][x].on("pointerdown", () => {
                if (check) {
                    b[y][x]++;
                    if (b[y][x] >= 3) {
                        b[y][x] = 0;
                    }
                }
            })
            app.stage.addChild(box[y][x]);
            var g1 = new PIXI.Graphics();
            var g2 = new PIXI.Graphics();
            if (b[y][x] == 2) {
                g1.lineStyle(2, 0x000000).moveTo(150 + rectSize * x + 1, 50 + rectSize * y + 1).lineTo(150 + rectSize * (x + 1), 50 + rectSize * (y + 1));
                app.stage.addChild(g1);
                g2.lineStyle(2, 0x000000).moveTo(150 + rectSize * (x + 1) - 1, 50 + rectSize * y + 1).lineTo(150 + rectSize * x, 50 + rectSize * (y + 1));
                app.stage.addChild(g2);
            }
        }
    }
    board = b;
}

function array_equal(a, b) {
    if (!Array.isArray(a)) return false;
    if (!Array.isArray(b)) return false;
    if (a.length != b.length) return false;
    for (var y = 0; y < a.length; y++) {
        for (var x = 0; x < a[y].length; x++) {
            if (a[y][x] !== b[y][x]) return false;
        }
    }
    return true;
}