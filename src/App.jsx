import './App.css'
import SearchForm from './components/SearchForm'
import BrandList from './components/BrandList'
import OffersTable from './components/OffersTable'

function App() {
  return (
    <div className="bg-body-tertiary min-vh-100">
      <div className="container py-5">
        <header className="text-center mb-4">
          <h1 className="h2 fw-bold mb-1">Поиск автозапчастей</h1>
          <p className="text-secondary mb-0">
            Введите артикул, выберите производителя и сравните предложения
          </p>
        </header>

        <div className="row justify-content-center mb-5">
          <div className="col-lg-7">
            <SearchForm />
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-4">
            <BrandList />
          </div>
          <div className="col-lg-8">
            <OffersTable />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App