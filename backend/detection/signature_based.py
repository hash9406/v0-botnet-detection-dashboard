import os
from config import Config

class SignatureDetector:
    def __init__(self):
        self.malicious_ips = self.load_signatures(Config.MALICIOUS_IPS_FILE)
        self.malicious_domains = self.load_signatures(Config.MALICIOUS_DOMAINS_FILE)
        print(f"Loaded {len(self.malicious_ips)} malicious IPs and {len(self.malicious_domains)} domains")
    
    def load_signatures(self, filepath):
        """Load threat signatures from file"""
        if not os.path.exists(filepath):
            print(f"Warning: {filepath} not found. Creating empty file.")
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            with open(filepath, 'w') as f:
                f.write("")
            return set()
        
        with open(filepath, 'r') as f:
            signatures = set(line.strip().lower() for line in f if line.strip())
        return signatures
    
    def detect(self, data):
        """Check for known malicious IPs and domains"""
        threats_found = []
        
        # Extract IPs and domains from data
        if isinstance(data, list):
            for entry in data:
                # Check IPs
                for ip_field in ['src_ip', 'dst_ip', 'ip', 'remote_ip']:
                    if ip_field in entry:
                        ip = str(entry[ip_field]).lower()
                        if ip in self.malicious_ips:
                            threats_found.append({
                                'type': 'malicious_ip',
                                'value': ip,
                                'field': ip_field,
                                'severity': 'HIGH'
                            })
                
                # Check domains
                for domain_field in ['domain', 'hostname', 'dns_query']:
                    if domain_field in entry:
                        domain = str(entry[domain_field]).lower()
                        if domain in self.malicious_domains:
                            threats_found.append({
                                'type': 'malicious_domain',
                                'value': domain,
                                'field': domain_field,
                                'severity': 'HIGH'
                            })
        
        return {
            'threats': threats_found,
            'threat_count': len(threats_found),
            'status': 'DETECTED' if len(threats_found) > 0 else 'CLEAN',
            'message': f"{len(threats_found)} known threats detected" if threats_found else "No known malicious signatures detected"
        }
