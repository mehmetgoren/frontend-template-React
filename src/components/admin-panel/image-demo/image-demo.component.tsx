import * as React from 'react';
import { ComponentBase } from '../../component-base';
import { HubConnection } from '@aspnet/signalr-client';
import { AppStorage } from '../../../utils/app-storage';

interface ImageDemoProps { }
interface ImageDemoState {
    image?: any;
}

export class ImageDemoComponent extends ComponentBase<ImageDemoProps, ImageDemoState> {

    constructor(props) {
        super(props);

        this.state = { image: null };
    }

    conn: HubConnection;
    componentWillMount(){
        this.conn = new HubConnection(AppStorage.host + "/images",);
        
        this.conn.on("notify", (data) => {
            this.setState({image:'data:image/png;base64,' + data})
        });

        this.conn.start().then(() => {
            this.conn.invoke("FloodImages");
        }).catch(err => {
            alert(JSON.stringify(err));
        });
    }

    async componentWillUnmount(){
        if (null != this.conn)
           await this.conn.stop();
    }

    render() {
        const { image } = this.state;
        return (
             image&&<img src={image} width="300" height="300" />
        )
    }
}