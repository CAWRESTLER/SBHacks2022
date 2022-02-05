from flask import Blueprint, render_template, request

route = Blueprint("route", __name__)


@route.route("/")
def index():
    return render_template(
        "index.html"
    )  # Landing page, maybe also contain projects but optional
