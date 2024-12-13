
import { useGetNotificationApiQuery } from "@/redux/api/dashboard/dashboardInfoApi";
import { CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';



interface Notification{
  restaurant_name: string;
  message: string;
  created_at: string;

}

const TotalSalesChart = () => {
  const { data: notificationData, isLoading, refetch: fetchNotification } = useGetNotificationApiQuery("");
  
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotificationData = async () => {
      if (notificationData) {
        const formattedNotifications: Notification[] = notificationData.map((item: any) => ({
          restaurant_name: item.restaurant?.name || '',
          message: item.message,
          created_at: item.created_at
        }));
        setNotifications(formattedNotifications);
      }
    };
    fetchNotificationData();
  }, [ notificationData]);

  const PopoverToggle = () => {
    return <i className="ri-more-2-fill text-xl" />;
  };

  return (
    <div className="col-lg-4">
      <div className="card">
        <div className="flex px-6 py-3 justify-between items-center">
          <h4 className="card-title">Latest Notifications</h4>
        </div>
        <div className="p-6 pt-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <CircularProgress />
            </div>
          ) : (
            (notifications || []).map((notification, idx) => (
              <div key={idx} className="mb-1.5">
                <h5 className="text-base font-medium mb-2.5">{notification.restaurant_name}</h5>
                <div className="flex items-center justify-between gap-2">
                  		<div>{notification.message}</div>
                  <span className="font-bold text-sm">{new Date(notification.created_at).toLocaleDateString()}</span>
                </div>
                {idx < (notificationData || []).length - 1 && <hr className="my-4 border-gray-200" />}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TotalSalesChart;