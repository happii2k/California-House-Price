
from flask import Flask, request, jsonify , render_template
import pickle
import numpy as np
import pandas as pd

app = Flask(__name__)

regmodel = pickle.load(open('models/regmodel.pkl', 'rb'))
scaler = pickle.load(open('models/scaler.pkl', 'rb'))

@app.route('/')
def home():
    return render_template('home.htm')


@app.route('/predict_api', methods=['POST'])
def predict_api():
    try:
        # Get JSON data
        data = request.get_json(force=True)
        data_df = pd.DataFrame([data])

        # Ensure the feature order and correct input columns
        expected_features = ['MedInc', 'HouseAge', 'AveRooms', 'AveBedrms', 'AveOccup', 'Latitude', 'Longitude']
        # Optionally, reindex just in case
        X1 = data_df.reindex(columns=expected_features)

        # Scale and predict
        X1_scaled = scaler.transform(X1)
        prediction = regmodel.predict(X1_scaled)

        return jsonify({'predicted_price': float(prediction)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/predict', methods=['POST' ,'GET'] )
def predict():
    if request.method == 'GET':
        return render_template('home.htm')
    
    else:
        data = [{"MedInc": float(request.form['MedInc']),
                 "HouseAge": float(request.form['HouseAge']),
                 "AveRooms": float(request.form['AveRooms']),
                 "AveBedrms": float(request.form['AveBedrms']),
                 #"Population": float(request.form['Population']),
                 "AveOccup": float(request.form['AveOccup']),
                 "Latitude": float(request.form['Latitude']),
                 "Longitude": float(request.form['Longitude'])}]
        data_df = pd.DataFrame(data)

        expected_features = ['MedInc', 'HouseAge', 'AveRooms', 'AveBedrms', 'Population', 'AveOccup', 'Latitude', 'Longitude']
        X1 = data_df.reindex(columns=expected_features)
        X1_scaled = scaler.transform(X1)
        prediction = regmodel.predict(X1_scaled)
        return render_template('home.htm', prediction_text=f'Predicted House Price: {float(prediction)}')
if __name__ == '__main__':
    app.run(debug=True)