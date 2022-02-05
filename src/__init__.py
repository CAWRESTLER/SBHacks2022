from flask import Flask, request, render_template, url_for, Response, Blueprint


def create_app():
    app = Flask(
        __name__, static_folder="./build/static", template_folder="./build"
    )
    with app.app_context():
        from .routes import route

        app.register_blueprint(route)

        # db.create_all()
        return app
