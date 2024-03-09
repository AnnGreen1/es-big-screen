<template>
	<div ref="chartRef" className='es-chart'></div>
</template>

<script setup lang='ts'>
import { onMounted, PropType, shallowRef, watch } from 'vue'
import * as echarts from 'echarts'
import { ECharts, EChartsCoreOption } from 'echarts'

const props = defineProps({
	option: {
		/**
		 * @author: AnnGreen1
		 * PropType 参考 Vue 官网：https://cn.vuejs.org/api/utility-types.html#proptype-t
		 * 这个 EChartsCoreOption 可以在 node_modules 中找到，但是很难在未知的情况下准确写出。
		 */
		type: Object as PropType<EChartsCoreOption>,
		required: true,
		default: () => ({})
	},
	loading: Boolean
})
/**
 * @author: AnnGreen1
 * shallowRef 标注类型参考：https://cn.vuejs.org/api/reactivity-advanced.html#shallowref
 * 这不是断言的语法，而是泛型的语法，泛型为联合类型（也就是说 chartRef.value 只能是 HTMLElement 类型或 null 类型），只要把 shallowRef 看做一个函数理解即可。
 */
const chartRef = shallowRef<HTMLElement | null>(null)

const chart = shallowRef<ECharts | null>(null)
function init() {
	if (props.option) {
		chart.value = echarts.init(chartRef.value!)
		setOption(props.option)
	}
}
/**
 * @author: AnnGreen1
 * 这是为函数参数标注类型
 * option 没有标注类型，缺省为 any 类型
 * notMerge、lazyUpdate 标注为 boolean 类型，? 代表这是一个可选参数
 */
function setOption(option, notMerge?: boolean, lazyUpdate?: boolean) {
	/**
	 * @author: AnnGreen1
	 * ?. 这是非空断言，告诉编译器 chart.value 不可能是 null 或 undefined 类型
	 */
	chart.value!.setOption(option, notMerge, lazyUpdate)
}

function resize() {
	chart.value!.resize()
}

watch(() => props.option, () => {
	setOption(props.option)
})

// show loading
watch(() => props.loading, (val) => {
	if (!chart.value) return
	if (val) {
		chart.value!.showLoading()
	} else {
		chart.value!.hideLoading()
	}
})

onMounted(() => {
	init()
})

defineExpose({
	chart,
	setOption,
	resize
})
</script>

<style lang='scss' scoped>
.es-chart {
	width: 100%;
	height: 100%;
}
</style>

