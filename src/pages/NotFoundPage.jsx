import { Link } from 'react-router-dom';
import EmptyState from '../components/ui/EmptyState';

export default function NotFoundPage() {
  return (
    <EmptyState
      icon="🔍"
      title="Page Not Found"
      description="The page you're looking for doesn't exist."
      action={
        <Link
          to="/dashboard"
          className="px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors inline-block"
        >
          Go to Dashboard
        </Link>
      }
    />
  );
}
