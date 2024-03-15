import qrcode
import json
import sys
from cryptography.fernet import Fernet

def pass_key():
    global key
    with open('passkey.text', 'rb') as f:  
        reader = f.read().replace(b'\n', b'') 
        key = reader
    return key
    
def encrypt(a1, cipher):
    data = a1.encode('utf-8')
    encrypted_data = cipher.encrypt(data)
    return encrypted_data

cipher = Fernet(pass_key())

user=[]
for i in sys.argv[2:]:
    user.append(encrypt(i, cipher))

data_json = json.dumps(str(user))

qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=4,
)
qr.add_data(data_json)
qr.make(fit=True)

img = qr.make_image(fill_color="black", back_color="white")
img.save("/home/sudharsan/projects/e-horizon/public/qr/"+sys.argv[2].split(':')[1]+".png")
print(data_json)
