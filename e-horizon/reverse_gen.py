import cv2
from cryptography.fernet import Fernet
import re
student=input()
def pass_key():
    global key
    with open('passkey.text', 'rb') as f:  
        reader = f.read().replace(b'\n', b'') 
        key = reader
    return key
   
cipher = Fernet(pass_key())
img = cv2.imread('/home/sudharsan/projects/e-horizon/public/qr/'+student+'.png', cv2.IMREAD_GRAYSCALE)
qr_decoder = cv2.QRCodeDetector()
data, points, qr_code_info = qr_decoder.detectAndDecode(img)

decrypted_data=[]
def decrypt():
    
    for i in user_list:
        decrypted_data.append(cipher.decrypt(i).decode())
    print(decrypted_data)
    
if data != '':
    elements = re.findall(r"'(.*?)'", data)
    user_list = [bytes(element, 'utf-8') for element in elements]
    decrypt()
else:
    print("No QR code found or unable to decode.")

