### 链接
https://leetcode.cn/problems/minimum-cost-of-buying-candies-with-discount/

### 题解
将数组由高到低排序

因为只能买贵的糖果送便宜的糖果，所以最贵的两个肯定是不送的，第三个是可以送的，依次类推，我们只需要，从第0项开始每隔两个免费即可
