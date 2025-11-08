import pickle
import os
import numpy as np
import pandas as pd
from config import Config

class BehaviorDetector:
    def __init__(self):
        self.model = self.load_model()
        self.features = [
            'flow_duration', 'total_fwd_packets', 'total_bwd_packets',
            'fwd_pkt_len_mean', 'bwd_pkt_len_mean', 'flow_bytes_s',
            'flow_pkts_s', 'flow_iat_mean', 'fwd_iat_mean', 'bwd_iat_mean'
        ]
    
    def load_model(self):
        """Load trained XGBoost model"""
        if not os.path.exists(Config.MODEL_PATH):
            print(f"Warning: Model file {Config.MODEL_PATH} not found. Using rule-based detection.")
            return None
        
        try:
            with open(Config.MODEL_PATH, 'rb') as f:
                model = pickle.load(f)
            print("XGBoost model loaded successfully")
            return model
        except Exception as e:
            print(f"Error loading model: {e}")
            return None
    
    def extract_features(self, data):
        """Extract ML features from network data"""
        if isinstance(data, list) and len(data) > 0:
            df = pd.DataFrame(data)
            
            # Try to map columns to expected features
            feature_values = {}
            for feature in self.features:
                if feature in df.columns:
                    feature_values[feature] = df[feature].mean()
                else:
                    # Use default/estimated values
                    feature_values[feature] = 0
            
            return pd.DataFrame([feature_values])
        
        return None
    
    def rule_based_detection(self, data):
        """Fallback rule-based detection if no ML model"""
        anomalies = []
        
        if isinstance(data, list):
            for entry in data:
                flags = []
                
                # Check high packet count
                packets = entry.get('packets', entry.get('total_fwd_packets', 0))
                if int(packets) > Config.BEHAVIOR_PACKET_THRESHOLD:
                    flags.append(f"High packet count: {packets}")
                
                # Check large data transfer
                bytes_transferred = entry.get('bytes', entry.get('flow_bytes_s', 0))
                if int(bytes_transferred) > Config.BEHAVIOR_BYTES_THRESHOLD:
                    flags.append(f"Large data transfer: {bytes_transferred} bytes")
                
                # Check short flow duration (potential C&C beacon)
                duration = entry.get('flow_duration', entry.get('duration', 999))
                if float(duration) < Config.BEHAVIOR_FLOW_DURATION_MIN:
                    flags.append(f"Short flow: {duration}s")
                
                if flags:
                    anomalies.append({
                        'flow': entry.get('src_ip', 'unknown') + ' -> ' + entry.get('dst_ip', 'unknown'),
                        'flags': flags
                    })
        
        confidence = min((len(anomalies) / max(len(data), 1)) * 100, 100)
        
        return {
            'prediction': 'BOTNET' if confidence > 50 else 'SUSPICIOUS' if confidence > 20 else 'CLEAN',
            'confidence': round(confidence, 2),
            'anomalies': anomalies,
            'method': 'rule_based'
        }
    
    def detect(self, data):
        """Run ML-based behavior detection"""
        
        # If no model, use rule-based
        if self.model is None:
            return self.rule_based_detection(data)
        
        try:
            features = self.extract_features(data)
            
            if features is None or features.empty:
                return self.rule_based_detection(data)
            
            # Predict
            prediction = self.model.predict(features)[0]
            confidence = self.model.predict_proba(features)[0]
            
            botnet_confidence = round(confidence[1] * 100, 2) if prediction == 1 else round((1 - confidence[0]) * 100, 2)
            
            return {
                'prediction': 'BOTNET' if prediction == 1 else 'CLEAN',
                'confidence': botnet_confidence,
                'model': 'XGBoost',
                'features_used': len(self.features),
                'status': 'DETECTED' if prediction == 1 else 'CLEAN',
                'message': f"ML model predicts {'BOTNET' if prediction == 1 else 'CLEAN'} traffic with {botnet_confidence}% confidence"
            }
            
        except Exception as e:
            print(f"ML detection error: {e}. Falling back to rules.")
            return self.rule_based_detection(data)
