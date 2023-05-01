const selectImage = document.querySelector('.upload-image');
const inputFile = document.querySelector('#file');
const imgArea = document.querySelector('.img-area');
const submitBtn = document.querySelector('.submit-btn');
const clearImage = document.querySelector('.clear-image');
let img = document.createElement('img');

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
clearImage.addEventListener('click', function () {
    const allImg = imgArea.querySelectorAll('img');
    allImg.forEach(item=> item.remove());
    imgArea.classList.remove('active');
    imgArea.removeAttribute('data-img');
})  })

//bind submitBtn to a function that sends to flask
submitBtn.addEventListener('click', function () {	
	// create a formData object with multipart/form-data
	const formData = new FormData();
	// append image to formData
	const image = inputFile.files[0];
	formData.append('file', image);
	fetch('/upload', {
		method: 'POST',
		body: formData
	}).then(res=> res.json())
	.then(data=> console.log(data))
	.catch(err=> console.log(err))
})
