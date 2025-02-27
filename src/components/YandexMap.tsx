import React, { useEffect, useState, useRef } from "react";
import { ForecastType } from "../App.tsx";

type YandexMapProps = {
    forecast: ForecastType;
};

const YandexMap: React.FC<YandexMapProps> = ({ forecast }) => {
    const [userLocation, setUserLocation] = useState<[number, number]>([55.751574, 37.573856]);
    const [cityLocation, setCityLocation] = useState<[number, number]>([55.751574, 37.573856]);
    const [error, setError] = useState<string | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);

    // При изменении forecast обновляем координаты города
    useEffect(() => {
        if (forecast && forecast.city && forecast.city.coord) {
            setCityLocation([forecast.city.coord.lat, forecast.city.coord.lon]);
        }
    }, [forecast]);

    // Получение геолокации пользователя
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation([latitude, longitude]);
                },
                (err) => {
                    setError("Не удалось получить ваше местоположение.");
                    console.error("Ошибка получения геолокации:", err);
                    // Если не удалось, оставляем координаты по умолчанию (Москва)
                    setUserLocation([55.751574, 37.573856]);
                }
            );
        } else {
            console.error("Геолокация не поддерживается вашим браузером");
            setUserLocation([55.751574, 37.573856]);
        }
    }, []);

    // Функция для динамической загрузки скрипта Яндекс.Карт
    const loadYandexMaps = (): Promise<any> => {
        return new Promise((resolve, reject) => {
            if ((window as any).ymaps) {
                resolve((window as any).ymaps);
                return;
            }
            const script = document.createElement("script");
            script.src =
                `https://api-maps.yandex.ru/2.1/?apikey=${import.meta.env.VITE_YMAPS_API_KEY}&lang=ru_RU`;
            script.async = true;
            script.onload = () => {
                (window as any).ymaps.ready(() => resolve((window as any).ymaps));
            };
            script.onerror = () => reject(new Error("Ошибка загрузки Яндекс.Карт API"));
            document.head.appendChild(script);
        });
    };

    // Инициализация и обновление карты
    useEffect(() => {
        let placemark: any;

        loadYandexMaps()
            .then((ymaps) => {
                // Вычисляем центр карты:
                // Если сумма элементов cityLocation не равна 0, используем его,
                // иначе, если первая координата userLocation > 0, используем userLocation,
                // иначе — координаты Москвы по умолчанию.
                const mapCenter =
                    (cityLocation[0] + cityLocation[1]) !== 0
                        ? cityLocation
                        : userLocation[0] > 0
                            ? userLocation
                            : [55.751574, 37.573856];

                if (!mapInstanceRef.current && mapContainerRef.current) {
                    // Инициализируем карту
                    mapInstanceRef.current = new ymaps.Map(mapContainerRef.current, {
                        center: mapCenter,
                        zoom: 15,
                    });
                    // Создаём placemark
                    placemark = new ymaps.Placemark(mapCenter, {
                        hintContent: "Ваше местоположение",
                        balloonContent: "Вы здесь!",
                    });
                    mapInstanceRef.current.geoObjects.add(placemark);
                } else if (mapInstanceRef.current) {
                    // Обновляем центр карты
                    mapInstanceRef.current.setCenter(mapCenter);
                    // Удаляем предыдущие объекты и добавляем новый placemark
                    mapInstanceRef.current.geoObjects.removeAll();
                    placemark = new ymaps.Placemark(mapCenter, {
                        hintContent: "Ваше местоположение",
                        balloonContent: "Вы здесь!",
                    });
                    mapInstanceRef.current.geoObjects.add(placemark);
                }
            })
            .catch((err) => console.error(err));

        // Очистка при размонтировании компонента
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.destroy();
                mapInstanceRef.current = null;
            }
        };
    }, [userLocation, cityLocation]);

    return (
        <div
            className="rounded-xl overflow-hidden shadow-xl w-[350px] h-[300px] max-[1600px]:w-[250px] max-[1362px]:w-[200px] max-[1362px]:h-[200px] max-[1122px]:w-[500px]
      max-[1122px]:h-[300px] max-[853px]:w-[350px] max-[853px]:h-[200px] max-[666px]:w-[280px] max-[666px]:h-[140px] max-[535px]:w-[220px]"
        >
            {error && <p className="text-red-700 text-xl font-medium">{error}</p>}
            <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
        </div>
    );
};

export default YandexMap;
