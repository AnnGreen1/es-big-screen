import { defineStore } from 'pinia'

interface ScreenState {
	title: string,
	theme: 'dark' | 'light'
}

export const useScreenStore = defineStore({
	id: 'screen',
	/**
	 * @author: AnnGreen1
	 * 标注返回值类型
	 */
	state: (): ScreenState => {
		return {
			title: '大屏可视化',
			theme: 'dark'
		}
	}
})
