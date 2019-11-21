import os

import pandas as pd
import numpy as np
import json
import datetime
import threading

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy import func

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

df_19 = pd.read_csv('data/2018_12_forex_sel.csv')

def livefeed():
    json_df = df_19.to_json(orient = 'records')
    return json_df

@app.route("/")
def index():
    return render_template("interactive.html")


@app.route("/data")
def data():
    return livefeed()
    
if __name__ == "__main__":
    app.run()

