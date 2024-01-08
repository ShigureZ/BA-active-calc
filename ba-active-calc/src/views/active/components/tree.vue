<script setup>
import { ref, watch } from "vue";
const props = defineProps(['data'])
const emit = defineEmits(['select-item'])

const tree = ref(null)

let isInit = true
const initTreeSel = (nodeList) => {
  console.log(nodeList);
  tree.value.setCheckedNodes(nodeList)
  setTimeout(() => {
    isInit = false
  }, 0)
}


const handleNodeClick = (node, isCheck, hasChild) => {
  if (node.children) {
    return
  }
  console.log("[handleNodeClick]", isInit);
  // 初始化树节点时，不改变道具需求值
  if (isInit) {
    return
  }
  const price = node.num * node.value
  // 选择反选
  emit('select-item', isCheck ? price : -price)
}

const getSelNodeList = () => {
  return tree.value.getCheckedNodes()
}

defineExpose(
  { getSelNodeList, initTreeSel }
)

</script>

<template>
  <div>


    <el-tree :data="props.data" @check-change="handleNodeClick" show-checkbox default-expand-all
      :render-after-expand="false" :expand-on-click-node="false" node-key="id" ref="tree">
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span>{{ node.label }} </span>
          <span>{{ data.num ? `x${data.num}` : '' }}</span>
        </span>
      </template>
    </el-tree>


  </div>
</template>

<style lang="scss"></style>
