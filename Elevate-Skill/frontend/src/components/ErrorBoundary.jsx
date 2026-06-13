import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center px-6">
          <div className="max-w-md w-full bg-white/5 border border-white/10 p-8 text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-black text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-white/60 text-sm mb-6">
              Don't worry, your data is safe. Try refreshing the page.
            </p>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#f89f29] to-[#fb7d15] text-white font-bold text-sm uppercase tracking-wider hover:brightness-110 transition-all"
            >
              <RefreshCw size={16} />
              Refresh Page
            </button>
            {this.props.showDetails && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-xs text-white/40 cursor-pointer hover:text-white/60">
                  Technical Details
                </summary>
                <pre className="mt-2 text-xs text-red-400 bg-black/30 p-3 rounded overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
