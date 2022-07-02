<template>
  <div></div>
</template>

<script>

import {validateInt} from '@/js/rules/ruleUtils'

export default {
  name: 'RuleValidation',
  methods: {
    /**
     * 组件共用验证表单项必须是不小于0的整数
     * @param msg
     * @param requried
     * @returns {{pattern: RegExp, trigger: string, message: *, required: boolean}}
     */
    validateInt(msg, requried){
      return validateInt(msg, requried)
    }
  }
}
</script>
