import ru from '../ru.json'

export type Translations = typeof ru

export function useTranslation() {
  return { t: ru }
}

export { ru as t }
