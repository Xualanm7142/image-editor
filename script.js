const upload = document.getElementById("upload");
const img = document.getElementById("img");

const brightness = document.getElementById("brightness");
const contrast = document.getElementById("contrast");
const saturate = document.getElementById("saturate");

upload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    img.src = reader.result;
  };

  reader.readAsDataURL(file);
});

function updateFilter() {
  img.style.filter = `
    brightness(${brightness.value}%)
    contrast(${contrast.value}%)
    saturate(${saturate.value}%)
  `;
}

[brightness, contrast, saturate].forEach(input => {
  input.addEventListener("input", updateFilter);
});
