const upload = document.getElementById("upload");
const originalCanvas = document.getElementById("originalCanvas");
const editedCanvas = document.getElementById("editedCanvas");
const oCtx = originalCanvas.getContext("2d");
const eCtx = editedCanvas.getContext("2d");

const brightness = document.getElementById("brightness");
const contrast = document.getElementById("contrast");
const saturate = document.getElementById("saturate");

const valBrightness = document.getElementById("val-brightness");
const valContrast = document.getElementById("val-contrast");
const valSaturate = document.getElementById("val-saturate");

const saveBtn = document.getElementById("saveBtn");
const cropBtn = document.getElementById("cropBtn");
const formatSelect = document.getElementById("format");

let image = new Image();
let cropMode = false;
let cropStart = null;
let cropRect = null;

// Vẽ ảnh ban đầu
function drawOriginal() {
  originalCanvas.width = image.width;
  originalCanvas.height = image.height;
  editedCanvas.width = image.width;
  editedCanvas.height = image.height;
  oCtx.drawImage(image, 0, 0);
  updateEdited();
}

// Áp dụng filter lên canvas chỉnh sửa
function updateEdited() {
  eCtx.clearRect(0, 0, editedCanvas.width, editedCanvas.height);
  eCtx.filter = `
    brightness(${brightness.value}%)
    contrast(${contrast.value}%)
    saturate(${saturate.value}%)
  `;
  eCtx.drawImage(originalCanvas, 0, 0);
  updateLabels();
}

function updateLabels() {
  valBrightness.textContent = `${brightness.value}%`;
  valContrast.textContent = `${contrast.value}%`;
  valSaturate.textContent = `${saturate.value}%`;
}

// Đọc ảnh từ file
upload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    image.onload = drawOriginal;
    image.src = reader.result;
  };
  reader.readAsDataURL(file);
});

// Cập nhật khi thay đổi thông số
[brightness, contrast, saturate].forEach(input => {
  input.addEventListener("input", updateEdited);
});

// Lưu ảnh
saveBtn.addEventListener("click", () => {
  const format = formatSelect.value;
  const link = document.createElement("a");
  link.download = `edited-image.${format}`;
  link.href = editedCanvas.toDataURL(`image/${format}`);
  link.click();
});

// Toggle chế độ crop
cropBtn.addEventListener("click", () => {
  cropMode = !cropMode;
  cropBtn.textContent = cropMode ? "Chế độ Crop: Bật" : "Bật chế độ Crop";
});

// Bắt đầu chọn vùng crop
editedCanvas.addEventListener("mousedown", (e) => {
  if (!cropMode) return;
  const rect = editedCanvas.getBoundingClientRect();
  cropStart = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
});

editedCanvas.addEventListener("mouseup", (e) => {
  if (!cropMode || !cropStart) return;
  const rect = editedCanvas.getBoundingClientRect();
  const endX = e.clientX - rect.left;
  const endY = e.clientY - rect.top;

  const x = Math.min(cropStart.x, endX);
  const y = Math.min(cropStart.y, endY);
  const width = Math.abs(cropStart.x - endX);
  const height = Math.abs(cropStart.y - endY);

  const croppedImage = eCtx.getImageData(x, y, width, height);

  // Cập nhật canvas mới
  editedCanvas.width = width;
  editedCanvas.height = height;
  eCtx.putImageData(croppedImage, 0, 0);

  cropStart = null;
  cropMode = false;
  cropBtn.textContent = "Bật chế độ Crop";
});
