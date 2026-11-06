function Loader({ text = 'Загрузка...' }) {
  return (
    <div className="d-flex justify-content-center align-items-center gap-2 text-secondary py-4">
      <div className="spinner-border spinner-border-sm text-primary" role="status" />
      <span>{text}</span>
    </div>
  )
}

export default Loader