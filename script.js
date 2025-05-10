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
  originalCanvas.width = image.width;
  originalCanvas.height = image.height;
  editedCanvas.width = image.width;
  editedCanvas.height = image.height;
  oCtx.drawImage(image, 0, 0);
  updateEdited();
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

saveBtn.addEventListener("click", () => {
  const format = formatSelect.value;
  const link = document.createElement("a");
  link.download = `edited-image.${format}`;
  link.href = editedCanvas.toDataURL(`image/${format}`);
  link.click();
});

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

editedCanvas.addEventListener("mouseup", (e

