from flask import Blueprint, render_template, request, current_app, url_for, send_from_directory, jsonify
from werkzeug.utils import secure_filename
from werkzeug.exceptions import BadRequestKeyError
import os
import json
from src.assembly import assemblyClient
import time

# change this variable to True to not send $ requests
SEND_DUMMY_QUERY = True

api = Blueprint("api", __name__, url_prefix="/api")


ALLOWED_EXTENSIONS = {'mp3', 'mp4', 'wav'}
def allowed_file(filename):
	return '.' in filename and \
		   filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@api.route("/upload", methods=["POST"])
def upload_file():
	"""
	route handler for "/api/upload" .

	POST - params : { 'file': '/name/of/file', 'apikey' : 'key'}
	Example form(for the react frontend):
	<h1>Upload new File</h1>
		<form method=post enctype=multipart/form-data>
		<input type=file name=file>
		<input type=submit value=Upload>
		</form>
	"""
	if request.method == 'POST':
			# check if the post request has the file part
			if 'file' not in request.files:
				return "no file in request"
			file = request.files['file']
			# If the user does not select a file, the browser submits an
			# empty file without a filename.
			if file.filename == '':
				return "no file selected"
			if file and allowed_file(file.filename):
				filename = str(time.time())
				filename += "-" + secure_filename(file.filename)
				filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
				file.save(filepath)
				file_url = url_for('api.download_file', name=filename)

				# send calls to AssemblyAI for text processing
				try:
					apikey = request.form['apikey']
				except BadRequestKeyError:
					return jsonify({"error":"missing apikey in form for request."}), 403
				client = assemblyClient(apikey)
				asm_upload_url = client.upload_file(filepath)
				_id = client.queue_url(asm_upload_url, dummy=SEND_DUMMY_QUERY)

				# Sends back the url for the file that was just uploaded
				return jsonify({"filepath":file_url, "query_id":_id}), 200
	return


@api.route("/uploads/<path:name>")
def download_file(name):
	"""
	route handler for "/api/uploads/<filename>"

	Sends over the file directly
	"""
	return send_from_directory(
		current_app.config['UPLOAD_FOLDER'], name, as_attachment=False
	)


# api endpoint for getting the response of an query id
# request data should contain the following fields:
# {
#	apikey 	: Assembly AI api key
#	id 		: id of queued video for processing
# }
# returns the response from AssemblyAI for the api call in json format
@api.route("/assembly/check_id", methods=['GET'])
def check_id():
	dat = request.form
	client = assemblyClient(dat['apikey'])
	response = client.check_id(dat['id'])
	return response

# api endpoint for getting the status of an query id
# request data should contain the following fields:
# {
#	apikey 	: Assembly AI api key
#	id 		: id of queued video for processing
# }
# returns status of the api request
@api.route("/assembly/get_id_status", methods=['GET'])
def get_id_status():
	dat = request.form
	client = assemblyClient(dat['apikey'])
	response = client.get_id_status(dat['id'])
	return response
