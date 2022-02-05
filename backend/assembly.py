# Wrapper for AssemblyAI api

from dotenv import load_dotenv
import requests as re
load_dotenv()

import os
APIKEY = os.environ["api-key"]
HEADERS = {"authorization": APIKEY, "content-type":"application/json"}
