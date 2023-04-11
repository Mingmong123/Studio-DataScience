const selectImage = document.querySelector('.upload-image');
const inputFile = document.querySelector('#file');
const imgArea = document.querySelector('.img-area');

selectImage.addEventListener('click', function () {
	inputFile.click();
})

inputFile.addEventListener('change', function () {
	const image = this.files[0]
	if(image.size < 2000000) {
		const reader = new FileReader();
		reader.onload = ()=> {
			const allImg = imgArea.querySelectorAll('img');
			allImg.forEach(item=> item.remove());
			const imgUrl = reader.result;
			const img = document.createElement('img');
			img.src = imgUrl;
			imgArea.appendChild(img);
			imgArea.classList.add('active');
			imgArea.dataset.img = image.name;
		}
		reader.readAsDataURL(image);
	} else {
		alert("Image size more than 2MB");
	}
// create a function for clear image area and remove image from imgArea 
// and remove data-img attribute from imgArea

const clearImage = document.querySelector('.clear-image');
clearImage.addEventListener('click', function () {
    const allImg = imgArea.querySelectorAll('img');
    allImg.forEach(item=> item.remove());
    imgArea.classList.remove('active');
    imgArea.removeAttribute('data-img');
})  })
