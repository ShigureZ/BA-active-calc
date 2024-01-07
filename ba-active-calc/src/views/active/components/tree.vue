<script setup>
import { ref, watch } from "vue";
const props = defineProps(['data'])
const emit = defineEmits(['select-item'])

const tree = ref(null)
const initTreeSel = (nodeList) => {
  console.log(nodeList);
  tree.value.setCheckedNodes(nodeList)
}


const handleNodeClick = (node, isCheck, hasChild) => {
  if (node.children) {
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
