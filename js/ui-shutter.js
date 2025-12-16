shutterBtn.addEventListener('click', async () => {

  uiLayer.style.display = 'none';

  const scene = document.querySelector('a-scene');

  // ① 両方準備完了まで待つ
  const video = await waitForVideo();
  await waitForRenderer(scene);

  // ② 1フレーム余裕を見る
  await new Promise(r => requestAnimationFrame(r));

  // ③ 背景取得
  const bgCanvas = document.createElement('canvas');
  bgCanvas.width = video.videoWidth;
  bgCanvas.height = video.videoHeight;
  bgCanvas.getContext('2d').drawImage(video, 0, 0);

  // ④ 3D取得
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

    const a = document.createElement('a');
    a.href = result.toDataURL('image/png');
    a.download = 'ar_photo.png';
    a.click();

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







