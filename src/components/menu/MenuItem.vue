<template>
  <div class="menu-item-container">
    <template v-for="item in itemData">
      <el-submenu v-if="item.hasOwnProperty('children') && item.children.length > 0" :key="item.id"
                  :disabled="item.hasOwnProperty('disabled') && item.disabled === true"
                  :index="item.path">
        <template #title>
          <i v-if="item.iconType === 'element-ui' && item.icon" :class="item.icon"></i>
          <span>{{item.title}}</span>
        </template>
        <menu-item :item-data="item.children"></menu-item>
      </el-submenu>
      <el-menu-item v-else :index="item.path" :key="item.id"
                    :disabled="item.hasOwnProperty('disabled') && item.disabled === true">
        <i v-if="item.iconType === 'element-ui' && item.icon" :class="item.icon"></i>
        <template #title>
          <span>{{item.title}}</span>
        </template>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
import MenuItem from '@/components/menu/MenuItem'

export default {
  name: 'MenuItem',
  components: {
    MenuItem
  },
  props: {
    itemData: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped>

</style>
