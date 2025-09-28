import numpy as np
from decimal import Decimal, ROUND_HALF_UP
from typing import List

class FragmentationEngine:
    def __init__(self):
        self.DECIMALS = 18  # For 1e18 precision
        
    def split_into_pools(self, amount: float) -> List[float]:
        """
        Split amount into 4 pools with 1e18 precision
        Returns: List of 4 amounts that sum to the input amount
        """
        # Convert to Decimal with 18 decimal places
        amount_dec = Decimal(str(amount)).quantize(Decimal('0.' + '0' * self.DECIMALS))
        
        # Generate random weights that sum to 1
        weights = np.random.dirichlet(np.ones(4))
        
        # Calculate pool amounts
        pools = []
        remaining = amount_dec
        
        # Split into first 3 pools
        for i in range(3):
            pool_amount = (amount_dec * Decimal(str(weights[i]))).quantize(
                Decimal('0.' + '0' * self.DECIMALS)
            )
            pools.append(float(pool_amount))
            remaining -= pool_amount
            
        # Add remaining to last pool to ensure exact sum
        pools.append(float(remaining))
        
        return pools

# Example usage:
if __name__ == "__main__":
    engine = FragmentationEngine()
    amount = 100.0  # Example amount
    splits = engine.split_into_pools(amount)
    print(f"Input amount: {amount}")
    print(f"Pool splits: {splits}")
    print(f"Sum of splits: {sum(splits)}") 