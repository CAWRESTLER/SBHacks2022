# Wrapper for AssemblyAI api

from dotenv import load_dotenv
from time import time
from random import randint
import os
import json
import pickle
import requests as re
load_dotenv()

APIKEY = os.environ["api-key"]

dummyTimer = []
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
	def queue_url(self, url, dummy=None):
		transcript_request = {"audio_url":url, "auto_chapters":'true'}
		if dummy == None:
			transcript_response = re.post("https://api.assemblyai.com/v2/transcript", json=transcript_request, headers=self.headers)
			_id = transcript_response.json()["id"]
		else:
			with open(f"src/dummyResponses/{dummy}/id_url.txt", 'r') as f:
				_id = f.read().splitlines()[0]
			q_time = time()
			# dummyTimer = [q_time+randint(1,2), q_time+randint(10,50)]
			dummyTimer = [q_time+randint(1,2), q_time+3]
			pickle.dump(dummyTimer, open(f'src/dummyResponses/{dummy}/timer.pkl', 'wb'))
		return _id

	# input a request id, and return the response from the api
	def check_id(self, id, dummy=None):
		if dummy == None:
			polling_response = re.get("https://api.assemblyai.com/v2/transcript/" + id, headers=self.headers)
			return polling_response.json()
		else:
			base = f"src/dummyResponses/{dummy}"
			_time = time()
			dummyTimer = pickle.load(open(f'src/dummyResponses/{dummy}/timer.pkl', 'rb'))
			if _time < dummyTimer[0]:
				stage = "queued"
			elif _time < dummyTimer[1]:
				stage = "processing"
			else:
				stage = "completed"
			with open(f"{base}/dummy{stage}.json", 'r') as f:
				return json.loads(f.read())

	# given a request id, return the status
	def get_id_status(self, id, dummy=None):
		return self.check_id(id, dummy=dummy)['status']

if __name__ == "__main__":
	from time import sleep
	client = assemblyClient(APIKEY)

	video_name = "ece153b" # put video name here
	
	os.makedirs(f"src/dummyResponses/{video_name}", exist_ok=False)
	_url = client.upload_file(f"src/testVideos/{video_name}.mp4")
	_id = client.queue_url(_url)
	with open(f"src/dummyResponses/{video_name}/id_url.txt", 'w') as f:
		f.write(_id)
		f.write("\n")
		f.write(_url)
	
	while True:
		resp = client.check_id(_id)
		with open(f"src/dummyResponses/{video_name}/dummy{resp['status']}.json", 'w') as f:
			json.dump(resp, f)
		sleep(1)
		if resp['status'] == "completed":
			break