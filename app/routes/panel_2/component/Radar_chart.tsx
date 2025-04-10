import React, { PureComponent } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  Legend,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    subject: "App Dev",
    A: 60,
  },
  {
    subject: "Web Dev",
    A: 80,
  },
  {
    subject: "UI / UX",
    A: 95,
  },
  {
    subject: "Front-end",
    A: 85,
  },
  {
    subject: "Back-end",
    A: 50,
  },
  {
    subject: "English",
    A: 65,
  },
];

export default class Example extends PureComponent {
  render() {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart
          cx="50%"
          cy="50%"
          outerRadius="75%"
          data={data}
          margin={{
            left: 60,
            right: 20,
          }}
        >
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" tickSize={22.5} fontSize={14.5} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar
            name="Mike"
            dataKey="A"
            stroke="#60a5fa"
            fill="#60a5fa"
            fillOpacity={0.3}
          />

          {/* <Legend /> */}
        </RadarChart>
      </ResponsiveContainer>
    );
  }
}
