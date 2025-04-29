const upload = document.getElementById("upload"); // Đối tượng input tải ảnh
const img = document.getElementById("img"); // Đối tượng img hiển thị ảnh

// Các thanh kéo để điều chỉnh độ sáng, độ tương phản, bão hòa
const brightness = document.getElementById("brightness");
const contrast = document.getElementById("contrast");
const saturate = document.getElementById("saturate");

// Sự kiện khi người dùng tải ảnh lên
upload.addEventListener("change", (e) => {
  const file = e.target.files[0]; // Lấy file ảnh
  const reader = new FileReader(); // Khởi tạo FileReader để đọc ảnh

  reader.onload = () => {
    img.src = reader.result; // Gán ảnh vào thẻ img khi đã đọc xong
  };

  reader.readAsDataURL(file); // Đọc file ảnh dưới dạng DataURL
});

// Hàm cập nhật filter cho ảnh khi thay đổi các thông số
function updateFilter() {
  img.style.filter = `
    brightness(${brightness.value}%)  /* Độ sáng */
    contrast(${contrast.value}%)      /* Độ tương phản */
    saturate(${saturate.value}%)      /* Bão hòa màu */
  `;
}

// Gắn sự kiện 'input' cho các thanh kéo để thay đổi giá trị khi người dùng kéo
[brightness, contrast, saturate].forEach(input => {
  input.addEventListener("input", updateFilter); // Cập nhật filter khi giá trị thay đổi
});
