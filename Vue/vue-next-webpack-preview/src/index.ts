import {reactive, computed, ref, onMounted, watch} from 'vue'

interface HouseNav {
    text: string
    className: string
}

const houseDetailLabelMap: {
    [index: string]: string
} = {
    house_address: '项目地址',
    build_type_string: '建筑类型',
    sales_address: '售楼处地址',
    area_covered: '占地面积',
    company_name: '开发商',
    property_company: '物业公司',
    volume_ratio: '容积率',
    green_rate: '绿化率',
    property_fee: '物业费',
    property_right: '产权年限',
    planning_households: '规划户数',
    hydropower: '水电类别',
    decoration_standard: '装修标准',
    sale_text: '预售证',
    feature_string: '项目特色',
    building_area: '建筑面积',
    parking_ratio: '车位占比',
    heating_method: '供暖方式',
    parking: '车位'
}

interface RoomType {
    phone: string
    list: {
        images: {
            text: string
            images: string[]
        }[],
        imageCount: number
        name: string
        small: string
        tags: string[]
        price: string
        fxs: string
        title: string
    }[]
}

interface Calc {
    list: ({
        label: string
        type: 'select' | 'text'
        select?: string[],
        text?: string
    })[]
    monthPrice: number
    first: string
    loan: string
    interest: string
}

interface Recommend {
    id: number
    image: string
    name: string
    status: string
    address: string
    price: string
    tags: string[]
}

function WindowScrollTop () {
    const top = ref(0)

    window.onscroll = function () {
        top.value = this.scrollY
    }

    return top
}

function NavComponent () {
    const houseNav: HouseNav[] = reactive([
        {
            text: '新房分析师',
            className: 'house-fxs'
        }, {
            text: '楼盘动态',
            className: 'house-dynamic'
        }, {
            text: '户型详情',
            className: 'roomType-detail'
        }, {
            text: '楼盘详情',
            className: 'house-detail'
        }
    ])
    const fixed = ref(false)
    const current = ref(0)
    const scrollTop = WindowScrollTop()
    const classMap: {
        [index: string]: HTMLDivElement
    } = {}
    const topFixedHeight = 80
    const navHeight = 70
    let box: HTMLDivElement = {} as HTMLDivElement

    const getClassNameDomTop = (dom: HTMLDivElement) => {
        return dom.offsetTop - topFixedHeight - navHeight
    }

    onMounted(() => {
        box = document.querySelector('.nav-component') as HTMLDivElement

        // 获取className对应dom节点
        houseNav.forEach((a: any) => {
            classMap[a.className] = document.querySelector(`.${a.className}`) as HTMLDivElement
        })
    })

    watch(scrollTop, () => {
        let i = 0
        for (let k in classMap) {
            if (scrollTop.value > getClassNameDomTop(classMap[k])) {
                current.value = i
            }
            i++
        }

        fixed.value = scrollTop.value > box.offsetTop
    })

    const goto = (item: HouseNav) => {
        scrollTo({
            top: getClassNameDomTop(classMap[item.className]),
            behavior: 'smooth'
        })
    }

    return {
        getClassNameDomTop,
        goto,
        current,
        fixed,
        houseNav
    }
}

export default {
    setup () {
        const navComponent = NavComponent()

        const recommend: Recommend[] = reactive([
            {
                id: 0,
                image: 'https://lxfm-file.malmam.com/dfs/18/5aaa3a67afdbb5/WechatIMG3869.jpeg',
                name: '科慧花园（富士康科技小镇）',
                status: '在售',
                address: '广州市增城区',
                price: '均价：19000元/m²',
                tags: ['精装', '高层']
            }, {
                id: 0,
                image: 'https://lxfm-file.malmam.com/dfs/18/5aaa3a67afdbb5/WechatIMG3869.jpeg',
                name: '科慧花园（富士康科技小镇）asdasdas dadad啊',
                status: '在售',
                address: '广州市增城区',
                price: '均价：19000元/m²',
                tags: ['精装', '高层']
            }, {
                id: 0,
                image: 'https://lxfm-file.malmam.com/dfs/18/5aaa3a67afdbb5/WechatIMG3869.jpeg',
                name: '科慧花园（富士康科技小镇）',
                status: '在售',
                address: '广州市增城区',
                price: '均价：19000元/m²',
                tags: ['精装', '高层']
            }, {
                id: 0,
                image: 'https://lxfm-file.malmam.com/dfs/18/5aaa3a67afdbb5/WechatIMG3869.jpeg',
                name: '科慧花园（富士康科技小镇）',
                status: '在售',
                address: '广州市增城区',
                price: '均价：19000元/m²',
                tags: ['精装', '高层']
            }
        ])

        const calc: Calc = reactive({
            list: [
                {
                    label: '选择户型',
                    type: 'select',
                    select: ['四室三居']
                }, {
                    label: '估算总价',
                    type: 'text',
                    text: '235.80万元(均价18000.00元/m2)'
                }, {
                    label: '按揭成数',
                    type: 'select',
                    select: ['7成', '6成', '5成', '4成', '3成', '2成', '1成']
                }, {
                    label: '贷款类别',
                    type: 'select',
                    select: ['商业贷款', '公积金贷款']
                }, {
                    label: '贷款时间',
                    type: 'select',
                    select: ['30年（360个月）', '25年（300个月）', '20年（240个月）', '15年（180个月）', '10年（120个月）']
                }
            ],
            monthPrice: 3018.16,
            first: '0元',
            loan: '0元',
            interest: '0元'
        })

        const houseDetail: {
            [index: string]: string
        } = reactive({
            house_address: '水运街与文综北路交叉口',
            build_type_string: '板楼',
            sales_address: '水运街与文综北路交叉口(街道时间9:00-18:00)',
            area_covered: '38,000㎡',
            company_name: '杭州金兴房地产开发有限公司',
            property_company: '未定',
            volume_ratio: '2.40',
            green_rate: '30.00',
            property_fee: '12.00/㎡',
            property_right: '70年',
            planning_households: '962',
            hydropower: '民水民电',
            decoration_standard: '毛坯',
            sale_text: '???',
            feature_string: '周围都是美女',
            building_area: '380,000㎡',
            parking_ratio: '1:1',
            heating_method: '市政供暖',
            parking: '12300'
        })

        const roomType: RoomType = reactive({
            phone: '',
            list: [
                {
                    images: [
                        {
                            text: '户型图',
                            images: ['https://lxfm-file.malmam.com/dfs/19/5d441ee1f3c9bc/_E4_B8_89_E6_88_BF79.jpg', 'https://lxfm-file.malmam.com/dfs/20/5979a6b8cce95e/42_131.jpg', 'https://lxfm-file.malmam.com/dfs/18/5979b3fff8fb83/52_141.jpg']
                        }
                    ],
                    imageCount: 3,
                    name: '四居 193m2(建筑面积)',
                    small: '（73㎡建面）',
                    tags: ['三居', '南向', '精装'],
                    price: '约760万(15000元/㎡）',
                    fxs: '每个房间都有窗户，保证日间室内有更多的自然光 2.每个房间都有窗户，保证日间室内有更多的自然光',
                    title: '四室三居'
                }
            ]
        })

        const houseDynamic = reactive({
            list: [
                {
                    html: '<p><span style="color: #ffffff; background-color: #ff0000;">【保利中海金地·大国璟售楼处】</span>：在售73-90平三房、96-120平四房，地铁21号线，绝版户型，均价19000元/平，增城的爆款神盘，不限购，致电了解最新优惠！</p>',
                    time: '2018年7月24日'
                }
            ],
            phone: ''
        })

        const houseFxs = reactive([
            {
                avatar: 'https://ssl.malmam.com/xiangju-static/dfs/12/5403f106a70e3e/_E7_BD_97_E5_90_9B_E5_BC_BA.png',
                username: '罗君强',
                job: '高级置业顾问',
                tag: '开朗/认真/踏实',
                labels: ['平均响应时间', '接待人数', '满意度', '回复率', '个人介绍'],
                values: [17, 62, 91, 85, '你的认可，是我全力服务的宗旨。我的专业，是你认可的开始。']
            }, {
                avatar: 'https://ssl.malmam.com/xiangju-static/dfs/12/5403f106a70e3e/_E7_BD_97_E5_90_9B_E5_BC_BA.png',
                username: '罗君强',
                job: '高级置业顾问',
                tag: '开朗/认真/踏实',
                labels: ['平均响应时间', '接待人数', '满意度', '回复率', '个人介绍'],
                values: [17, 62, 91, 85, '你的认可，是我全力服务的宗旨。我的专业，是你认可的开始。']
            }
        ])

        const images = reactive({
            data: [
                {
                    text: '效果图',
                    images: ['https://ssl.malmam.com/xiangju-static/sie/aD02NDAmbT1RJnVybD1kZnMlM0ExOSUyQzU5OWRiNjg4Zjg1NWM0Jnc9NzUw/img.jpg', 'https://ssl.malmam.com/xiangju-static/sie/aD02NDAmbT1RJnVybD1kZnMlM0ExOSUyQzU5OWRiNGRiZTIwMTYxJnc9NzUw/img.jpg', 'https://ssl.malmam.com/xiangju-static/sie/aD02NDAmbT1RJnVybD1kZnMlM0ExOCUyQzU5OWRiMjJlY2I2MDY1Jnc9NzUw/img.jpg']
                }, {
                    text: '区位图',
                    images: ['https://ssl.malmam.com/xiangju-static/sie/aD02NDAmbT1RJnVybD1kZnMlM0ExOCUyQzU5OWQ3ZTQwNTE1NTFmJnc9NzUw/img.jpg']
                }
            ],
            current: 0
        })

        const baseInfo = reactive({
            name: '【保利大国璟售楼处】21号线，低至1字头的小户型',
            discount: '送25～30年物业管理费！首付最新20万起！全场还有特惠专享额外96折优惠！仅限本周！',
            address: '[广州市增城区] 增城大道471号',
            activity: [
                {
                    name: '1000元购房券',
                    small: '（4月22日止）',
                    tips: '开发商专供新房分析师平台客户'
                }, {
                    name: '专车看房券',
                    small: '（剩189张）',
                    tips: '专人专车免费接送，限时抢'
                }
            ],
            today: {
                update: '6小时前更新',
                data: [
                    {
                        name: '多层别墅',
                        area: '182m²',
                        price: {
                            all: 510,
                            single: 30000
                        }
                    }, {
                        name: '三室两厅',
                        area: '73m²',
                        price: {
                            all: 139,
                            single: 19000
                        }
                    }, {
                        name: '四室两厅',
                        area: '96m²',
                        price: {
                            all: 182,
                            single: 19000
                        }
                    }
                ]
            }
        })

        // 特点
        const features = reactive(['处于粤港澳大湾区核心创新区，保利+金地+中海三大品牌地产联合巨制', '21号线4站到天河，40分钟到达珠江新城，半小时交通生活圈', '世界500强企业富士康、广本、阿里等企业聚集，居住需求强大', '坐拥朱村、荔城双重资源，5分钟雄踞东汇城、万达两大商圈', '重点级医疗、优质教育配套完善，五大园林、七重庭院，每一步都是风景', '百米楼距，超高性价比小三四房，罕见的1字头价格洼地'])

        // 动态
        const dynamic = reactive({
            time: '2020年03月09日',
            name: '【保利中海金地·大国璟售楼处】',
            html: '<p><span style="color: #ffffff; background-color: #ff0000;">【保利中海金地·大国璟售楼处】</span>：在售73-90平三房、96-120平四房，地铁21号线，绝版户型，均价19000元/平，增城的爆款神盘，不限购，致电了解最新优惠！</p>'
        })

        const getHouseDetailLeft = computed(() => {
            let res: {
                [index: string]: string
            } = {}

            let i = 0
            for (let k in houseDetail) {
                i++
                if (i % 2 !== 0) { res[k] = houseDetail[k] }
            }

            return res
        })

        const getHouseDetailRight = computed(() => {
            let res: {
                [index: string]: string
            } = {}

            let i = 0
            for (let k in houseDetail) {
                i++
                if (i % 2 === 0) { res[k] = houseDetail[k] }
            }

            return res
        })

        // 获取楼盘详情 label 的文字
        const getHouseDetailLabel = (label: string) => {
            return houseDetailLabelMap[label]
        }

        return {
            ...navComponent,
            recommend,
            calc,
            houseDetail,
            roomType,
            houseDynamic,
            houseFxs,
            images,
            baseInfo,
            features,
            dynamic,
            getHouseDetailLeft,
            getHouseDetailRight,
            getHouseDetailLabel
        }
    }
}
