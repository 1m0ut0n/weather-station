from datetime import datetime
from app import app
from app import db

class Data(db.Model):
	__tablename__ = "data"

	_id = db.Column("id", db.Integer, primary_key=True)
	date = db.Column(db.DateTime)
	temperature = db.Column(db.Float)
	humidity = db.Column(db.Float)
	light = db.Column(db.Float)
	wind = db.Column(db.Float)
	shutter = db.Column(db.Boolean)
	blind = db.Column(db.Boolean)
	
	def __init__(self, date, temperature, humidity, light, wind, shutter, blind) :
		self.date = date
		self.temperature = temperature
		self.humidity = humidity
		self.light = light
		self.wind = wind
		self.shutter = shutter
		self.blind = blind
	
	def __repr__(self) :
		return "{} -> {}K {}% {}lum {}km/h | Shutter {}  Blind {}".format(self.date, self.temperature, self.humidity, self.light, self.wind, self.shutter, self.blind)




# ----------------------------- Creation de la db -----------------------------


with app.app_context() :
	# Creation des tables
	db.create_all()
	# Test
	#db.session.add(Data(datetime.now(), 293.15,50, 100, 10, True, True))
	# Mise à jour des informations
	db.session.commit()
