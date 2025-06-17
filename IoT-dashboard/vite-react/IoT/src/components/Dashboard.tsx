import React, {useState, useEffect} from "react"
import Navbar from './Navbar.tsx'
import Devices from './Devices.tsx'

function Dashboard() {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState<Device[]>([]);

    const getDevices = async() => {
        try {
            const res = await fetch("http://localhost:3100/api/data/latest",
                                    {method: "GET",
                                     headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': ' application/json',
                                        'x-access-token': localStorage.getItem('token')
                                    }}
            );
            const json = await res.json();
            setData(json.map((el) => {return {
                temperature: el.temperature,
                pressure: el.pressure,
                humidity: el.humidity,
                deviceId: el.deviceId,
                readingDate: Date.parse(el.readingDate)
            }}));
        } catch(error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getDevices();
    }, []);

    return (
        <>
        {!isLoading && <Devices data={data} />}
        </>
    )


}

export default Dashboard