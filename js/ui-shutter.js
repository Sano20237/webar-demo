//const 再代入（別の値を入れること）ができない「読み取り専用」の変数を宣言するキーワード
const shutterBtn = document.getElementById("btn-shutter");
const uiLayer = document.getElementById("ui-layer"); // UI全体を囲うdiv

shutterBtn.addEventListener("click", async () => {
  // ① UIを一時的に消す
  uiLayer.style.display = "none";

  // ② 描画待ち（1フレーム）
  await new Promise(resolve => setTimeout(resolve, 100));

  // ③ 画面をキャプチャ
  html2canvas(document.body, {
    useCORS: true,
    backgroundColor: null
  }).then(canvas => {
    // ④ PNG化
    const image = canvas.toDataURL("image/png");

    // ⑤ 保存処理
    downloadImage(image);

    // ⑥ UIを戻す
    uiLayer.style.display = "block";
  });
});

function downloadImage(dataUrl) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = "webar_capture.png";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}