from app import app
from flask import render_template, request, redirect, url_for


@app.route("/", methods=["GET"])
def index() :
	return render_template("public/index.html")


#output = request.get_json() #le force=True sert a skip la verification du contentType application/json
#recu = output['text']

#true = fermé