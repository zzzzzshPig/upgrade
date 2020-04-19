class Storage {
	static instance = null

	item = {}

	constructor () {
		if (Storage.instance) return Storage.instance

		Storage.instance = this
	}

	setItem (key, value) {
		this.item[key] = value
	}

	getItem (key) {
		return this.item[key]
	}
}

const storage = new Storage()
storage.setItem('a', 1)
console.log(storage.getItem('a'))

const storage1 = new Storage()
console.log(storage1.getItem('a'), storage === storage1)

