/**
 *Функция для задержки. Используем если например нужно выполнить проверку на срок жизни токена
 */
export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


