// components
import {useState} from 'react'
import Statistics from './components/Statistics'
import TotalSalesChart from './components/NotificationTable'
import TopSellingProducts from './components/OfferTable'


const Ecommerce = () => {


	return (
		<>
			
			<Statistics />
			<div className="grid lg:grid-cols-12 gap-6 mb-6">
			  <div className="lg:col-span-8 col-span-12">
				<TopSellingProducts  
				  
				 />
			  </div>
			  <div className="lg:col-span-4 col-span-12">
				<TotalSalesChart />
			  </div>
			</div>
			
		</>
	)
}

export default Ecommerce
