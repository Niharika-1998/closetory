import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const occasions = ['all', 'wedding', 'evening', 'vacation', 'festive', 'brunch'];
const categories = ['all', 'Dresses', 'Co-ord Sets', 'Tops & Blouses', 'Bottoms', 'Sarees & Ethnic', 'Jackets & Outerwear', 'Jumpsuits'];

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOccasion, setSelectedOccasion] = useState(searchParams.get('occasion') || 'all');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedOccasion !== 'all') params.occasion = selectedOccasion;
        if (selectedCategory !== 'all') params.category = selectedCategory;
        
        const response = await axios.get(`${API}/products`, { params });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedOccasion, selectedCategory]);

  const handleOccasionChange = (value) => {
    setSelectedOccasion(value);
    const params = new URLSearchParams(searchParams);
    if (value === 'all') {
      params.delete('occasion');
    } else {
      params.set('occasion', value);
    }
    setSearchParams(params);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    const params = new URLSearchParams(searchParams);
    if (value === 'all') {
      params.delete('category');
    } else {
      params.set('category', value);
    }
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen" data-testid="shop-page">
      <section className="max-w-[1600px] mx-auto px-8 py-16">
        <div className="mb-16">
          <h1 className="font-display text-5xl md:text-6xl mb-6">The Edit</h1>
          <p className="font-body text-lg text-muted-foreground max-w-2xl">
            Curated statement pieces from emerging Indian designers. Every outfit tells a story.
          </p>
        </div>

        <div className="flex flex-wrap gap-6 mb-12 pb-8 border-b border-border/30">
          <div className="flex-1 min-w-[200px]">
            <label className="font-body text-sm uppercase tracking-wide mb-2 block">Occasion</label>
            <Select value={selectedOccasion} onValueChange={handleOccasionChange}>
              <SelectTrigger className="w-full bg-background border-border" data-testid="occasion-filter">
                <SelectValue placeholder="All Occasions" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                {occasions.map((occasion) => (
                  <SelectItem key={occasion} value={occasion} className="font-body capitalize">
                    {occasion === 'all' ? 'All Occasions' : occasion}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="font-body text-sm uppercase tracking-wide mb-2 block">Category</label>
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full bg-background border-border" data-testid="category-filter">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="font-body">
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-body text-lg text-muted-foreground">No products found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" data-testid="products-grid">
            {products.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ShopPage;