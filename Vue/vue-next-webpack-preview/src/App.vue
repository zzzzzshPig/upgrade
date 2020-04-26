<template>
    <div class="house-page">
        <!-- 面包屑 -->
        <nav class="bread">
            <div class="house-name">
                保利·大国璟
            </div>
        </nav>
        
        <!-- 房源基础信息 -->
        <div class="house-infos">
            <div class="infos">
                <div class="title">
                    {{ baseInfo.name }}
                </div>
                
                <div class="discount">
                    {{ baseInfo.discount }}
                    
                    <div class="alert-text">
                        立即预约看房
                    </div>
                </div>
                
                <div class="address">
                    {{ baseInfo.address }}
                    
                    <div class="alert-text">
                        发送地址到手机
                    </div>
                </div>
                
                <div class="activity">
                    <div v-for="item in baseInfo.activity" :key="item.id" class="activity-item" @click="">
                        <div class="left">
                            <div class="top">
                                <div class="name">
                                    {{ item.name }}
                                </div>
                                
                                <div class="small">
                                    {{ item.small }}
                                </div>
                            </div>
                            
                            <div class="bottom">
                                {{ item.tips }}
                            </div>
                        </div>
                        
                        <div class="right">
                            立即领取
                        </div>
                    </div>
                </div>
                
                <div class="today">
                    <div class="top">
                        <div class="small">
                            {{ baseInfo.today.update }}
                        </div>
                    </div>
                    
                    <table class="list">
                        <tbody>
                        <tr v-for="item in baseInfo.today.data" :key="item.id" class="item">
                            <td class="name">
                                {{ item.name }}
                            </td>
                            
                            <td class="area">
                                {{ item.area }}
                            </td>
                            
                            <td class="price">
                                约{{ item.price.all }}万（{{ item.price.single }}/m²）
                            </td>
                            
                            <td class="btn-roomType">
                                户型图
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                
                <div class="low-price">
                    <div class="tips">
                        以上价格为开发商报价，可联系分析师咨询最低价格
                    </div>
                    
                    <div class="btn-ask">
                        询底价
                    </div>
                </div>
                
                <div class="fxs">
                    <div class="avatar-box">
                        <img src="https://ssl.malmam.com/xiangju-static/dfs/12/5403f106a70e3e/_E7_BD_97_E5_90_9B_E5_BC_BA.png" alt="" class="avatar">
                        
                        <div class="label icon-online">
                            在线
                        </div>
                    </div>
                    
                    <div class="user-infos">
                        <div class="name">
                            罗俊强
                            
                            <span class="tag">高级置业顾问 </span>
                        </div>
                        
                        <div class="minute">
                            <div class="label">
                                平均响应时间：
                            </div>
                            
                            <div class="value">
                                17分钟
                            </div>
                        </div>
                        
                        <div class="people">
                            <div class="label">
                                接待人数：
                            </div>
                            
                            <div class="value">
                                62人
                            </div>
                        </div>
                        
                        <div class="ok">
                            <div class="label">
                                满意度：
                            </div>
                            
                            <div class="value">
                                91%
                            </div>
                        </div>
                    </div>
                    
                    <div class="btn-ask">
                        向他咨询
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 楼盘特点，最新动态-->
        <div class="featuresAndDynamic">
            <div class="features">
                <div class="title">
                    楼盘特点
                </div>
                
                <div class="list">
                    <div v-for="item in features" :key="item.id" class="item">
                        {{ item }}
                    </div>
                </div>
            </div>
            
            <div class="dynamic">
                <div class="title">
                    最新动态<span class="small">{{ dynamic.time }}</span>
                </div>
                
                <!-- no xss -->
                <div class="html" v-html="dynamic.html"></div>
                
                <div class="alert-text">
                    变价，开盘，优惠通知我
                </div>
            </div>
        </div>
        
        <div class="nav-component">
            <div
                ref="box"
                :class="{
                'house-nav-box': true,
                fixed: fixed
            }"
            >
                <div class="house-nav-c">
                    <div class="list">
                        <div
                            v-for="(item, index) in houseNav"
                            :key="item.id"
                            :class="{
                            item: true,
                            active: current === index
                        }"
                            @click="goto(item)"
                        >
                            {{ item.text }}
                        </div>
                    </div>
                
                    <input placeholder="请输入您的手机号" class="input-phone" type="number" alt>
                
                    <div class="btn-ask">
                        免费咨询
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 新房分析师 -->
        <div class="house-fxs">
            <div class="title">
                新房分析师
            </div>
            
            <div class="list">
                <div v-for="item in houseFxs" :key="item.id" class="item">
                    <div class="top">
                        <img :src="item.avatar" alt="" class="avatar">
                        
                        <div class="infos">
                            <div class="username">
                                {{ item.username }}
                                <span class="icon-online">在线</span>
                            </div>
                            
                            <div class="job">
                                {{ item.job }}
                            </div>
                            
                            <div class="tags">
                                {{ item.tag }}
                            </div>
                        </div>
                    </div>
                    
                    <div v-for="(info, index) in item.labels" :key="info.id" class="info-item">
                        <span class="label">{{ info }}：</span>
                        {{ item.values[index] }}
                    </div>
                    
                    <div class="btn-ask">
                        向他咨询
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 楼盘动态 -->
        <div class="house-dynamic">
            <div class="left">
                <div class="title">
                    楼盘动态
                </div>
                
                <div class="list">
                    <div v-for="item in houseDynamic.list" :key="item.id" class="item">
                        <div class="html" v-html="item.html"></div>
                        
                        <div class="time">
                            {{ item.time }}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="right">
                <div class="right-title">
                    订阅楼盘动态
                </div>
                
                <input placeholder="请输入您的手机号" class="input-phone" type="number" alt>
                
                <div class="tips">
                    输入手机号订阅最新楼盘动态，有最新楼盘消息时，我们将第一时间通过短信通知您
                </div>
                
                <div class="btn-enter">
                    确认订阅
                </div>
            </div>
        </div>
        
        <!-- 户型详情 -->
        <div class="roomType-detail">
            <div class="title">
                户型详情
                
                <div class="reserve">
                    <div class="tips">
                        了解更多专业户型分析，请咨询分析师
                    </div>
                    
                    <input placeholder="请输入您的手机号" class="input-phone" type="number" alt />
                    
                    <div class="btn-reserve">
                        预约咨询
                    </div>
                </div>
            </div>
            
            <div class="list">
                <div v-for="item in roomType.list" :key="item.id" class="item">
                    <div class="left">
                        <img :src="item.images[0].images[0]" alt="" class="image">
                        
                        <div class="count">
                            {{ item.imageCount }}个
                        </div>
                    </div>
                    
                    <div class="center">
                        <div class="name">
                            {{ item.name }}
                            <span class="small">
                                {{ item.small }}
                            </span>
                        </div>
                        
                        <div class="tags">
                            <div v-for="tag in item.tags" :key="tag.id" class="tag">
                                {{ tag }}
                            </div>
                        </div>
                        
                        <div class="price">
                            {{ item.price }}
                        </div>
                        
                        <div class="fxs">
                            分析师解读
                            
                            <div class="content">
                                {{ item.fxs }}
                            </div>
                        </div>
                    </div>
                    
                    <div class="btn-more">
                        了解更多户型信息
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 楼盘详情 -->
        <div class="house-detail">
            <div class="title">
                楼盘详情
            </div>
            
            <div class="list">
                <div class="left">
                    <div v-for="(value, key) in getHouseDetailLeft" :key="value.id" class="item">
                        <div class="label">
                            {{ getHouseDetailLabel(key) }}：
                        </div>
                        
                        <div class="value">
                            {{ value }}
                        </div>
                    </div>
                </div>
                
                <div class="right">
                    <div v-for="(value, key) in getHouseDetailRight" :key="value.id" class="item">
                        <div class="label">
                            {{ getHouseDetailLabel(key) }}：
                        </div>
                        
                        <div class="value">
                            {{ value }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 贷款计算器 -->
        <div class="calc">
            <div class="title">
                贷款计算器
            </div>
            
            <div class="content">
                <div class="left">
                    <div class="c-title">
                        计算条件
                    </div>
                    
                    <div class="list">
                        <div v-for="item in calc.list" :key="item.id" class="item">
                            <div class="label">
                                {{ item.label }}
                            </div>
                            
                            <select v-if="item.type === 'select'" class="select">
                                <option v-for="s in item.select" :key="s.id">
                                    {{ s }}
                                </option>
                            </select>
                            
                            <div v-else-if="item.type === 'text'" class="text">
                                {{ item.text }}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="right">
                    <div class="c-title">
                        计算结果
                    </div>
                    
                    <div class="box">
                        <div ref="echarts" class="echarts"></div>
                        
                        <div class="infos">
                            <div class="month-price">
                                月均还款
                                <span class="price">
                                    {{ calc.monthPrice }}
                                    <span class="unit">元</span>
                                </span>
                            </div>
                            
                            <div class="first">
                                参考首付：
                                <div class="price">
                                    {{ calc.first }}
                                </div>
                            </div>
                            
                            <div class="loan">
                                贷款金额：
                                <div class="price">
                                    {{ calc.loan }}
                                </div>
                            </div>
                            
                            <div class="interest">
                                支付利息：
                                <div class="price">
                                    {{ calc.interest }}
                                </div>
                            </div>
                            
                            <div class="tip">
                                （利率：公积金3.25%，商业4.9%）
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 推荐楼盘 -->
        <div class="recommend">
            <div class="title">
                推荐楼盘
            </div>
            
            <div class="list">
                <div v-for="item in recommend" :key="item.id" class="item">
                    <img :src="item.image" alt="" class="image">
                    
                    <div class="name">
                        <div class="status">
                            {{ item.status }}
                        </div>
                        
                        <div class="text">
                            {{ item.name }}
                        </div>
                    </div>
                    
                    <div class="address">
                        {{ item.address }}
                    </div>
                    
                    <div class="price">
                        {{ item.price }}
                    </div>
                    
                    <div class="tags">
                        <div v-for="tag in item.tags" :key="tag.id" class="tag">
                            {{ tag }}
                        </div>
                    </div>
                    
                    <div class="btn-ask">
                        查底价
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less">
    #app {
        .house-page {
            width: 1200px;
            margin: 0 auto;
        }
    }
</style>

<style lang="less" scoped>
    @import "./index.less";
    // 公共样式
    .alert-text {
        .defaultText(14px, rgba(180,37,54,1), 20px);
        display: inline;
        border-bottom: 1px dashed rgba(180,37,54,1);
        cursor: pointer;
    }
    .icon-online {
        .defaultText(12px, #336DD2, 17px);
        .flexAlignCenterJustifyCenter;
    
        &:before {
            content: '';
            display: block;
            width: 5px;
            height: 5px;
            margin-right: 6px;
            background: rgba(51,109,210,1);
            border-radius: 100%;
        }
    }
    .input-phone {
        .defaultInput(36px);
        width: 243px;
        height: 44px;
    }

    .house-fxs, .house-dynamic, .roomType-detail, .house-detail, .calc, .recommend {
        padding: 40px 0;
        border-bottom: 1px solid rgba(0,0,0,.1);
    
        .title {
            .defaultText(22px, #020202, 30px, bold);
        }
    }

    .nav-component  {
        height: 70px;
        margin-top: 40px;
    
        .house-nav-box {
            &.fixed {
                z-index: 99;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                background: #fff;
            }
        
            .house-nav-c {
                .flexAlignCenter;
                width: 1200px;
                margin: 0 auto;
                border-bottom: 1px solid rgba(0,0,0,.1);
            
                .list {
                    .flexAlignCenter;
                    flex: 1;
                    height: 69px;
                
                    .item {
                        .flexAlignCenter;
                        .defaultText(16px, rgba(2, 2, 2, .5));
                        height: 100%;
                        margin-right: 20px;
                        padding: 0 24px;
                        border-bottom: 2px solid transparent;
                        cursor: pointer;
                    
                        &:hover, &.active {
                            .defaultText(16px, rgba(2, 2, 2, 1), 22px, bold);
                            border-bottom: 2px solid rgba(180,37,54,1);
                        }
                    }
                }
            
                .btn-ask {
                    .defaultText(16px, rgba(249,249,249,1));
                    margin-left: 26px;
                    padding: 11px 28px;
                    background: rgba(180,37,54,1);
                    border-radius: 4px;
                    cursor: pointer;
                }
            }
        }
    }
    
    .recommend {
        border-bottom: none;
    
        .list {
            .flexAlignCenter;
            margin-top: 40px;
        
            .item {
                .relative;
                flex-shrink: 0;
                margin-right: 68px;
            
                &:last-child {
                    margin-right: 0;
                }
            
                .image {
                    display: block;
                    width: 248px;
                    height: 210px;
                    border-radius: 4px;
                }
            
                .name {
                    .flexAlignCenter;
                    margin-top: 15px;
                    margin-bottom: 6px;
                
                    .text {
                        .textOverflow;
                        .defaultText(16px, rgba(2, 2, 2, 1), 22px, bold);
                        flex: 1;
                        width: 0;
                    }
                
                    .status {
                        .defaultText(12px, #fff, 1);
                        flex-shrink: 0;
                        margin-right: 3px;
                        padding: 1px 2px;
                        background: #ba2d3f;
                        border-radius: 2px;
                    }
                }
            
                .address {
                    .defaultText(12px, #636363, 18px);
                    margin-bottom: 6px;
                }
            
                .price {
                    .defaultText(14px, rgba(180, 37, 54, 1), 20px);
                    margin-bottom: 6px;
                }
            
                .tags {
                    .flexAlignCenter;
                
                    .tag {
                        .defaultText(12px, #fff, 1);
                        padding: 3px 8px;
                        border-radius: 2px;
                    
                        &:nth-child(1) {
                            margin-right: 6px;
                            background: #e6efff;
                            color: #336dd2;
                        }
                        &:nth-child(2) {
                            background: #ffecea;
                            color: #ba2d3f;
                        }
                    }
                }
            
                .btn-ask {
                    .defaultText(14px, rgb(180,37,54,1), 34px);
                    position: absolute;
                    right: 0;
                    bottom: 25px;
                    width: 68px;
                    height: 34px;
                    background: #FFF4F4;
                    border: 1px solid #B42536;
                    text-align: center;
                    border-radius: 4px;
                    cursor: pointer;
                }
            }
        }
    }

    .calc {
        .content {
            .relative;
            .flexAlignStretch;
            margin-top: 26px;
            border: 1px solid #eee;
        
            .btn-calc {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 184px;
                height: 74px;
                cursor: pointer;
                transform: translate(-50%, -50%);
            }
        
            .left, .right {
                flex: 1;
                padding: 20px 14px;
                box-sizing: border-box;
            
                .c-title {
                    .defaultText(18px, #515151, 24px, bold);
                }
            }
        
            .left {
                .list {
                    margin-top: 40px;
                
                    .item {
                        .flexAlignCenter;
                        margin-bottom: 34px;
                    
                        &:last-child {
                            margin-bottom: 0;
                        }
                    
                        .text {
                            .defaultText(14px, #333, 20px);
                        }
                    
                        .label {
                            .defaultText(12px, #acacac, 18px, bold);
                            margin-right: 26px;
                        }
                    
                        .select {
                            .defaultText(14px, #555, 20px);
                            width: 150px;
                            padding: 6px 12px;
                            border: 1px solid #ccc;
                            border-radius: 4px;
                            box-sizing: border-box;
                            cursor: pointer;
                        }
                    }
                }
            }
        
            .right {
                background: #f9f9f9;
            
                .box {
                    .flexAlignStart;
                    margin-top: 55px;
                
                    .echarts {
                        width: 219px;
                        height: 200px;
                        margin-left: 50px;
                    }
                
                    .infos {
                        .defaultText(14px, #9a9a9a, 20px);
                        margin-left: 30px;
                    
                        .month-price {
                            .defaultText(16px, #9a9a9a);
                            margin-bottom: 16px;
                        
                            .price {
                                .defaultText(24px, #FF6619, 35px);
                            
                                .unit {
                                    font-size: 18px;
                                }
                            }
                        }
                    
                        .first, .loan, .interest {
                            .flexAlignCenter;
                            margin-bottom: 16px;
                        
                            &.first:before {
                                background: #1A69BB;
                            }
                            &.loan:before {
                                background: #A1BF41;
                            }
                            &.interest:before {
                                background: #C65936;
                            }
                        
                            &:before {
                                content: '';
                                display: block;
                                width: 8px;
                                height: 8px;
                                margin-right: 8px;
                                border-radius: 100%;
                            }
                        }
                    
                        .tip {
                            font-size: 12px;
                        }
                    }
                }
            }
        }
    }

    .house-detail {
        .list {
            .flexAlignStart;
            width: 100%;
            margin-top: 30px;
            margin-bottom: -20px;
        
            .left {
                margin-right: 70px;
            }
        
            .left, .right {
                flex-shrink: 0;
                max-width: 50%;
            
                .item {
                    .flexAlignStart;
                    margin-bottom: 20px;
                
                    .label {
                        .defaultText(16px, rgba(38,38,38,1));
                        flex-shrink: 0;
                        width: 96px;
                        margin-right: 20px;
                    }
                
                    .value {
                        .defaultText(16px, rgba(140,140,140,1));
                        word-break: break-all;
                    }
                }
            }
        }
    }

    .roomType-detail {
        .title {
            .flexAlignCenterJustifySpaceBetween;
        
            .reserve {
                .flexAlignCenter;
            
                .tips {
                    .defaultText(14px, rgba(140,140,140,1), 20px);
                    margin-right: 10px;
                }
            
                .btn-reserve {
                    .flexAlignCenterJustifyCenter;
                    .defaultText(16px, rgba(249,249,249,1));
                    width: 120px;
                    height: 44px;
                    margin-left: 26px;
                    background: rgba(180,37,54,1);
                    border-radius: 4px;
                    cursor: pointer;
                }
            }
        }
    
        .list {
            margin-top: 23px;
        
            .item {
                .flexAlignStart;
                padding: 30px 0;
                border-top: 1px dashed #979797;
            
                &:last-child {
                    padding-bottom: 0;
                }
            
                .left {
                    .relative;
                    flex-shrink: 0;
                    width: 360px;
                    height: 250px;
                    border:1px solid rgba(0,0,0,.1);
                
                    .image {
                        display: block;
                        max-width: 100%;
                        max-height: 100%;
                        margin: 0 auto;
                    }
                
                    .count {
                        .defaultText(16px, #fff);
                        position: absolute;
                        right: 12px;
                        bottom: 12px;
                        padding: 2px 14px;
                        background: rgba(0,0,0,.7);
                        border-radius: 15px;
                    }
                }
            
                .center {
                    margin-left: 60px;
                
                    .name {
                        .defaultText(18px, rgba(17,28,55,1), 25px, bold);
                    
                        .small {
                            .defaultText(14px, rgba(147,153,164,1), 20px);
                            margin-left: 4px;
                        }
                    }
                
                    .tags {
                        .flexAlignCenter;
                        margin-top: 20px;
                    
                        .tag {
                            .defaultText(14px, #000, 20px);
                            margin-right: 10px;
                            padding: 0 6px;
                        
                            &:nth-child(1) {
                                background: rgba(232,248,239,1);
                                color: #1EA855;
                            }
                        
                            &:nth-child(2) {
                                background: rgba(255,240,240,1);
                                color: #DB3535;
                            }
                        
                            &:nth-child(3) {
                                background: rgba(240,245,255,1);
                                color: #3577DB;
                            }
                        }
                    }
                
                    .price {
                        .defaultText(20px, rgba(233,49,71,1), 28px, bold);
                        margin-top: 30px;
                    }
                
                    .fxs {
                        .defaultText(14px, rgba(17,28,55,1), 20px, bold);
                        margin-top: 20px;
                    
                        .content {
                            .defaultText(14px, rgba(140,140,140,1), 28px);
                            margin-top: 8px;
                            margin-right: 16px;
                            word-break: break-all;
                        }
                    }
                }
            
                .btn-more {
                    .defaultText(16px, #fff);
                    flex-shrink: 0;
                    margin-top: 100px;
                    padding: 10px 16px;
                    background: rgba(180,37,54,1);
                    border-radius: 4px;
                    cursor: pointer;
                }
            }
        }
    }

    .house-dynamic {
        .flexAlignStartJustifySpaceBetween;
    
        .left {
            .list {
                width: 640px;
                margin-top: 10px;
            
                .item {
                    padding: 20px 0;
                    border-bottom: 2px dashed #bfbfbf;
                
                    &:last-child {
                        padding-bottom: 0;
                        border-bottom: none;
                    }
                
                    .html {
                        .defaultText(16px, rgba(38,38,38,1), 28px);
                        margin-bottom: 10px;
                        word-break: break-all;
                    }
                
                    .time {
                        .defaultText(14px, rgba(140,140,140,1), 20px);
                    }
                }
            }
        }
    
        .right {
            .flexAlignCenterColumn;
            width: 329px;
            height: 406px;
            padding: 40px 24px 0;
            background: rgba(247,247,247,1);
            border-radius: 4px;
            box-sizing: border-box;
        
            .right-title {
                .defaultText(18px, rgba(38,38,38,1), 25px, bold);
                margin-bottom: 40px;
            }
        
            .tips {
                .defaultText(14px, rgba(140,140,140,1), 20px);
                margin-top: 27px;
            }
        
            .btn-enter {
                .flexAlignCenterJustifyCenter;
                .defaultText(16px, rgba(180,37,54,1));
                width: 110px;
                height: 40px;
                margin-top: 40px;
                background: rgba(255,244,244,1);
                border:1px solid rgba(180,37,54,1);
                border-radius: 4px;
                box-sizing: border-box;
                cursor: pointer;
            }
        }
    }

    .house-fxs {
        .list {
            .flexAlignCenter;
            overflow-x: auto;
            width: 100%;
            margin: 22px -8px -8px;
            padding: 8px;
        
            .item {
                flex-shrink: 0;
                width: 263px;
                height: 359px;
                margin-right: 30px;
                padding: 16px 20px;
                background: #fff;
                box-shadow: 0 2px 16px 0 rgba(0,0,0,0.11);
                border-radius: 6px;
                box-sizing: border-box;
            
                .top {
                    .flexAlignCenter;
                    margin-bottom: 20px;
                
                    .avatar {
                        width: 69px;
                        border: 1px solid rgba(0,0,0,0.08);
                        box-sizing: border-box;
                    }
                
                    .infos {
                        margin-left: 20px;
                    
                        .username {
                            .flexAlignCenter;
                            .defaultText(16px, rgba(17,28,55,1), 22px, bold);
                            margin-bottom: 4px;
                        
                            .icon-online {
                                margin-left: 10px;
                                font-size: 14px;
                            }
                        }
                    
                        .job {
                            .defaultText(14px, rgba(147,153,164,1), 20px);
                            margin-bottom: 6px;
                        }
                    
                        .tags {
                            .defaultText(12px, rgba(233,93,110,1));
                            height: 19px;
                            padding: 0 4px;
                            background: rgba(255,240,238,1);
                            line-height: 19px;
                            letter-spacing:2px;
                        }
                    }
                }
            
                .info-item {
                    .textOverflowByRow(3);
                    .defaultText(14px, #3d465c, 20px);
                    margin-bottom: 10px;
                
                    .label {
                        color: rgba(147,153,164,1);
                    }
                }
            
                .btn-ask {
                    .defaultText(14px, rgba(180,37,54,1));
                    width: 105px;
                    height: 40px;
                    margin: 16px auto 0;
                    background: rgba(255,244,244,1);
                    border: 1px solid rgba(180,37,54,1);
                    text-align: center;
                    line-height: 40px;
                    border-radius: 4px;
                    cursor: pointer;
                    box-sizing: border-box;
                }
            }
        }
    }

    .house-page {
        padding-bottom: 80px;
    }

    .featuresAndDynamic {
        .flexAlignStretch;
        margin-top: 50px;
    
        .features, .dynamic {
            width: 570px;
            padding: 20px 20px 20px 30px;
            background: rgba(247,247,247,1);
            box-sizing: border-box;
        
            .title {
                .defaultText(18px, rgba(17,28,55,1), 25px, bold);
            
                .small {
                    .defaultText(14px, rgba(147,153,164,1), 20px);
                    margin-left: 10px;
                }
            }
        }
    
        .features {
            margin-right: 60px;
        
            .list {
                margin-top: 20px;
            
                .item {
                    .flexAlignStart;
                    .defaultText(14px, rgba(61,70,92,1), 24px);
                    word-break: break-all;
                
                    &:before {
                        flex-shrink: 0;
                        display: block;
                        content: '';
                        width: 8px;
                        height: 8px;
                        margin-top: 8px;
                        margin-right: 8px;
                        background: rgba(180,37,54,1);
                        border-radius: 100%;
                    }
                }
            }
        }
    
        .dynamic {
            .html {
                .defaultText(14px, rgba(61,70,92,1), 24px);
                margin: 3px 0;
            }
        }
    }

    .bread {
        .flexAlignCenter;
        padding: 30px 0 28px 0;
    
        .link-home {
            .defaultText(12px, rgba(38,38,38,1), 17px);
            text-decoration: none;
        }
    
        .icon-down {
            width: 10px;
            height: 6px;
            margin: 0 10px;
            transform: rotate(-90deg);
        }
    
        .house-name {
            .defaultText(12px, rgba(186,45,63,1), 17px);
        }
    }

    .house-infos {
        display: flex;
    
        .images {
            flex-shrink: 0;
            width: 634px;
            height: 541px;
        }
    
        .infos {
            flex: 1;
            margin-left: 50px;
        
            .title {
                .defaultText(20px, rgba(2,2,2,1),28px,bold);
                word-break: break-all;
            }
        
            .discount {
                .defaultText(14px, rgba(61,70,92,1), 20px);
                margin-top: 10px;
                padding: 10px 14px;
                background: rgba(238,67,67,.06);
            }
        
            .address {
                .defaultText(14px, rgba(147,153,164,1), 20px);
                margin-top: 10px;
            }
        
            .activity {
                .flexAlignCenter;
                margin-top: 18px;
            
                .activity-item {
                    .flexAlignCenterJustifySpaceBetween;
                    flex: 1;
                    margin-right: 22px;
                    margin-bottom: 20px;
                    padding: 6px 14px;
                    background-size: 100% 100%;
                    cursor: pointer;
                
                    &:nth-child(1) {
                        .left {
                            .top {
                                .name {
                                    color: #BA2D3F;
                                }
                            }
                        }
                    
                        .right {
                            color: #BA2D3F;
                        }
                    }
                
                    &:nth-child(2) {
                        .left {
                            .top {
                                .name {
                                    color: #336DD2;
                                }
                            }
                        }
                    
                        .right {
                            color: #336DD2;
                        }
                    }
                
                    &:nth-child(2n) {
                        margin-right: 0;
                    }
                
                    .left {
                        .top {
                            .flexAlignCenter;
                        
                            .name {
                                .defaultText(14px, #000, 20px, bold);
                            }
                        
                            .small {
                                .defaultText(12px, #000, 16px, bold);
                            }
                        }
                    
                        .bottom {
                            .defaultText(12px, rgba(82,97,106,1), 16px);
                            margin-top: 2px;
                        }
                    }
                
                    .right {
                        .defaultText(14px, #000, 16px, bold);
                        flex-shrink: 0;
                        width: 28px;
                        height: 32px;
                        margin-left: 10px;
                        word-break: break-all;
                    }
                }
            }
        
            .today {
                .top {
                    .flexAlignCenter;
                
                    .image {
                        width: 66px;
                        height: 16px;
                        margin-right: 10px;
                    }
                
                    .small {
                        .defaultText(14px, rgba(147,153,164,1), 20px);
                    }
                }
            
                .list {
                    border-spacing: 30px 10px;
                    margin: 6px 0 -10px -30px;
                
                    .item {
                        .defaultText(14px, rgba(61,70,92,1), 20px);
                        margin-bottom: 10px;
                    
                        .price {
                            .num {
                                color: #E93147;
                            }
                        }
                    
                        .btn-roomType {
                            .defaultText(14px, rgba(132,154,174,1), 20px);
                            padding: 0 4px;
                            background: rgba(244,247,249,1);
                            border-radius: 2px;
                            cursor: pointer;
                        }
                    }
                }
            }
        
            .low-price {
                .flexAlignCenterJustifySpaceBetween;
                margin-top: 18px;
            
                .tips {
                    .defaultText(12px, rgba(172,120,77,1), 17px, bold);
                    padding: 4px 13px;
                    background:rgba(233,143,71,.1);
                }
            
                .btn-ask {
                    .defaultText(16px, #fff, 22px, bold);
                    padding: 9px 26px;
                    background: rgba(180,37,54,1);
                    border-radius: 4px;
                    cursor: pointer;
                }
            }
        
            .fxs {
                .flexAlignCenter;
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid rgba(0, 0, 0, .1);
            
                .avatar-box {
                    flex-shrink: 0;
                
                    .avatar {
                        display: block;
                        width:69px;
                        height:69px;
                        border:1px solid rgba(0,0,0,0.08);
                    }
                
                    .label {
                        height: 17px;
                        background: rgba(239,244,252,1);
                    }
                }
            
                .user-infos {
                    flex: 1;
                    margin-left: 15px;
                
                    .name {
                        .defaultText(16px, rgba(2,2,2,1), 22px, bold);
                        margin-bottom: 6px;
                    
                        .tag {
                            .defaultText(12px, rgba(0,0,0,.5), 17px);
                            margin-left: 9px;
                            padding: 2px 9px;
                            background: rgba(51,109,210,0.0574);
                        }
                    }
                
                    .minute, .people, .ok {
                        .flexAlignCenter;
                        .defaultText(12px, rgba(61,70,92,1), 17px);
                        margin-bottom: 4px;
                    
                        .value {
                            font-weight: bold;
                            color: #000;
                        }
                    
                        &.ok {
                            margin-bottom: 0;
                        }
                    }
                }
            
                .btn-ask {
                    .defaultText(16px, rgba(180,37,54,1));
                    flex-shrink: 0;
                    padding: 9px 18px;
                    background: rgba(255,244,244,1);
                    border: 1px solid rgba(180,37,54,1);
                    border-radius: 4px;
                    cursor: pointer;
                }
            }
        }
    }
</style>

<script src="./index.ts" lang="ts"></script>
