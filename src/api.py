from flask import Blueprint, render_template, request

api = Blueprint("api", __name__, url_prefix="/api")


@api.route("/")
