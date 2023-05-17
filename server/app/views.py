from app import app, db
from flask import render_template, request
from datetime import datetime
from app.models import Data
import json

@app.route("/", methods=["GET"])
def index() :
	return render_template("public/index.html")

@app.route("/envoi", methods=["POST"])
def envoi():
	output = request.get_json()
	if output["shutterstate"] == 0:
	    output["shutterstate"] = True
	else:
	    output["shutterstate"] = False
	if output["blindstate"] == 0:
	    output["blindstate"] = True
	else:
	    output["blindstate"] = False
	output["date"] = datetime.now()
	
	avant_dernier = db.session.execute(db.select(Data).order_by(Data.date.desc()).limit(2)).all()[1]
	dernier = db.session.execute(db.select(Data).order_by(Data.date.desc())).first()
	
	if (dernier[0].shutter != avant_dernier[0].shutter) and (dernier[0].shutter != output["shutterstate"]):
	    etat_volets = dernier[0].shutter
	else:
	    etat_volets = output["shutterstate"]
	if (dernier[0].blind != avant_dernier[0].blind) and (dernier[0].blind != output["blindstate"]):
	    etat_stores = dernier[0].blind
	else:
	    etat_stores = output["blindstate"]
	db.session.add(Data(output['date'],output['temperature'],output['humidity'],output['light'],output['wind'],etat_volets,etat_stores))
	db.session.commit()
	if etat_volets == True:
		volets = 0
	else:
	    volets = 1
	if etat_stores == True:
		stores = 0
	else:
	    stores = 1
	return [volets,stores]

@app.route("/maj", methods=["GET"])
def maj():
	bdd = db.session.execute(db.select(Data).order_by(Data.date.desc()).limit(50)).all()
	if len(bdd) != 0:
		donnees = bdd[0][0]
		return {"actuel" : {"date" : str(donnees.date.hour)+"h "+str(donnees.date.minute)+"m "+str(donnees.date.second)+"s.","temperature" : donnees.temperature,"humidity" : donnees.humidity,"light" : donnees.light,"wind" : donnees.wind,"shutterstate" : donnees.shutter,"blindstate" : donnees.blind},"db" : "lol"}
	else:
		return {"date" : None,"temperature" : None,"humidity" : None,"light" : None,"wind" : None,"shutterstate" : None,"blindstate" : None}
		
@app.route("/volets", methods=["POST"])
def volets():
	result = request.get_json()
	output = json.loads(result)
	db.session.add(Data(datetime.now(),output['temperature'],output['humidity'],output['light'],output['wind'],output['shutterstate'],output['blindstate']))
	db.session.commit()
	return "OK"

@app.route("/stores", methods=["POST"])
def stores():
	result = request.get_json()
	output = json.loads(result)
	db.session.add(Data(datetime.now(),output['temperature'],output['humidity'],output['light'],output['wind'],output['shutterstate'],output['blindstate']))
	db.session.commit()
	return "OK"