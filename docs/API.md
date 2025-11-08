# Botnet Detection API Documentation

## Overview
This API provides endpoints for analyzing network traffic data for botnet detection using multiple detection methods.

## Endpoints

### POST /api/analyze
Analyzes uploaded CSV or JSON files for botnet indicators.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: file (CSV or JSON)

**Response:**
```json
{
  "signature": {
    "ip_malicious": false,
    "domain_malicious": false,
    "confidence": 0.0
  },
  "host_based": {
    "anomalies": [],
    "confidence": 0.0,
    "detected": false
  },
  "behavior": [
    {
      "prediction": 0,
      "probability": 0.1,
      "confidence": 0.9
    }
  ],
  "gemini": {
    "verdict": "Suspicious activity detected",
    "confidence": 0.85,
    "details": "AI analysis suggests potential botnet behavior"
  }
}
```

### GET /api/history
Retrieves scan history.

**Response:**
```json
[
  {
    "timestamp": "2023-...",
    "results": {...}
  }
]
```

## Detection Methods
1. **Signature-based**: Checks against known malicious IPs and domains
2. **Host-based**: Monitors process anomalies
3. **Behavior-based**: ML analysis using XGBoost
4. **AI Analysis**: Gemini API integration for advanced detection
