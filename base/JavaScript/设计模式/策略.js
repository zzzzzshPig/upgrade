/*
* 当价格类型为“预售价”时，满 100 - 20，不满 100 打 9 折
* 当价格类型为“大促价”时，满 100 - 30，不满 100 打 8 折
* 当价格类型为“返场价”时，满 200 - 50，不叠加
* 当价格类型为“尝鲜价”时，直接打 5 折
* */

class GetPriceByType {
    static PRE = 'pre'
    static SALE = 'sale'
    static BACK = 'back'
    static FRESH = 'fresh'

    constructor () {
        // 分发
        this.getPrice = {
            [GetPriceByType.PRE]: (price) => {
                if (price >= 100) price -= 20
                else price *= 0.9
                return price
            },

            [GetPriceByType.SALE]: (price) => {
                if (price >= 100) price -= 30
                else price *= 0.8
                return price
            },

            [GetPriceByType.BACK]: (price) => {
                if (price >= 200) price -= 50
                return price
            },

            [GetPriceByType.FRESH]: (price) => {
                price *= 0.5
                return price
            }
        }
    }

    get (type, price) {
        return this.fixed(this.getPrice[type](price))
    }

    fixed (price) {
        return price.toFixed(2)
    }
}

const p = new GetPriceByType()

console.log(
    p.get(GetPriceByType.PRE, 99),
    p.get(GetPriceByType.PRE, 120),
    p.get(GetPriceByType.SALE, 99),
    p.get(GetPriceByType.SALE, 120),
    p.get(GetPriceByType.BACK, 120),
    p.get(GetPriceByType.BACK, 250),
    p.get(GetPriceByType.FRESH, 120)
)
