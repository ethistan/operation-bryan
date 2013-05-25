import cloudinary
import os

from bson.objectid import ObjectId
from flask import Flask, render_template, request, send_from_directory

from db_connector import database as mongo
from image_connector import getConnection as getImageConnection

app = Flask("Operation Bryan")

database = mongo()
getImageConnection()

static_root = "app"
test_root = "test"

@app.route('/')
def index():
	return send_from_directory(static_root, "index.html")

@app.route('/partials/<file>')
def getPartial(file):
	return send_from_directory(static_root, "partials/" + file)

@app.route('/css/<cssFile>')
def getCss(cssFile):
	return send_from_directory(static_root, "css/" + cssFile)

@app.route('/lib/<library>/<jsFile>')
def getLibraryJs(library, jsFile):
	return send_from_directory(static_root, "lib/" + library + "/" + jsFile)

@app.route('/js/<jsFile>')
def getJs(jsFile):
	return send_from_directory(static_root, "js/" + jsFile)

@app.route('/img/<imgFile>')
def getImg(imgFile):
	return send_from_directory(static_root, "img/" + imgFile)

@app.route('/test')
def test():
	return send_from_directory(test_root, "e2e/runner.html")

@app.route('/scenarios')
def testScenarios():
	return send_from_directory(test_root, "e2e/scenarios.js")


@app.route('/test/lib/<library>/<fileName>')
def getLibrary(library, fileName):
	return send_from_directory(test_root, "lib/" + library + "/" + fileName)

@app.route('/favicon.ico')
def favicon():
	return send_from_directory(static_root, 'img/favicon.ico')

@app.route('/api/concept/root')
def getRoot():
	parentlessConcept = database.getSingleData("concepts", criteria={"parents": []}, dump=False)

	if not parentlessConcept:
		rootId = createConcept(None, False)
	else:
		rootId = parentlessConcept["_id"]

	return getConcept(rootId)

@app.route('/api/concept/<conceptId>', methods=["GET"])
def getConcept(conceptId):
	data = database.getSingleData("concepts", criteria={"_id": ObjectId(conceptId)}, dump=False)

	arrNames = ["parents", "related", "children"]

	for array in arrNames:
		newArray = []

		for child in data[array]:
			listData = database.getSingleData("concepts", criteria={"_id": ObjectId(child)}, dump=False, selection={"name": True, "overview": True})
			newArray.append({"id": child, "name": listData["name"], "overview": listData["overview"]})

		data[array] = newArray

	return database.dumpObject(data)

@app.route('/api/concept/<conceptId>', methods=['POST'])
def saveConcept(conceptId):
	data = request.json
	data = database.createBSONID(data)

	arrNames = ["parents", "related", "children"]

	for array in arrNames:
		newArray = []

		for child in data[array]:
			newArray.append(child["id"])

		data[array] = newArray

	database.save("concepts", data)

	return getConcept(conceptId)

@app.route('/api/concept/<conceptId>', methods=["CREATE"])
def createConcept(conceptId, fromApp=True):
	data = {
		"name": "New Concept",
	    "overview": "Sample overview",
	    "parents": [],
	    "children": [],
	    "related": [],
	    "fields": []
	}

	if(conceptId):
		owner = request.args.get("owner").lower()

		print "Owner:", owner

		if owner == "parents":
			owner = "children"
		elif owner == "children":
			owner = "parents"

		data[owner].append(conceptId)

	newConcept = database.save("concepts", data)

	if fromApp:
		return database.dumpObject({"id": newConcept, "name": "New Concept", "overview": "Sample Overview"})
	else:
		return newConcept

@app.route('/image/<imagePage>')
def getImagePage(imagePage):
	return render_template("image/" + imagePage + ".html")

#noinspection PyBroadException
@app.route("/createImage", methods=['POST'])
def createImage():
	data = request.json

	try:
		cloudinaryImage = cloudinary.upload(data["file"], public_id = data["name"])
		cloudinaryImage["name"] = data["name"]

		image = database.save("images", cloudinaryImage)

		return database.dumpObject({"status": "success", "content": getImage(image)})
	except:
		return database.dumpObject({"status" : "error", "message": "The URL must be valid"})

#noinspection PyBroadException
@app.route("/uploadImage", methods=['POST'])
def uploadImage():
	data = request.form

	try:
		cloudinaryImage = cloudinary.upload(request.files["file"], public_id = data["name"])
		cloudinaryImage["name"] = data["name"]

		image = database.save("images", cloudinaryImage)

		return database.dumpObject({"status": "success", "content": getImage(image)})
	except:
		return database.dumpObject({"status" : "error", "message" : "There was a problem uploading the image"})

@app.route("/deleteImage", methods=['POST'])
def deleteImage():
	data = database.createBSONID(request.json)

	cloudinary.destroy(public_id = data["name"])

	database.remove("images", data)

	return database.dumpObject({"status": "success"})

@app.route("/updateImage", methods=['POST'])
def updateImage():
	data = database.createBSONID(request.json)

	database.save("images", data)

	return database.dumpObject({"status": "success"})

def getImage(imageId):
	objectID = ObjectId(imageId)

	return database.getData("images", dump=False, criteria={"_id": objectID})

if __name__ == '__main__':
	app.debug = True
	port = int(os.environ.get('PORT', 5000))
	app.run(host='0.0.0.0', port=port)