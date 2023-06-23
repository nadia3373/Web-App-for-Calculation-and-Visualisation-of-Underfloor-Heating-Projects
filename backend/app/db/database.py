from typing import Optional
from pymongo import MongoClient
from pymongo.database import Database

 
def get_database()-> Optional[Database]:
    try:
        client = MongoClient('mongodb://db:27017/')
        db = client.my_database
        return db
    except:
        return None