/**
 * ui-shutter.js
 * WebAR 撮影（video + Three.js 合成）安定版
 *
 * 前提：
 * - Three.js renderer は preserveDrawingBuffer: true
 * - AR.js marker を使用（marker.object3D.visible）
 * - video は <video> 要素（getUserMedia / AR.js 管理）
 */

/* ================================
   参照DOM
================================ */

const shutterBtn = document.getElementById("shutter-btn");
const uiLayer   = document.getElementById("ui-layer");

/* ================================
   外部依存（必須）
================================ */

// Three.js
// scene.renderer.domElement が存在すること
// scene.renderer instanceof THREE.WebGLRenderer

// AR.js
// marker.object3D.visible が取得できること
// const marker = ...

// video
// const video = document.querySelector("video");

/* ================================
   Utility
================================ */

/** requestAnimationFrame を1フレーム待つ */
const raf = () => new Promise(r => requestAnimationFrame(r));

/** video が描画可能になるまで待つ */
function waitForValidVideo(video) {
  return new Promise(resolve => {
    function check() {
      if (video && video.videoWidth > 0 && video.readyState >= 2) {
        resolve(video);
      } else {
        requestAnimationFrame(check);
      }
    }
    check();
  });
}

/** renderer が描画可能になるまで待つ */
function waitForRenderer(scene) {
  return new Promise(resolve => {
    function check() {
      if (
        scene &&
        scene.renderer &&
        scene.renderer.domElement &&
        scene.renderer.domElement.width > 0
      ) {
        resolve();
      } else {
        requestAnimationFrame(check);
      }
    }
    check();
  });
}

/** マーカーが安定して visible なフレームを待つ */
function waitForStableMarker(marker, stableFrames = 5) {
  return new Promise((resolve, reject) => {
    let count = 0;
    let timeout = 120; // 最大約2秒

    function check() {
      if (marker.object3D.visible) {
        count++;
        if (count >= stableFrames) {
          resolve();
          return;
        }
      } else {
        count = 0;
      }

      timeout--;
      if (timeout <= 0) {
        reject(new Error("Marker not stable"));
        return;
      }
      requestAnimationFrame(check);
    }
    check();
  });
}

/** dataURL 妥当性チェック */
function isValidDataURL(url) {
  return typeof url === "string" && url.length > 1000;
}

/** ダウンロード処理 */
function download(dataUrl, filename = "ar-photo.png") {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/* ================================
   メイン処理
================================ */

shutterBtn.addEventListener("click", async () => {

  if (shutterBtn.disabled) return;
  shutterBtn.disabled = true;

  try {

    /* ---------- 安定状態待ち ---------- */

    await waitForStableMarker(marker, 5);

    uiLayer.style.display = "none";

    const video = await waitForValidVideo(
      document.querySelector("video")
    );

    await waitForRenderer(scene);

    /* ---------- 背景キャプチャ ---------- */

    const bgCanvas = document.createElement("canvas");
    bgCanvas.width  = video.videoWidth;
    bgCanvas.height = video.videoHeight;

    const bgCtx = bgCanvas.getContext("2d");
    bgCtx.drawImage(video, 0, 0);

    /* ---------- 描画安定待ち ---------- */

    await raf();
    await raf();

    /* ---------- Three.js キャプチャ ---------- */

    const threeCanvas = scene.renderer.domElement;
    const threeDataUrl = threeCanvas.toDataURL("image/png");

    if (!isValidDataURL(threeDataUrl)) {
      throw new Error("Three.js capture failed");
    }

    /* ---------- 合成 ---------- */

    const threeImage = new Image();
    threeImage.src = threeDataUrl;

    await new Promise(resolve => {
      threeImage.onload = resolve;
    });

    const result = document.createElement("canvas");
    result.width  = bgCanvas.width;
    result.height = bgCanvas.height;

    const ctx = result.getContext("2d");
    ctx.drawImage(bgCanvas, 0, 0);
    ctx.drawImage(threeImage, 0, 0);

    /* ---------- ダウンロード ---------- */

    download(result.toDataURL("image/png"));

  } catch (err) {

    console.warn("AR capture failed:", err);
    alert("撮影に失敗しました。\nもう一度お試しください。");

  } finally {

    uiLayer.style.display = "block";
    shutterBtn.disabled = false;

  }
});

/*//const 再代入（別の値を入れること）ができない「読み取り専用」の変数を宣言するキーワード
const shutterBtn = document.getElementById("btn-shutter");
const uiLayer = document.getElementById("ui-layer"); // UI全体を囲うdiv
const scene = document.querySelector("a-scene");

shutterBtn.addEventListener("click", async () => {
  // ① UIを一時的に消す
  uiLayer.style.display = "none";

  // ② 描画待ち（1フレーム）
  await new Promise(r => setTimeout(r, 100));

  // ③ A-Frameスクリーンショット
  scene.components.screenshot.capture("perspective");

  // ④ UIを戻す
  setTimeout(() => {
    uiLayer.style.display = "block";
  }, 300);
  
});*/;










