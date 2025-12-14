const model = document.getElementById("myModel");

// 左回転
document.getElementById("btn-rotate-left").onclick = () => {
  const r = model.getAttribute("rotation");
  model.setAttribute("rotation", { x: r.x, y: r.y + 10, z: r.z });
};

// 拡大
document.getElementById("btn-zoom-in").onclick = () => {
  const s = model.getAttribute("scale");
  model.setAttribute("scale", {
    x: s.x * 1.1,
    y: s.y * 1.1,
    z: s.z * 1.1
  });
};