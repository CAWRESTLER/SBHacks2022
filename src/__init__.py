from flask import Flask, request, render_template, url_for, Response, Blueprint, send_from_directory
import os
from flask_cors import CORS
# TODO figure out a better path?
UPLOAD_FOLDER = './uploads'


def create_app():
	app = Flask(
		__name__, static_folder="./build/static", template_folder="./build"
	)
	#  TODO Delete in production
	CORS(app)
	# TODO refactor into separate config file
	app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
	with app.app_context():
		from .api import api

		app.register_blueprint(api)
		@app.route("/")
		def index():
		  return render_template(
			  "index.html"
		  )  # Landing page, maybe also contain projects but optional

		@app.route("/favicon.ico")
		def favicon():
			return send_from_directory(os.path.join(os.getcwd(), 'src/build'),'favicon.ico', mimetype='image/vnd.microsoft.icon')
		# db.create_all()
		return app
