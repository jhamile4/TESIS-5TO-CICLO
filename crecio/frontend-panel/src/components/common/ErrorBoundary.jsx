import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '24px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '12px', margin: '24px' }}>
          <h3 style={{ color: '#991b1b', fontWeight: 800, margin: '0 0 8px' }}>⚠️ Error en el módulo</h3>
          <p style={{ color: '#7f1d1d', fontSize: '13px', margin: 0 }}>
            {this.state.error?.message || 'Ocurrió un error inesperado al cargar esta sección.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{ marginTop: '12px', padding: '6px 14px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}
          >
            Reintentar
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
