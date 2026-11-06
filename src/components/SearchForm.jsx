import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBrands, selectBrands } from '../store/partsSlice'

function SearchForm() {
  const dispatch = useDispatch()
  const { status } = useSelector(selectBrands)
  const [value, setValue] = useState('')

  const isLoading = status === 'loading'
  const number = value.trim()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (number) dispatch(fetchBrands(number))
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="search input-group input-group-lg flex-nowrap rounded-pill border bg-white shadow-sm"
    >
      <input
        type="text"
        className="form-control border-0 shadow-none rounded-start-pill ps-4"
        placeholder="Артикул, например 01089"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        type="submit"
        className="btn btn-primary rounded-end-pill px-4"
        disabled={!number || isLoading}
      >
        Найти
      </button>
    </form>
  )
}

export default SearchForm