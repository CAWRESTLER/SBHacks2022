from src import create_app
from flask import url_for

app = create_app()

if __name__ == "__main__":
	# locally hosted
    # app.run(host="localhost", debug=True)

	# public host
    app.run(host="0.0.0.0", port=80, debug=True)
