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

df_19 = pd.read_csv('EURUSD-2019ForexData.csv')
# i = 10

# def iterate():
#     i += 1
#     return i

def livefeed():
#     live_df = df_19[:i]

#     if (live_df.index.size > 60):
#         live_df = live_df.iloc[-60]

    json_df = df_19.to_json(orient = 'records')
    return json_df

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/data")
def data():
    return livefeed()
    # i += 1

# threading.Timer(60, data()).start()
    
if __name__ == "__main__":
    app.run()

