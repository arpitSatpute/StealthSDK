from flask import Flask, request, jsonify
from models.layer_1 import FragmentationEngine
from flask_cors import CORS
import logging
import time
from decimal import Decimal, InvalidOperation

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={
    r"/split-pools": {
        "origins": ["http://localhost:5173"],
        "methods": ["POST"],
        "allow_headers": ["Content-Type"]
    }
})
engine = FragmentationEngine()

@app.route('/split-pools', methods=['POST'])
def split_pools():
    """
    Split an amount into 4 pools using FragmentationEngine
    
    Expected input JSON:
    {
        "amount": float  // Positive number to split
    }
    
    Returns:
    {
        "success": bool,
        "pool_splits": [float, float, float, float],
        "total": float,
        "metadata": {
            "timestamp": int,
            "precision": int
        }
    }
    """
    try:
        # Validate input
        data = request.get_json()
        if not data:
            return jsonify({
                'success': False,
                'error': 'Missing request body'
            }), 400
            
        if 'amount' not in data:
            return jsonify({
                'success': False,
                'error': 'Missing amount parameter'
            }), 400
            
        # Parse and validate amount
        try:
            amount = Decimal(str(data['amount']))
            if amount <= 0:
                raise ValueError("Amount must be positive")
        except (InvalidOperation, ValueError) as e:
            return jsonify({
                'success': False,
                'error': f'Invalid amount: {str(e)}'
            }), 400
        
        # Get pool splits (4 pools)
        logger.info(f"Splitting amount {amount} into pools")
        pool_splits = engine.split_into_pools(float(amount))
        
        # Validate splits
        total = sum(pool_splits)
        if abs(total - float(amount)) > 1e-8:
            logger.error(f"Split validation failed: {total} != {amount}")
            return jsonify({
                'success': False,
                'error': 'Split validation failed'
            }), 500
        
        # Return successful response
        return jsonify({
            'success': True,
            'pool_splits': pool_splits,
            'total': float(amount),
            'metadata': {
                'timestamp': int(time.time()),
                'precision': engine.DECIMALS
            }
        })
        
    except Exception as e:
        logger.error(f"Error processing split-pools request: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

if __name__ == '__main__':
    try:
        logger.info("Starting Flask server on http://127.0.0.1:5000")
        app.run(debug=True, host='127.0.0.1', port=5000)
    except Exception as e:
        logger.error(f"Failed to start server: {str(e)}")