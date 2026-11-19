import { initHeroViscousLiquid } from './heroViscousLiquid.js';

export function initHero3DScene(containerId, fallbackFn) {
    const safeFallback = typeof fallbackFn === 'function'
        ? () => fallbackFn(containerId)
        : undefined;

    return initHeroViscousLiquid(containerId, safeFallback);
}
