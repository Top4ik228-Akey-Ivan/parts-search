import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getBrands, getOffers } from '../api/parts'

// производители по артикулу
export const fetchBrands = createAsyncThunk('parts/fetchBrands', (number, { signal }) =>
  getBrands(number, signal),
)

// деталь и аналоги по артикулу и бренду
export const fetchOffers = createAsyncThunk('parts/fetchOffers', ({ number, brand }, { signal }) =>
  getOffers(number, brand, signal),
)

const createList = () => ({ items: [], status: 'idle', error: null, requestId: null })

const initialState = {
  number: '',
  selectedBrand: null,
  brands: createList(),
  offers: createList(),
}

const partsSlice = createSlice({
  name: 'parts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state, action) => {
        state.number = action.meta.arg.trim()
        state.selectedBrand = null
        state.brands = { ...createList(), status: 'loading', requestId: action.meta.requestId }
        state.offers = createList() // новый поиск сбрасывает этап 2
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        if (state.brands.requestId !== action.meta.requestId) return // устаревший ответ
        state.brands.status = 'succeeded'
        state.brands.items = action.payload
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        if (state.brands.requestId !== action.meta.requestId) return
        state.brands.status = 'failed'
        state.brands.error = action.error.message
      })

      .addCase(fetchOffers.pending, (state, action) => {
        state.selectedBrand = action.meta.arg.brand
        state.offers = { ...createList(), status: 'loading', requestId: action.meta.requestId }
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        if (state.offers.requestId !== action.meta.requestId) return
        state.offers.status = 'succeeded'
        state.offers.items = action.payload
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        if (state.offers.requestId !== action.meta.requestId) return
        state.offers.status = 'failed'
        state.offers.error = action.error.message
      })
  },
})

export const selectNumber = (state) => state.parts.number
export const selectSelectedBrand = (state) => state.parts.selectedBrand
export const selectBrands = (state) => state.parts.brands
export const selectOffers = (state) => state.parts.offers

export default partsSlice.reducer