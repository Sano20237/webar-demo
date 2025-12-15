// ===============================
// 操作対象のモデル
// ===============================
const model = document.getElementById("myModel");

// ===============================
// 調整パラメータ
// ===============================
const ROTATE_SPEED = 1.5;   // 回転速度
const SCALE_SPEED  = 0.01;  // 拡大縮小速度
const SCALE_MIN = 0.1;      // 最小サイズ
const SCALE_MAX = 3.0;      // 最大サイズ

// ===============================
// 内部状態
// ===============================
let rotateInterval = null;
let scaleInterval  = null;

// ===============================
// 回転処理
//setIntervalを使う理由→シンプルで安定
// ===============================
function startRotate(axis, direction) {
  stopRotate(); // 二重起動防止

  rotateInterval = setInterval(() => {
    const r = model.getAttribute("rotation");

    model.setAttribute("rotation", {
      x: r.x + (axis === "x" ? ROTATE_SPEED * direction : 0),
      y: r.y + (axis === "y" ? ROTATE_SPEED * direction : 0),
      z: r.z
    });
  }, 16); // 約60fps、カクカクする場合
}

function stopRotate() {
  if (rotateInterval) {
    clearInterval(rotateInterval);
    rotateInterval = null;
  }
}

// ===============================
// 拡大・縮小処理
// ===============================
function startScale(direction) {
  stopScale();

  scaleInterval = setInterval(() => {
    const s = model.getAttribute("scale");

    let newScale = s.x + SCALE_SPEED * direction;
    newScale = Math.max(SCALE_MIN, Math.min(SCALE_MAX, newScale));

    model.setAttribute("scale", {
      x: newScale,
      y: newScale,
      z: newScale
    });
  }, 16);
}

function stopScale() {
  if (scaleInterval) {
    clearInterval(scaleInterval);
    scaleInterval = null;
  }
}

// ===============================
// ボタン紐付け（共通）
// ===============================
function bindHoldButton(buttonId, onStart, onStop) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;

  // スマホ
  //画面スクロール防止,長押し時の誤動作防止
  btn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    onStart();
  });
  btn.addEventListener("touchend", onStop);
  btn.addEventListener("touchcancel", onStop);

  // PC確認用
  btn.addEventListener("mousedown", onStart);
  btn.addEventListener("mouseup", onStop);
  btn.addEventListener("mouseleave", onStop);
}

// ===============================
// 回転ボタン
// ===============================
bindHoldButton("btn-rotate-up",    () => startRotate("x", -1), stopRotate);
bindHoldButton("btn-rotate-down",  () => startRotate("x",  1), stopRotate);
bindHoldButton("btn-rotate-left",  () => startRotate("y",  1), stopRotate);
bindHoldButton("btn-rotate-right", () => startRotate("y", -1), stopRotate);

// ===============================
// 拡大・縮小ボタン
// ===============================
bindHoldButton("btn-zoom-in",  () => startScale( 1), stopScale);
bindHoldButton("btn-zoom-out", () => startScale(-1), stopScale);
