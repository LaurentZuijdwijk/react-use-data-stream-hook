import React, {useContext} from 'react';
import ServiceLocatorContext from "../../services/service-locator-context";
import { useStreamer } from "streamer";

export default (props) => {
    // const ctx = useContext(ServiceLocatorContext);
    const factService = useContext(ServiceLocatorContext).factService;
    const { payload } = useStreamer(factService.subscribeToFacts, 'cats');
    if(payload && payload.loading){
        return <span>Loading...</span>
    }

    if(payload && payload.fact){
        return <div>

            <span>{payload.fact}</span><br />
                {!payload.loading && 
                <button onClick={() => factService.getFact('cats')} >refresh</button>}
            </div>;
    }
    else return <></>
}