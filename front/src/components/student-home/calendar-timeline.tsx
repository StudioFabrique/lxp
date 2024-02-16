import ReactApexChart from "react-apexcharts";

const CalendarTimeline = () => {
  return (
    <div>
      <h2 className="font-bold text-xl">Mon emploi du temps</h2>
      <div className="">
        <ReactApexChart
          type={"rangeBar"}
          height={220}
          series={[
            {
              data: [
                {
                  x: "Code",
                  y: [
                    new Date("2019-03-02").getTime(),
                    new Date("2019-03-04").getTime(),
                  ],
                },
                {
                  x: "Test",
                  y: [
                    new Date("2019-03-04").getTime(),
                    new Date("2019-03-08").getTime(),
                  ],
                },
                {
                  x: "Validation",
                  y: [
                    new Date("2019-03-08").getTime(),
                    new Date("2019-03-12").getTime(),
                  ],
                },
                {
                  x: "Deployment",
                  y: [
                    new Date("2019-03-12").getTime(),
                    new Date("2019-03-18").getTime(),
                  ],
                },
              ],
            },
          ]}
          options={{
            plotOptions: {
              bar: {
                horizontal: true,
              },
            },
            xaxis: {
              type: "datetime",
            },
          }}
        />
      </div>
    </div>
  );
};

export default CalendarTimeline;
