from bson import json_util, ObjectId
from flask import json
from mongokit.mongo_exceptions import ConnectionError
from mongokit.connection import Connection
import sys
import os

__author__ = 'Peter Budd'


class database:
	def __init__(self):
		mongoDB_uri = os.environ.get("MONGOLAB_URI", "localhost:27017")

		last_slash = mongoDB_uri.rfind("/")
		dbName = mongoDB_uri[last_slash + 1:]

		if dbName == mongoDB_uri:
			dbName = "operationBryan"

		try:
			connection = Connection(mongoDB_uri)
			connection.register([])
			self.database = connection[dbName]
		except ConnectionError:
			print('Error: Unable to connect to database.')
			sys.exit(1)

	def getCollection(self, collectionName):
		return self.database[collectionName]

	def getData(self, collectionName, dump=True, criteria=None, selection=None, sort=None):
		collection = self.getCollection(collectionName)

		if not sort: sort = [('_id', 1)]
		if not criteria: criteria = {}
		dataList = []

		for entry in collection.find(criteria, selection).sort(sort):
			dataList.append(entry)

		if dump:
			return self.dumpObject(dataList)
		else:
			return dataList

	def getSingleData(self, collectionName, dump=True, criteria=None, selection=None, sort=None):
		data = self.getData(collectionName, dump=False, criteria=criteria, selection=selection, sort=sort)

		data = data[0]

		if dump:
			return self.dumpObject(data)
		else:
			return data

	def getDistinct(self, collectionName, dump=True, criteria=None, selection=None, distinct="", sort=None):
		collection = self.getCollection(collectionName)
		if not sort: sort = [('_id', 1)]
		if not criteria: criteria = {}
		dataList = []

		for entry in collection.find(criteria, selection).sort(sort).distinct(distinct):
			dataList.append(entry)

		if dump:
			return self.dumpObject(dataList)
		else:
			return dataList

	def dumpObject(self, jsonObject):
		return json.dumps(jsonObject, default=json_util.default)

	def createBSONID(self, data):
		data["_id"] = ObjectId(str(data["id"]))
		del data["id"]
		return data

	def save(self, collectionName, data):
		collection = self.getCollection(collectionName)
		return collection.save(data)

	def remove(self, collectionName, data):
		collection = self.getCollection(collectionName)
		collection.remove(data)