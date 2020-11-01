export const enum trackKey {
    'filterItemChange' = 'filterItemChange',
    'clearFilterItem' = 'clearFilterItem'
}

type triggerEffectData = {
    [trackKey.filterItemChange]: [{
        id: string;
        text: string;
        value: any;
    }];
    [trackKey.clearFilterItem]: [string];
}

type trackEffectParams = {
    [trackKey.filterItemChange]: {
        (...args: triggerEffectData[trackKey.filterItemChange]): void;
    };
    [trackKey.clearFilterItem]: {
        (...args: triggerEffectData[trackKey.clearFilterItem]): void;
    };
}

type effects = Set<Function>
type effectIds = Map<string, effects>
const effectMap = new Map<trackKey, effectIds>()

export function track <T extends trackKey> (key: T, id: string, effect: trackEffectParams[T]) {
  const effectIds = effectMap.get(key) || new Map() as effectIds
  const effects = effectIds.get(id) || new Set() as effects

  effects.add(effect)

  effectIds.set(id, effects)
  effectMap.set(key, effectIds)
}

export function trigger <T extends trackKey> (key: T, id: string, ...data: triggerEffectData[T]) {
  const effectIds = effectMap.get(key)
  if (!effectIds) return

  const effects = effectIds.get(id)
  if (!effects) return

  effects.forEach(a => a(...data))
}

export function abort (key: trackKey, id: string) {
  const effectIds = effectMap.get(key)
  if (!effectIds) return

  effectIds.delete(id)
}
