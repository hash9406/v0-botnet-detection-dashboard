from flask import Blueprint, request, jsonify
import os
from werkzeug.utils import secure_filename
from detection.signature_based import SignatureDetector
from detection.host_based import HostBasedDetector
from detection.behavior_based import BehaviorDetector
from utils.gemini_client import GeminiAnalyzer
from utils.data_processor import DataProcessor, save_results
from config import Config

analyze_bp = Blueprint('analyze', __name__)

ALLOWED_EXTENSIONS = {'csv', 'json', 'txt', 'log'}
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@analyze_bp.route('/analyze', methods=['POST'])
def analyze():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        # Check file size
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)
        if file_size > MAX_FILE_SIZE:
            return jsonify({'error': 'File too large. Max 50MB allowed.'}), 400

        filename = secure_filename(file.filename)
        filepath = os.path.join('data/scans/uploads', filename)
        file.save(filepath)

        # Parse data
        processor = DataProcessor()
        data = processor.parse_file(filepath)

        if data is None:
            return jsonify({'error': 'Failed to parse file'}), 400

        # Initialize detectors
        sig_detector = SignatureDetector()
        host_detector = HostBasedDetector()
        behavior_detector = BehaviorDetector()
        gemini_client = GeminiAnalyzer()

        # Run detections
        signature_result = sig_detector.detect(data)
        host_result = host_detector.detect(data)
        behavior_result = behavior_detector.detect(data)

        # Combine results for Gemini analysis
        combined_results = {
            'signature': signature_result,
            'host_based': host_result,
            'behavior_based': behavior_result
        }

        gemini_result = gemini_client.analyze(combined_results)

        # Calculate risk score and verdict
        risk_score = calculate_risk_score(signature_result, host_result, behavior_result, gemini_result)
        verdict = get_verdict(risk_score)

        # Final results
        results = {
            'signature_based': signature_result,
            'host_based': host_result,
            'behavior_based': behavior_result,
            'gemini_analysis': gemini_result,
            'risk_score': risk_score,
            'verdict': verdict,
            'file_info': {
                'filename': filename,
                'size': file_size,
                'type': filename.split('.')[-1]
            }
        }

        # Save results
        save_results(results)

        return jsonify(results), 200

    return jsonify({'error': 'Invalid file type'}), 400

def calculate_risk_score(sig, host, behavior, gemini):
    score = 0

    # Signature score
    if sig.get('status') == 'DETECTED':
        score += 40

    # Host score
    if host.get('status') == 'SUSPICIOUS':
        score += 30

    # Behavior score
    if behavior.get('status') == 'DETECTED':
        score += 30

    # Gemini score based on verdict
    verdict = gemini.get('verdict', '')
    if verdict == 'INFECTED':
        score += 50
    elif verdict == 'SUSPICIOUS':
        score += 25

    return min(score, 100)

def get_verdict(risk_score):
    if risk_score >= 70:
        return 'INFECTED'
    elif risk_score >= 40:
        return 'SUSPICIOUS'
    else:
        return 'CLEAN'
