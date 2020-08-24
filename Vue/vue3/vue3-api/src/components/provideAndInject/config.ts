import { InjectionKey, Ref } from 'vue'

export const injectRef: InjectionKey<Ref<string>> = Symbol('injectRef')
export const injectBase: InjectionKey<string> = Symbol('injectBase')
