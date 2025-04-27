export function calculateHoopCoins(amount) {
    if (amount >= 50) return 200;
    if (amount >= 25) return 100;
    if (amount >= 10) return 40;
    if (amount >= 5) return 15;
    return 0;
}
