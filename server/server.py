import os

from bson.objectid import ObjectId
from flask import Flask, render_template, request, send_from_directory

from server.db_connector import database as mongo
from server.image_connector import getConnection as getImageConnection

app = Flask(__name__, static_folder="app")

database = mongo()
getImageConnection()

@app.route('/')
def index():
	return send_from_directory("app", "index.html")

@app.route('/partials/<file>')
def getPartial(file):
	return send_from_directory('app', "partials/" + file)

@app.route('/css/<cssFile>')
def getCss(cssFile):
	return send_from_directory('app', "css/" + cssFile)

@app.route('/lib/<library>/<jsFile>')
def getLibraryJs(library, jsFile):
	return send_from_directory('app', "lib/" + library + "/" + jsFile)

@app.route('/js/<jsFile>')
def getJs(jsFile):
	return send_from_directory('app', "js/" + jsFile)

@app.route('/img/<imgFile>')
def getImg(imgFile):
	return send_from_directory('app', "img/" + imgFile)

@app.route('/favicon.ico')
def favicon():
	return ""

@app.route('/api/concept/<conceptId>')
def getConcept(conceptId):
	conceptId = conceptId.title()
	data = database.getData("concepts", criteria={"name": conceptId}, dump=False)[0]

	return database.dumpObject(data)

@app.route('/properties/<propertyName>')
def getProperty(propertyName):
	data = {
		"name": propertyName,
	    "html": render_template("properties/" + propertyName + ".html")
	}

	return database.dumpObject(data)

@app.route('/image/<imagePage>')
def getImagePage(imagePage):
	return render_template("image/" + imagePage + ".html")

@app.route('/saveForm', methods=['POST'])
def saveForm():
	data = request.json
	data = database.createBSONID(data)

	database.save("forms", data)

	return database.dumpObject({"status": "success"})

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

@app.route("/latest_form")
def getLatestForm():
	formData = database.getData("forms", False)

	return database.dumpObject(formData[0])

@app.route("/images")
def getImages():
	return database.getData("images")

def getImage(imageId):
	objectID = ObjectId(imageId)

	return database.getData("images", dump=False, criteria={"_id": objectID})

if __name__ == '__main__':
	app.debug = True
	port = int(os.environ.get('PORT', 5000))
	app.run(host='0.0.0.0', port=port)