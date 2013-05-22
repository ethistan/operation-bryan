from bson import json_util, ObjectId
from flask import json
from mongokit.mongo_exceptions import ConnectionError
from mongokit.connection import Connection
import sys
import os

__author__ = 'pbudd'

class database:
	def __init__(self):
		mongodb_uri = os.environ.get("MONGOLAB_URI", "localhost:27017")

		last_slash = mongodb_uri.rfind("/")
		dbname = mongodb_uri[last_slash + 1:]

		if dbname == mongodb_uri:
			dbname = "operationBryan"

		try:
			connection = Connection(mongodb_uri)
			connection.register([])
			self.database = connection[dbname]
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

		if dump: return self.dumpObject(dataList)
		else: return dataList

	def getDistinct(self, collectionName, dump=True, criteria=None, selection=None, distinct="", sort=None):
		collection = self.getCollection(collectionName)
		if not sort: sort = [('_id', 1)]
		if not criteria: criteria = {}
		dataList = []

		for entry in collection.find(criteria, selection).sort(sort).distinct(distinct):
			dataList.append(entry)

		if dump: return self.dumpObject(dataList)
		else: return dataList

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