"use client";

import { ITEM_TYPES } from "./constants";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { easeOutBounce } from "./utils/graphUtils";
import { theme } from "./theme/themes";
import { useDrop } from "react-dnd";
import Loader from "./Loader";
import { IndicatorModel } from "./backtest/models";
import { GraphProps } from "./models";

const Graph = (props: GraphProps) => {
  const {
    stockStyles,
    companyInfo,
    companyTimeSeries,
    graphLoading,
    graphType,
    indicators,
    setIndicators,
  } = props;
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ITEM_TYPES.INDICATOR,
      drop: (item: IndicatorModel) => {
        setIndicators((prev: IndicatorModel[]) =>
          prev.map((e) => (e.id === item.id ? { ...e, active: true } : e))
        );
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    []
  );

  const shownIndicatorsSeries = indicators
    .filter((e: IndicatorModel) => e.active)
    .map((e: IndicatorModel) => ({
      type: "line",
      id: e.id,
      name: e.id,
      data: e.calculation(companyTimeSeries.data, e.params),
    }));

  console.log("shownIndicatorsSeries", shownIndicatorsSeries);

  return (
    <div
      ref={drop}
      style={{
        opacity: isOver ? 0.5 : 1,
      }}
    >
      {graphLoading ? (
        <div style={{ position: "absolute", zIndex: 20000000, width: "65%" }}>
          <Loader />
        </div>
      ) : (
        <></>
      )}
      <div
        style={{
          opacity: graphLoading ? 0.5 : 1,
        }}
      >
        <HighchartsReact
          highcharts={Highcharts}
          constructorType={"stockChart"}
          options={{
            rangeSelector: {
              enabled: false,
            },
            scrollbar: {
              enabled: false,
            },
            navigator: {
              enabled: false,
            },
            plotOptions: {
              series: {
                lineColor: stockStyles.main,
              },
            },
            tooltip: {
              shared: true,
              useHTML: true,
              xDateFormat: "%H:%M %Y-%m-%d",
              backgroundColor: theme.palette.background.default,
              style: { color: theme.palette.secondary.main },
            },
            series: [
              {
                name: companyInfo["Symbol"],
                id: companyInfo["Symbol"],
                type: graphType === "Line" ? "area" : "ohlc",
                data:
                  graphType === "Line"
                    ? companyTimeSeries.data
                    : companyTimeSeries.ohlc,
                gapSize: 5,
                fillColor: {
                  linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1,
                  },
                  stops: [
                    [0, stockStyles.main],
                    [1, stockStyles.transparent],
                  ],
                },
                threshold: null,
                animation: {
                  duration: 3000,
                  easing: easeOutBounce,
                },
              },
              ...shownIndicatorsSeries,
              // {
              //   type: "column",
              //   id: "volume",
              //   name: "Volume",
              //   data: companyTimeSeries.volume,
              // },
            ],
          }}
        />
      </div>
    </div>
  );
};

export default Graph;
