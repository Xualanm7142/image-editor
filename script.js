const upload = document.getElementById('upload');
const originalCanvas = document.getElementById('originalCanvas');
const editedCanvas = document.getElementById('editedCanvas');
const brightnessSlider = document.getElementById('brightness');
const contrastSlider = document.getElementById('contrast');
const saturateSlider = document.getElementById('saturate');
const filterSelect = document.getElementById('filter');
const formatSelect = document.getElementById('format');
const cropBtn = document.getElementById('cropBtn');
const undoCropBtn = document.getElementById('undoCropBtn');
const saveBtn = document.getElementById('saveBtn');
const valBrightness = document.getElementById('val-brightness');
const valContrast = document.getElementById('val-contrast');
const valSaturate = document.getElementById('val-saturate');

const originalCtx = originalCanvas.getContext('2d');
const editedCtx = editedCanvas.getContext('2d');

let img = new Image();
let isCropping = false;
let cropStartX, cropStartY, cropEndX, cropEndY;
let originalImageData = null;

function updateCanvasSize(canvas, width, height) {
  canvas.width = width;
  canvas.height = height;
}

function drawImageToCanvas() {
  if (!img) return; // Ensure image exists
  updateCanvasSize(originalCanvas, img.width, img.height);
  updateCanvasSize(editedCanvas, img.width, img.height);
  originalCtx.drawImage(img, 0, 0);
  applyFilters(); // draw to edited canvas
}

function applyFilters() {
  const brightness = brightnessSlider.value;
  const contrast = contrastSlider.value;
  const saturate = saturateSlider.value;
  const selectedFilter = filterSelect.value;

  valBrightness.textContent = brightness + '%';
  valContrast.textContent = contrast + '%';
  valSaturate.textContent = saturate + '%';

  editedCtx.clearRect(0, 0, editedCanvas.width, editedCanvas.height);
  editedCtx.drawImage(originalCanvas, 0, 0);

  let filterString = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%)`;

  switch (selectedFilter) {
    case 'grayscale':
      filterString += ' grayscale(100%)';
      break;
    case 'blur':
      filterString += ' blur(3px)';
      break;
    case 'warm':
      filterString += ' sepia(0.3) hue-rotate(-10deg)';
      break;
    case 'cool':
      filterString += ' hue-rotate(180deg) saturate(120%)';
      break;
  }

  editedCtx.filter = filterString;
  editedCtx.drawImage(originalCanvas, 0, 0);
  editedCtx.filter = 'none'; // reset filter
}

function saveImage() {
  const format = formatSelect.value;
  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const dataUrl = editedCanvas.toDataURL(mimeType);

  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `edited.${format}`;
  link.click();
}

// --- Crop ---
editedCanvas.addEventListener('mousedown', e => {
  if (!isCropping) return;
  const rect = editedCanvas.getBoundingClientRect();
  cropStartX = e.clientX - rect.left;
  cropStartY = e.clientY - rect.top;
});

editedCanvas.addEventListener('mouseup', e => {
  if (!isCropping) return;
  const rect = editedCanvas.getBoundingClientRect();
  cropEndX = e.clientX - rect.left;
  cropEndY = e.clientY - rect.top;

  const x = Math.min(cropStartX, cropEndX);
  const y = Math.min(cropStartY, cropEndY);
  const width = Math.abs(cropEndX - cropStartX);
  const height = Math.abs(cropEndY - cropStartY);

  if (width === 0 || height === 0) return;

  // Save current image data for undo
  originalImageData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height);

  // Crop both canvases
  const croppedImage = editedCtx.getImageData(x, y, width, height);
  updateCanvasSize(originalCanvas, width, height);
  updateCanvasSize(editedCanvas, width, height);
  originalCtx.putImageData(croppedImage, 0, 0);
  applyFilters();
});

cropBtn.addEventListener('click', () => {
  isCropping = !isCropping;
  cropBtn.textContent = isCropping ? 'Đang crop – Click để tắt' : 'Bật chế độ Crop';
});

undoCropBtn.addEventListener('click', () => {
  if (originalImageData) {
    updateCanvasSize(originalCanvas, originalImageData.width, originalImageData.height);
    updateCanvasSize(editedCanvas, originalImageData.width, originalImageData.height);
    originalCtx.putImageData(originalImageData, 0, 0);
    applyFilters();
  }
});

// --- Sự kiện ---
upload.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    const image = new Image();
    image.onload = () => {
      img = image;
      drawImageToCanvas();
    };
    image.src = evt.target.result;
  };
  reader.readAsDataURL(file);
});

[brightnessSlider, contrastSlider, saturateSlider, filterSelect].forEach(el =>
  el.addEventListener('input', applyFilters)
);

saveBtn.addEventListener('click', saveImage);
