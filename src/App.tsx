import './index.css'


import {useEffect, useState} from "react";
import axios from "axios";


import sunny from './assets/sunny.jpg'
import snowy from './assets/snowy.jpg'
import rainy from './assets/rainy.jpg'
import foggy from './assets/foggy.jpg'
import cloudy from './assets/cloudy.jpg'
import clear from './assets/clear.jpg'
import SearchInput from "./components/SearchInput.tsx";
import SearchButton from "./components/SearchButton.tsx";
import {BsCalendar2Date, BsFillEyeSlashFill, BsFillMoonStarsFill} from "react-icons/bs";
import {FaCloud, FaCloudSunRain, FaTemperatureHigh, FaTemperatureLow} from "react-icons/fa";
import {IoWaterOutline} from "react-icons/io5";
import {MdCompress} from "react-icons/md";
import {GiWindSlap} from "react-icons/gi";
import YandexMap from "./components/YandexMap.tsx";


type WeatherType = {
    description: string,
    icon: string,
    id: number,
    main: string,
}

type ListType = {
    dt: number,
    clouds: {
        all: number,
    },
    dt_txt: string,
    main: {
        temp: number,
        feels_like: number,
        temp_min: number,
        temp_max: number,
        temp_kf: number,
        grnd_level: number,
        humidity: number,
        pressure: number,
        sea_level: number,
    },
    pop: number,
    sys: {
        pod: string,
    },
    visibility: number,
    weather: WeatherType[],
    wind: {
        deg: number,
        gust: number,
        speed: number,
    }
}

export type ForecastType = {
    city: {
        id: number,
        name: string,
        coord: {
            lat: number,
            lon: number
        },
        country: string,
        population: number,
        sunrise: number,
        sunset: number,
        timezone: number
    },
    list: ListType[]

}

const App = () => {


    const [search, setSearch] = useState('');
    const [placeholder, setPlaceholder] = useState('City or town');
    const [forecast, setForecast] = useState<ForecastType>({
        city: {
            id: 0,
            name: '',
            coord: {
                lat: 0,
                lon: 0
            },
            country: '',
            population: 0,
            sunrise: 0,
            sunset: 0,
            timezone: 0
        },
        list: [{
            dt: 0,
            clouds: {
                all: 0,
            },
            dt_txt: '2001-11-09',
            main: {
                temp: 0,
                feels_like: 0,
                temp_min: 0,
                temp_max: 0,
                temp_kf: 0,
                grnd_level: 0,
                humidity: 0,
                pressure: 0,
                sea_level: 0,
            },
            pop: 0,
            sys: {
                pod: '',
            },
            visibility: 0,
            weather: [
                {
                    description: 'Описание',
                    icon: 'icon',
                    id: 0,
                    main: 'Vacuum',
                }
            ],
            wind: {
                deg: 0,
                gust: 0,
                speed: 0,
            }
        }]
    })

    const [weatherImage, setWeatherImage] = useState(sunny)




    const getForecast = async () => {
        try {
            if (!search) {
               setPlaceholder('Введите значение!');
            }
            const {data} = await axios.get<ForecastType>
            (`https://api.openweathermap.org/data/2.5/forecast?q=${search}&units=metric&appid=${import.meta.env.VITE_API_KEY}`)
            setForecast((prevState) => {
                return ({
                    ...prevState,
                    city: data.city,
                    list: data.list.filter(item => item.dt_txt.slice(11) === '15:00:00')
                });
            })
            console.log(data.list[0].weather[0].main) //clouds, clear, snow, rain
            setSearch('')
            setPlaceholder('City or town')


        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        if (forecast.list[0].weather[0].main === 'Clouds') {
            setWeatherImage(cloudy)
        } else if (forecast.list[0].weather[0].main === 'Clear') {
            setWeatherImage(clear)
        } else if (forecast.list[0].weather[0].main === 'Snow') {
            setWeatherImage(snowy)
        } else if (forecast.list[0].weather[0].main === 'Rain') {
            setWeatherImage(rainy)
        } else if (forecast.list[0].weather[0].main === 'Fog') {
            setWeatherImage(foggy)
        } else {
            setWeatherImage(sunny)
        }
    }, [forecast])




    return (
        <div className="w-full h-full px-16 py-8 bg-neutral-800 flex gap-20 bg-center bg-no-repeat bg-cover"
            style={{backgroundImage: `url(${weatherImage})`}}
        >

            <div className="w-full flex flex-col gap-10 items-end">
                <div className="flex justify-between items-center w-full">
                    <div className="flex flex-col gap-2">
                        <div>
                            <h1 className='text-6xl text-white font-bold'>Search...</h1>
                        </div>
                        <div className="flex gap-2">
                            <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder={placeholder}/>
                            <SearchButton onClick={getForecast} children={'Прогноз'}/>
                        </div>

                    </div>
                    <h1 className="text-7xl text-white font-bold flex gap-1"><FaCloudSunRain /> Weather</h1>
                    <div className="flex flex-col items-start gap-2 text-white">
                        <div className="flex gap-4 items-end">
                            <h1 className="text-6xl font-bold">{forecast.city.name ? forecast.city.name : 'City'}</h1>
                            <h2 className="text-3xl font-medium">{forecast.city.country ? forecast.city.country : 'Country'}</h2>
                        </div>
                        <span
                            className="text-3xl font-medium">{forecast.list[0].weather[0].main ? forecast.list[0].weather[0].main : 'Empty'}
                        </span>


                    </div>
                </div>

                <div className="flex justify-between items-center w-full">
                    <YandexMap forecast={forecast}/>
                    <div className="text-white flex flex-col gap-6">


                        <div className="flex gap-10">
                            <div className="flex flex-col gap-4">
                                <h1 className="shadow-xl text-2xl font-bold bg-black/65 px-3 py-4 rounded-lg flex gap-1 items-center">
                                    <BsCalendar2Date/> Date
                                </h1>
                                <span className="shadow-xl text-xl font-bold bg-black/65 px-3 py-4 rounded-lg flex gap-1 items-center">
                                    <FaTemperatureLow/> Температура:
                                </span>
                                <span className="shadow-xl text-xl font-bold bg-black/65 px-3 py-4 rounded-lg flex gap-1 items-center">
                                    <FaTemperatureHigh/> Ощущается как:
                                </span>
                                <span className="shadow-xl text-xl font-bold bg-black/65 px-3 py-4 rounded-lg flex gap-1 items-center">
                                    <IoWaterOutline/> Влажность:
                                </span>
                                <span className="shadow-xl text-xl font-bold bg-black/65 px-3 py-4 rounded-lg flex gap-1 items-center">
                                    <MdCompress/> Атмосферное давление:
                                </span>
                                <span className="shadow-xl text-xl font-bold bg-black/65 px-3 py-4 rounded-lg flex gap-1 items-center">
                                    <FaCloud/> Облачность:
                                </span>
                                <span className="shadow-xl text-xl font-bold bg-black/65 px-3 py-4 rounded-lg flex gap-1 items-center">
                                    <BsFillEyeSlashFill/> Видимость:
                                </span>
                                <span className="shadow-xl text-xl font-bold bg-black/65 px-3 py-4 rounded-lg flex gap-1 items-center">
                                    <BsFillMoonStarsFill/> Погода:
                                </span>
                                <span className="shadow-xl text-xl font-bold bg-black/65 px-3 py-4 rounded-lg flex gap-1 items-center">
                                    <GiWindSlap/> Ветер:
                                </span>
                            </div>
                            {forecast.list.map((item) => {
                                return (
                                    <div className="flex flex-col items-center gap-4">
                                        <h1 className="shadow-xl text-2xl font-medium bg-black/65 px-3 py-4 rounded-lg w-40">
                                            {item.dt_txt.slice(0, 10).split('-').reverse().join('-')}
                                        </h1>
                                        <span className="shadow-xl text-xl font-bold bg-black/65 px-3 py-4 rounded-lg w-40">
                                            {item.main.temp}°C
                                        </span>
                                        <span className="shadow-xl text-xl font-bold bg-black/65 px-3 py-4 rounded-lg w-40">
                                            {item.main.feels_like}°C
                                        </span>
                                        <span className="shadow-xl text-xl font-bold bg-black/65 px-3 py-4 rounded-lg w-40">
                                            {item.main.humidity}%
                                        </span>
                                        <span className="shadow-xl text-xl font-bold bg-black/65 px-3 py-4 rounded-lg w-40">
                                            {item.main.pressure} гПа
                                        </span>
                                        <span className="shadow-xl text-xl font-bold bg-black/65 px-3 py-4 rounded-lg w-40">
                                            {item.clouds.all}%
                                        </span>
                                        <span className="shadow-xl text-xl font-bold bg-black/65 px-3 py-4 rounded-lg w-40">
                                            {item.visibility} м
                                        </span>
                                        <span className="shadow-xl text-xl font-bold bg-black/65 px-3 py-4 rounded-lg w-40">
                                            {item.weather[0].main}
                                        </span>
                                        <span className="shadow-xl text-xl font-bold bg-black/65 px-3 py-4 rounded-lg w-40">
                                            {item.wind.speed} м/с
                                        </span>


                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default App
