import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
          <div className="w-24 h-24 bg-red-100 rounded-[40px] flex items-center justify-center mb-8">
             <span className="text-5xl">😕</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Something went wrong</h1>
          <p className="text-gray-500 max-w-sm mb-8 font-medium">
             An unexpected error occurred in our neural core. 
             Please try refreshing the page or contact support if the issue persists.
          </p>
          <button 
            onClick={this.handleRefresh}
            className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition transform hover:-translate-y-1 active:scale-95"
          >
            Refresh Dashboard
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
