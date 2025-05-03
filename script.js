const upload = document.getElementById("upload");
const original = document.getElementById("original");
const edited = document.getElementById("edited");

const brightness = document.getElementById("brightness");
const contrast = document.getElementById("contrast");
const saturate = document.getElementById("saturate");
const saveBtn = document.getElementById("saveBtn");

// Khi người dùng chọn ảnh
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

// Cập nhật filter cho ảnh chỉnh sửa
function updateFilter() {
  edited.style.filter = `
    brightness(${brightness.value}%)
    contrast(${contrast.value}%)
    saturate(${saturate.value}%)
  `;
}

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

