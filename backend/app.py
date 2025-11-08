from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import json
from datetime import datetime
import uuid

from detection.signature_based import SignatureDetector
from detection.host_based import HostBasedDetector
from detection.behavior_based import BehaviorDetector
from utils.data_processor import DataProcessor
from utils.gemini_client import GeminiAnalyzer
from config import Config

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://192.168.44.1:3000"])  # Enable CORS for frontend

# Configuration
app.config['UPLOAD_FOLDER'] = 'data/scans/uploads'
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max file size
app.config['ALLOWED_EXTENSIONS'] = {'csv', 'json', 'txt', 'log'}

# Ensure directories exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs('data/scans', exist_ok=True)

# Initialize detectors
signature_detector = SignatureDetector()
host_detector = HostBasedDetector()
behavior_detector = BehaviorDetector()
data_processor = DataProcessor()
gemini_analyzer = GeminiAnalyzer()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def save_scan_result(result):
    """Save scan result to history"""
    results_file = 'data/scans/results.json'
    
    try:
        if os.path.exists(results_file):
            with open(results_file, 'r') as f:
                history = json.load(f)
        else:
            history = []
    except:
        history = []
    
    history.append(result)
    
    with open(results_file, 'w') as f:
        json.dump(history, f, indent=2)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

@app.route('/api/analyze', methods=['POST'])
def analyze():
    """Main detection endpoint"""
    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Use CSV, JSON, TXT, or LOG'}), 400
        
        # Save uploaded file
        filename = secure_filename(file.filename)
        scan_id = str(uuid.uuid4())[:8]
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        saved_filename = f"{scan_id}_{timestamp}_{filename}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], saved_filename)
        file.save(filepath)
        
        # Process the file
        print(f"Processing file: {saved_filename}")
        parsed_data = data_processor.parse_file(filepath)
        
        if not parsed_data:
            return jsonify({'error': 'Unable to parse file. Check format.'}), 400
        
        # Run all three detection methods
        print("Running signature-based detection...")
        signature_results = signature_detector.detect(parsed_data)
        
        print("Running host-based detection...")
        host_results = host_detector.detect(parsed_data)
        
        print("Running behavior-based ML detection...")
        behavior_results = behavior_detector.detect(parsed_data)
        
        # Combine results for Gemini analysis
        combined_results = {
            'signature_based': signature_results,
            'host_based': host_results,
            'behavior_based': behavior_results
        }
        
        print("Getting Gemini AI analysis...")
        gemini_verdict = gemini_analyzer.analyze(combined_results)
        
        # Determine overall risk level
        risk_score = (
            signature_results['threat_count'] * 10 +
            host_results['suspicious_count'] * 5 +
            (100 - behavior_results['confidence']) if behavior_results['prediction'] == 'CLEAN' else behavior_results['confidence']
        )
        
        if risk_score > 70:
            risk_level = 'CRITICAL'
            verdict = 'INFECTED'
        elif risk_score > 40:
            risk_level = 'HIGH'
            verdict = 'SUSPICIOUS'
        elif risk_score > 20:
            risk_level = 'MEDIUM'
            verdict = 'SUSPICIOUS'
        else:
            risk_level = 'LOW'
            verdict = 'CLEAN'
        
        # Compile final result
        final_result = {
            'scan_id': scan_id,
            'timestamp': datetime.now().isoformat(),
            'filename': filename,
            'verdict': verdict,
            'risk_level': risk_level,
            'risk_score': min(risk_score, 100),
            'detections': combined_results,
            'gemini_analysis': gemini_verdict,
            'file_path': saved_filename
        }
        
        # Save to history
        save_scan_result(final_result)
        
        print(f"Analysis complete: {verdict} - {risk_level}")
        
        return jsonify(final_result), 200
        
    except Exception as e:
        print(f"Error during analysis: {str(e)}")
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500

@app.route('/api/history', methods=['GET'])
def get_history():
    """Get all scan history"""
    try:
        results_file = 'data/scans/results.json'
        
        if not os.path.exists(results_file):
            return jsonify([]), 200
        
        with open(results_file, 'r') as f:
            history = json.load(f)
        
        # Return in reverse chronological order
        return jsonify(history[::-1]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/history/<scan_id>', methods=['GET'])
def get_scan_details(scan_id):
    """Get specific scan details"""
    try:
        results_file = 'data/scans/results.json'
        
        if not os.path.exists(results_file):
            return jsonify({'error': 'Scan not found'}), 404
        
        with open(results_file, 'r') as f:
            history = json.load(f)
        
        # Find scan by ID
        scan = next((s for s in history if s['scan_id'] == scan_id), None)
        
        if not scan:
            return jsonify({'error': 'Scan not found'}), 404
        
        return jsonify(scan), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get overall statistics"""
    try:
        results_file = 'data/scans/results.json'
        
        if not os.path.exists(results_file):
            return jsonify({
                'total_scans': 0,
                'threats_detected': 0,
                'clean_scans': 0,
                'suspicious_scans': 0
            }), 200
        
        with open(results_file, 'r') as f:
            history = json.load(f)
        
        stats = {
            'total_scans': len(history),
            'threats_detected': sum(1 for s in history if s['verdict'] == 'INFECTED'),
            'clean_scans': sum(1 for s in history if s['verdict'] == 'CLEAN'),
            'suspicious_scans': sum(1 for s in history if s['verdict'] == 'SUSPICIOUS')
        }
        
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("=" * 50)
    print("Botnet Detection System - Backend Server")
    print("=" * 50)
    print("Server starting on http://localhost:5000")
    print("Available endpoints:")
    print("  GET  /health")
    print("  POST /api/analyze")
    print("  GET  /api/history")
    print("  GET  /api/history/<scan_id>")
    print("  GET  /api/stats")
    print("=" * 50)
    
    app.run(debug=True, host='0.0.0.0', port=5000)
