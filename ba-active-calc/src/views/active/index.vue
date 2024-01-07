<script setup>
import { ref } from 'vue'
import * as math from 'mathjs'
import { onMounted } from 'vue'
import ItemTree from './components/tree.vue'
import { item1, item2, item3 } from './active.js'

const Q9 = [30, 5]
const Q10 = [24, 5]
const Q11 = [20, 5]
const Q12 = [4, 4, 4, 20]
const ap = 15

let itemNeed = ref(['', '', '', ''])
let itemHave = ref(['', '', '', ''])
let itemAdd = ref(['', '', '', ''])

let Qtime = ref([])

onMounted(() => {
  initCache()
})

const num2percent = (num) => {
  return 1 + num / 100
}

// 初始化用户数据
const initCache = () => {
  itemNeed.value = JSON.parse(localStorage.getItem('shigure_BA_itemNeed')) ?? itemNeed.value
  itemHave.value = JSON.parse(localStorage.getItem('shigure_BA_itemHave')) ?? itemHave.value
  itemAdd.value = JSON.parse(localStorage.getItem('shigure_BA_itemAdd')) ?? itemAdd.value
}
// 缓存用户输入项
const saveCache = () => {
  localStorage.setItem('shigure_BA_itemNeed', JSON.stringify(itemNeed.value))
  localStorage.setItem('shigure_BA_itemHave', JSON.stringify(itemHave.value))
  localStorage.setItem('shigure_BA_itemAdd', JSON.stringify(itemAdd.value))
}
// 清空缓存
const cleanCache = () => {
  localStorage.removeItem('shigure_BA_itemNeed')
  localStorage.removeItem('shigure_BA_itemHave')
  localStorage.removeItem('shigure_BA_itemAdd')
  reset()
}

// 计算数量
const calc = () => {
  saveCache()
  // 创建材料PT矩阵
  const QM = math.matrix([
    [Q9[0] * num2percent(itemAdd.value[0]), 0, 0, Q9[1] * num2percent(itemAdd.value[3])],
    [0, Q10[0] * num2percent(itemAdd.value[1]), 0, Q10[1] * num2percent(itemAdd.value[3])],
    [0, 0, Q11[0] * num2percent(itemAdd.value[2]), Q11[1] * num2percent(itemAdd.value[3])],
    [
      Q12[0] * num2percent(itemAdd.value[0]),
      Q12[1] * num2percent(itemAdd.value[1]),
      Q12[2] * num2percent(itemAdd.value[2]),
      Q12[3] * num2percent(itemAdd.value[3])
    ]
  ])

  // 创建需求矩阵
  const needM = math.matrix([
    [itemNeed.value[0] - itemHave.value[0]],
    [itemNeed.value[1] - itemHave.value[1]],
    [itemNeed.value[2] - itemHave.value[2]],
    [itemNeed.value[3] - itemHave.value[3]]
  ])

  // 计算刷图次数
  const calc = math.lusolve(QM, needM)

  // 格式化
  Qtime.value = calc._data.map((e) => {
    return e < 0 ? 0 : math.ceil(e[0])
  })

  console.log(Qtime.value)
}

// 重置输入项
const reset = () => {
  itemNeed.value = ['', '', '', '']
  itemHave.value = ['', '', '', '']
  itemAdd.value = ['', '', '', '']
  Qtime.value = []
}

const selectItem1 = (price) => {
  console.log('[selectItem1]', price)
  itemNee.valued[0] = +itemNeed.value[0] + price
}
const selectItem2 = (price) => {
  console.log('[selectItem2]', price)
  itemNeed.value[1] = +itemNeed.value[1] + price
}
const selectItem3 = (price) => {
  console.log('[selectItem3]', price)
  itemNeed.value[2] = +itemNeed.value[2] + price
}
</script>

<template>
  <div>
    <h2 style="text-align: center">BA活动刷图计算器 v0.1</h2>
    <table>
      <tr>
        <th></th>
        <th>浴巾</th>
        <th>洗发水</th>
        <th>入浴剂</th>
        <th>PT</th>
      </tr>
      <tr>
        <td>加成</td>
        <td v-for="(item, index) in itemAdd" :key="'add' + index">
          <el-input v-model="itemAdd[index]" type="number" clearable placeholder="请输入加成">
            <template #append>%</template>
          </el-input>
        </td>
      </tr>
      <tr>
        <td>需求</td>
        <td v-for="(item, index) in itemNeed" :key="'need' + index">
          <el-input v-model="itemNeed[index]" type="number" clearable placeholder="请输入需求量" />
        </td>
      </tr>
      <tr>
        <td>持有</td>
        <td v-for="(item, index) in itemHave" :key="'have' + index">
          <el-input v-model="itemHave[index]" type="number" clearable placeholder="请输入持有量" />
        </td>
      </tr>
    </table>

    <table v-if="Qtime.length > 0">
      <tr>
        <th></th>
        <th>Q9</th>
        <th>Q10</th>
        <th>Q11</th>
        <th>Q12</th>
      </tr>
      <tr>
        <td>次数</td>
        <td v-for="(item, index) in Qtime" :key="'time' + index">
          <el-tag type="success">{{ item }}次</el-tag>
        </td>
      </tr>
      <tr>
        <td>体力</td>
        <td v-for="(item, index) in Qtime" :key="'ap' + index">
          <el-tag type="success">{{ item * ap }}AP</el-tag>
        </td>
      </tr>
    </table>
    <ItemTree :data="item1" @select-item="selectItem1" />
    <ItemTree :data="item2" @select-item="selectItem2" />
    <ItemTree :data="item3" @select-item="selectItem3" />
    <div class="btn">
      <el-button type="primary" @click="calc">计算</el-button>
      <el-button type="warning" @click="cleanCache">清空缓存</el-button>
      <el-button type="danger" @click="reset">重置</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
table {
  width: 80%;
  text-align: center;
  margin: auto;
  td {
    padding: 10px 5px;
    .el-input {
      width: 250px;
    }
  }
  th {
    font-size: 20px;
  }
}

.btn {
  @extend table;
  text-align: right;
  margin-top: 20px;
}
</style>
