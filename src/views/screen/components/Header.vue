<template>
	<div class="es-screen-header">
	<h1 class="es-screen-logo">
		<span>ES Big Screen</span>
	</h1>
		<div class="es-screen-header-title">{{ store.title }}</div>
		<div class="es-screen-header-right">
			<img :src="githubIcon" />
			<img class="theme-change" :src="icon" @click="handleChangeTheme">
			<span class="datetime">{{ currentTime }}</span>
		</div>
	</div>
</template>

<script setup lang='ts'>
import { computed, onBeforeUnmount, ref } from 'vue'
import dayjs from 'dayjs'
import { useScreenStore } from '@/store'
/**
 * @author: AnnGreen1
 * 注意这几个 icon 是如何使用的
 * light 模式与 dark 模式是不同的图片
 */
import darkIcon from '@/assets/images/screen/qiehuan_dark.png'
import lightIcon from '@/assets/images/screen/qiehuan_light.png'
import githubIconDark from '@/assets/images/screen/github_dark.svg'
import githubIconLight from '@/assets/images/screen/github_light.svg'
const store = useScreenStore()

const icon = computed(() => store.theme === 'dark' ? darkIcon : lightIcon)
const githubIcon = computed(() => store.theme === 'dark' ? githubIconDark : githubIconLight)

const currentTime = ref('')
const timeId = ref()
function handleChangeTheme() {
	store.$patch({
		/**
		 * @author: AnnGreen1
		 * 能够实现主题切换是通过 @/views/screen/index.vue 组件里样式中CSS自定义属性及类名实现的，添加 light 类名优先级较高，覆盖变量值，又因为主题的 background 依赖此类名，从而实现主题切换
		 */
		theme: store.theme === 'dark' ? 'light' : 'dark'
	})
}

function startTime() {
	timeId.value = setTimeout(() => {
		currentTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
		startTime()
	}, 1000)
}

onBeforeUnmount(() => {
	clearTimeout(timeId.value)
})

startTime()
</script>

<style lang='scss' scoped>
.es-screen-header {
	position: relative;
	width: 100%;
	height: var(--es-header-height);
	background-image: url('@/assets/images/screen/header_border_dark.png');
	background-size: 100% 100%;
	background-repeat: no-repeat;
	animation: fade 3s;
	&-title {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 487px;
		height: var(--es-header-height);
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 30px;
		font-weight: 500;
		letter-spacing: 7px;
		text-shadow: 0px 2px 20px rgba(222,171,155,0.6);
	}
	.es-screen-logo {
		display: flex;
    align-items: center;
		height: calc(var(--es-header-height) - 20px);
	}
	&-right {
		display: flex;
    align-items: center;
    position:absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-80%);
		img {
			width: 30px;
			margin-right: 16px;
			cursor: pointer;
			transition: .3s cubic-bezier(.175,.885,.32,1.275);
			&:hover {
				transform: scale(1.2);
			}
		}
	}
}

@keyframes fade {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}
</style>
