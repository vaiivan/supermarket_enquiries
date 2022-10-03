from PIL import Image
import pytesseract



#Define path to tessaract.exe
path_to_tesseract = r'/opt/homebrew/Cellar/tesseract/5.2.0/bin/tesseract'


#Define path to image
path_to_image = './images/100G.png'

#Point tessaract_cmd to tessaract.exe
pytesseract.tesseract_cmd = path_to_tesseract

#Open image with PIL
img = Image.open(path_to_image)

#Extract text from image
text = pytesseract.image_to_string(img, lang="chi_tra+eng")
print(text)