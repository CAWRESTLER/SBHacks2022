from flask import Flask, request, render_template, url_for, Response, Blueprint


def create_app():
    app = Flask(
        __name__, static_folder="./build/static", template_folder="./build"
    )
    with app.app_context():
        from .api import api

        app.register_blueprint(api)
        @app.route("/")
        def index():
          return render_template(
              "index.html"
          )  # Landing page, maybe also contain projects but optional

        # db.create_all()
        return app
