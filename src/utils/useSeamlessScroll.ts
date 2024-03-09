import { onMounted, shallowRef, Ref, onUpdated, onBeforeUpdate, watch, nextTick } from 'vue'
import anime from 'animejs/lib/anime.es.js'

export type OptionsType = {
	direction?: 'horizontal' | 'vertical'
	gap?: number
	duration?: number
}

export function useSeamlessScroll(listRef: Ref<HTMLElement | null>, options: OptionsType = {}) {
	/**
	 * @author: AnnGreen1
	 * 在这段代码中，`const animation = shallowRef<ReturnType<typeof anime>>(null)` 的含义如下：
		- `typeof anime`: 这部分代码获取了 `anime` 这个模块的类型。`typeof` 操作符用于获取一个值的类型，这里获取了 `anime` 这个模块的类型。
		- `ReturnType<typeof anime>`: `ReturnType` 是一个 TypeScript 工具类型，用于获取函数的返回类型。在这里，`ReturnType<typeof anime>` 表示获取 `anime` 模块的类型，即 `anime` 模块的返回类型。
		- `shallowRef<ReturnType<typeof anime>>(null)`: 这里使用了 Vue 3 中的 `shallowRef` 函数来创建一个响应式的引用。`shallowRef` 接受一个初始值作为参数，并返回一个包含这个初始值的响应式引用。在这里，`shallowRef<ReturnType<typeof anime>>(null)` 表示创建了一个响应式引用，其值的类型为 `ReturnType<typeof anime>`，初始值为 `null`。

		综合起来，这行代码的作用是创建了一个响应式引用 `animation`，其值的类型为 `anime` 模块的返回类型，初始值为 `null`。这样在后续的代码中，可以将 `anime` 模块的返回值赋给 `animation.value`，并且通过 Vue 3 的响应式系统来跟踪这个值的变化。
	 */
	const animation = shallowRef<ReturnType<typeof anime>>(null)
	const transList: any = []

	function init() {
		const {
			direction = 'horizontal',
			gap = 10,
			duration = 10000
		} = options
		const isHorizontal = direction === 'horizontal'

		const translateKey = isHorizontal ? 'translateX' : 'translateY'

		const transKey = isHorizontal ? 'x' : 'y'

		// items
		const children = listRef.value?.children || []
		if (!children.length) return

		// 第一个元素
		const firstEl =  children[0] as HTMLElement
		const firstDiff = (isHorizontal ? firstEl.offsetWidth : firstEl.offsetHeight ) + gap

		// 默认将list元素向左或向上移动一个item的距离
		listRef.value!.style.transform = `${translateKey}(-${firstDiff}px)`


		let total = 0 // 总宽/高
		// 设置初始位置
		anime.set(children, {
			[translateKey]: (el: HTMLElement, i) => {
				const distance = (isHorizontal ? el.offsetWidth : el.offsetHeight ) + gap
				total += distance
				transList[i] = { [transKey]: total - distance }
			}
		})
		// 设置list容器的宽或高
		listRef.value!.style[isHorizontal ? 'width' : 'height'] = total + 'px'

		// 添加动画
		animation.value = anime({
			targets: transList,
			duration,
			easing: 'linear',
			direction: isHorizontal ? undefined : 'reverse',
			[transKey]: `+=${total}`,
			loop: true,
			update: () => {
				anime.set(children, {
					[translateKey]: (el, i) => {
						return transList[i][transKey] % total
					}
				})
			}
		})
	}

	watch(() => options, () => {
		// 移除上一次的
		animation.value.remove(transList)
		nextTick(() => {
			// 重新初始化
			init()
		})
	}, { deep: true })

	onBeforeUpdate(() => {
		// 移除上一次的
		animation.value.remove(transList)
	})
	onUpdated(() => {
		// 重新初始化
		init()
	})
	// 暂停
	function pause() {
		animation.value!.pause()
	}
	// 停止
	function play() {
		animation.value!.play()
	}

	onMounted(() => {
		init()
	})

	return {
		listRef,
		pause,
		play,
		animation
	}
}


