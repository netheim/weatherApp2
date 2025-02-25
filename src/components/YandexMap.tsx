import React, {useEffect, useState} from "react";
import { YMaps, Map, Placemark } from "react-yandex-maps";
import {ForecastType} from "../App.tsx";

type YandexMapProps = {

    forecast: ForecastType
}

const YandexMap: React.FC<YandexMapProps> = ({forecast}) => {

    const [userLocation, setUserLocation] = useState<[number, number]>();
    const [cityLocation, setCityLocation] = useState<[number, number]>();
    const [error, setError] = useState<string | null>(null);


    // Получение текущих координат пользователя
    useEffect(() => {
        setCityLocation([forecast.city.coord.lat, forecast.city.coord.lon])
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation([latitude, longitude]);
                },
                (error) => {
                    setError("Не удалось получить ваше местоположение.")
                    console.error("Ошибка получения геолокации:", error);
                    setUserLocation([55.751574, 37.573856]); // Координаты по умолчанию (Москва)
                }
            );
        } else {
            console.error("Геолокация не поддерживается вашим браузером");
            setUserLocation([55.751574, 37.573856]); // Координаты по умолчанию
        }
    }, [forecast]);

    if (!userLocation) {
        return <div>Загрузка карты...</div>;
    }

    const mapCenter = cityLocation?.reduce((a, b) => a + b) !== 0 ? cityLocation: userLocation[0] > 0 ? userLocation : [55.751574, 37.573856] ;

    return (
        <div className="rounded-xl overflow-hidden shadow-xl">
            {error && <p className="text-red-700 text-xl font-medium">{error}</p>}
            <YMaps  query={{ apikey: "0f5fa129-0a27-4d25-985c-e95803db1dea" }}>
                <Map
                    state={{
                        center: mapCenter,
                        zoom: 15,
                    }}
                    width="460px"
                    height="670px"

                >
                    <Placemark
                        geometry={mapCenter} // Маркер на текущих координатах
                        properties={{
                            hintContent: "Ваше местоположение",
                            balloonContent: "Вы здесь!",
                        }}
                    />
                </Map>
            </YMaps>
        </div>
    );
};

export default YandexMap;