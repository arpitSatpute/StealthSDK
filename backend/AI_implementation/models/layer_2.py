import json
import time
import secrets
import random
import hashlib
from typing import List, Dict, Any, Optional, Tuple, Set
from dataclasses import dataclass
from decimal import Decimal
import redis
from web3 import Web3  
from eth_account import Account
from cryptography.fernet import Fernet 
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding, rsa
import numpy as np
from collections import deque

@dataclass
class SecurityConfig:
    """Security parameters and thresholds"""
    MIN_PATH_LENGTH: int = 3
    MAX_PATH_LENGTH: int = 5
    COVER_TRAFFIC_RATIO: float = 0.20
    MIN_BATCH_WINDOW: int = 30
    MAX_BATCH_WINDOW: int = 120
    MIN_RELAY_STAKE: Decimal = Decimal('100.0')
    MAX_RELAY_CONNECTIONS: int = 50
    REPUTATION_THRESHOLD: float = 0.8
    SLASH_THRESHOLD: int = 3
    MAX_RETRIES: int = 2
    TIMING_JITTER: float = 0.1
    DUMMY_FRAGMENT_RATIO: float = 0.15
    FORCED_REMIX_BLOCKS: int = 100

@dataclass
class Fragment:
    id: str
    tx_hash: str
    token_type: str
    amount: Decimal
    timestamp: int
    metadata_hash: str = ""
    is_dummy: bool = False
    remix_count: int = 0

@dataclass
class Relay:
    id: str
    address: str
    bandwidth: int
    reputation: float
    last_active: int
    stake: Decimal
    connections: int = 0
    failed_attempts: int = 0
    
@dataclass
class EphemeralKey:
    public_key: str
    private_key: str
    nonce: int
    expiry: int
    layer_key: bytes  # For onion encryption

@dataclass
class Path:
    fragment_id: str
    relays: List[Relay]
    keys: List[EphemeralKey]
    created_at: int
    expires_at: int
    onion_layers: List[bytes]  # Layered encryption data

@dataclass 
class Schedule:
    path_id: str
    delays: List[int]
    cover_traffic: List[bool]
    batch_id: Optional[str]
    jitter: List[float]  # Timing randomization

class AnonymityMetrics:
    def __init__(self):
        self.fragment_linkability: float = 0.0
        self.timing_correlation: float = 0.0
        self.path_uniqueness: float = 0.0
        self.relay_distribution: Dict[str, int] = {}
        self.batch_entropy: float = 0.0
        
    def update(self, path: Path, schedule: Schedule):
        # Update metrics based on new routing decision
        pass

class ObfRouter:
    def __init__(
        self,
        web3_provider: str,
        contract_address: str,
        contract_abi: str,
        private_key: str,
        redis_url: str
    ):
        self.w3 = Web3(Web3.HTTPProvider(web3_provider))
        self.contract = self.w3.eth.contract(
            address=contract_address,
            abi=json.loads(contract_abi)
        )
        self.account = Account.from_key(private_key)
        self.redis = redis.from_url(redis_url)
        
        # Security configuration
        self.security = SecurityConfig()
        
        # Metrics tracker
        self.metrics = AnonymityMetrics()
        
        # State management
        self.active_batches: Dict[str, Set[str]] = {}
        self.relay_reputation: Dict[str, deque] = {}
        self.path_history: Dict[str, List[str]] = {}
        
        # Initialize encryption
        self.key_encryption = Fernet(Fernet.generate_key())
        
    def generate_onion_layers(self, path: Path) -> List[bytes]:
        """Generate layered encryption for each hop"""
        layers = []
        message = path.fragment_id.encode()
        
        for key in reversed(path.keys):
            # Generate RSA key pair for this layer
            private_key = rsa.generate_private_key(
                public_exponent=65537,
                key_size=2048
            )
            public_key = private_key.public_key()
            
            # Encrypt with previous layer
            if layers:
                message = layers[-1]
                
            # Add this layer's encryption
            ciphertext = public_key.encrypt(
                message,
                padding.OAEP(
                    mgf=padding.MGF1(algorithm=hashes.SHA256()),
                    algorithm=hashes.SHA256(),
                    label=None
                )
            )
            layers.append(ciphertext)
            
            # Store layer key
            key.layer_key = private_key.private_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PrivateFormat.PKCS8,
                encryption_algorithm=serialization.NoEncryption()
            )
            
        return layers

    def select_relays(self, num_relays: int) -> List[Relay]:
        """Select relays with enhanced security checks"""
        available = self.get_available_relays()
        
        # Filter by security requirements
        available = [
            r for r in available 
            if (r.stake >= self.security.MIN_RELAY_STAKE and
                r.reputation >= self.security.REPUTATION_THRESHOLD and
                r.connections < self.security.MAX_RELAY_CONNECTIONS and
                r.failed_attempts < self.security.SLASH_THRESHOLD)
        ]
        
        if len(available) < num_relays:
            raise ValueError("Not enough qualified relays")
            
        # Weight by stake * reputation * (1/connections)
        weights = [
            float(r.stake) * r.reputation * (1.0 / (r.connections + 1))
            for r in available
        ]
        
        # Normalize weights
        total = sum(weights)
        probabilities = [w/total for w in weights]
        
        selected = []
        while len(selected) < num_relays:
            # Use secure random selection
            idx = secrets.randbelow(len(available))
            if random.random() < probabilities[idx]:
                relay = available.pop(idx)
                
                # Check for path diversity
                if not self._check_path_diversity(relay, selected):
                    continue
                    
                selected.append(relay)
                weights.pop(idx)
                total = sum(weights)
                if total > 0:
                    probabilities = [w/total for w in weights]
                    
        return selected

    def _check_path_diversity(self, relay: Relay, selected: List[Relay]) -> bool:
        """Ensure sufficient path diversity"""
        # Check for repeated relays in recent paths
        if relay.id in self.path_history.get(selected[0].id, []):
            return False
            
        # Check for network diversity
        relay_networks = set()
        for r in selected:
            network = self._get_relay_network(r)
            if network in relay_networks:
                return False
            relay_networks.add(network)
            
        return True

    def schedule_transmission(self, path: Path) -> Schedule:
        """Enhanced scheduling with security features"""
        delays = []
        cover = []
        jitter = []
        
        base_delay = random.randint(
            self.security.MIN_BATCH_WINDOW,
            self.security.MAX_BATCH_WINDOW
        )
        
        for _ in range(len(path.relays)):
            # Add randomized delay with jitter
            delay = base_delay + int(
                random.expovariate(1/30) * (1 + random.uniform(
                    -self.security.TIMING_JITTER,
                    self.security.TIMING_JITTER
                ))
            )
            delays.append(delay)
            
            # Add cover traffic based on security config
            cover.append(random.random() < self.security.COVER_TRAFFIC_RATIO)
            
            # Add timing jitter
            jitter.append(random.uniform(
                -self.security.TIMING_JITTER,
                self.security.TIMING_JITTER
            ))
            
        return Schedule(
            path_id=path.fragment_id,
            delays=delays,
            cover_traffic=cover,
            batch_id=self._get_batch_id(),
            jitter=jitter
        )

    def _get_batch_id(self) -> str:
        """Get or create current batch ID"""
        current_time = int(time.time())
        batch_window = random.randint(
            self.security.MIN_BATCH_WINDOW,
            self.security.MAX_BATCH_WINDOW
        )
        return f"batch_{current_time // batch_window}"

    def route_fragment(self, fragment: Fragment) -> bool:
        """Main routing logic with security measures"""
        try:
            # Check if remixing is needed
            if self._needs_remixing(fragment):
                return self._handle_remix(fragment)
                
            # Generate routing plan
            path = self.generate_path(fragment)
            path.onion_layers = self.generate_onion_layers(path)
            
            schedule = self.schedule_transmission(path)
            
            # Add dummy fragments if needed
            if random.random() < self.security.DUMMY_FRAGMENT_RATIO:
                self._add_dummy_fragments(path, schedule)
            
            # Store metadata and get verification hash
            metadata_hash = self.store_routing_plan(fragment, path, schedule)
            fragment.metadata_hash = metadata_hash
            
            # Update metrics
            self.metrics.update(path, schedule)
            
            # Mark as routed on-chain
            receipt = self.mark_routed(fragment.id, metadata_hash)
            
            # Update path history
            self._update_path_history(path)
            
            return receipt.status == 1
            
        except Exception as e:
            return self.handle_failure(fragment, e)

    def _needs_remixing(self, fragment: Fragment) -> bool:
        """Check if fragment needs forced remixing"""
        return (
            fragment.remix_count == 0 and
            self.w3.eth.block_number - fragment.timestamp > 
            self.security.FORCED_REMIX_BLOCKS
        )

    def _handle_remix(self, fragment: Fragment) -> bool:
        """Handle forced fragment remixing"""
        fragment.remix_count += 1
        return self.route_fragment(fragment)

    def _add_dummy_fragments(self, path: Path, schedule: Schedule):
        """Add dummy fragments for additional cover"""
        num_dummies = random.randint(1, 3)
        for _ in range(num_dummies):
            dummy_fragment = Fragment(
                id=secrets.token_hex(16),
                tx_hash="0x" + secrets.token_hex(32),
                token_type=path.fragment_id,
                amount=Decimal("0.0"),
                timestamp=int(time.time()),
                is_dummy=True
            )
            self.route_fragment(dummy_fragment)

    def _update_path_history(self, path: Path):
        """Update path history for diversity tracking"""
        for relay in path.relays:
            if relay.id not in self.path_history:
                self.path_history[relay.id] = deque(maxlen=100)
            self.path_history[relay.id].append(path.fragment_id)

    def get_anonymity_score(self) -> Dict[str, float]:
        """Calculate current anonymity metrics"""
        return {
            "fragment_linkability": self.metrics.fragment_linkability,
            "timing_correlation": self.metrics.timing_correlation,
            "path_uniqueness": self.metrics.path_uniqueness,
            "batch_entropy": self.metrics.batch_entropy
        }