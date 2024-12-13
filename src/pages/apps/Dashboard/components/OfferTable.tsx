import { Link } from 'react-router-dom';
import { useGetOfferApiQuery} from "@/redux/api/dashboard/dashboardInfoApi";
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';

interface Offer {
  title: string;
  restaurant_name: string;
  created_at: string;
  valid_until: string | null;
}


const TopSellingProducts = () => {
  const { data: offerData, isLoading, refetch: fetchOffer } = useGetOfferApiQuery("");
const [offers, setOffers] = useState<Offer[]>([]);

  



  useEffect(() => {
    const fetchOfferData = async () => {
      if (offerData) {
        const mappedOffers: Offer[] = offerData.map((offer: any) => ({
          title: offer.title,
          restaurant_name: offer.restaurant?.name || '',
          created_at: offer.created_at,
          valid_until: offer.valid_until
        }));
        setOffers(mappedOffers);
      }
    };
    fetchOfferData();
  }, [  offerData]);

  return (
    <div className="card">
      <div className="card-header flex justify-between items-center">
        <h4 className="card-title">Most Recent Offers By Restaurants</h4>
      </div>
      <div className="relative overflow-x-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <CircularProgress />
          </div>
        ) : (
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="bg-light/40 border-b border-gray-100 dark:bg-light/5 dark:border-b-gray-700">
              <tr>
                <th className="py-1.5 px-4">Offer</th>
                <th className="py-1.5 px-4">Restaurant</th>
                <th className="py-1.5 px-4">Created At</th>
                <th className="py-1.5 px-4">Valid Until</th>
              </tr>
            </thead>
            <tbody>
              {(offers || []).map((offer, idx) => (
                <tr key={idx}>
                  <td className="p-4">{offer.title}</td>
                  <td className="p-4">{offer.restaurant_name || 'N/A'}</td>
                  <td className="p-4">{new Date(offer.created_at).toLocaleDateString()}</td>
                  <td className="p-4">{offer.valid_until ? new Date(offer.valid_until).toLocaleDateString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="text-center">
        <Link to="#!" className="btn text-primary underline font-bold mb-2">
          View All
        </Link>
      </div>
    </div>
  );
};

export default TopSellingProducts;