import { MdFoodBank, MdSearch, MdSaveAlt } from "react-icons/md";

export function Features() {
  return (
    <div className="py-16 bg-purple-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-purple-900 mb-12">
          Why Use Chilioil?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<MdFoodBank className="w-10 h-10 text-purple-600" />}
            title="Store Recipes"
            description="Keep all your favorite recipes in one place, organized and easy to find."
          />
          
          <FeatureCard 
            icon={<MdSearch className="w-10 h-10 text-purple-600" />}
            title="Search Easily"
            description="Quickly find the perfect recipe with powerful search and filtering."
          />
          
          <FeatureCard 
            icon={<MdSaveAlt className="w-10 h-10 text-purple-600" />}
            title="Share Effortlessly"
            description="Share your culinary creations with friends and family with one click."
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-purple-800">{title}</h3>
      <p className="text-purple-700">{description}</p>
    </div>
  );
} 