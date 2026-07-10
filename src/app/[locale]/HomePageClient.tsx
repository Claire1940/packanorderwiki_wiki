"use client";

import { useState, Suspense, lazy } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Backpack,
  BookOpen,
  Check,
  ChevronDown,
  ClipboardCheck,
  ClipboardList,
  Coins,
  ExternalLink,
  Keyboard,
  Layers,
  ListChecks,
  Move,
  ReceiptText,
  ScanSearch,
  Sparkles,
  Star,
  Tag,
  TrendingUp,
  Truck,
  Trophy,
  User,
  Users,
  UsersRound,
  Wand2,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  locale: string;
}

// Tools Grid navigation cards map to these section anchors (order matches en.json tools.cards)
const TOOL_SECTION_IDS = [
  "codes",
  "beginner-guide",
  "best-upgrades",
  "controls",
  "abilities-guide",
  "orders-and-items",
  "coins-and-leveling",
  "coop-leaderboard",
];

// Distinct lucide-react icons per card position for data-driven content modules.
// Icons live in the component layer (not the data file) so en.json stays pure copy,
// while every card still gets a unique icon — no duplicates within a module.
// Module 5 (Abilities): Speed, Carry Capacity, Reach, Unlockable Abilities
const ABILITY_ICONS = [Zap, Backpack, Move, Wand2];
// Module 6 (Orders accordion): ticket, match, inspect, carry, load
const ORDER_ICONS = [ReceiptText, ListChecks, ScanSearch, Layers, Truck];
// Module 8 (Co-op): Solo, Two-Player, Three-Player, Multi-Order, Leaderboard
const COOP_ICONS = [User, Users, UsersRound, ClipboardList, Trophy];

export default function HomePageClient({
  latestArticles,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.packanorderwiki.wiki";
  const ROBLOX_URL =
    "https://www.roblox.com/games/133880823575739/Pack-an-Order";
  const YOUTUBE_URL = "https://www.youtube.com/watch?v=lqozi7Nuilg";

  // Accordion state for Orders and Items module
  const [ordersExpanded, setOrdersExpanded] = useState<number | null>(0);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Pack an Order Wiki",
        description:
          "Complete Pack an Order Wiki covering guides, orders, items, upgrades, abilities, controls, and codes for the fast-paced co-op warehouse game on Roblox.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 500,
          height: 279,
          caption: "Pack an Order - Roblox Co-op Warehouse Game",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Pack an Order Wiki",
        alternateName: "Pack an Order",
        url: siteUrl,
        description:
          "Complete Pack an Order Wiki resource hub for Roblox guides, orders, items, upgrades, abilities, controls, and codes",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 500,
          height: 279,
          caption: "Pack an Order Wiki - Roblox Co-op Warehouse Game",
        },
        sameAs: [ROBLOX_URL, "https://www.roblox.com/charts", YOUTUBE_URL],
      },
      {
        "@type": "VideoGame",
        name: "Pack an Order",
        gamePlatform: ["Roblox"],
        applicationCategory: "Game",
        genre: ["Co-op", "Simulation", "Casual", "Time Management"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 4,
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: ROBLOX_URL,
        },
      },
      {
        "@type": "VideoObject",
        name: "Roblox | Pack an Order Gameplay | No Commentary",
        description:
          "Pack an Order Roblox gameplay video showing toy collecting, order matching, packing boxes and loading delivery trucks.",
        uploadDate: "2026-07-10",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/lqozi7Nuilg",
        url: YOUTUBE_URL,
      },
    ],
  };

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* ===== Hero Section ===== */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                          bg-[hsl(var(--nav-theme)/0.1)]
                          border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("codes")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <Tag className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href={ROBLOX_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnRobloxCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* ===== Video Section - 紧跟 Hero，展示 Pack an Order 实机玩法 ===== */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="lqozi7Nuilg"
              title="Roblox | Pack an Order Gameplay | No Commentary"
            />
          </div>
        </div>
      </section>

      {/* ===== Tools Grid - 8 Navigation Cards ===== */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = TOOL_SECTION_IDS[index];
              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                bg-[hsl(var(--nav-theme)/0.1)]
                                flex items-center justify-center
                                group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Latest Updates Section（模板保留模块，禁止删除）===== */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* ===== Module 1: Pack an Order Codes (code-cards) ===== */}
      <section id="codes" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium uppercase tracking-wider">
                {t.modules.packanOrderCodes.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.packanOrderCodes.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.packanOrderCodes.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.packanOrderCodes.items.map((item: any, index: number) => (
              <div
                key={index}
                className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors flex flex-col"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] font-medium">
                    {item.status}
                  </span>
                  <Tag className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                </div>
                <h3 className="font-bold text-base md:text-lg mb-2">
                  {item.label}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 flex-1">
                  {item.description}
                </p>
                <p className="text-xs text-[hsl(var(--nav-theme-light))] font-semibold uppercase tracking-wider">
                  {item.reward}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Module 2: Pack an Order Beginner Guide (step-by-step) ===== */}
      <section
        id="beginner-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
              <BookOpen className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium uppercase tracking-wider">
                {t.modules.packanOrderBeginnerGuide.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.packanOrderBeginnerGuide.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.packanOrderBeginnerGuide.intro}
            </p>
          </div>

          {/* Steps timeline */}
          <div className="scroll-reveal space-y-3 md:space-y-4 mb-8 md:mb-10">
            {t.modules.packanOrderBeginnerGuide.steps.map(
              (step: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>

          {/* Quick Tips */}
          <div className="scroll-reveal p-4 md:p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <Check className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-base md:text-lg">Quick Tips</h3>
            </div>
            <ul className="space-y-2">
              {t.modules.packanOrderBeginnerGuide.quickTips.map(
                (tip: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground text-sm">{tip}</span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* 广告位 4: 前两模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* ===== Module 3: Best Upgrades in Pack an Order (comparison-table) ===== */}
      <section id="best-upgrades" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
              <TrendingUp className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium uppercase tracking-wider">
                {t.modules.packanOrderBestUpgrades.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.packanOrderBestUpgrades.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.packanOrderBestUpgrades.intro}
            </p>
          </div>

          {/* Desktop comparison table */}
          <div className="scroll-reveal hidden md:block overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-[hsl(var(--nav-theme)/0.1)]">
                <tr className="text-left">
                  <th className="p-4 font-semibold">Upgrade</th>
                  <th className="p-4 font-semibold">Effect</th>
                  <th className="p-4 font-semibold">Best For</th>
                  <th className="p-4 font-semibold text-center">Solo</th>
                  <th className="p-4 font-semibold text-center">Team</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.packanOrderBestUpgrades.items.map(
                  (item: any, index: number) => (
                    <tr
                      key={index}
                      className="border-t border-border align-top hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4 font-bold text-[hsl(var(--nav-theme-light))]">
                        {item.upgrade}
                      </td>
                      <td className="p-4 text-muted-foreground">{item.effect}</td>
                      <td className="p-4 text-muted-foreground">{item.bestFor}</td>
                      <td className="p-4 text-center font-semibold">
                        {item.soloPriority}
                      </td>
                      <td className="p-4 text-center font-semibold">
                        {item.teamPriority}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked cards */}
          <div className="scroll-reveal md:hidden space-y-4">
            {t.modules.packanOrderBestUpgrades.items.map(
              (item: any, index: number) => (
                <div
                  key={index}
                  className="p-5 bg-white/5 border border-border rounded-xl"
                >
                  <h3 className="font-bold text-lg mb-2 text-[hsl(var(--nav-theme-light))]">
                    {item.upgrade}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {item.effect}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                      Solo {item.soloPriority}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                      Team {item.teamPriority}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      Recommendation:{" "}
                    </span>
                    {item.recommendation}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ===== Module 4: Pack an Order Controls (table) ===== */}
      <section
        id="controls"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
              <Keyboard className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium uppercase tracking-wider">
                {t.modules.packanOrderControls.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.packanOrderControls.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.packanOrderControls.intro}
            </p>
          </div>

          {/* Desktop controls table */}
          <div className="scroll-reveal hidden md:block overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-[hsl(var(--nav-theme)/0.1)]">
                <tr className="text-left">
                  <th className="p-4 font-semibold">Input</th>
                  <th className="p-4 font-semibold">Action</th>
                  <th className="p-4 font-semibold">Device</th>
                  <th className="p-4 font-semibold">Tip</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.packanOrderControls.items.map(
                  (item: any, index: number) => (
                    <tr
                      key={index}
                      className="border-t border-border align-top hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4">
                        <span className="inline-block px-2.5 py-1 rounded-md bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.3)] font-mono font-semibold text-[hsl(var(--nav-theme-light))]">
                          {item.input}
                        </span>
                      </td>
                      <td className="p-4 font-semibold">{item.action}</td>
                      <td className="p-4 text-muted-foreground">{item.device}</td>
                      <td className="p-4 text-muted-foreground">{item.tip}</td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked control cards */}
          <div className="scroll-reveal md:hidden space-y-3">
            {t.modules.packanOrderControls.items.map(
              (item: any, index: number) => (
                <div
                  key={index}
                  className="p-5 bg-white/5 border border-border rounded-xl"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-block px-2.5 py-1 rounded-md bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.3)] font-mono font-semibold text-[hsl(var(--nav-theme-light))]">
                      {item.input}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                      {item.device}
                    </span>
                  </div>
                  <h3 className="font-bold mb-1">{item.action}</h3>
                  <p className="text-sm text-muted-foreground">{item.tip}</p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* ===== Module 5: Pack an Order Abilities and Upgrades (card-list) ===== */}
      <section id="abilities-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
              <Star className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium uppercase tracking-wider">
                {t.modules.packanOrderAbilitiesGuide.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.packanOrderAbilitiesGuide.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.packanOrderAbilitiesGuide.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.packanOrderAbilitiesGuide.items.map(
              (item: any, index: number) => {
                const Icon = ABILITY_ICONS[index];
                return (
                  <div
                    key={index}
                    className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3 gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.3)]">
                          <Icon className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                        </span>
                        <h3 className="font-bold text-lg text-[hsl(var(--nav-theme-light))]">
                          {item.name}
                        </h3>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] whitespace-nowrap">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {item.effect}
                    </p>
                    <dl className="space-y-1.5 text-sm">
                      <div className="flex gap-2">
                        <dt className="font-semibold flex-shrink-0">Best for:</dt>
                        <dd className="text-muted-foreground">{item.bestFor}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="font-semibold flex-shrink-0">Timing:</dt>
                        <dd className="text-muted-foreground">
                          {item.recommendedTiming}
                        </dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="font-semibold flex-shrink-0">Tip:</dt>
                        <dd className="text-muted-foreground">{item.usageTip}</dd>
                      </div>
                    </dl>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* ===== Module 6: Pack an Order Orders and Items Guide (accordion) ===== */}
      <section
        id="orders-and-items"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
              <ClipboardCheck className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium uppercase tracking-wider">
                {t.modules.packanOrderOrdersAndItems.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.packanOrderOrdersAndItems.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.packanOrderOrdersAndItems.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-3">
            {t.modules.packanOrderOrdersAndItems.items.map(
              (item: any, index: number) => {
                const Icon = ORDER_ICONS[index];
                return (
                <div
                  key={index}
                  className="border border-border rounded-xl overflow-hidden bg-white/5"
                >
                  <button
                    onClick={() =>
                      setOrdersExpanded(ordersExpanded === index ? null : index)
                    }
                    className="w-full flex items-center justify-between gap-3 p-5 text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.3)]">
                        <Icon className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                      </span>
                      <span className="font-semibold text-base md:text-lg">
                        {item.heading}
                      </span>
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 text-[hsl(var(--nav-theme-light))] transition-transform ${ordersExpanded === index ? "rotate-180" : ""}`}
                    />
                  </button>
                  {ordersExpanded === index && (
                    <div className="px-5 pb-5 space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {item.content}
                      </p>
                      {item.controls?.length > 0 && (
                        <ul className="space-y-1.5">
                          {item.controls.map((ctrl: string, ci: number) => (
                            <li
                              key={ci}
                              className="flex items-start gap-2 text-sm"
                            >
                              <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">
                                {ctrl}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {item.example && (
                        <p className="text-sm bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.2)] rounded-lg p-3">
                          <span className="font-semibold">Example: </span>
                          <span className="text-muted-foreground">
                            {item.example}
                          </span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* ===== Module 7: Pack an Order Coins and Leveling Guide (progression-table) ===== */}
      <section
        id="coins-and-leveling"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
              <Coins className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium uppercase tracking-wider">
                {t.modules.packanOrderCoinsAndLeveling.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.packanOrderCoinsAndLeveling.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.packanOrderCoinsAndLeveling.intro}
            </p>
          </div>

          {/* Desktop progression table */}
          <div className="scroll-reveal hidden lg:block overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-[hsl(var(--nav-theme)/0.1)]">
                <tr className="text-left">
                  <th className="p-4 font-semibold">Stage</th>
                  <th className="p-4 font-semibold">Goal</th>
                  <th className="p-4 font-semibold">Actions</th>
                  <th className="p-4 font-semibold">Spend Priority</th>
                  <th className="p-4 font-semibold">Value</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.packanOrderCoinsAndLeveling.items.map(
                  (item: any, index: number) => (
                    <tr
                      key={index}
                      className="border-t border-border align-top hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4 font-bold text-[hsl(var(--nav-theme-light))] whitespace-nowrap">
                        {item.stage}
                      </td>
                      <td className="p-4 font-semibold">{item.goal}</td>
                      <td className="p-4 text-muted-foreground">
                        {item.actions}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {item.spendPriority}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {item.progressionValue}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile / tablet stacked progression cards */}
          <div className="scroll-reveal lg:hidden space-y-4">
            {t.modules.packanOrderCoinsAndLeveling.items.map(
              (item: any, index: number) => (
                <div
                  key={index}
                  className="p-5 bg-white/5 border border-border rounded-xl"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[hsl(var(--nav-theme)/0.2)] border border-[hsl(var(--nav-theme)/0.4)]">
                      <span className="text-sm font-bold text-[hsl(var(--nav-theme-light))]">
                        {index + 1}
                      </span>
                    </div>
                    <h3 className="font-bold text-[hsl(var(--nav-theme-light))]">
                      {item.stage}
                    </h3>
                  </div>
                  <p className="text-sm font-semibold mb-1">{item.goal}</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    {item.actions}
                  </p>
                  <p className="text-sm text-muted-foreground mb-1">
                    <span className="font-semibold text-foreground">
                      Spend:{" "}
                    </span>
                    {item.spendPriority}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Value: </span>
                    {item.progressionValue}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ===== Module 8: Pack an Order Co-op and Leaderboard Strategy (strategy-cards) ===== */}
      <section
        id="coop-leaderboard"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
              <Users className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium uppercase tracking-wider">
                {t.modules.packanOrderCoopAndLeaderboard.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.packanOrderCoopAndLeaderboard.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.packanOrderCoopAndLeaderboard.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.packanOrderCoopAndLeaderboard.items.map(
              (item: any, index: number) => {
                const Icon = COOP_ICONS[index];
                return (
                  <div
                    key={index}
                    className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors flex flex-col"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.3)]">
                        <Icon className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                      </span>
                      <h3 className="font-bold text-lg text-[hsl(var(--nav-theme-light))]">
                        {item.mode}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">
                      {item.setup}
                    </p>
                    <ul className="space-y-1.5 mb-3">
                      {item.roles.map((role: string, ri: number) => (
                        <li key={ri} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{role}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm text-muted-foreground mb-3 flex-1">
                      {item.execution}
                    </p>
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.2)]">
                      <AlertTriangle className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold">Avoid: </span>
                        {item.mistakeToAvoid}
                      </p>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* ===== FAQ Section ===== */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* ===== CTA Section ===== */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* ===== Footer ===== */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href={ROBLOX_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition inline-flex items-center gap-1.5"
                  >
                    {t.footer.robloxGame}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a
                    href={YOUTUBE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition inline-flex items-center gap-1.5"
                  >
                    {t.footer.watchGameplay}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/charts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition inline-flex items-center gap-1.5"
                  >
                    {t.footer.robloxBlog}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
