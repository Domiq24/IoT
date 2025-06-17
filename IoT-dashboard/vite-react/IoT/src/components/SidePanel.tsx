import {useState} from 'react'
import DeviceManage from './DeviceManage.tsx'
import DeviceLineGraph from './DeviceLineGraph.tsx'

interface Limit {
    readings: number,
    temperature: bool,
    pressure: bool,
    humidity: bool
}

function SidePanel({selected, setSelected, manage, setManage}) {
    const [limit, setLimit] = useState<Limit>({readings: null, temperature: true, pressure: true, humidity: true});

    return(
        <>
            {manage ? <DeviceManage data={selected} setData={setSelected} setLimit={setLimit} setManage={setManage}/> : <DeviceLineGraph data={selected} limit={limit}/>}
        </>
    )
}

export default SidePanel