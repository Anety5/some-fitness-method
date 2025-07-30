import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, Heart, Package } from 'lucide-react';
import BlowfishAnimation from './BlowfishAnimation';

interface MerchandiseItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: 'sticker' | 'apparel' | 'accessories';
  inStock: boolean;
  rating?: number;
  features: string[];
}

const merchandiseItems: MerchandiseItem[] = [
  {
    id: 'blowfish-logo-sticker',
    name: 'S.O.M.E Blowfish Logo Sticker',
    description: 'Premium vinyl sticker featuring the iconic S.O.M.E fitness method blowfish logo. Weather-resistant and perfect for water bottles, laptops, or any smooth surface.',
    price: 3.99,
    category: 'sticker',
    inStock: true,
    rating: 4.8,
    features: ['Weather Resistant', 'Premium Vinyl', '3" Diameter', 'UV Protected', 'Easy Application']
  },
  {
    id: 'animated-blowfish-sticker',
    name: 'Animated Blowfish Series Sticker Pack',
    description: 'Collection of 5 stickers showing the blowfish animation sequence from calm to fully inflated. Tell the story of your wellness transformation!',
    price: 12.99,
    category: 'sticker',
    inStock: true,
    rating: 4.9,
    features: ['5 Sticker Set', 'Animation Sequence', 'Premium Quality', 'Storytelling Design', 'Collectible Series']
  },
  {
    id: 'some-method-logo-sticker',
    name: 'S.O.M.E Method Logo Sticker',
    description: 'Clean, minimalist sticker featuring the S.O.M.E fitness method logo with the four wellness pillars: Sleep, Oxygen, Move, Eat.',
    price: 2.99,
    category: 'sticker',
    inStock: true,
    rating: 4.7,
    features: ['Minimalist Design', '2.5" Size', 'Four Pillars', 'Clean Aesthetic', 'Brand Recognition']
  }
];

interface MerchandiseStoreProps {
  onPurchase?: (itemId: string, quantity: number) => void;
}

export default function MerchandiseStore({ onPurchase }: MerchandiseStoreProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<{[key: string]: number}>({});

  const categories = [
    { id: 'all', name: 'All Items', icon: Package },
    { id: 'sticker', name: 'Stickers', icon: Heart },
  ];

  const filteredItems = selectedCategory === 'all' 
    ? merchandiseItems 
    : merchandiseItems.filter(item => item.category === selectedCategory);

  const addToCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const handlePurchase = (itemId: string) => {
    const quantity = cart[itemId] || 1;
    if (onPurchase) {
      onPurchase(itemId, quantity);
    }
    // Reset cart for this item after purchase
    setCart(prev => ({
      ...prev,
      [itemId]: 0
    }));
  };

  const getTotalCartValue = () => {
    return Object.entries(cart).reduce((total, [itemId, quantity]) => {
      const item = merchandiseItems.find(i => i.id === itemId);
      return total + (item ? item.price * quantity : 0);
    }, 0);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header with animated blowfish */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <BlowfishAnimation size="large" autoPlay={true} />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">S.O.M.E Merchandise Store</h1>
            <p className="text-gray-600 mt-2">Show your wellness journey with our exclusive blowfish collection</p>
          </div>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {categories.map(category => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              <Icon className="w-4 h-4" />
              {category.name}
              {category.id !== 'all' && (
                <Badge variant="secondary" className="ml-1">
                  {merchandiseItems.filter(item => item.category === category.id).length}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>

      {/* Cart summary */}
      {getTotalCartValue() > 0 && (
        <Card className="mb-6 bg-green-50 border-green-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Cart Total: ${getTotalCartValue().toFixed(2)}</span>
              </div>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                Checkout ({Object.values(cart).reduce((a, b) => a + b, 0)} items)
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Merchandise grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant={item.inStock ? "default" : "secondary"}>
                  {item.inStock ? 'In Stock' : 'Out of Stock'}
                </Badge>
                {item.rating && (
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {item.rating}
                  </div>
                )}
              </div>
              
              <CardTitle className="text-lg">{item.name}</CardTitle>
              <div className="text-2xl font-bold text-green-600">${item.price}</div>
            </CardHeader>

            <CardContent>
              {/* Special preview for blowfish items */}
              {item.id.includes('blowfish') && (
                <div className="flex justify-center mb-4">
                  <BlowfishAnimation size="medium" autoPlay={false} />
                </div>
              )}

              <p className="text-gray-600 text-sm mb-4">{item.description}</p>

              {/* Features */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {item.features.slice(0, 3).map(feature => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {item.features.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{item.features.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Quantity and purchase */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCart(prev => ({
                      ...prev,
                      [item.id]: Math.max(0, (prev[item.id] || 0) - 1)
                    }))}
                    disabled={!cart[item.id]}
                  >
                    -
                  </Button>
                  <span className="mx-2 min-w-[2rem] text-center">{cart[item.id] || 0}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addToCart(item.id)}
                    disabled={!item.inStock}
                  >
                    +
                  </Button>
                </div>

                <Button
                  className="flex-1"
                  onClick={() => handlePurchase(item.id)}
                  disabled={!item.inStock || (!cart[item.id] && !item.inStock)}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {cart[item.id] ? `Buy ${cart[item.id]}` : 'Add to Cart'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-600">Try selecting a different category</p>
        </div>
      )}
    </div>
  );
}