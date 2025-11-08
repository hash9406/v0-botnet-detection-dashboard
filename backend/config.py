import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # API Keys
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'your-api-key-here')
    
    # Detection Thresholds
    HOST_CPU_THRESHOLD = 80  # CPU % threshold
    HOST_MEMORY_THRESHOLD = 500  # Memory MB threshold
    HOST_CONNECTION_THRESHOLD = 30  # Number of connections
    
    # Behavior Thresholds
    BEHAVIOR_PACKET_THRESHOLD = 1000
    BEHAVIOR_BYTES_THRESHOLD = 1000000  # 1MB
    BEHAVIOR_FLOW_DURATION_MIN = 2  # seconds
    
    # File Paths
    MALICIOUS_IPS_FILE = 'data/malicious_ips.txt'
    MALICIOUS_DOMAINS_FILE = 'data/malicious_domains.txt'
    MODEL_PATH = 'models/xgboost_model.pkl'
    
    # ML Model Settings
    ML_CONFIDENCE_THRESHOLD = 0.7
