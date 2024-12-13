import ReactApexCharts from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface StatisticsWidgetProps {
  variant: string;
  cardTitle: string;
  title: string;
  stats: string;
  dataSince: string;
  classname: string;
  chartSeries: number[];
  colors: string[];
}

const StatisticsWidget = ({  cardTitle, title, stats, colors }: StatisticsWidgetProps) => {
  const apexOpts: ApexOptions = {
    chart: {
      height: 72,
      width: 72,
      type: 'donut',
    },
    legend: {
      show: false,
    },
   
    stroke: {
      colors: ['transparent'],
    },
    dataLabels: {
      enabled: false,
    },
    colors: colors,
  };

  return (
    <div className="card">
      <div className="p-6">
        <div className="flex justify-between">
          <div className="grow overflow">
            <h5 className="text-base/3 text-gray-400 font-normal mt-0" title={title}>
              {cardTitle}
            </h5>
            <h3 className="text-2xl my-6">{stats}</h3>
            
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default StatisticsWidget;