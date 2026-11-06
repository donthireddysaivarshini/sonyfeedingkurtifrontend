export interface CustomerReview {
  id: string;
  customerName: string;
  location: string;
  rating: number;
  date: string;
  productName: string;
  clothingType: 'Feeding' | 'Non-Feeding';
  review: string;
  avatar?: string;
  verified: boolean;
}

export const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    customerName: 'Priya Sharma',
    location: 'Hyderabad, Telangana',
    rating: 5,
    date: '2 weeks ago',
    productName: 'Nayantara Rose Flared Maxi Dupatta Set',
    clothingType: 'Feeding',
    review: 'The dual feeding zippers are completely invisible! I wore this to my niece’s naming ceremony and was able to feed my 3-month-old peacefully without searching for a separate room. The fabric is so soft and comfortable.',
    verified: true
  },
  {
    id: 'rev-2',
    customerName: 'Kavitha Reddy',
    location: 'Bangalore, Karnataka',
    rating: 5,
    date: '1 month ago',
    productName: 'Madhavi Heritage 3-Piece Anarkali Set',
    clothingType: 'Feeding',
    review: 'Finding festive partywear that also has feeding access was impossible until I found Sony Feeding Kurtis. The stitching quality, zari finish, and the smart zipper placement under the border exceeded all expectations.',
    verified: true
  },
  {
    id: 'rev-3',
    customerName: 'Ananya Varma',
    location: 'Chennai, Tamil Nadu',
    rating: 5,
    date: '3 weeks ago',
    productName: 'Kalyani Tiered Gathered Frock',
    clothingType: 'Feeding',
    review: 'Pure mulmul cotton goodness! It gives plenty of room for post-pregnancy tummy while still looking stylish. Delivered in 3 days with lovely packaging.',
    verified: true
  },
  {
    id: 'rev-4',
    customerName: 'Deepa Nair',
    location: 'Kochi, Kerala',
    rating: 5,
    date: 'Recent Purchase',
    productName: 'Ira Indigo Hand-Block Co-ord Set',
    clothingType: 'Non-Feeding',
    review: 'Even without the feeding option, this co-ord set fits like a glove! Great cut, breezy fabric, and pockets in pants are a bonus. Love the boutique vibe.',
    verified: true
  }
];

