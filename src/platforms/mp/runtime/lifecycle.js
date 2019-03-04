/* @flow */

const LIFECYCLE_HOOKS = [
    //App
    'onLaunch',
    'onShow',
    'onHide',
    'onUniNViewMessage',
    //Page
    'onLoad',
    // 'onShow',
    'onReady',
    // 'onHide',
    'onUnload',
    'onPullDownRefresh',
    'onReachBottom',
    'onTabItemTap',
    'onShareAppMessage',
    'onPageScroll',
    'onNavigationBarButtonTap',
    'onBackPress',
    'onNavigationBarSearchInputChanged',
    'onNavigationBarSearchInputConfirmed',
    'onNavigationBarSearchInputClicked',
    //Component
    'onPageShow',
    'onPageHide',
    'onPageResize'
]
export function lifecycleMixin(Vue: Class<Component>) {
    const strategies = Vue.config.optionMergeStrategies
    const mergeHook = strategies.created
    LIFECYCLE_HOOKS.forEach(hook => {
        strategies[hook] = mergeHook
    })
}
