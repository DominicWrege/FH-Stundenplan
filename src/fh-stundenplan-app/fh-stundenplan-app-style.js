import { html } from "@polymer/lit-element";

const appStyle = html`
        <style>
            :host {
            display: block;
            min-width: 300px;
        }

        app-header {
            background-color: #F44336;
            color: #fff;
            padding-bottom: 2px;
            padding-left: 10px;
            padding-right: 10px;
        }
        main .page {
            display: none;
        }
        main .page[active] {
            display: block;
        }
        paper-tabs {
            max-width: 750px;
            margin: 0 auto;
        }
        paper-tabs, main stundenplan-feed{
            width: 100%;
        }
        main stundenplan-feed{
            margin-bottom: 5%;
        }
        main card-element {
            display: block;
            padding: 16px;
            background-color: #fff;
            width: 85%;
            
        }
        main stundenplan-feed, main card-element{
            margin: 3% auto;
            max-width: 720px;
        }

        paper-tabs {
            min-width: 54px;
        }
        #settingsButton{
            background: none;
            border: none;
            cursor: pointer;
            outline: none;
        }

        app-toolbar {
            height: 64px;
        }

        @media(max-width: 650px) {
            app-toolbar {
                height: 52px;
            }
            main card-element{
                width: 90%;
            }
        }
    </style>
`;

export { appStyle };