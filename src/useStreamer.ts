import { Subscription } from ".";
import { useState, useEffect } from "react";

export interface useStreamerOptions<T> {
    filter?: (x: T) => boolean;
}

export const useStreamer = <T>(service: (subject:string) => Subscription<T>, subject: string='', options: useStreamerOptions<T>= {}) => {
    const [payload, setPayload] = useState<T | null>(null);

    useEffect(() => {
        const subscription = service(subject);
        let stream = subscription.stream;

        if(options?.filter) {
            stream = stream.filter(options?.filter);
        }

        stream
            .each((newVal) => {
                setPayload(newVal);
            });
        return () => {
            subscription.cancel();
        };
    }, [subject]);
    return {
        payload
    };
}
