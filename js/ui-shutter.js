shutterBtn.addEventListener('click', async () => {

  // UI非表示
uiLayer.style.display = 'none';

// video & renderer 準備待ち
const video = await waitForVideo();
await waitForRenderer(scene);

// 背景取得
const bgCanvas = document.createElement('canvas');
bgCanvas.width = video.videoWidth;
bgCanvas.height = video.videoHeight;
bgCanvas.getContext('2d').drawImage(video, 0, 0);

// ★ ここが重要 ★
await new Promise(r => requestAnimationFrame(r));
await new Promise(r => requestAnimationFrame(r));

// 3D取得
const threeCanvas = scene.renderer.domElement;
const threeImage = new Image();
threeImage.src = threeCanvas.toDataURL('image/png');

threeImage.onload = () => {
  const result = document.createElement('canvas');
  result.width = bgCanvas.width;
  result.height = bgCanvas.height;

  const ctx = result.getContext('2d');
  ctx.drawImage(bgCanvas, 0, 0);
  ctx.drawImage(threeImage, 0, 0);

  download(result.toDataURL('image/png'));
  uiLayer.style.display = 'block';
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








