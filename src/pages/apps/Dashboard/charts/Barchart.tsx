import React from "react";
import Chart from "react-apexcharts";
import { useGetRestaurantApiQuery } from "@/redux/api/restaurant/restaurantApiSlice";

const Barchart = () => {
  const { data: restaurants = [] } = useGetRestaurantApiQuery("");

  // Helper function to parse the date using JavaScript's built-in Date constructor
  const parseDate = (dateString: string) => {
    if (!dateString) {
      console.error("Empty date string:", dateString);
      return new Date(NaN);
    }

    // Attempt to create a new Date from the ISO string
    const parsedDate = new Date(dateString);

    // If the date is invalid, return an invalid date
    if (isNaN(parsedDate.getTime())) {
      console.error("Invalid date string:", dateString);
      return new Date(NaN);
    }

    return parsedDate;
  };

  // Group restaurants by month-year
  const groupedData = restaurants?.reduce(
    (acc: Record<string, number>, restaurant) => {
      const date = parseDate(restaurant.created_at); // Parse cleaned date

      // If the date is invalid (NaN), skip this restaurant
      if (isNaN(date.getTime())) {
        return acc;
      }

      // Format as "Month-Year" (e.g., "Sep-2024")
      const monthYear = date.toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      });

      acc[monthYear] = (acc[monthYear] || 0) + 1; // Increment count for the month-year
      return acc;
    },
    {}
  );

  console.log("Grouped Data:", groupedData); // Log grouped data

  // Extract labels and values for the chart
  const labels = Object.keys(groupedData); // Month-Year labels
  const values = Object.values(groupedData); // Restaurant counts

  console.log("Labels:", labels); // Log labels
  console.log("Values:", values); // Log values

  if (labels.length === 0 || values.length === 0) {
    return <div>No data available for charting</div>; // Show message if no data is available
  }

  // ApexCharts configuration
  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
    },
    title: {
      text: "Restaurant Creation Count by Month",
      align: "center",
      style: { fontSize: "16px" },
    },
    xaxis: {
      categories: labels, // Month-Year labels
      title: {
        text: "Month-Year",
      },
    },
    yaxis: {
      title: {
        text: "Total Restaurants",
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#3b82f6"], // Customize bar color
  };

  const chartSeries: ApexAxisChartSeries = [
    {
      name: "Total Restaurants",
      data: values as number[], // Ensure `values` is typed as `number[]`
    },
  ];

  return (
    <div style={{ width: "100%", maxWidth: "800px", margin: "auto" }}>
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default Barchart;
