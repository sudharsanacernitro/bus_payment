#!/home/sudharsan/myenv/bin/python3
from pymongo import MongoClient 
user1=[]
client = MongoClient("localhost",27017)
db = client.student
collection = db.main
def db(a1):
   
    #document_to_insert = {"name": "John", "age": 30, "city": "New York"}
    collection.insert_one(a1)
    #collection.delete_many({})
'''

l=[{"name":"22csr201","dob":"2005-01-01","bus-no":"1","validity":"31-12-2023","expire":"31-12-2024","stopping":"kanagapuram","allowed":True},
{"name":"22csr202","dob":"2005-01-01","bus-no":"1","validity":"31-12-2023","expire":"31-12-2024","stopping":"vellode","allowed":False},
{"name":"22ecr203","dob":"2005-01-01","bus-no":"1","validity":"31-12-2023","expire":"31-12-2024","stopping":"perumapalayam","allowed":True},
{"name":"22adr207","dob":"2005-01-01","bus-no":"2","validity":"31-12-2023","expire":"31-12-2024","stopping":"vellode","allowed":False},
{"name":"22csr190","dob":"2005-01-01","bus-no":"2","validity":"31-12-2023","expire":"31-12-2024","stopping":"chennimalai","allowed":True},
{"name":"22csr174","dob":"2005-01-01","bus-no":"2","validity":"31-12-2023","expire":"31-12-2024","stopping":"chennimalai-bus-stand","allowed":True},
{"name":"22csr245","dob":"2005-01-01","bus-no":"3","validity":"31-12-2023","expire":"31-12-2024","stopping":"perundurai","allowed":False},
{"name":"22csr207","dob":"2024-01-01","bus-no":"3","validity":"31-12-2023","expire":"31-12-2024","stopping":"erode","allowed":False},
{"name":"admin","dob":"2024-03-13"}
]



l=[{"busno":"1","stopping":{"vellode":"12000","kanagapuram":"12500","perumapalayam":"13000"}},
   {"busno":"2","stopping":{"vellode":"12000","chennimalai":"12500","chennimalai-bus-stand":"13000"}},
   {"busno":"3","stopping":{"perundurai":"12000","erode":"13000"}}
   
   ]'''
l=[{"name":"22csr210","dob":"2024-01-01","bus-no":"3","validity":"31-12-2023","expire":"31-12-2024","stopping":"perundurai","allowed":False}]
for i in l:
    db(i)
documents = collection.find()
for document in documents:
    user1.append(document)
print(user1)
client.close()