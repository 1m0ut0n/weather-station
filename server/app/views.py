from app import app
from flask import render_template, request, redirect, url_for

recu = "couuucouuuu"

@app.route("/test", methods=["GET", "POST"])
def test() :
	if request.method == "POST":
		#output = request.get_json(force=True) #le force=True sert a skip la verification du contentType application/json
		#recu = output['text']
		recu = request.data
	return render_template("public/index.html", test=recu)
