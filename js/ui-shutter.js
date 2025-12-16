// ===============================
// 要素取得
// ===============================
const shutterBtn = document.getElementById("btn-shutter");
const uiLayer = document.getElementById("ui-layer");
const scene = document.querySelector("a-scene");

// ===============================
// ユーティリティ
// ===============================
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function waitForVideo() {
  return new Promise(resolve => {
    const check = () => {
      const video = document.querySelector("video");
      if (video && video.videoWidth > 0 && video.videoHeight > 0) {
        resolve(video);
      } else {
        requestAnimationFrame(check);
      }
    };
    check();
  });
}

function waitForRenderer(scene) {
  return new Promise(resolve => {
    const check = () => {
      if (scene.renderer && scene.renderer.domElement) {
        resolve();
      } else {
        requestAnimationFrame(check);
      }
    };
    check();
  });
}

function downloadImage(dataUrl) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = "ar_photo.png";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// ===============================
// シャッター処理
// ===============================
shutterBtn.addEventListener("click", async () => {

  // UI非表示
  uiLayer.style.display = "none";

  // カメラ & renderer 準備待ち
  const video = await waitForVideo();
  await waitForRenderer(scene);

  // ===== 背景（擬似カメラ）取得 =====
  const bgCanvas = document.createElement("canvas");
  bgCanvas.width  = video.videoWidth;
  bgCanvas.height = video.videoHeight;

  const bgCtx = bgCanvas.getContext("2d");
  bgCtx.drawImage(video, 0, 0, bgCanvas.width, bgCanvas.height);

  // ===== 重要：2フレーム待つ =====
  await new Promise(r => requestAnimationFrame(r));
  await new Promise(r => requestAnimationFrame(r));

  // ===== Three.js 取得 =====
  const threeCanvas = scene.renderer.domElement;
  const threeImage = new Image();
  threeImage.src = threeCanvas.toDataURL("image/png");

  threeImage.onload = () => {

    // ===== 合成キャンバス =====
    const resultCanvas = document.createElement("canvas");
    resultCanvas.width  = bgCanvas.width;
    resultCanvas.height = bgCanvas.height;

    const ctx = resultCanvas.getContext("2d");

    // --- 背景描画 ---
    ctx.drawImage(bgCanvas, 0, 0);

    // --- 比率補正（超重要） ---
    const bw = bgCanvas.width;
    const bh = bgCanvas.height;

    const tw = threeImage.width;
    const th = threeImage.height;

    const bgRatio = bw / bh;
    const threeRatio = tw / th;

    let sx, sy, sw, sh;

    if (threeRatio > bgRatio) {
      // 横長 → 左右トリミング
      sh = th;
      sw = th * bgRatio;
      sx = (tw - sw) / 2;
      sy = 0;
    } else {
      // 縦長 → 上下トリミング
      sw = tw;
      sh = tw / bgRatio;
      sx = 0;
      sy = (th - sh) / 2;
    }

    // --- 3D合成 ---
    ctx.drawImage(
      threeImage,
      sx, sy, sw, sh,   // 切り出し
      0, 0, bw, bh      // 背景にフィット
    );

    // ===== 保存 =====
    downloadImage(resultCanvas.toDataURL("image/png"));

    // UI復帰
    uiLayer.style.display = "block";
  };
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











