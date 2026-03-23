import numpy as np
import matplotlib.pyplot as plt


def plot_loss_distribution(losses: np.ndarray, bins: int = 50) -> None:
    """
    ETAPA 10.4 – Monte Carlo Output Visualization

    Plots histogram of simulated losses.
    Intended for debug / analysis mode only.
    """

    plt.figure(figsize=(8, 4))
    plt.hist(losses, bins=bins)
    plt.xlabel("Loss value")
    plt.ylabel("Frequency")
    plt.title("Monte Carlo Loss Distribution")
    plt.tight_layout()
    plt.show()


def compute_quantiles(losses: np.ndarray, quantiles: list[float]) -> dict:
    """
    Helper utility to compute quantiles from loss distribution.
    """
    return {q: float(np.quantile(losses, q)) for q in quantiles}
