from pymongo import MongoClient

def is_database_available():
    try:
        client = MongoClient('mongodb://db:27017/')
        db = client.my_database
        collection = db.my_collection
        result = collection.find_one()
        # # создаем документ для вставки в коллекцию
        # doc1 = {"item": "apple", "qty": 2, "color": "red", "status": "A"}
        # doc2 = {"item": "pear", "qty": 5, "color": "yellow", "status": "A"}
        # doc3 = {"item": "cherry", "qty": 4, "color": "red", "status": "A"}

        # # вставляем документы в коллекцию
        # collection.insert_many([doc1, doc2, doc3])

        # # Получаем все документы из коллекции и выводим на экран
        # cursor = collection.find()
        # for document in cursor:
        #     print(document)

        # # Удаляем все документы из коллекции
        # result = collection.delete_many({})
        # print(f"{result.deleted_count} documents deleted.")
        return True
    except:
        return False