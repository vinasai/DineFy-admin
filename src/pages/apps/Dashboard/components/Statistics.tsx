import StatisticsWidget from './StatisticsWidget';
import { useGetStatisticsApiQuery } from "@/redux/api/dashboard/dashboardInfoApi";
import { CircularProgress } from '@mui/material';

const Statistics = () => {
  const { data: statisticsData, isLoading } = useGetStatisticsApiQuery("");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="grid 2xl:grid-cols-5 lg:grid-cols-6 md:grid-cols-2 gap-6 mb-6">
      <div className="2xl:col-span-1 lg:col-span-2">
        <StatisticsWidget
          variant={'bg-success'}
          cardTitle={'Restaurants'}
          title={'Number of Restaurants'}
          stats={String(statisticsData?.restaurantCount || '0')}
          dataSince={'Since last month'}
          classname={'apex-charts'}
          colors={['#47ad77', '#e3e9ee']}
         
          chartSeries={[68]}
        />
      </div>

      <div className="2xl:col-span-1 lg:col-span-2">
        <StatisticsWidget
          variant={'bg-danger'}
          cardTitle={'Owners'}
          title={'Number of Owners'}
          stats={String(statisticsData?.ownerCount || '0')}
          dataSince={'Since last month'}
          classname={'apex-charts'}
          colors={['#3e60d5', '#e3e9ee']}
          
          chartSeries={[45]}
        />
      </div>

      <div className="2xl:col-span-1 lg:col-span-2">
        <StatisticsWidget
          variant={'bg-danger'}
          cardTitle={'Profiles'}
          title={'Number of Profiles'}
          stats={String(statisticsData?.profileCount || '0')}
          dataSince={'Since last month'}
          classname={'apex-charts'}
          colors={['#16a7e9', '#e3e9ee']}
          
          chartSeries={[55]}
        />
      </div>

      <div className="2xl:col-span-1 lg:col-span-3">
        <StatisticsWidget
          variant={'bg-success'}
          cardTitle={'Offers'}
          title={'Number of Offers'}
          stats={String(statisticsData?.offerCount || '0')}
          dataSince={'Since last month'}
          classname={'apex-charts'}
          colors={['#ffc35a', '#e3e9ee']}
          
          chartSeries={[82]}
        />
      </div>

      <div className="2xl:col-span-1 lg:col-span-3 md:col-span-2">
        <StatisticsWidget
          variant={'bg-success'}
          cardTitle={'Notifications'}
          title={'Number of Notifications'}
          stats={String(statisticsData?.notificationCount || '0')}
          dataSince={'Since last month'}
          classname={'apex-charts'}
          colors={['#f15776', '#e3e9ee']}
          
          chartSeries={[35]}
        />
      </div>
    </div>
  );
};

export default Statistics;