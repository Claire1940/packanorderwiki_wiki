import {
	BookOpen,
	Ticket,
	ClipboardList,
	Package,
	TrendingUp,
	Zap,
	Gamepad2,
	type LucideIcon,
} from 'lucide-react'

export interface NavigationItem {
	key: string // 用于翻译键，如 'codes' -> t('nav.codes')
	path: string // URL 路径，如 '/codes'
	icon: LucideIcon // Lucide 图标组件
	isContentType: boolean // 是否对应 content/ 目录
}

// Pack an Order 导航分类（与 content/<locale>/ 目录名一一对应）
// 顺序参考 00基础信息.md 导航栏优先级：Guides｜Codes｜Orders｜Items｜Upgrades｜Abilities｜Controls
export const NAVIGATION_CONFIG: NavigationItem[] = [
	{ key: 'guides', path: '/guides', icon: BookOpen, isContentType: true },
	{ key: 'codes', path: '/codes', icon: Ticket, isContentType: true },
	{ key: 'orders', path: '/orders', icon: ClipboardList, isContentType: true },
	{ key: 'items', path: '/items', icon: Package, isContentType: true },
	{ key: 'upgrades', path: '/upgrades', icon: TrendingUp, isContentType: true },
	{ key: 'abilities', path: '/abilities', icon: Zap, isContentType: true },
	{ key: 'controls', path: '/controls', icon: Gamepad2, isContentType: true },
]

// 从配置派生内容类型列表（用于路由和内容加载）
export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map(
	(item) => item.path.slice(1),
) // 移除开头的 '/' -> ['guides', 'codes', 'orders', 'items', 'upgrades', 'abilities', 'controls']

export type ContentType = (typeof CONTENT_TYPES)[number]

// 辅助函数：验证内容类型
export function isValidContentType(type: string): type is ContentType {
	return CONTENT_TYPES.includes(type as ContentType)
}
