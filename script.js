const upload = document.getElementById("upload");
const original = document.getElementById("original");
const edited = document.getElementById("edited");

const brightness = document.getElementById("brightness");
const contrast = document.getElementById("contrast");
const saturate = document.getElementById("saturate");

const valBrightness = document.getElementById("val-brightness");
const valContrast = document.getElementById("val-contrast");
const valSaturate = document.getElementById("val-saturate");

const saveBtn = document.getElementById("saveBtn");

// Cập nhật bộ lọc cho ảnh chỉnh sửa
function updateFilter() {
  valBrightness.textContent = `${brightness.value}%`;
  valContrast.textContent = `${contrast.value}%`;
  valSaturate.textContent = `${saturate.value}%`;

  edited.style.filter = `
    brightness(${brightness.value}%)
    contrast(${contrast.value}%)
    saturate(${saturate.value}%)
  `;
}

// Khi người dùng tải ảnh lên
upload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    original.src = reader.result;
    edited.src = reader.result;
  };

  if (file) {
    reader.readAsDataURL(file);
  }
});

// Cập nhật filter khi thay đổi thông số
[brightness, contrast, saturate].forEach(input => {
  input.addEventListener("input", updateFilter);
});

// Lưu ảnh đã chỉnh sửa
saveBtn.addEventListener("click", () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = edited.naturalWidth;
  canvas.height = edited.naturalHeight;

  ctx.filter = `
    brightness(${brightness.value}%)
    contrast(${contrast.value}%)
    saturate(${saturate.value}%)
  `;
  ctx.drawImage(edited, 0, 0, canvas.width, canvas.height);

  const link = document.createElement("a");
  link.download = "edited-image.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});
