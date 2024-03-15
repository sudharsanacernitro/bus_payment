#!/home/sudharsan/myenv/bin/python3
from pymongo import MongoClient 
import sys
import csv
import json
user = []
user1 = []

def db():
    client = MongoClient("localhost",27017)
    db = client.student
    collection = db.main
    #document_to_insert = {"name": "John", "age": 30, "city": "New York"}
    #collection.insert_one(a1)
    #collection.delete_many({"name":"john"})
    documents = collection.find()
    for document in documents:
        a1=document['name']+document["dob"]
        user1.append(a1)
    client.close()


 
#x2=encrypt(a[1])
#db({"name":x1,"email":x2})
db()
json_list = json.dumps(user1)
print(json_list)




'''
if(x==0):        
    with open('user.csv','a',newline='') as fp:
        writer=csv.writer(fp)
        for i in sys.argv[1:]:
            user.append(i)
            writer.writerow(user)
    with open('user.csv','r',newline='') as f:
        reader=csv.reader(f)
        for row in reader:
            user1.append(row[0])
    json_list = json.dumps(user1)
    print(json_list)'''
