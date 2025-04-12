import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';


const socket = io("http://localhost:3000");

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


function App() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [temperatures, setTemperatures] = useState([]);
    const [humidities, setHumidities] = useState([]);
    const [pressures, setPressures] = useState([]);

    const getOptions = (title) => {
    return {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: title,
            },
        },
    }};

    const getData = (data) => {
    return {
        labels: getLabels(data),
        datasets: [{
            label: '',
            data: data,
            borderColor: 'rgb(255, 255, 255)',
            backgroundColor: 'rgba(0, 0, 0, 0)',
        }]
    }};

    const getLabels = (data) => {
        const indexes = [];
        data.forEach((el, idx) => indexes.push(idx+1));
        return indexes;
    }

    useEffect(() => {
        socket.on("message", (data) => {
            setMessages((prev) => [...prev, data]);
        });


        return () => {
            socket.off("message");
        };
    }, []);

    useEffect(() => {
        socket.on("sensor-data", (data) => {
            setTemperatures((prev) => {
                if(prev.length >= 10) { return [...prev.slice(1), data.temperature]; }
                else { return [...prev, data.temperature]; }
            });
            setHumidities((prev) => {
                if(prev.length >= 10) { return [...prev.slice(1), data.humidity]; }
                else { return [...prev, data.humidity]; }
            });
            setPressures((prev) => {
                if(prev.length >= 10) { return [...prev.slice(1), data.pressure]; }
                else { return [...prev, data.pressure]; }
            });
        });

        return () => {
            socket.off("sensor-data")
        };
    }, [])


    const sendMessage = () => {
        if (message) {
            socket.emit("message", message);
            setMessage("");
        }
    };


    /*{measurements.map((mnt, index) => (
                        <p key={index}>Temperature: {mnt.temperature}°C, Humidity: {mnt.humidity}%, Pressure: {mnt.pressure}hPa</p>
                    ))}*/
    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <h2>WebSocket TWwAIR test App (Post: /measurement)</h2>
            <div>
                <Line data={getData(temperatures)} options={getOptions("Temperatura")}/>
            </div>
            <div>
                <Line data={getData(humidities)} options={getOptions("Wilgotność")}/>
            </div>
            <div>
                <Line data={getData(pressures)} options={getOptions("Ciśnienie")}/>
            </div>
        </div>
    );
}


export default App;