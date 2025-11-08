import os
import json
from config import Config

# Uncomment when you have API key
# import google.generativeai as genai

class GeminiAnalyzer:
    def __init__(self):
        # Uncomment when ready to use Gemini
        # genai.configure(api_key=Config.GEMINI_API_KEY)
        # self.model = genai.GenerativeModel('gemini-pro')
        self.enabled = False  # Set to True when API key is added
    
    def analyze(self, results):
        """Send combined detection results to Gemini for analysis"""
        
        if not self.enabled:
            return self.generate_fallback_verdict(results)
        
        # Uncomment when using Gemini API
        """
        prompt = f'''
You are a cybersecurity expert analyzing botnet detection results.

**DETECTION RESULTS:**

1. Signature-Based Detection:
   - Status: {results['signature_based']['status']}
   - Threats found: {results['signature_based']['threat_count']}
   - Details: {json.dumps(results['signature_based']['threats'], indent=2)}

2. Host-Based Detection:
   - Status: {results['host_based']['status']}
   - Suspicious processes: {results['host_based']['suspicious_count']}
   - Details: {json.dumps(results['host_based']['suspicious_processes'], indent=2)}

3. Behavior-Based ML Detection:
   - Prediction: {results['behavior_based']['prediction']}
   - Confidence: {results['behavior_based']['confidence']}%
   - Status: {results['behavior_based']['status']}

**PROVIDE:**
1. Final Verdict: INFECTED / SUSPICIOUS / CLEAN
2. Risk Level: CRITICAL / HIGH / MEDIUM / LOW
3. Brief Explanation (2-3 sentences)
4. Recommended Actions (3-4 bullet points)

Format as JSON with keys: verdict, risk_level, explanation, recommendations (array)
'''
        
        try:
            response = self.model.generate_content(prompt)
            return json.loads(response.text)
        except Exception as e:
            print(f"Gemini API error: {e}")
            return self.generate_fallback_verdict(results)
        """
        
        return self.generate_fallback_verdict(results)
    
    def generate_fallback_verdict(self, results):
        """Generate rule-based verdict when Gemini is not available"""
        
        signature_threats = results['signature_based']['threat_count']
        host_suspicious = results['host_based']['suspicious_count']
        behavior_pred = results['behavior_based']['prediction']
        behavior_conf = results['behavior_based']['confidence']
        
        # Determine verdict
        if signature_threats > 0 or behavior_pred == 'BOTNET':
            verdict = 'INFECTED'
            risk_level = 'CRITICAL' if signature_threats > 3 else 'HIGH'
            explanation = f"System shows strong indicators of botnet infection. {signature_threats} known malicious signatures detected and ML model predicts {'botnet' if behavior_pred == 'BOTNET' else 'anomalous'} traffic patterns."
            recommendations = [
                "Immediately isolate the affected system from the network",
                "Run a full antivirus and anti-malware scan",
                "Check all detected IPs/domains and block them at firewall level",
                "Review and terminate suspicious processes identified",
                "Consider forensic analysis to determine infection vector"
            ]
        
        elif host_suspicious > 0 or behavior_conf > 50:
            verdict = 'SUSPICIOUS'
            risk_level = 'MEDIUM' if behavior_conf < 70 else 'HIGH'
            explanation = f"System exhibits suspicious behavior patterns. {host_suspicious} processes show anomalous resource usage and network traffic patterns show {behavior_conf}% confidence of botnet activity."
            recommendations = [
                "Monitor the flagged processes closely for 24-48 hours",
                "Review process executable locations and signatures",
                "Check network traffic logs for unusual patterns",
                "Update all security software and run deep scans"
            ]
        
        else:
            verdict = 'CLEAN'
            risk_level = 'LOW'
            explanation = "No significant threats detected across all three detection methods. System appears to be operating normally with no indicators of botnet infection."
            recommendations = [
                "Continue regular monitoring and scheduled scans",
                "Keep signature databases updated",
                "Maintain security best practices",
                "Review logs periodically for emerging threats"
            ]
        
        return {
            'verdict': verdict,
            'risk_level': risk_level,
            'explanation': explanation,
            'recommendations': recommendations,
            'source': 'rule_based'  # Change to 'gemini_ai' when API is enabled
        }
