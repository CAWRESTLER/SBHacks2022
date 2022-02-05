# Wrapper for AssemblyAI api

from dotenv import load_dotenv
import requests as re
load_dotenv()

import os
APIKEY = os.environ["api-key"]

class assemblyClient:
	def __init__(self, apikey):
		self.apikey = apikey
		self.headers = {"authorization": self.apikey, "content-type":"application/json"}

	# input a path to a file, and it will act as a generator for the file contents
	def read_file(self, path):
		with open(path, 'rb') as f:
			while True:
				data = f.read(5242880)
				if not data:
					break
				yield data

	# input a path to a file, reads file as video then outputs upload link for transcription
	def upload_file(self, path):
		upload_response = re.post('https://api.assemblyai.com/v2/upload', headers=self.headers, data=self.read_file(path))
		audio_url = upload_response.json()["upload_url"]
		return audio_url

	# input a url, returns request id for polling later
	def queue_url(self, url, dummy=False):
		transcript_request = {"audio_url":url, "auto_chapters":'true'}
		if dummy == False:
			transcript_response = re.post("https://api.assemblyai.com/v2/transcript", json=transcript_request, headers=self.headers)
			_id = transcript_response.json()["id"]
		else:
			_id = "o6cbblqme5-7a97-4fc0-9c0d-57c2c96cdb94"
		return _id

	# input a request id, and return the response from the api
	def check_id(self, id):
		polling_response = re.get("https://api.assemblyai.com/v2/transcript/" + id, headers=self.headers)
		return polling_response.json()

	# given a request id, return the status
	def get_id_status(self, id):
		return self.check_id(id)['status']

if __name__ == "__main__":
	client = assemblyClient(APIKEY)
	print(client.get_id_status("o6cb6cvwr9-2b83-4dbb-b939-e8634130d732"))