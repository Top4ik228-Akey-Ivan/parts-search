import { useSelector } from 'react-redux'
import { selectOffers, selectSelectedBrand } from '../store/partsSlice'
import Loader from './Loader'
import ErrorAlert from './ErrorAlert'

const formatPrice = (price) =>
  `${price.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₽`

function OffersTable() {
  const brand = useSelector(selectSelectedBrand)
  const { items, status, error } = useSelector(selectOffers)

  if (status === 'idle') return null

  let body
  if (status === 'loading') {
    body = <Loader text="Загружаем предложения..." />
  } else if (status === 'failed') {
    body = <ErrorAlert message={error} />
  } else if (items.length === 0) {
    body = <p className="text-center text-secondary my-3">Для бренда «{brand}» предложений не найдено</p>
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white fw-semibold py-3">
        Предложения: {brand}
        {status === 'succeeded' && (
          <span className="text-secondary fw-normal"> · {items.length}</span>
        )}
      </div>

      {body ? (
        <div className="card-body">{body}</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-3">Название / Производитель</th>
                <th className="text-end">Цена</th>
                <th className="text-end pe-3">Остаток</th>
              </tr>
            </thead>
            <tbody>
              {items.map((offer, index) => (
                <tr key={`${offer.id}-${index}`}>
                  <td className="ps-3 py-3">
                    <div>
                      {offer.name}
                      {offer.isAnalogue && (
                        <span className="badge rounded-pill text-bg-info ms-2">Аналог</span>
                      )}
                    </div>
                    <small className="text-secondary">
                      {offer.brand} · {offer.number}
                    </small>
                  </td>
                  <td className="text-end text-nowrap">
                    {offer.price === null ? (
                      <span className="text-secondary">нет в наличии</span>
                    ) : (
                      <span className="fw-semibold">{formatPrice(offer.price)}</span>
                    )}
                  </td>
                  <td className="text-end pe-3">
                    <span
                      className={`badge rounded-pill ${
                        offer.stock > 0 ? 'text-bg-success' : 'text-bg-secondary'
                      }`}
                    >
                      {offer.stock}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default OffersTable