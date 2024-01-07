<script setup>
const props = defineProps(['data'])
const emit = defineEmits(['select-item'])

const handleNodeClick = (node, isCheck, hasChild) => {
  if (node.children) {
    return
  }
  console.log(node, isCheck, hasChild)
  const price = node.num * node.value
  console.log(price)

  emit('select-item', price)
}

const price = (arr) => {
  if (!node.children) {
    return
  }
  while (node.children) {}
}
</script>

<template>
  <div>
    <el-tree
      :data="props.data"
      @check-change="handleNodeClick"
      show-checkbox
      default-expand-all
      :render-after-expand="false"
    />
  </div>
</template>

<style lang="scss"></style>
