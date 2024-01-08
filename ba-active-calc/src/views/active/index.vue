<script setup>
import { ref, onMounted, computed } from 'vue'
import * as math from 'mathjs'
import NP from 'number-precision'
import ItemTree from './components/tree.vue'
import { item1, item2, item3 } from './active.js'
import itemImg1 from '../../assets/277/item/item1.png';
import itemImg2 from '../../assets/277/item/item2.png';
import itemImg3 from '../../assets/277/item/item3.png';
import itemImgPt from '../../assets/277/item/pt.png';

const Q9 = [30, 5]
const Q10 = [24, 5]
const Q11 = [20, 5]
const Q12 = [4, 4, 4, 20]
const ap = 15

let itemNeed = ref(['', '', '', ''])
let itemHave = ref(['', '', '', ''])
let itemAdd = ref(['', '', '', '', ''])

let Qtime = ref([])

const itemTree1 = ref([])
const itemTree2 = ref([])
const itemTree3 = ref([])
const tree1 = ref(null)
const tree2 = ref(null)
const tree3 = ref(null)

const getTreeNode = () => {
  const tree1NodeList = tree1.value.getSelNodeList()
  const tree2NodeList = tree2.value.getSelNodeList()
  const tree3NodeList = tree3.value.getSelNodeList()
  return [tree1NodeList, tree2NodeList, tree3NodeList]
}
const setTreeNode = (reset) => {
  tree1.value.initTreeSel(reset ? [] : itemTree1.value)
  tree2.value.initTreeSel(reset ? [] : itemTree2.value)
  tree3.value.initTreeSel(reset ? [] : itemTree3.value)
}


onMounted(() => {
  initCache()
})

/**
 * 数字转百分数
 * @param {number} num 
 */
const num2percent = (num) => {
  console.log(num, (100 + +num) / 100);
  return (100 + +num) / 100
}


// 初始化用户数据
const initCache = () => {
  itemNeed.value = JSON.parse(localStorage.getItem('shigure_BA_itemNeed')) ?? itemNeed.value
  itemHave.value = JSON.parse(localStorage.getItem('shigure_BA_itemHave')) ?? itemHave.value
  itemAdd.value = JSON.parse(localStorage.getItem('shigure_BA_itemAdd')) ?? itemAdd.value
  itemTree1.value = JSON.parse(localStorage.getItem('shigure_BA_itemTree1')) ?? itemTree1.value
  itemTree2.value = JSON.parse(localStorage.getItem('shigure_BA_itemTree2')) ?? itemTree2.value
  itemTree3.value = JSON.parse(localStorage.getItem('shigure_BA_itemTree3')) ?? itemTree3.value
  setTreeNode()
}
// 缓存用户输入项
const saveCache = () => {
  const nodeSel = getTreeNode()
  localStorage.setItem('shigure_BA_itemNeed', JSON.stringify(itemNeed.value))
  localStorage.setItem('shigure_BA_itemHave', JSON.stringify(itemHave.value))
  localStorage.setItem('shigure_BA_itemAdd', JSON.stringify(itemAdd.value))
  localStorage.setItem('shigure_BA_itemTree1', JSON.stringify(nodeSel[0]))
  localStorage.setItem('shigure_BA_itemTree2', JSON.stringify(nodeSel[1]))
  localStorage.setItem('shigure_BA_itemTree3', JSON.stringify(nodeSel[2]))
}
// 清空缓存
const cleanCache = () => {
  localStorage.removeItem('shigure_BA_itemNeed')
  localStorage.removeItem('shigure_BA_itemHave')
  localStorage.removeItem('shigure_BA_itemTree1')
  localStorage.removeItem('shigure_BA_itemTree2')
  localStorage.removeItem('shigure_BA_itemTree3')
  reset()
}

// 计算数量
const calc = () => {
  const _getItemNum = (base, persent) => {
    return Math.ceil(NP.times(base, persent))
  }
  saveCache()

  console.log(Q10[0], num2percent(itemAdd.value[1]), Q10[0] * num2percent(itemAdd.value[1]));
  // 创建材料PT矩阵
  const QM = math.matrix([
    [_getItemNum(Q9[0], num2percent(itemAdd.value[0])), 0, 0, _getItemNum(Q9[1], num2percent(itemAdd.value[3]))],
    [0, _getItemNum(Q10[0], num2percent(itemAdd.value[1])), 0, _getItemNum(Q10[1], num2percent(itemAdd.value[3]))],
    [0, 0, _getItemNum(Q11[0], num2percent(itemAdd.value[2])), _getItemNum(Q11[1], num2percent(itemAdd.value[3]))],
    [
      _getItemNum(Q12[0], num2percent(itemAdd.value[0])),
      _getItemNum(Q12[1], num2percent(itemAdd.value[1])),
      _getItemNum(Q12[2], num2percent(itemAdd.value[2])),
      _getItemNum(Q12[3], num2percent(itemAdd.value[4]))
    ]
  ])

  // 创建需求矩阵1
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

  console.log(QM)
}

const sum = computed(() => {
  const time = Qtime.value.reduce((total, num) => {
    return total += num
  }, 0)
  const sumAp = time * ap

  console.log("[sum]", time, sumAp);
  return [time, sumAp]
})

// 重置输入项
const reset = () => {
  setTreeNode(true)
  setTimeout(() => {
    itemNeed.value = ['', '', '', '']
    itemHave.value = ['', '', '', '']
    itemAdd.value = ['', '', '', '']
    Qtime.value = []
  }, 0);
}

const selectItem1 = (price) => {
  itemNeed.value[0] = +itemNeed.value[0] + price
}
const selectItem2 = (price) => {
  itemNeed.value[1] = +itemNeed.value[1] + price
}
const selectItem3 = (price) => {
  itemNeed.value[2] = +itemNeed.value[2] + price
}
</script>

<template>
  <div>
    <h2 style="text-align: center">BA活动刷图计算器 v0.20</h2>


    <el-card class="shop">
      <template #header>
        <div class="card-header">
          <span>商店道具</span>
        </div>
      </template>
      <div class="item-tree">
        <ItemTree :data="item1" @select-item="selectItem1" ref="tree1" />
        <ItemTree :data="item2" @select-item="selectItem2" ref="tree2" />
        <ItemTree :data="item3" @select-item="selectItem3" ref="tree3" />
      </div>
    </el-card>



    <table>
      <tr>
        <th></th>
        <th>
          <div class="flex">
            <span>浴巾</span>
            <el-image style="width: 50px; " :src="itemImg1" :fit="fit" />
          </div>
        </th>
        <th>
          <div class="flex">
            <span>洗发水</span>
            <el-image style="width:  50px; " :src="itemImg2" :fit="fit" />
          </div>
        </th>
        <th>
          <div class="flex">
            <span>入浴剂</span>
            <el-image style="width:  50px; " :src="itemImg3" :fit="fit" />
          </div>
        </th>
        <th>
          <div class="flex">
            <span>PT</span>
            <el-image style="width:  50px; " :src="itemImgPt" :fit="fit" />
          </div>
        </th>
      </tr>
      <tr>
        <td>加成</td>
        <td v-for="(item, index) in itemAdd" :key="'add' + index" v-show="index < 3">
          <el-input v-model="itemAdd[index]" type="number" clearable placeholder="请输入加成">
            <template #append>%</template>
          </el-input>
        </td>
        <td style="display: flex;justify-content: center;">
          <div style="width: 300px;">
            <el-input v-model="itemAdd[3]" type="number" clearable placeholder="请输入Q9-Q11加成" style="margin-bottom: 10px;">
              <template #prepend>&nbsp;Q9</template>
              <template #append>%</template>
            </el-input>
            <el-input v-model="itemAdd[4]" type="number" clearable placeholder="请输入Q12加成">
              <template #prepend>Q12</template>
              <template #append>%</template>
            </el-input>
          </div>
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
          <el-tag type="success" size="large">{{ item }}次</el-tag>
        </td>
      </tr>
      <tr>
        <td>体力</td>
        <td v-for="(item, index) in Qtime" :key="'ap' + index">
          <el-tag type="success" size="large">{{ item * ap }}AP</el-tag>
        </td>
      </tr>
      <tr>
        <td>合计</td>
        <td>
          <el-tag size="large">共需刷图：{{ sum[0] }}次</el-tag>
        </td>
        <td>
          <el-tag size="large">消耗体力：{{ sum[1] }}AP</el-tag>
        </td>
      </tr>
    </table>

    <div class="btn">
      <el-button type="primary" @click="calc">计算</el-button>
      <el-button type="warning" @click="cleanCache">清空缓存</el-button>
      <el-button type="danger" @click="reset">重置</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
%main {
  width: 1500px;
  text-align: center;
  margin: auto;
}

.shop {
  @extend %main;
  width: 800px;
  margin-bottom: 20px;

  .item-tree {
    display: flex;
    justify-content: space-around;
  }
}

table {
  @extend %main;

  .flex {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  td {
    padding: 10px 5px;

    .el-input {
      width: 300px;
    }
  }

  th {
    font-size: 20px;
  }
}

.btn {
  @extend %main;
  text-align: right;
  margin-top: 20px;
}
</style>
