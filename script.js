const upload = document.getElementById("upload");
const originalCanvas = document.getElementById("originalCanvas");
const editedCanvas = document.getElementById("editedCanvas");
const oCtx = originalCanvas.getContext("2d");
const eCtx = editedCanvas.getContext("2d");

const brightness = document.getElementById("brightness");
const contrast = document.getElementById("contrast");
const saturate = document.getElementById("saturate");
const filterSelect = document.getElementById("filter");
const formatSelect = document.getElementById("format");

const valBrightness = document.getElementById("val-brightness");
const valContrast = document.getElementById("val-contrast");
const valSaturate = document.getElementById("val-saturate");

const saveBtn = document.getElementById("saveBtn");
const cropBtn = document.getElementById("cropBtn");
const undoCropBtn = document.getElementById("undoCropBtn");

let image = new Image();
let cropMode = false;
let cropStart = null;
let cropEnd = null;
let originalEditedImageData = null;

function drawOriginal() {
  // Đảm bảo kích thước canvas đúng với ảnh
  originalCanvas.width = image.width;
  originalCanvas.height = image.height;
  editedCanvas.width = image.width;
  editedCanvas.height = image.height;
  oCtx.drawImage(image, 0, 0);
  updateEdited();  // Cập nhật canvas sau khi vẽ ảnh
}

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

  if (selectedFilter === "warm" || selectedFilter === "cool") {
    let imgData = eCtx.getImageData(0, 0, editedCanvas.width, editedCanvas.height);
    for (let i = 0; i < imgData.data.length; i += 4) {
      if (selectedFilter === "warm") {
        imgData.data[i] = Math.min(imgData.data[i] + 30, 255);     // R
        imgData.data[i + 2] = Math.max(imgData.data[i + 2] - 10, 0); // B
      } else {
        imgData.data[i] = Math.max(imgData.data[i] - 10, 0);       // R
        imgData.data[i + 2] = Math.min(imgData.data[i + 2] + 30, 255); // B
      }
    }
    eCtx.putImageData(imgData, 0, 0);
  }

  updateLabels();
}

function updateLabels() {
  valBrightness.textContent = `${brightness.value}%`;
  valContrast.textContent = `${contrast.value}%`;
  valSaturate.textContent = `${saturate.value}%`;
}

// Xử lý sự kiện tải ảnh lên
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

[brightness, contrast, saturate].forEach(input => {
  input.addEventListener("input", updateEdited);
});

filterSelect.addEventListener("change", updateEdited);

// Lưu ảnh sau khi chỉnh sửa
saveBtn.addEventListener("click", () => {
  const format = formatSelect.value;
  const link = document.createElement("a");
  link.download = `edited-image.${format}`;
  link.href = editedCanvas.toDataURL(`image/${format}`);
  link.click();
});

// Bật chế độ crop (cắt ảnh)
cropBtn.addEventListener("click", () => {
  cropMode = !cropMode;
  cropBtn.textContent = cropMode ? "Chế độ Crop: Bật" : "Bật chế độ Crop";
});

editedCanvas.addEventListener("mousedown", (e) => {
  if (!cropMode) return;
  const rect = editedCanvas.getBoundingClientRect();
  cropStart = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
});

editedCanvas.addEventListener("mousemove", (e) => {
  if (!cropMode || !cropStart) return;

  const rect = editedCanvas.getBoundingClientRect();
  cropEnd = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };

  // Vẽ lại vùng crop
  const width = cropEnd.x - cropStart.x;
  const height = cropEnd.y - cropStart.y;
  const cropBox = document.querySelector(".crop-box");
  if (!cropBox) {
    const newCropBox = document.createElement("div");
    newCropBox.classList.add("crop-box");
    document.body.appendChild(newCropBox);
  }
  document.querySelector(".crop-box").style.width = `${Math.abs(width)}px`;
  document.querySelector(".crop-box").style.height = `${Math.abs(height)}px`;
  document.querySelector(".crop-box").style.left = `${Math.min(cropStart.x, cropEnd.x)}px`;
  document.querySelector(".crop-box").style.top = `${Math.min(cropStart.y, cropEnd.y)}px`;
});

editedCanvas.addEventListener("mouseup", (e) => {
  if (!cropMode || !cropStart || !cropEnd) return;

  const rect = editedCanvas.getBoundingClientRect();
  const x = Math.min(cropStart.x, cropEnd.x);
  const y = Math.min(cropStart.y, cropEnd.y);
  const width = Math.abs(cropStart.x - cropEnd.x);
  const height = Math.abs(cropStart.y - cropEnd.y);

  const croppedImage = eCtx.getImageData(x, y, width, height);
  editedCanvas.width = width;
  editedCanvas.height = height;
  eCtx.putImageData(croppedImage, 0, 0);

  // Xóa vùng crop
  document.querySelector(".crop-box").remove();

  cropStart = null;
  cropEnd = null;
  cropMode = false;
  cropBtn.textContent = "Bật chế độ Crop";
});

// Hoàn tác crop
undoCropBtn.addEventListener("click", () => {
  if (!originalEditedImageData) return;
  editedCanvas.width = originalEditedImageData.width;
  editedCanvas.height = originalEditedImageData.height;
  eCtx.putImageData(originalEditedImageData, 0, 0);
  originalEditedImageData = null;
});
