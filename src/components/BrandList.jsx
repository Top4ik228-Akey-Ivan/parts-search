import { useDispatch, useSelector } from 'react-redux'
import {
  fetchOffers,
  selectBrands,
  selectNumber,
  selectSelectedBrand,
} from '../store/partsSlice'
import Loader from './Loader'
import ErrorAlert from './ErrorAlert'

function BrandList() {
  const dispatch = useDispatch()
  const number = useSelector(selectNumber)
  const selectedBrand = useSelector(selectSelectedBrand)
  const { items, status, error } = useSelector(selectBrands)

  if (status === 'idle') return null

  let body
  if (status === 'loading') {
    body = <Loader text="Ищем производителей..." />
  } else if (status === 'failed') {
    body = <ErrorAlert message={error} />
  } else if (items.length === 0) {
    body = <p className="text-center text-secondary my-3">По артикулу «{number}» ничего не найдено</p>
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white fw-semibold py-3">
        Производители <span className="text-secondary fw-normal">для «{number}»</span>
      </div>

      {body ? (
        <div className="card-body">{body}</div>
      ) : (
        <div className="list-group list-group-flush">
          {items.map(({ brand, name }) => (
            <button
              key={brand}
              type="button"
              className={`list-group-item list-group-item-action py-3 ${
                brand === selectedBrand ? 'active' : ''
              }`}
              onClick={() => dispatch(fetchOffers({ number, brand }))}
            >
              <div className="fw-semibold">{brand}</div>
              <small className={brand === selectedBrand ? '' : 'text-secondary'}>{name}</small>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default BrandList