# 🏠 California House Price Prediction

A complete end-to-end machine learning project for predicting California house prices using the famous California Housing dataset. Built with Flask, XGBoost, and modern web technologies.

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-2.0+-green.svg)](https://flask.palletsprojects.com/)
[![XGBoost](https://img.shields.io/badge/XGBoost-Latest-orange.svg)](https://xgboost.readthedocs.io/)
[![Scikit-learn](https://img.shields.io/badge/Scikit--learn-Latest-red.svg)](https://scikit-learn.org/)

## 🎯 Project Overview

This project demonstrates a complete machine learning pipeline for house price prediction, from data exploration to model deployment. It uses the California Housing dataset from the 1990 U.S. Census to predict median house values based on various demographic and geographic features.

### 🌟 Key Features

- **Complete ML Pipeline**: Data preprocessing, feature engineering, model training, and evaluation
- **Multiple Models Comparison**: Linear Regression, Random Forest, XGBoost, CatBoost, and more
- **Flask Web Application**: User-friendly web interface for real-time predictions
- **RESTful API**: JSON API endpoint for programmatic access
- **Responsive Design**: Mobile-friendly interface with modern UI/UX
- **Docker Ready**: Containerized deployment with Docker support
- **CI/CD Pipeline**: GitHub Actions workflow for automated testing

## 📊 Dataset Information

The California Housing dataset contains aggregated data from the 1990 U.S. Census:

- **Samples**: 20,640 California districts
- **Features**: 8 numerical features + target variable
- **Target**: Median house value (in hundreds of thousands of dollars)
- **Source**: StatLib repository / sklearn.datasets

### 🔍 Features Description

| Feature | Description | Unit |
|---------|-------------|------|
| `MedInc` | Median income in block group | Tens of thousands of dollars |
| `HouseAge` | Median house age in block group | Years |
| `AveRooms` | Average number of rooms per household | Count |
| `AveBedrms` | Average number of bedrooms per household | Count |
| `Population` | Block group population | Count |
| `AveOccup` | Average number of household members | Count |
| `Latitude` | Block group latitude | Degrees |
| `Longitude` | Block group longitude | Degrees |

## 🏗️ Project Structure

```
California-House-Price/
├── 📁 .github/
│   └── workflows/
│       └── python-app.yml          # CI/CD pipeline
├── 📁 models/
│   ├── regmodel.pkl                # Trained XGBoost model
│   └── scaler.pkl                  # Feature scaler
├── 📁 notebook/
│   ├── EDA.ipynb                   # Exploratory Data Analysis
│   └── catboost_info/              # CatBoost model information
├── 📁 templates/
│   ├── home.htm                    # Main web interface
│   ├── index.html                  # Alternative interface
│   ├── style.css                   # Stylesheet
│   └── app.js                      # Frontend JavaScript
├── app.py                          # Flask application
├── requirements.txt                # Python dependencies
├── Procfile                        # Heroku deployment
├── .gitignore                      # Git ignore rules
└── README.md                       # Project documentation
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- pip package manager
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/happii2k/California-House-Price.git
   cd California-House-Price
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   python app.py
   ```

5. **Open in browser**
   ```
   http://localhost:5000
   ```

### 🐳 Docker Deployment

```bash
# Build Docker image
docker build -t california-house-price .

# Run container
docker run -p 5000:5000 california-house-price
```

## 🔧 Usage

### Web Interface

1. Navigate to `http://localhost:5000`
2. Fill in the property details:
   - Median Income (in tens of thousands)
   - House Age (years)
   - Average Rooms per household
   - Average Bedrooms per household
   - Average Occupancy
   - Location (Latitude & Longitude)
3. Click "Predict Price" to get the estimated house value

### API Usage

**Endpoint**: `POST /predict_api`

**Request Format**:
```json
{
  "MedInc": 5.5,
  "HouseAge": 10,
  "AveRooms": 6.2,
  "AveBedrms": 1.1,
  "AveOccup": 3.2,
  "Latitude": 34.05,
  "Longitude": -118.25
}
```

**Response Format**:
```json
{
  "predicted_price": 245000.50
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:5000/predict_api \
  -H "Content-Type: application/json" \
  -d '{
    "MedInc": 5.5,
    "HouseAge": 10,
    "AveRooms": 6.2,
    "AveBedrms": 1.1,
    "AveOccup": 3.2,
    "Latitude": 34.05,
    "Longitude": -118.25
  }'
```

## 🧠 Machine Learning Pipeline

### 1. Data Preprocessing
- **Log transformation** applied to skewed features (AveRooms, AveBedrms, HouseAge)
- **Population feature removal** due to weak correlation with target
- **Feature standardization** using StandardScaler
- **Train-test split** (80-20 ratio)

### 2. Model Comparison

| Model | RMSE | R² Score | Performance |
|-------|------|----------|-------------|
| **XGBoost** | **0.464** | **0.836** | 🥇 Best |
| CatBoost | 0.480 | 0.824 | 🥈 |
| Random Forest | 0.504 | 0.806 | 🥉 |
| Gradient Boosting | 0.511 | 0.800 | |
| K-Nearest Neighbors | 0.658 | 0.670 | |
| Decision Tree | 0.703 | 0.623 | |
| Lasso Regression | 0.745 | 0.577 | |
| Ridge Regression | 0.746 | 0.576 | |
| Linear Regression | 0.746 | 0.576 | |

### 3. Best Model: XGBoost
- **Algorithm**: Extreme Gradient Boosting
- **Hyperparameters**:
  - n_estimators: 200
  - learning_rate: 0.1
  - max_depth: 6
  - random_state: 42
- **Performance**: 83.6% R² score, 0.464 RMSE

## 📈 Model Performance

The XGBoost model achieves excellent performance with:
- **R² Score**: 0.836 (83.6% variance explained)
- **RMSE**: 0.464 (in hundreds of thousands of dollars)
- **Strong correlation** with actual prices
- **Low residual distribution** indicating good fit

### Feature Importance
Based on the XGBoost model, the most important features are:
1. **Median Income** - Strongest predictor of house prices
2. **Geographic Location** (Latitude/Longitude) - California coastal premium
3. **Average Rooms** - House size indicator
4. **House Age** - Property condition factor

## 🌐 Deployment

### Local Development
```bash
python app.py
# Access at http://localhost:5000
```

### Production Deployment

**Heroku**:
```bash
git push heroku main
```

**Render/Railway**:
- Connect GitHub repository
- Set Python environment
- Deploy automatically

**Docker**:
```bash
docker build -t house-price-app .
docker run -p 5000:5000 house-price-app
```

## 🧪 Testing

The project includes automated testing with GitHub Actions:

```bash
# Run tests locally
pytest

# Lint code
flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
```

## 📝 API Documentation

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Web interface |
| POST | `/predict` | Form-based prediction |
| POST | `/predict_api` | JSON API prediction |

### Error Handling

The API returns appropriate HTTP status codes:
- `200`: Successful prediction
- `400`: Invalid input data
- `500`: Internal server error

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📋 Requirements

### Core Dependencies
```
pandas
numpy
scikit-learn
matplotlib
seaborn
xgboost
catboost
Flask
gunicorn
```

## 🐛 Troubleshooting

### Common Issues

1. **Model files not found**
   - Ensure `models/` directory contains `regmodel.pkl` and `scaler.pkl`
   - Run the Jupyter notebook to generate models if missing

2. **Port already in use**
   ```bash
   # Kill process using port 5000
   lsof -ti:5000 | xargs kill -9
   ```

3. **Dependencies conflicts**
   ```bash
   # Create fresh virtual environment
   python -m venv fresh_venv
   source fresh_venv/bin/activate
   pip install -r requirements.txt
   ```

## 📊 Future Enhancements

- [ ] **Advanced Models**: Implement neural networks and ensemble methods
- [ ] **Feature Engineering**: Add external data sources (crime rates, school ratings)
- [ ] **Time Series**: Incorporate temporal price trends
- [ ] **Geospatial Analysis**: Enhanced location-based features
- [ ] **Model Monitoring**: Real-time performance tracking
- [ ] **A/B Testing**: Compare different model versions
- [ ] **Mobile App**: React Native or Flutter application

## 📚 Learning Resources

- [California Housing Dataset Documentation](https://scikit-learn.org/stable/datasets/real_world.html#california-housing-dataset)
- [XGBoost Documentation](https://xgboost.readthedocs.io/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Machine Learning with Python](https://scikit-learn.org/stable/tutorial/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**happii2k**
- GitHub: [@happii2k](https://github.com/happii2k)
- Project Link: [https://github.com/happii2k/California-House-Price](https://github.com/happii2k/California-House-Price)

## 🙏 Acknowledgments

- **California Housing Dataset**: Originally from StatLib repository
- **Scikit-learn**: For providing easy access to the dataset
- **XGBoost Team**: For the excellent gradient boosting implementation
- **Flask Community**: For the lightweight web framework
- **Open Source Community**: For the amazing tools and libraries

---

⭐ **If you found this project helpful, please give it a star!** ⭐
