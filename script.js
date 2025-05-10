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

const filterSelect = document.getElementById("filter");
const formatSelect = document.getElementById("format");

const saveBtn = document.getElementById("saveBtn");
const cropBtn = document.getElementById("cropBtn");
const undoCropBtn = document.getElementById("undoCropBtn");

let image = new Image();
let cropMode = false;
let cropStart = null;
let originalEditedImageData = null;

// Hiển thị ảnh gốc và ảnh chỉnh sửa
function drawOriginal() {
  originalCanvas.width = image.width;
  originalCanvas.height = image.height;
  editedCanvas.width = image.width;
  editedCanvas.height = image.height;
  oCtx.drawImage(image, 0, 0);
  updateEdited();
}

// Cập nhật ảnh đã chỉnh sửa
function updateEdited() {
  eCtx.clearRect(0, 0, editedCanvas.width, editedCanvas.height);

  let filters = [
    `brightness(${brightness.value}%)`,
    `contrast(${contrast.value}%)`,
    `saturate(${saturate.value}%)`
  ];

  const selectedFilter = filterSelect.value;

  if (selectedFilter === "grayscale") {
    filters.push("grayscale(100%)");
  } else if (selectedFilter === "blur") {
    filters.push("blur(3px)");
  }

  eCtx.filter = filters.join(" ");
  eCtx.drawImage(originalCanvas, 0, 0);
  updateLabels();
}

// Cập nhật nhãn hiển thị
function updateLabels() {
  valBrightness.textContent = `${brightness.value}%`;
  valContrast.textContent = `${contrast.value}%`;
  valSaturate.textContent = `${saturate.value}%`;
}

// Tải ảnh
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

// Thay đổi thông số
[brightness, contrast, saturate].forEach(input => {
  input.addEventListener("input", updateEdited);
});

// Thay đổi bộ lọc
filterSelect.addEventListener("change", updateEdited);

// Lưu ảnh
saveBtn.addEventListener("click", () => {
  const format = formatSelect.value;
  const link = document.createElement("a");
  link.download = `edited-image.${format}`;
  link.href = editedCanvas.toDataURL(`image/${format}`);
  link.click();
});

// Bật chế độ crop
cropBtn.addEventListener("click", () => {
  cropMode = !cropMode;
  cropBtn.textContent = cropMode ? "Chế độ Crop: Bật" : "Bật chế độ Crop";
});

// Crop ảnh
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

  originalEditedImageData = eCtx.getImageData(0, 0, editedCanvas.width, editedCanvas.height);

  const rect = editedCanvas.getBoundingClientRect();
  const endX = e.clientX - rect.left;
  const endY = e.clientY - rect.top;

  const x = Math.min(cropStart.x, endX);
  const y = Math.min(cropStart.y, endY);
  const width = Math.abs(cropStart.x - endX);
  const height = Math.abs(cropStart.y - endY);

  const croppedImage = eCtx.getImageData(x, y, width, height);

  editedCanvas.width = width;
  editedCanvas.height = height;
  eCtx.putImageData(croppedImage, 0, 0);

  cropStart = null;
  cropMode = false;
  cropBtn.textContent = "Bật chế độ Crop";
});

// Hoàn tác crop
undoCropBtn.addEventListener("click", () => {
  if (!originalEditedImageData) {
    alert("Không có ảnh nào để hoàn tác.");
    return;
  }

  editedCanvas.width = originalEditedImageData.width;
  editedCanvas.height = originalEditedImageData.height;
  eCtx.putImageData(originalEditedImageData, 0, 0);
  originalEditedImageData = null;
});
