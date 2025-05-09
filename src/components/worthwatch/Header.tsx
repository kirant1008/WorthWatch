import { Icon } from '@/components/icons';

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center">
        <Icon name="PieChart" className="h-8 w-8 mr-3" />
        <h1 className="text-2xl md:text-3xl font-bold">WorthWatch</h1>
      </div>
    </header>
  );
}
