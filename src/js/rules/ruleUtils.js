/**
 * 验证表单项必须是不小于0的整数
 *
 * @param tips
 */
export function validateInt(tips, requried) {
  return {pattern: /^[0-9]*$/, message: tips, required: requried === true, trigger: 'blur'}
}
