import { BarChartWrapper } from "./component/Bar_chart_wrapper";
import GraphRadar from "./component/Radar_chart";
import GanttChart from "./component/Gantt_chart_";
import { AnimateIn } from "~/components/animation";

export default function Panel2() {
  return (
    <>
      <AnimateIn>
        <div className="text-black bg-white min-h-[100vh]  h-auto w-full ">
          {/* Responsible Width-Max-Break */}
          <div className="xl:flex flex-row justify-between xl-3:justify-center">
            {/* Header */}
            <div className="hidden xl:block text-4xl my-sm:text-5xl xl-2:text-6xl mt-[7vh] ml-16 mr-6 font-archivo">
              <p>Be</p> <br />
              Super <br />
              <div className="underline underline-offset-[20px] decoration-[6px]">
                Creative
              </div>
            </div>

            {/* Responsible Width-Mid-Break */}
            <div className="my-md:flex flex-row justify-between my-lg:justify-around lg-2:justify-center my-2xl:justify-between">
              {/* Header & Content Container A */}
              <div>
                {/* Header */}
                <div className="text-4xl xl:text-white my-sm:text-5xl mt-[7vh] mb-24 ml-8 my-lg:ml-10 xl:hidden font-archivo">
                  <span className="block">Be</span>
                  <span className="block">Super</span>
                  <span className="block">Creative</span>
                  <span className="block h-[0.5rem] w-[15rem] mt-3 bg-black" />
                </div>

                {/* Content Container A */}
                <div className="mt-10 ml-0 my-lg:ml-10 lg-2:mr-12 xl:mt-[7vh] xl-3:ml-24 xl-3:mr-20 w-96">
                  <div id="chart" className="w-full h-[400px]">
                    <BarChartWrapper />
                  </div>
                </div>
              </div>

              {/* Header Place Holder & Content Container A */}
              <div>
                {/* Header Place Holder */}
                <div className="text-4xl hidden my-md:text-5xl my-md:block mt-[7vh] mb-24 ml-8 my-lg:ml-10 xl:hidden font-archivo">
                  <br />
                  <br />
                  <br />
                </div>
                {/* Content Container B */}
                <div>
                  <div className="mt-10 ml-8 mr-8 my-lg:mr-0 my-md:mt-10 xl:mt-[7vh] xl:mr-16 w-96">
                    <div id="chart" className="w-full h-[400px]">
                      <GraphRadar />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gunt Chart */}
          <div className="flex justify-center items-start mt-[5vh] w-full h-[50vh]">
            <div id="chart" className=" h-[90%] w-[90%]">
              <GanttChart />
            </div>
          </div>
        </div>
      </AnimateIn>
    </>
  );
}
