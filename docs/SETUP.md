# Setup Instructions

## Prerequisites
- Python 3.8+
- pip
- Virtual environment (recommended)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd v0-botnet-detection-dashboard
```

2. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
cd backend
pip install -requirements.txt
```

4. Set up environment variables:
Create a `.env` file in the backend directory:
```
SECRET_KEY=your-secret-key
GEMINI_API_KEY=your-gemini-api-key
```

5. Train the model (optional, pre-trained model available):
```bash
python models/train_model.py
```
Or use the Jupyter notebook:
```bash
jupyter notebook notebooks/train_model.ipynb
```

## Running the Application

1. Start the Flask backend:
```bash
python app.py
```

2. The API will be available at `http://localhost:5000`

## API Usage

See [API.md](API.md) for detailed endpoint documentation.

## File Structure

- `backend/`: Flask application
- `backend/models/`: ML models and training scripts
- `backend/data/`: Datasets and threat feeds
- `backend/detection/`: Detection modules
- `backend/utils/`: Utility functions
- `backend/routes/`: API endpoints
- `notebooks/`: Jupyter notebooks for model training
- `docs/`: Documentation
