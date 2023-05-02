from app import app
from flask import render_template, request, redirect, url_for

recu = "couuucouuuu"

@app.route("/", methods=["GET", "POST"])
def index() :
	if request.method == "POST":
		#output = request.get_json(force=True) #le force=True sert a skip la verification du contentType application/json
		#recu = output['text']
		recu = request.data
		print(recu)
	return render_template("public/index.html", test=recu)
