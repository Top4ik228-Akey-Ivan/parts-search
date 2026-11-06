const API_URL = 'https://api.favorit-parts.ru/hs/hsprice/'
const API_KEY = import.meta.env.VITE_API_KEY

// Человекочитаемые тексты для ошибок API из документации
const API_ERRORS = {
  'Empty key!': 'Не указан ключ покупателя',
  'Invalid key client!': 'Неверный ключ покупателя',
  'Empty number goods!': 'Не указан номер детали',
  'Request quota exceeded!': 'Превышен лимит запросов, попробуйте позже',
}

// Если деталь не найдена, API возвращает массив с одной пустой структурой
const isRealItem = (item) => Boolean(item && (item.goodsID || item.brand || item.number))

async function request(params, signal) {
  const query = new URLSearchParams({ key: API_KEY, ...params })

  let response
  try {
    response = await fetch(`${API_URL}?${query}`, { signal })
  } catch (err) {
    if (err.name === 'AbortError') throw err
    throw new Error('Не удалось связаться с сервером. Проверьте подключение к сети.')
  }

  if (!response.ok) {
    throw new Error(`Ошибка сервера: ${response.status}`)
  }

  let data
  try {
    data = await response.json()
  } catch {
    throw new Error('Сервер вернул некорректный ответ')
  }

  if (data.error) {
    const messages = [].concat(data.error).map((e) => API_ERRORS[String(e).trim()] || e)
    throw new Error(messages.join('; '))
  }

  return (data.goods || []).filter(isRealItem)
}

function getPrice(warehouses = []) {
  const inStock = warehouses.filter((w) => w.stock > 0)
  const list = inStock.length ? inStock : warehouses
  if (!list.length) return null
  return Math.min(...list.map((w) => w.price))
}

function normalizeOffer(item, isAnalogue) {
  return {
    id: item.goodsID,
    brand: item.brand,
    number: item.number,
    name: item.name,
    price: getPrice(item.warehouses),
    stock: item.count ?? 0,
    isAnalogue,
  }
}

export async function getBrands(number, signal) {
  const goods = await request({ number: number.trim() }, signal)

  const unique = new Map()
  goods.forEach((item) => {
    if (item.brand && !unique.has(item.brand)) {
      unique.set(item.brand, { brand: item.brand, name: item.name })
    }
  })
  return [...unique.values()]
}


export async function getOffers(number, brand, signal) {
  const goods = await request({ number: number.trim(), brand, analogues: 'on' }, signal)

  return goods.flatMap((item) => [
    normalizeOffer(item, false),
    ...(item.analogues || []).filter(isRealItem).map((a) => normalizeOffer(a, true)),
  ])
}