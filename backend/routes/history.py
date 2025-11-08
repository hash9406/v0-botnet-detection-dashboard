from flask import Blueprint, jsonify
from utils.data_processor import parse_json_data

history_bp = Blueprint('history', __name__)

@history_bp.route('/history', methods=['GET'])
def get_history():
    data = parse_json_data('data/scans/results.json')
    if isinstance(data, list):
        # Sort by timestamp in reverse chronological order (newest first)
        sorted_data = sorted(data, key=lambda x: x.get('timestamp', ''), reverse=True)
        return jsonify(sorted_data), 200
    else:
        return jsonify({'error': 'Failed to load history'}), 500
