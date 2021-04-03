/**
 * @param {number} big
 * @param {number} medium
 * @param {number} small
 */
var ParkingSystem = function(big, medium, small) {
    this.big = big
    this.medium = medium
    this.small = small
    this.type = ['big', 'medium', 'small']
};

/**
 * @param {number} carType
 * @return {boolean}
 */
ParkingSystem.prototype.addCar = function(carType) {
    const type = this.type[carType - 1]
    this[type]--

    if (this[type] === -1) {
        this[type] = 0
        return false
    }

    return true
};

/**
 * Your ParkingSystem object will be instantiated and called as such:
 * var obj = new ParkingSystem(big, medium, small)
 * var param_1 = obj.addCar(carType)
 */
