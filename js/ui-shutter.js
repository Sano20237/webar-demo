const shutterBtn = document.getElementById("btn-shutter");
const uiLayer = document.getElementById("ui-layer");
const scene = document.querySelector("a-scene");

shutterBtn.addEventListener("click", async () => {

  // UIを隠す
  uiLayer.style.display = "none";

  // 1フレーム待つ
  await new Promise(r => requestAnimationFrame(r));

  // ▼ AR.js の video を正しく取得
  const video = document.querySelector("#arjs-video");

  if (!video || video.videoWidth === 0) {
    alert("カメラ映像がまだ取得できていません");
    uiLayer.style.display = "block";
    return;
  }

  if (!scene.renderer) {
    alert("3D描画が準備できていません");
    uiLayer.style.display = "block";
    return;
  }

  // ① 背景（擬似カメラ）
  const bgCanvas = document.createElement("canvas");
  bgCanvas.width = video.videoWidth;
  bgCanvas.height = video.videoHeight;

  const bgCtx = bgCanvas.getContext("2d");
  bgCtx.drawImage(video, 0, 0);

  // ② 3Dスクショ
  const threeCanvas = scene.renderer.domElement;
  const threeImage = new Image();
  threeImage.src = threeCanvas.toDataURL("image/png");

  // ③ 合成
  threeImage.onload = () => {
    const resultCanvas = document.createElement("canvas");
    resultCanvas.width = bgCanvas.width;
    resultCanvas.height = bgCanvas.height;

    const ctx = resultCanvas.getContext("2d");
    ctx.drawImage(bgCanvas, 0, 0);
    ctx.drawImage(threeImage, 0, 0);

    // ④ 保存
    const link = document.createElement("a");
    link.href = resultCanvas.toDataURL("image/png");
    link.download = "ar_photo.png";
    link.click();

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






