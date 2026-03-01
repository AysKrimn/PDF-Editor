import { Nav } from '../components/Nav';

interface ToolbarProps {
  onGoHome: () => void;
}

// migh destroy this component and tell other services to call nav directly
export function Toolbar({ onGoHome }: ToolbarProps) {

  return (
    <Nav onGoHome={onGoHome} />
  );
}
