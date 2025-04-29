const upload = document.getElementById("upload");
const img = document.getElementById("img");

// Các thanh kéo để điều chỉnh độ sáng, độ tương phản, bão hòa
const brightness = document.getElementById("brightness");
const contrast = document.getElementById("contrast");
const saturate = document.getElementById("saturate");

// Thanh kéo phóng to/thu nhỏ ảnh
const zoom = document.getElementById("zoom");

// Nút lưu ảnh
const saveBtn = document.getElementById("saveBtn");

upload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    img.src = reader.result;
  };

  reader.readAsDataURL(file);
});

// Hàm cập nhật filter cho ảnh khi thay đổi các thông số
function updateFilter() {
  img.style.filter = `
    brightness(${brightness.value}%)
    contrast(${contrast.value}%)
    saturate(${saturate.value}%)
  `;

  // Cập nhật phóng to/thu nhỏ
  img.style.transform = `scale(${zoom.value})`;
}

// Gắn sự kiện 'input' cho các thanh kéo để thay đổi giá trị khi người dùng kéo
[brightness, contrast, saturate, zoom].forEach(input => {
  input.addEventListener("input", updateFilter);
});

// Hàm lưu ảnh đã chỉnh sửa
saveBtn.addEventListener("click", () => {
  // Tạo canvas để vẽ ảnh đã chỉnh sửa
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Đặt kích thước canvas bằng với kích thước ảnh đã chỉnh sửa
  canvas.width = img.width;
  canvas.height = img.height;

  // Vẽ ảnh lên canvas với các filter đã áp dụng
  ctx.filter = `
    brightness(${brightness.value}%)
    contrast(${contrast.value}%)
    saturate(${saturate.value}%)
  `;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // Tạo liên kết tải ảnh về
  const link = document.createElement("a");
  link.download = "edited-image.png";
  link.href = canvas.toDataURL("image/png");
  link.click(); // Tải ảnh về
});
