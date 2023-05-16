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
	
	def __init__(self, date, temperature, humidity, light, wind) :
		self.date = date
		self.temperature = temperature
		self.humidity = humidity
		self.light = light
		self.wind = wind
	
	def __repr__(self) :
		return "{} -> {}K {}% {}lum {}km/h".format(self.date, self.temperature, self.humidity, self.light, self.wind)




# ----------------------------- Creation de la db -----------------------------


with app.app_context() :
	# Creation des tables
	db.create_all()
	# Test
	db.session.add(Data(datetime.now(), 293.15,50, 1000, 10))
	# Mise à jour des informations
	db.session.commit()
