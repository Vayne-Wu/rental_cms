// 防抖
export function debounce(fn, wait) {
  let timeout = null
  return function() {
    const context = this
    const args = arguments
    if (timeout !== null) clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn.apply(context, args)
    }, wait)
  }
}
// 节流
export function throttle(fn, wait) {
  let timeout = null
  return function() {
    const context = this
    const args = arguments
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null
        fn.apply(context, args)
      }, wait)
    }
  }
}
