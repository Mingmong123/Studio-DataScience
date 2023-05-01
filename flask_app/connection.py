from flask import *
import cv2
from werkzeug.utils import secure_filename
import numpy as np
import magic
from os import remove
from io import BytesIO
from PIL import Image
import base64


from flask_session import Session
from tensorflow.keras.models import load_model


app = Flask(__name__)
MAX_CONTENT_LENGTH = 4 * 1024 * 1024
ALLOWED_FILES = ['jpg', 'png', 'jpeg', 'JPG', 'PNG', 'JPEG' ]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/image')
def image():
    return render_template('tes_gambar.html')

@app.route('/imagehandler', methods=['POST'])
def imagehandler():
    try:
        img = request.files.get('image')
        predicted = "There was a problem in loading image. Please try again"
        if img:
            print("img exist")
            #check if the image is not above 2mb
            if img.content_length > MAX_CONTENT_LENGTH:
                return "Size too big, 4MB maximum"
            #check if the image is not corrupt
            check = magic.from_buffer(img.read(2048), mime=True)
            if check != 'image/jpeg' and check != 'image/png':
                return "Image is corrupt or not supported"
            
            img.stream.seek(0)
            
            img = cv2.imdecode(np.frombuffer(img.read(), np.uint8), cv2.IMREAD_UNCHANGED)
            model = load_model("test_1.h5")
            
            img = cv2.resize(img, (224, 224))

            cv2.imwrite("img.jpg", img, [int(cv2.IMWRITE_JPEG_QUALITY), 75])
            img = cv2.imread("img.jpg")
            

            classes=-1
            img = np.expand_dims(img, axis=0)
            img = np.reshape(img, [1, 224, 224, 3])
            classes = np.argmax(model.predict(img), axis=1)
            print(classes)
        
            if classes == 0:
                predicted = "No signs of Pneumonia detected"
            elif classes == 1:
                predicted = "Signs of Bacterial Pneumonia detected"
            elif classes == 2:
                predicted = "Signs of Viral Pneumonia detected"
            else:
                predicted = "Please try again"

            img2 = Image.open("img.jpg")
            img_data = BytesIO()
            img2.save(img_data,"JPEG")
            encoded_img_data = (base64.b64encode(img_data.getvalue())).decode('utf-8')
            remove("img.jpg")

            return render_template('hasil.html', predicted=predicted, image = encoded_img_data)
        else:
            return "There was a problem in loading image. Please try again"
    except Exception as e:
        return "There was a problem in loading image. Please try again"

    

if __name__ == '__main__':
    app.run(debug=False)