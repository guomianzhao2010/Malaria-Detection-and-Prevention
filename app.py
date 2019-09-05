import os
import pandas as pd
import numpy as np
from flask import Flask, jsonify, render_template, flash, request, redirect, render_template
from sqlalchemy import create_engine
from helper.get_event_by_country import get_child_parent_list, get_incident_by_years
from helper.get_event_by_age_group import get_event_by_age_group
from werkzeug.utils import secure_filename
from ml.Malaria_CNN_Test_Model import predict
from keras.models import load_model
import tensorflow as tf
from helper.regression import regress_child, regress_gdp, regress_rain,regress_temp, qua_child, qua_gdp, qua_percipitation, qua_temp
from helper.get_mosquitoes_dist import get_mosquitoes_geo, get_mosquitoes_data_period
from helper.get_classification_data import get_death_prec_temp_data, get_incident_prec_temp_data

global graph
graph = tf.get_default_graph()

ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])

app = Flask(__name__)
app.secret_key = "secret key"
app.config['UPLOAD_FOLDER'] = 'static/image'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

default_file = 'C12NThinF_IMG_20150614_124212_cell_138.png'
model_loc = os.path.join('ml','Malaria_CNN_Trained7.h5')

model = load_model(model_loc)

# print(predict(model,os.path.join(app.config['UPLOAD_FOLDER'], default_file)))
################## Routes ######################
@app.route('/')
def index():
    mosquitoes_data_period = get_mosquitoes_data_period()
    return render_template("index.html",periods = mosquitoes_data_period)

@app.route('/data/sunburst')
def sunburst():
    return jsonify(get_child_parent_list())

@app.route('/data/dist/death')
def dist_death():
    return jsonify(get_incident_by_years())

@app.route('/data/age/death')
def age_death():
    return jsonify(get_event_by_age_group())

@app.route('/data/mosquitoes')
def mosquitoes():
    moquitoes_dict = get_mosquitoes_geo()
    return(jsonify(moquitoes_dict))


@app.route('/predict', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        # Get the file from post request
        try:
            f = request.files['file']

            # Save the file to ./uploads
            basepath = os.path.dirname(os.path.realpath(__file__))
            file_path = os.path.join(
                basepath, app.config['UPLOAD_FOLDER'], secure_filename(f.filename))
            f.save(file_path)

            # Make prediction
            with graph.as_default():
                preds = predict(model,file_path)

            return preds
        except Exception as e:
            return f'Excpetion: {e}'
    return None

@app.route('/data/reg/<feature>/<model>')
def make_regression(feature, model):
    if model=="linear": 
        if feature =="Child Mortality": 
            return jsonify(regress_child())

        elif feature =="GDP": 
            return jsonify(regress_gdp())
        
        elif feature =="Percipitation": 
            return jsonify(regress_rain())
        
        elif feature =="Temperature": 
            return jsonify(regress_temp())
    
    elif model=="quadratic": 
        if feature =="Child Mortality": 
            return jsonify(qua_child())
        
        elif feature =="GDP": 
            return jsonify(qua_gdp())
        
        elif feature =="Percipitation": 
            return jsonify(qua_percipitation())

        elif feature =="Temperature": 
            return jsonify(qua_temp())

@app.route('/data/class/death/<threshold>')
def make_death_classfication(threshold):
    death_by_prec_temp = get_death_prec_temp_data()
    death_by_prec_temp['group'] = death_by_prec_temp['death'].apply(lambda x: 1 if x >= float(threshold) else 0)
    death_group_clean = death_by_prec_temp[['group','Annual_precip','Annual_temp','Country']].rename(columns={'Annual_precip':'x','Annual_temp':'y'}).to_dict('records')
    return jsonify(death_group_clean)

@app.route('/data/class/incident/<threshold>')
def make_incident_classfication(threshold):
    incident_by_prec_temp = get_incident_prec_temp_data()
    incident_by_prec_temp['group'] = incident_by_prec_temp['incident'].apply(lambda x: 1 if x >= float(threshold) else 0)
    incident_group_clean = incident_by_prec_temp[['group','Annual_precip','Annual_temp','Country']].rename(columns={'Annual_precip':'x','Annual_temp':'y'}).to_dict('records')
    return jsonify(incident_group_clean)

    
if __name__ == "__main__":
    app.run(debug=False)
    # http_server = WSGIServer(('', 5000), app)
    # http_server.serve_forever()

