/*
* 和平常编程的习惯完全不一样
* 这种面向对象编程的优点是扩展性强，开放封闭。缺点是大量的继承，重载，一层套一层很没必要感觉
* 还是不太习惯这种抽象工厂的方式，也不太喜欢工厂的方式
* */

class Os {
	// @override
	getHardwareInfo () {
		throw new Error('需要重写')
	}
}

class AppleOs extends Os {
	getHardwareInfo () {
		console.log('这是苹果操作系统获取硬件信息的方法')
	}
}

class SzAppleOs extends Os {
	getHardwareInfo() {
		console.log('山寨机没有办法返回硬件信息')
	}
}

class Hardware {
	setVolume () {
		throw new Error('需要重写')
	}
}

class AppleHardware extends Hardware {
	setVolume() {
		console.log('调节音量')
	}
}

class SzAppleHardware extends Hardware {
	setVolume() {
		console.log('调节音量失败')
	}
}

class Mobile {
	// @override
	createOs () {
		throw new Error('需要重写')
	}

	// @override
	createHardware () {
		throw new Error('需要重写')
	}
}

class Apple extends Mobile {
	createOs() {
		return new AppleOs()
	}

	createHardware() {
		return new AppleHardware()
	}
}

class SzApple extends Mobile {
	createOs() {
		return new SzAppleOs()
	}

	createHardware() {
		return new SzAppleHardware()
	}
}

const myPhone = new Apple()
const os = myPhone.createOs()
const hardware = myPhone.createHardware()

os.getHardwareInfo()
hardware.setVolume()

const mySzPhone = new SzApple()
const SzOs = mySzPhone.createOs()
const SzHardware = mySzPhone.createHardware()

SzOs.getHardwareInfo()
SzHardware.setVolume()

