##############################################################################
#                         Initialisation de l'app                            #
#                                                                            #
# Sert à mettre en place l'application Flask et SQL Alchemy en puis importe  #
# les fichiers python dans lesquels on customise l'application avec une base #
# de données et des routes http personalisées.                               #
##############################################################################

# ----------------------- Import de Flask et SQLAlchemy -----------------------

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import datetime



# ---------------------- Initialisation de l'application ----------------------

# Créer l'application
app = Flask(__name__)
# Configuration de la base de donnée SQLite (chemin du dossier par rapport à 'app')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db/data.sqlite3.db'
# Créer l'extention db et l'initialiser avec l'application 
db = SQLAlchemy(app)



# ------------------------------- Mise en place -------------------------------

# Creation des tables de la base de donnée et des modèle pour les remplir
from app import models
# Creation des routes http et définition de leurs action
from app import views



# ----------------------------- Creation de la db -----------------------------
