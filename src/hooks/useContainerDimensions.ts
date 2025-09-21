import { useState, useEffect, useRef } from 'react';

interface Dimensions {
    width: number;
    height: number;
}

export const useContainerDimensions = (): [React.RefObject<HTMLDivElement | null>, Dimensions] => {
    const ref = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 });

    useEffect(() => {
        const updateDimensions = () => {
            if (ref.current) {
                const { offsetWidth, offsetHeight } = ref.current;
                setDimensions({ width: offsetWidth, height: offsetHeight });
            }
        };

        // Оновлюємо розміри при монтуванні
        updateDimensions();

        // Створюємо ResizeObserver для відстеження змін розміру
        const resizeObserver = new ResizeObserver(updateDimensions);
        if (ref.current) {
            resizeObserver.observe(ref.current);
        }

        // Також слухаємо зміни вікна
        window.addEventListener('resize', updateDimensions);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', updateDimensions);
        };
    }, []);

    return [ref, dimensions];
};