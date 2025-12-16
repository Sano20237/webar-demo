// ===============================
// UI & Scene 参照
// ===============================
const shutterBtn = document.getElementById("btn-shutter");
const uiLayer = document.getElementById("ui-layer");
const scene = document.querySelector("a-scene");
const marker = document.querySelector("a-marker");

// ===============================
// ユーティリティ
// ===============================

// video が使えるまで待つ
function waitForVideo() {
  return new Promise(resolve => {
    const check = () => {
      const video = document.querySelector("video");
      if (video && video.videoWidth > 0) {
        resolve(video);
      } else {
        requestAnimationFrame(check);
      }
    };
    check();
  });
}

// renderer が初期化されるまで待つ
function waitForRenderer(scene) {
  return new Promise(resolve => {
    const check = () => {
      if (scene.renderer) {
        resolve();
      } else {
        requestAnimationFrame(check);
      }
    };
    check();
  });
}

// ===============================
// シャッター処理
// ===============================
shutterBtn.addEventListener("click", async () => {

  // マーカー未検出なら撮影しない（重要）
  if (!marker.object3D.visible) {
    alert("マーカーを認識してください");
    return;
  }

  // UI 非表示
  uiLayer.style.display = "none";

  // 準備待ち
  const video = await waitForVideo();
  await waitForRenderer(scene);

  // ===============================
  // ① 背景（擬似カメラ）取得
  // ===============================
  const bgCanvas = document.createElement("canvas");
  bgCanvas.width = video.videoWidth;
  bgCanvas.height = video.videoHeight;

  const bgCtx = bgCanvas.getContext("2d");
  bgCtx.drawImage(video, 0, 0);

  // ===============================
  // ★ WebGL描画確定待ち（超重要）
  // ===============================
  await new Promise(r => requestAnimationFrame(r));
  await new Promise(r => requestAnimationFrame(r));

  // ===============================
  // ② 3D取得
  // ===============================
  const threeCanvas = scene.renderer.domElement;
  const threeImage = new Image();
  threeImage.src = threeCanvas.toDataURL("image/png");

  threeImage.onload = () => {

    // ===============================
    // ③ 合成
    // ===============================
    const resultCanvas = document.createElement("canvas");
    resultCanvas.width = bgCanvas.width;
    resultCanvas.height = bgCanvas.height;

    const ctx = resultCanvas.getContext("2d");
    ctx.drawImage(bgCanvas, 0, 0);
    ctx.drawImage(threeImage, 0, 0);

    // ===============================
    // ④ 保存
    // ===============================
    const a = document.createElement("a");
    a.href = resultCanvas.toDataURL("image/png");
    a.download = "ar_photo.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // UI 復帰
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









