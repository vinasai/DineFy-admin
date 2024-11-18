import React from "react";
import { useGetUserApiQuery } from "@/redux/api/user/userApi"; // Assuming you have the useGetUserApiQuery hook
import Chart from "react-apexcharts";

const BarchartUsers = () => {
  const { data: users = [] } = useGetUserApiQuery(""); // Fetching users

  // Helper function to parse the date using JavaScript's built-in Date constructor
  const parseDate = (dateString: string) => {
    if (!dateString) {
      console.error("Empty date string:", dateString);
      return new Date(NaN);
    }

    const parsedDate = new Date(dateString); // Using JavaScript's built-in Date constructor
    if (isNaN(parsedDate.getTime())) {
      console.error("Invalid date string:", dateString);
      return new Date(NaN);
    }

    return parsedDate;
  };

  // Group users by month-year
  const groupedData = users?.reduce((acc: Record<string, number>, user) => {
    const date = parseDate(user.created_at); // Parse the created_at date of each user

    // If the date is invalid (NaN), skip this user
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
  }, {});

  // Extract labels and values for the chart
  const labels = Object.keys(groupedData); // Month-Year labels
  const values = Object.values(groupedData); // User counts

  // Check if we have data to show
  if (labels.length === 0 || values.length === 0) {
    return <div className="text-center mt-11">No data available for charting</div>; // Show message if no data is available
  }

  // ApexCharts configuration
  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
    },
    title: {
      text: "User Creation Count by Month",
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
        text: "Total Users",
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
      name: "Total Users",
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

export default BarchartUsers;
