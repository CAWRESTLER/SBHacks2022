from flask import Blueprint, render_template, request, current_app, url_for, send_from_directory
from werkzeug.utils import secure_filename
import os
import assembly
import time


api = Blueprint("api", __name__, url_prefix="/api")


ALLOWED_EXTENSIONS = {'mp3', 'mp4', 'wav'}
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@api.route("/upload", methods=["POST"])
def upload_file():
    """
    route handler for "/api/upload" .

    POST - params : { 'file': '/name/of/file' }
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
                file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
                # Sends back the url for the file that was just uploaded
                return url_for('api.download_file', name=filename)
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

# api endpoint for sending file to AssemblyAI servers
# request data should contain the following fields:
# {
#	apikey 	: Assembly AI api key
#	path 	: Path to the file locally for upload
# }
# returns url for the uploaded data
@api.route("/assembly/upload_filepath", methods=['POST'])
def upload_filepath():
	dat = json.loads(request.data)
	client = assemblyClient(dat['apikey'])
	response = client.upload_file(dat['path'])
	return response

# api endpoint for queuing an uploaded data url for processing
# request data should contain the following fields:
# {
#	apikey 	: Assembly AI api key
#	url 	: url for previously uploaded file
# }
# returns the id of the queued data, used for checking results so should be saved
@api.route("/assembly/queue_url", methods=['POST'])
def queue_url():
	dat = json.loads(request.data)
	client = assemblyClient(dat['apikey'])
	response = client.upload_file(dat['url'])
	return response

# api endpoint for getting the response of an query id
# request data should contain the following fields:
# {
#	apikey 	: Assembly AI api key
#	id 		: id of queued video for processing
# }
# returns the response from AssemblyAI for the api call in json format
@api.route("/assembly/check_id", methods=['GET'])
def check_id():
	dat = json.loads(request.data)
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
	dat = json.loads(request.data)
	client = assemblyClient(dat['apikey'])
	response = client.get_id_status(dat['id'])
	return response
