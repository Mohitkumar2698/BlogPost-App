import React from "react";
import Button from "./ui/button";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("UI runtime exception:", error);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-100 px-4 py-10 dark:bg-slate-950">
          <div className="mx-auto max-w-xl rounded-xl border border-red-200 bg-white p-6 shadow-sm dark:border-red-900/60 dark:bg-slate-900">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Something broke in the UI</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              The page hit an unexpected exception. Reload to recover.
            </p>
            <Button className="mt-4" onClick={this.handleReload}>
              Reload app
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
