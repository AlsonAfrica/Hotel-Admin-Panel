import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
} from "recharts";

const userData = [
    { name: "January", users: 4000 },
    { name: "February", users: 3000 },
    { name: "March", users: 5000 },
    { name: "April", users: 4500 },
    { name: "May", users: 6000 },
];

const pieData = [
    { name: "Returning Users", value: 400 },
    { name: "New Users", value: 300 },
    { name: "Guest Users", value: 300 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const DashBoard = () => {
    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
                <div>
                    <h3>User Growth Over Months</h3>
                    <BarChart width={500} height={300} data={userData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="users" fill="#8884d8" />
                    </BarChart>
                </div>
                <div>
                    <h3>User Distribution</h3>
                    <PieChart width={400} height={300}>
                        <Pie
                            data={pieData}
                            cx={200}
                            cy={150}
                            labelLine={false}
                            label={entry => entry.name}
                            outerRadius={80}
                            fill="#8884d8"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </div>
            </div>
        </div>
    );
};

export default DashBoard;
